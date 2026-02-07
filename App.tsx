
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Uploader } from './components/Uploader';
import { SlideView } from './components/SlideView';
import { AppState, SlideContent, AnalysisInput } from './types';
import { analyzeContent, generateComicImage } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    status: 'idle',
    slides: [],
    config: {
      style: 'apple',
      pageCount: 6,
      font: 'microsoft-yahei',
      aspectRatio: '16:9'
    },
    imageProgress: { current: 0, total: 0 }
  });

  const handleInputReady = (input: AnalysisInput) => {
    setState(prev => ({ ...prev, status: 'configuring', inputData: input }));
  };

  const batchGenerateImages = async (slides: SlideContent[]) => {
    const total = slides.length;
    setState(prev => ({ ...prev, status: 'generating_images', imageProgress: { current: 0, total } }));

    const updatedSlides = [...slides];
    
    // 增加重试次数到3次，防止网络波动导致最后几页缺失
    for (let i = 0; i < total; i++) {
      let success = false;
      let attempts = 0;
      
      while (!success && attempts < 3) {
        try {
          const url = await generateComicImage(updatedSlides[i].imagePrompt, state.config);
          if (url && url.length > 100) { // 检查有效性
            updatedSlides[i] = { ...updatedSlides[i], imageUrl: url };
            success = true;
          } else {
              throw new Error("Empty image data");
          }
        } catch (e) {
          attempts++;
          console.warn(`Attempt ${attempts} failed for slide ${i}. Retrying...`);
          if (attempts < 3) await new Promise(r => setTimeout(r, 1500));
        }
      }

      setState(prev => ({ 
        ...prev, 
        imageProgress: { ...prev.imageProgress, current: i + 1 },
        slides: [...updatedSlides]
      }));
    }
    setState(prev => ({ ...prev, status: 'ready' }));
  };

  const handleRegenerateImage = async (slideId: string) => {
    const slideIndex = state.slides.findIndex(s => s.id === slideId);
    if (slideIndex === -1) return;

    try {
      const url = await generateComicImage(state.slides[slideIndex].imagePrompt, state.config);
      const newSlides = [...state.slides];
      newSlides[slideIndex] = { ...newSlides[slideIndex], imageUrl: url };
      setState(prev => ({ ...prev, slides: newSlides }));
    } catch (e) {
      console.error("Manual regeneration failed", e);
    }
  };

  const startGeneration = async () => {
    if (!state.inputData) return;
    try {
      setState(prev => ({ ...prev, status: 'analyzing' }));
      const extractedSlides = await analyzeContent(state.inputData, state.config);
      setState(prev => ({ ...prev, slides: extractedSlides }));
      await batchGenerateImages(extractedSlides);
    } catch (err: any) {
      setState(prev => ({ ...prev, status: 'error', error: err.message }));
    }
  };

  return (
    <Layout>
      {state.status === 'idle' && <Uploader onInputReady={handleInputReady} isLoading={false} />}

      {state.status === 'configuring' && (
        <div className="max-w-4xl mx-auto bg-white p-12 rounded-[2.5rem] border border-amber-50 soft-shadow fade-in">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">定制演示工坊</h2>
            <p className="text-sm text-slate-400">选择您的专业审美风格</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-4">视觉审美风格</span>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'apple', label: '苹果极简', desc: 'Minimal/White' },
                    { id: 'internet', label: '互联网', desc: 'Tech/Corporate' },
                    { id: 'magazine', label: '杂志风', desc: 'Bold/Branding' },
                    { id: 'datavis', label: '数据可视化', desc: 'McKinsey/Structured' },
                    { id: 'oilpainting', label: '油画感', desc: 'Impressionist' },
                    { id: 'custom', label: '自定义 Prompt', desc: 'Free Input' },
                  ].map(s => (
                    <button 
                      key={s.id}
                      onClick={() => setState(prev => ({ ...prev, config: { ...prev.config, style: s.id as any } }))}
                      className={`p-4 rounded-3xl text-left border-2 transition-all ${state.config.style === s.id ? 'border-amber-400 bg-amber-50' : 'border-slate-50 bg-white hover:border-amber-200'}`}
                    >
                      <div className="font-bold text-sm text-slate-700">{s.label}</div>
                      <div className="text-[10px] text-slate-400">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              {state.config.style === 'custom' && (
                <textarea 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-amber-100 text-xs focus:border-amber-400 outline-none"
                  placeholder="请输入您的风格 Prompt..."
                  onChange={(e) => setState(prev => ({ ...prev, config: { ...prev.config, customStylePrompt: e.target.value } }))}
                />
              )}
            </div>

            <div className="space-y-8">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-4">版式比例</span>
                <div className="flex gap-3">
                  {['16:9', '4:3'].map(r => (
                    <button 
                      key={r}
                      onClick={() => setState(prev => ({ ...prev, config: { ...prev.config, aspectRatio: r as any } }))}
                      className={`flex-1 py-3 rounded-2xl font-bold text-xs transition-all border-2 ${state.config.aspectRatio === r ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-slate-100 text-slate-500'}`}
                    >
                      {r} {r === '16:9' ? '(标准)' : '(经典)'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">目标页数</span>
                  <input 
                    type="number" value={state.config.pageCount}
                    className="w-12 text-center text-xs font-bold text-amber-600 bg-amber-50 rounded"
                    onChange={(e) => setState(prev => ({ ...prev, config: { ...prev.config, pageCount: parseInt(e.target.value) || 1 } }))}
                  />
                </div>
                <input type="range" min="3" max="20" className="w-full accent-amber-500" value={state.config.pageCount} onChange={(e) => setState(prev => ({ ...prev, config: { ...prev.config, pageCount: parseInt(e.target.value) } }))} />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-4">首选字体</span>
                <select className="w-full p-3 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-amber-400 outline-none text-xs font-bold" value={state.config.font} onChange={(e) => setState(prev => ({ ...prev, config: { ...prev.config, font: e.target.value as any } }))}>
                   <option value="microsoft-yahei">微软雅黑</option>
                   <option value="inter">Inter (Modern)</option>
                   <option value="playfair">Playfair (Classic)</option>
                   <option value="arial">Arial</option>
                </select>
              </div>
            </div>
          </div>

          <button onClick={startGeneration} className="mt-12 w-full py-5 bg-amber-500 text-white font-black uppercase tracking-[0.3em] rounded-full hover:bg-amber-600 shadow-xl shadow-amber-200 transition-all">
            开始生成智能文稿
          </button>
        </div>
      )}

      {(state.status === 'analyzing' || state.status === 'generating_images') && (
        <div className="flex flex-col items-center justify-center min-h-[500px] text-center fade-in">
           <div className="w-24 h-24 border-8 border-amber-50 border-t-amber-500 rounded-full animate-spin mb-8"></div>
           <h2 className="text-2xl font-bold text-slate-800 mb-2">{state.status === 'analyzing' ? '正在分析深度洞察...' : '正在为您精绘视觉内容...'}</h2>
           <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">
             {state.status === 'generating_images' ? `进度: ${state.imageProgress.current} / ${state.imageProgress.total}` : '请稍候'}
           </p>
        </div>
      )}

      {(state.status === 'ready' || (state.status === 'generating_images' && state.slides.length > 0)) && (
        <SlideView 
          slides={state.slides} 
          config={state.config} 
          onUpdateSlides={(newSlides) => setState(prev => ({ ...prev, slides: newSlides }))}
          onRegenerateImage={handleRegenerateImage}
        />
      )}
    </Layout>
  );
};

export default App;
