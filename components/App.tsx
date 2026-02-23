'use client';

import React, { useState } from 'react';
import { Layout } from './Layout';
import { Uploader } from './Uploader';
import { SlideView } from './SlideView';
import LayoutTemplateSelector from './LayoutTemplateSelector';
import OutlinePreview from './OutlinePreview';
import ProgressIndicator from './ProgressIndicator';
import { AppState, SlideContent, AnalysisInput } from '../types';
import { analyzeContent, generateComicImage, generateOutline } from '../services/clientService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    status: 'idle',
    slides: [],
    config: {
      style: 'apple',
      pageCount: 6,
      font: 'microsoft-yahei',
      aspectRatio: '16:9',
      layout: 'left-right-golden',
      language: 'bilingual',
      keyPointsConfig: {
        count: 4,
        position: 'left-bottom',
        style: 'boxed'
      },
      visualElements: {
        showTopBar: true,
        showDecoLine: true,
        showFooter: true
      }
    },
    imageProgress: { current: 0, total: 0 }
  });

  const handleInputReady = (input: AnalysisInput) => {
    setState(prev => ({ ...prev, status: 'configuring', inputData: input }));
  };

  const batchGenerateImages = async (slides: SlideContent[]) => {
    const total = slides.length;
    setState(prev => ({
      ...prev,
      status: 'generating_images',
      imageProgress: { current: 0, total },
      progressMessage: `准备生成 ${total} 张图片...`
    }));

    const updatedSlides = [...slides];
    const DELAY_BETWEEN_IMAGES = 15000; // 15秒间隔，确保不超过 5次/分钟 限制

    for (let i = 0; i < total; i++) {
      let success = false;
      let attempts = 0;

      // 第一张之后，每张图片前等待
      if (i > 0) {
        console.log(`Waiting ${DELAY_BETWEEN_IMAGES/1000}s before generating image ${i + 1}/${total}...`);
        setState(prev => ({
          ...prev,
          progressMessage: `等待 API 冷却... (${Math.ceil(DELAY_BETWEEN_IMAGES/1000)}秒)`
        }));
        await new Promise(r => setTimeout(r, DELAY_BETWEEN_IMAGES));
      }

      // 更新进度：正在生成
      setState(prev => ({
        ...prev,
        progressMessage: `正在生成图片 ${i + 1}/${total}...`
      }));

      while (!success && attempts < 3) {
        try {
          const url = await generateComicImage(updatedSlides[i].imagePrompt, state.config);
          if (url && url.length > 100) {
            updatedSlides[i] = { ...updatedSlides[i], imageUrl: url };
            success = true;
          } else {
            throw new Error("Empty image data");
          }
        } catch (e: any) {
          attempts++;
          console.warn(`Attempt ${attempts} failed for slide ${i + 1}:`, e.message);
          // 如果是 429 错误，等待更长时间
          const isRateLimit = e.message?.includes('429') || e.message?.includes('rate limit');
          const waitTime = isRateLimit ? 60000 : 5000;
          if (attempts < 3) {
            console.log(`Retrying in ${waitTime/1000}s...`);
            setState(prev => ({
              ...prev,
              progressMessage: `图片生成失败，${waitTime/1000}秒后重试... (尝试 ${attempts}/3)`
            }));
            await new Promise(r => setTimeout(r, waitTime));
          } else {
            // 3次尝试都失败，使用占位符
            console.warn(`All attempts failed for slide ${i + 1}, will use placeholder`);
          }
        }
      }

      // 更新进度：完成当前图片
      setState(prev => ({
        ...prev,
        imageProgress: { ...prev.imageProgress, current: i + 1 },
        slides: [...updatedSlides],
        progressMessage: `已完成 ${i + 1}/${total} 张图片`
      }));
    }

    setState(prev => ({
      ...prev,
      status: 'ready',
      progressMessage: '所有幻灯片生成完成！'
    }));
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

  // 重置到主页
  const handleReset = () => {
    const confirmReset = confirm('确定要返回主页吗？当前内容将丢失。');
    if (confirmReset) {
      setState({
        status: 'idle',
        slides: [],
        config: {
          style: 'apple',
          pageCount: 6,
          font: 'microsoft-yahei',
          aspectRatio: '16:9',
          layout: 'left-right-golden',
          language: 'bilingual',
          keyPointsConfig: {
            count: 4,
            position: 'left-bottom',
            style: 'boxed'
          },
          visualElements: {
            showTopBar: true,
            showDecoLine: true,
            showFooter: true
          }
        },
        imageProgress: { current: 0, total: 0 }
      });
    }
  };

  // 重新生成整个演示文稿（从大纲开始）
  const handleRegenerateAll = async () => {
    const confirmRegenerate = confirm('重新生成整个演示文稿？当前内容将丢失。');
    if (!confirmRegenerate || !state.inputData) return;

    setState(prev => ({
      ...prev,
      status: 'generating_outline',
      slides: [],
      outline: undefined,
      progressMessage: '正在重新生成大纲...'
    }));

    await startOutlineGeneration();
  };

  // 仅重新生成所有图片（保留文字内容）
  const handleRegenerateImages = async () => {
    const confirmRegenerate = confirm('重新生成所有图片？当前图片将被替换。');
    if (!confirmRegenerate) return;

    setState(prev => ({
      ...prev,
      progressMessage: '准备重新生成所有图片...'
    }));

    await batchGenerateImages(state.slides);
  };

  // 带超时保护的内容分析
  const analyzeWithTimeout = async (input: AnalysisInput, config: typeof state.config, timeoutMs = 120000) => {
    return Promise.race([
      analyzeContent(input, config),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('分析超时（2分钟），请尝试较小的文件或简化内容')), timeoutMs)
      )
    ]);
  };

  // Skip outline generation and go directly to content generation
  const startOutlineGeneration = async () => {
    if (!state.inputData) return;

    // Skip outline step - go directly to full content generation
    try {
      setState(prev => ({
        ...prev,
        status: 'analyzing',
        progressMessage: 'Generating presentation content...'
      }));

      const extractedSlides = await analyzeWithTimeout(state.inputData, state.config);

      if (!extractedSlides || extractedSlides.length === 0) {
        throw new Error('Failed to extract content from document');
      }

      setState(prev => ({
        ...prev,
        slides: extractedSlides,
        progressMessage: `Successfully generated ${extractedSlides.length} slides`
      }));

      // Generate images
      await batchGenerateImages(extractedSlides);
    } catch (err: any) {
      console.error('Generation error:', err);
      setState(prev => ({
        ...prev,
        status: 'error',
        error: err.message || 'Generation failed, please try again'
      }));
    }
  };

  // Generate full content from confirmed outline
  const generateFromOutline = async (confirmedOutline: string[]) => {
    if (!state.inputData) return;
    try {
      // Update config with confirmed outline length
      const updatedConfig = {
        ...state.config,
        pageCount: confirmedOutline.length
      };

      // 分析阶段 - with outline guidance
      setState(prev => ({
        ...prev,
        status: 'analyzing',
        progressMessage: '正在生成详细内容...',
        config: updatedConfig
      }));

      const extractedSlides = await analyzeWithTimeout(state.inputData, updatedConfig);

      if (!extractedSlides || extractedSlides.length === 0) {
        throw new Error('未能从文档中提取有效内容');
      }

      setState(prev => ({
        ...prev,
        slides: extractedSlides,
        progressMessage: `成功生成 ${extractedSlides.length} 页幻灯片结构`
      }));

      // 图片生成阶段
      await batchGenerateImages(extractedSlides);
    } catch (err: any) {
      console.error('Generation error:', err);
      setState(prev => ({
        ...prev,
        status: 'error',
        error: err.message || '生成失败，请重试'
      }));
    }
  };

  return (
    <Layout>
      {state.status === 'idle' && <Uploader onInputReady={handleInputReady} isLoading={false} />}

      {state.status === 'configuring' && (
        <div className="max-w-4xl mx-auto bg-white p-12 rounded-sm border border-[#e7e5e4] shadow-[0_20px_60px_rgba(0,0,0,0.08)] fade-in">
          <div className="text-center mb-10 border-b border-[#e7e5e4] pb-8">
            <h2 className="font-[Playfair_Display,serif] text-4xl font-bold text-[#1c1917] mb-3">Configure Your Presentation</h2>
            <p className="text-sm text-[#57534e] leading-relaxed">Customize style, layout, and language to match your vision</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase text-[#d97706] tracking-[0.1em] block mb-4">Visual Style</span>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'apple', label: '极简', desc: 'Minimalist' },
                    { id: 'datavis', label: '数据可视化', desc: 'Data-Driven' },
                    { id: 'internet', label: '互联网', desc: 'Tech/Corporate' },
                    { id: 'custom', label: '自定义Prompt', desc: 'Custom Prompt' },
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => setState(prev => ({ ...prev, config: { ...prev.config, style: s.id as any } }))}
                      className={`p-4 rounded-sm text-left border transition-all ${state.config.style === s.id ? 'border-[#d97706] bg-[#fef3c7]' : 'border-[#e7e5e4] bg-white hover:border-[#d97706]'}`}
                    >
                      <div className="font-bold text-sm text-[#1c1917]">{s.label}</div>
                      <div className="text-[10px] text-[#57534e]">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              {state.config.style === 'custom' && (
                <textarea
                  className="w-full p-4 bg-[#fafaf9] rounded-sm border border-[#e7e5e4] text-xs focus:border-[#d97706] outline-none"
                  placeholder="Enter your custom style prompt..."
                  onChange={(e) => setState(prev => ({ ...prev, config: { ...prev.config, customStylePrompt: e.target.value } }))}
                />
              )}

              {/* Layout Template Selector - Simplified */}
              <div>
                <span className="font-mono text-[10px] font-bold uppercase text-[#d97706] tracking-[0.1em] block mb-4">Layout Template</span>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'left-right-golden', label: '左右布局', desc: 'Left-Right Split' },
                    { id: 'top-bottom', label: '上下布局', desc: 'Top-Bottom Split' },
                    { id: 'text-only', label: 'Auto Detect', desc: 'AI Chooses Best' },
                    { id: 'custom', label: '自定义Prompt', desc: 'Custom Layout' },
                  ].map(layout => (
                    <button
                      key={layout.id}
                      onClick={() => setState(prev => ({ ...prev, config: { ...prev.config, layout: layout.id as any } }))}
                      className={`p-4 rounded-sm text-left border transition-all ${state.config.layout === layout.id ? 'border-[#d97706] bg-[#fef3c7]' : 'border-[#e7e5e4] bg-white hover:border-[#d97706]'}`}
                    >
                      <div className="font-bold text-sm text-[#1c1917]">{layout.label}</div>
                      <div className="text-[10px] text-[#57534e]">{layout.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase text-[#d97706] tracking-[0.1em] block mb-4">Aspect Ratio</span>
                <div className="flex gap-3">
                  {['16:9', '4:3'].map(r => (
                    <button
                      key={r}
                      onClick={() => setState(prev => ({ ...prev, config: { ...prev.config, aspectRatio: r as any } }))}
                      className={`flex-1 py-3 rounded-sm font-bold text-xs transition-all border ${state.config.aspectRatio === r ? 'border-[#d97706] bg-[#fef3c7] text-[#1c1917]' : 'border-[#e7e5e4] text-[#57534e]'}`}
                    >
                      {r} {r === '16:9' ? '(Standard)' : '(Classic)'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-mono text-[10px] font-bold uppercase text-[#d97706] tracking-[0.1em] block mb-4">Language Mode</span>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'bilingual', label: 'Bilingual', desc: 'EN+中文' },
                    { id: 'english-only', label: 'English', desc: 'English Only' },
                    { id: 'chinese-only', label: '中文', desc: 'Chinese Only' },
                    { id: 'auto', label: 'Auto', desc: 'Auto Detect' },
                  ].map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => setState(prev => ({ ...prev, config: { ...prev.config, language: lang.id as any } }))}
                      className={`p-3 rounded-sm text-left border transition-all ${state.config.language === lang.id ? 'border-[#d97706] bg-[#fef3c7]' : 'border-[#e7e5e4] bg-white hover:border-[#d97706]'}`}
                    >
                      <div className="font-bold text-xs text-[#1c1917]">{lang.label}</div>
                      <div className="text-[9px] text-[#57534e]">{lang.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-mono text-[10px] font-bold uppercase text-[#d97706] tracking-[0.1em]">Page Count</span>
                  <input
                    type="number" value={state.config.pageCount}
                    className="w-12 text-center text-xs font-bold text-[#d97706] bg-[#fef3c7] rounded border border-[#d97706]"
                    onChange={(e) => setState(prev => ({ ...prev, config: { ...prev.config, pageCount: parseInt(e.target.value) || 1 } }))}
                  />
                </div>
                <input type="range" min="3" max="20" className="w-full accent-[#d97706]" value={state.config.pageCount} onChange={(e) => setState(prev => ({ ...prev, config: { ...prev.config, pageCount: parseInt(e.target.value) } }))} />
              </div>

              <div>
                <span className="font-mono text-[10px] font-bold uppercase text-[#d97706] tracking-[0.1em] block mb-4">Font Family</span>
                <select className="w-full p-3 bg-[#fafaf9] rounded-sm border border-[#e7e5e4] focus:border-[#d97706] outline-none text-xs font-bold text-[#1c1917]" value={state.config.font} onChange={(e) => setState(prev => ({ ...prev, config: { ...prev.config, font: e.target.value as any } }))}>
                   <option value="microsoft-yahei">Microsoft YaHei</option>
                   <option value="inter">Inter</option>
                   <option value="playfair">Playfair Display</option>
                   <option value="arial">Arial</option>
                </select>
              </div>
            </div>
          </div>

          <button onClick={startOutlineGeneration} className="mt-12 w-full py-4 bg-[#1c1917] text-[#fafaf9] font-bold uppercase tracking-[0.15em] rounded-sm hover:bg-[#d97706] shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all hover:-translate-y-0.5">
            Generate Presentation
          </button>
        </div>
      )}

      {/* Outline Preview */}
      {state.status === 'outline_ready' && state.outline && (
        <OutlinePreview
          outline={state.outline}
          language={state.config.language}
          onConfirm={generateFromOutline}
          onRegenerate={startOutlineGeneration}
          onBack={() => setState(prev => ({ ...prev, status: 'configuring', outline: undefined }))}
        />
      )}

      {/* Enhanced Progress Indicator */}
      {(state.status === 'generating_outline' || state.status === 'analyzing' || state.status === 'generating_images') && (
        <ProgressIndicator
          currentPhase={state.status}
          imageProgress={state.imageProgress}
          message={state.progressMessage}
        />
      )}

      {state.status === 'error' && (
        <div className="max-w-2xl mx-auto bg-red-50 border-2 border-red-200 p-8 rounded-[2rem] text-center fade-in">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-700 mb-2">生成失败</h2>
          <p className="text-red-600 text-sm mb-6">{state.error}</p>
          <button
            onClick={() => setState(prev => ({ ...prev, status: 'idle', error: undefined }))}
            className="px-6 py-3 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 transition-all"
          >
            返回重试
          </button>
        </div>
      )}

      {(state.status === 'ready' || (state.status === 'generating_images' && state.slides.length > 0)) && (
        <SlideView
          slides={state.slides}
          config={state.config}
          onUpdateSlides={(newSlides) => setState(prev => ({ ...prev, slides: newSlides }))}
          onRegenerateImage={handleRegenerateImage}
          onRegenerateAll={handleRegenerateAll}
          onRegenerateImages={handleRegenerateImages}
          onReset={handleReset}
        />
      )}
    </Layout>
  );
};

export default App;
