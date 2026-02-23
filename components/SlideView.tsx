'use client';

import React, { useState } from 'react';
import { SlideContent, UserConfig } from '../types';
import { refineSlide, generateComicImage } from '../services/clientService';

interface SlideViewProps {
  slides: SlideContent[];
  config: UserConfig;
  onUpdateSlides: (newSlides: SlideContent[]) => void;
  onRegenerateImage: (slideId: string) => Promise<void>;
  onRegenerateAll: () => Promise<void>;
  onRegenerateImages: () => Promise<void>;
  onReset: () => void;
}

export const SlideView: React.FC<SlideViewProps> = ({ slides, config, onUpdateSlides, onRegenerateImage, onRegenerateAll, onRegenerateImages, onReset }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [refinePrompt, setRefinePrompt] = useState('');
  const [isRefining, setIsRefining] = useState(false);

  // Layout rendering helper
  const renderSlideContent = (slide: SlideContent, index: number) => {
    const layoutClass = config.layout;

    // Render title section
    const renderTitle = () => (
      <div className="px-10 lg:px-16 pt-10 lg:pt-14 pb-4">
        {config.language === 'chinese-only' ? (
          <h2 className="text-2xl lg:text-3xl font-black mb-1 truncate" style={{ color: theme.primary }}>{slide.titleZh}</h2>
        ) : config.language === 'english-only' ? (
          <h2 className="text-2xl lg:text-3xl font-black mb-1 truncate" style={{ color: theme.primary }}>{slide.titleEn}</h2>
        ) : (
          <>
            <h2 className="text-2xl lg:text-3xl font-black mb-1 truncate" style={{ color: theme.primary }}>{slide.titleEn}</h2>
            <h3 className="text-sm lg:text-lg font-bold opacity-60 truncate" style={{ color: theme.secondary }}>{slide.titleZh}</h3>
          </>
        )}
      </div>
    );

    // Render text content
    const renderTextContent = () => (
      <div className="space-y-4 lg:space-y-8 overflow-hidden">
        {config.language === 'chinese-only' ? (
          <div className="border-l-[6px] pl-6 py-1" style={{ borderColor: theme.primary }}>
            <p className="text-sm lg:text-lg leading-relaxed font-semibold text-slate-800 line-clamp-6">{slide.descriptionZh}</p>
          </div>
        ) : config.language === 'english-only' ? (
          <div className="border-l-[6px] pl-6 py-1" style={{ borderColor: theme.primary }}>
            <p className="text-sm lg:text-lg leading-relaxed font-semibold text-slate-800 line-clamp-6">{slide.descriptionEn}</p>
          </div>
        ) : (
          <>
            <div className="border-l-[6px] pl-6 py-1" style={{ borderColor: theme.primary }}>
              <p className="text-sm lg:text-lg leading-relaxed font-semibold text-slate-800 line-clamp-6">{slide.descriptionEn}</p>
            </div>
            <p className="text-xs lg:text-base text-slate-400 font-medium pl-6 line-clamp-5">{slide.descriptionZh}</p>
          </>
        )}
      </div>
    );

    // Render key points
    const renderKeyPoints = () => slide.keyPoints && (
      <div className="mt-6 p-4 lg:p-8 rounded-[2rem] text-white shadow-xl" style={{ backgroundColor: theme.primary }}>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {slide.keyPoints.slice(0, 4).map((kp, i) => (
            <div key={i} className="text-[10px] lg:text-xs font-bold border-b border-white/10 pb-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></div>
              <span className="leading-tight">{kp}</span>
            </div>
          ))}
        </div>
      </div>
    );

    // Render image
    const renderImage = () => (
      <div className="w-full h-full rounded-[2.5rem] overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center relative shadow-inner">
        {slide.imageUrl ? (
          <img src={slide.imageUrl} className="w-full h-full object-cover transition-transform hover:scale-110 duration-1000" alt="" />
        ) : (
          <div className="flex flex-col items-center gap-3 animate-pulse">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-[10px] font-black text-slate-300 tracking-widest uppercase">Visualizing...</div>
          </div>
        )}
      </div>
    );

    // Layout-specific rendering
    switch (layoutClass) {
      case 'left-right-equal':
        return (
          <>
            {renderTitle()}
            <div className="px-10 lg:px-16 pb-10 lg:pb-14 flex-grow flex flex-row gap-8 lg:gap-14 overflow-hidden">
              <div className="w-1/2 flex flex-col justify-between py-2 min-w-0">
                {renderTextContent()}
                {renderKeyPoints()}
              </div>
              <div className="w-1/2 flex items-center justify-center">
                {renderImage()}
              </div>
            </div>
          </>
        );

      case 'top-bottom':
        return (
          <>
            {renderTitle()}
            <div className="px-10 lg:px-16 pb-10 lg:pb-14 flex-grow flex flex-col gap-6 overflow-hidden">
              <div className="h-1/2">
                {renderImage()}
              </div>
              <div className="h-1/2 flex flex-col justify-between">
                {renderTextContent()}
                {renderKeyPoints()}
              </div>
            </div>
          </>
        );

      case 'image-background':
        return (
          <div className="relative w-full h-full">
            <img src={slide.imageUrl} className="absolute inset-0 w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent"></div>
            <div className="relative h-full flex flex-col justify-end p-10 lg:p-16">
              <div className="text-white">
                {config.language === 'chinese-only' ? (
                  <h2 className="text-3xl lg:text-4xl font-black mb-4">{slide.titleZh}</h2>
                ) : config.language === 'english-only' ? (
                  <h2 className="text-3xl lg:text-4xl font-black mb-4">{slide.titleEn}</h2>
                ) : (
                  <>
                    <h2 className="text-3xl lg:text-4xl font-black mb-2">{slide.titleEn}</h2>
                    <h3 className="text-lg lg:text-xl font-bold opacity-80 mb-4">{slide.titleZh}</h3>
                  </>
                )}
                <div className="text-white/90 text-sm lg:text-base leading-relaxed max-w-3xl">
                  {config.language === 'chinese-only' ? slide.descriptionZh : slide.descriptionEn}
                </div>
              </div>
            </div>
          </div>
        );

      case 'right-left':
        return (
          <>
            {renderTitle()}
            <div className="px-10 lg:px-16 pb-10 lg:pb-14 flex-grow flex flex-row gap-8 lg:gap-14 overflow-hidden">
              <div className="w-[38.2%] flex items-center justify-center">
                {renderImage()}
              </div>
              <div className="w-[61.8%] flex flex-col justify-between py-2 min-w-0">
                {renderTextContent()}
                {renderKeyPoints()}
              </div>
            </div>
          </>
        );

      case 'text-only':
        return (
          <>
            {renderTitle()}
            <div className="px-10 lg:px-16 pb-10 lg:pb-14 flex-grow flex flex-col justify-between overflow-hidden">
              {renderTextContent()}
              {renderKeyPoints()}
            </div>
          </>
        );

      case 'image-focus':
        return (
          <>
            <div className="flex-grow relative">
              {renderImage()}
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-8">
                {config.language === 'chinese-only' ? (
                  <h2 className="text-xl font-bold" style={{ color: theme.primary }}>{slide.titleZh}</h2>
                ) : config.language === 'english-only' ? (
                  <h2 className="text-xl font-bold" style={{ color: theme.primary }}>{slide.titleEn}</h2>
                ) : (
                  <>
                    <h2 className="text-xl font-bold" style={{ color: theme.primary }}>{slide.titleEn}</h2>
                    <h3 className="text-sm opacity-60" style={{ color: theme.secondary }}>{slide.titleZh}</h3>
                  </>
                )}
              </div>
            </div>
          </>
        );

      // Default: left-right-golden (61.8:38.2)
      default:
        return (
          <>
            {renderTitle()}
            <div className="px-10 lg:px-16 pb-10 lg:pb-14 flex-grow flex flex-row gap-8 lg:gap-14 overflow-hidden">
              <div className="w-[61.8%] flex flex-col justify-between py-2 min-w-0">
                {renderTextContent()}
                {renderKeyPoints()}
              </div>
              <div className="w-[38.2%] flex items-center justify-center">
                {renderImage()}
              </div>
            </div>
          </>
        );
    }
  };

  const theme = {
    apple: { primary: '#000000', secondary: '#86868b', bg: '#ffffff' },
    internet: { primary: '#0052cc', secondary: '#172b4d', bg: '#f4f5f7' },
    magazine: { primary: '#e63946', secondary: '#1d3557', bg: '#f1faee' },
    datavis: { primary: '#051C2C', secondary: '#334155', bg: '#ffffff' },
    oilpainting: { primary: '#78350f', secondary: '#b45309', bg: '#fef3c7' },
    custom: { primary: '#334155', secondary: '#64748b', bg: '#ffffff' }
  }[config.style];

  // Font family mapping
  const fontFamilyMap: Record<string, string> = {
    'microsoft-yahei': '"Microsoft YaHei", "微软雅黑", sans-serif',
    'arial': 'Arial, Helvetica, sans-serif',
    'inter': '"Inter", system-ui, sans-serif',
    'playfair': '"Playfair Display", Georgia, serif',
    'mono': '"Courier New", Courier, monospace',
    'pingfang': '"PingFang SC", "苹方", sans-serif',
    'helvetica': 'Helvetica, Arial, sans-serif'
  };
  const fontFamily = fontFamilyMap[config.font] || fontFamilyMap['microsoft-yahei'];

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleRefine = async () => {
    if (selectedIds.length === 0 || !refinePrompt.trim()) return;
    setIsRefining(true);
    const newSlides = [...slides];
    for (let i = 0; i < newSlides.length; i++) {
      if (selectedIds.includes(newSlides[i].id)) {
        try {
          const updated = await refineSlide(newSlides[i], refinePrompt, config);
          if (refinePrompt.includes('图') || refinePrompt.includes('画') || refinePrompt.includes('image')) {
             updated.imageUrl = await generateComicImage(updated.imagePrompt, config);
          }
          newSlides[i] = { ...updated, id: newSlides[i].id };
        } catch (e) { console.error(e); }
      }
    }
    onUpdateSlides(newSlides);
    setIsRefining(false);
    setRefinePrompt('');
    setSelectedIds([]);
  };

  const exportPDF = async () => {
    setIsExporting(true);
    setShowExportModal(false);
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const slidesHtml = slides.map((s, index) => `
      <div class="pdf-slide" style="border-top: 10mm solid ${theme.primary}; background: ${theme.bg};">
        <div class="header-full">
            ${config.language === 'chinese-only'
              ? `<h1 class="title-en" style="color: ${theme.primary}">${s.titleZh}</h1>`
              : config.language === 'english-only'
              ? `<h1 class="title-en" style="color: ${theme.primary}">${s.titleEn}</h1>`
              : `<h1 class="title-en" style="color: ${theme.primary}">${s.titleEn}</h1>
                 <h2 class="title-zh" style="color: ${theme.secondary}">${s.titleZh}</h2>`
            }
        </div>

        <div class="content-body">
          <div class="left-main">
            <div class="desc-box">
                ${config.language === 'chinese-only'
                  ? `<div class="desc-en" style="border-left: 2.5mm solid ${theme.primary}">${s.descriptionZh}</div>`
                  : config.language === 'english-only'
                  ? `<div class="desc-en" style="border-left: 2.5mm solid ${theme.primary}">${s.descriptionEn}</div>`
                  : `<div class="desc-en" style="border-left: 2.5mm solid ${theme.primary}">${s.descriptionEn}</div>
                     <div class="desc-zh">${s.descriptionZh}</div>`
                }
            </div>
            ${s.keyPoints ? `
            <div class="metrics-area" style="background: ${theme.primary}">
              <div class="metrics-grid">
                ${s.keyPoints.slice(0, 4).map(kp => `<div class="metric-item">• ${kp}</div>`).join('')}
              </div>
            </div>
            ` : ''}
          </div>
          <div class="right-visual">
            <div class="img-frame">
              ${s.imageUrl ? `<img src="${s.imageUrl}" />` : ''}
            </div>
          </div>
        </div>
        <div class="footer-bar">
          <span>Source: ${s.sourceInfo || 'Internal Document'}</span>
          <span>PAGE ${index + 1}</span>
        </div>
      </div>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <style>
            @page { size: ${config.aspectRatio === '16:9' ? '297mm 167mm' : '297mm 210mm'}; margin: 0; }
            body { margin: 0; font-family: ${fontFamily}; background: #fff; }
            .pdf-slide { 
                width: 297mm; height: ${config.aspectRatio === '16:9' ? '167mm' : '210mm'}; 
                page-break-after: always; display: flex; flex-direction: column; padding: 10mm 15mm; box-sizing: border-box; 
                position: relative;
            }
            .header-full { margin-bottom: 6mm; width: 100%; }
            .title-en { margin: 0; font-size: 28px; font-weight: 900; text-transform: uppercase; line-height: 1.1; }
            .title-zh { margin: 2mm 0; font-size: 18px; opacity: 0.7; font-weight: bold; }
            
            .content-body { display: flex; flex: 1; gap: 12mm; min-height: 0; overflow: hidden; }
            .left-main { width: 61.8%; display: flex; flex-direction: column; justify-content: space-between; padding-bottom: 5mm; }
            .right-visual { width: 38.2%; }
            
            .desc-box { margin-bottom: 5mm; }
            .desc-en { padding-left: 6mm; font-size: 16px; font-weight: 600; line-height: 1.6; color: #1e293b; margin-bottom: 6mm; }
            .desc-zh { padding-left: 6mm; font-size: 14px; color: #64748b; line-height: 1.5; font-weight: 500; }
            
            .metrics-area { padding: 6mm 8mm; border-radius: 6mm; color: white; margin-top: auto; }
            .metrics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; }
            .metric-item { font-size: 11px; font-weight: bold; line-height: 1.4; white-space: normal; word-wrap: break-word; }
            
            .img-frame { width: 100%; height: 100%; border-radius: 6mm; overflow: hidden; border: 1px solid #e2e8f0; }
            .img-frame img { width: 100%; height: 100%; object-fit: cover; }
            
            .footer-bar { display: flex; justify-content: space-between; font-size: 9px; color: #cbd5e1; font-weight: 900; margin-top: 4mm; border-top: 0.5px solid #f1f5f9; padding-top: 2mm; }
            @media print { * { -webkit-print-color-adjust: exact !important; } }
          </style>
        </head>
        <body>${slidesHtml}<script>window.onload=()=>{setTimeout(()=>{window.print();window.close();},1200)}</script></body>
      </html>
    `);
    printWindow.document.close();
    setIsExporting(false);
  };

  // 动态加载 PptxGenJS CDN
  const loadPptxGenJS = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      if (window.PptxGenJS) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load PptxGenJS'));
      document.head.appendChild(script);
    });
  };

  const exportPPT = async () => {
    try {
      setIsExporting(true);
      setShowExportModal(false);

      // 动态加载 CDN
      await loadPptxGenJS();
      // @ts-ignore
      const pptx = new window.PptxGenJS();
      pptx.layout = config.aspectRatio === '16:9' ? 'LAYOUT_16x9' : 'LAYOUT_4x3';
      const slideW = 10;
      const slideH = config.aspectRatio === '16:9' ? 5.625 : 7.5;

      // Font mapping for PPT export (PowerPoint-compatible names)
      const pptFontMap: Record<string, string> = {
        'microsoft-yahei': 'Microsoft YaHei',
        'arial': 'Arial',
        'inter': 'Arial', // Inter fallback to Arial
        'playfair': 'Georgia', // Playfair fallback to Georgia
        'mono': 'Courier New',
        'pingfang': 'PingFang SC',
        'helvetica': 'Helvetica'
      };
      const pptFont = pptFontMap[config.font] || 'Arial';

      slides.forEach((slide, index) => {
        let master = pptx.addSlide();
        const primary = theme.primary.replace('#', '');
        const secondary = theme.secondary.replace('#', '');
        const margin = 0.5;

        // Top colored bar
        master.addShape('rect', { x: 0, y: 0, w: '100%', h: 0.1, fill: { color: primary } });

      // 1. 全宽标题区
      if (config.language === 'chinese-only') {
        master.addText(slide.titleZh, {
          x: margin, y: 0.3, w: slideW - 1, h: 0.5,
          fontSize: 22, bold: true, color: primary, fontFace: pptFont, valign: 'top', shrinkText: true
        });
      } else if (config.language === 'english-only') {
        master.addText(slide.titleEn, {
          x: margin, y: 0.3, w: slideW - 1, h: 0.5,
          fontSize: 22, bold: true, color: primary, fontFace: pptFont, valign: 'top', shrinkText: true
        });
      } else {
        master.addText(slide.titleEn, {
          x: margin, y: 0.3, w: slideW - 1, h: 0.5,
          fontSize: 22, bold: true, color: primary, fontFace: pptFont, valign: 'top', shrinkText: true
        });
        master.addText(slide.titleZh, {
          x: margin, y: 0.85, w: slideW - 1, h: 0.4,
          fontSize: 14, bold: true, color: secondary, fontFace: pptFont, valign: 'top'
        });
      }

      // 2. 黄金分割内容区 (0.618 : 0.382)
      const leftW = 5.8;
      const rightW = 3.2;
      const contentY = 1.6;
      const descEnH = 0.8;
      const descZhY = contentY + descEnH + 0.3; // 增加间距防止重叠

      // 左侧装饰竖线，需覆盖所有描述
      master.addShape('rect', { x: margin, y: contentY, w: 0.05, h: 1.6, fill: { color: primary } });

      if (config.language === 'chinese-only') {
        master.addText(slide.descriptionZh, {
          x: margin + 0.2, y: contentY, w: leftW - 0.4, h: descEnH,
          fontSize: 11, color: '1e293b', fontFace: pptFont, lineSpacing: 18, valign: 'top', shrinkText: true
        });
      } else if (config.language === 'english-only') {
        master.addText(slide.descriptionEn, {
          x: margin + 0.2, y: contentY, w: leftW - 0.4, h: descEnH,
          fontSize: 11, color: '1e293b', fontFace: pptFont, lineSpacing: 18, valign: 'top', shrinkText: true
        });
      } else {
        master.addText(slide.descriptionEn, {
          x: margin + 0.2, y: contentY, w: leftW - 0.4, h: descEnH,
          fontSize: 11, color: '1e293b', fontFace: pptFont, lineSpacing: 18, valign: 'top', shrinkText: true
        });
        master.addText(slide.descriptionZh, {
          x: margin + 0.2, y: descZhY, w: leftW - 0.4, h: 0.5,
          fontSize: 9.5, color: '64748b', fontFace: pptFont, valign: 'top', shrinkText: true
        });
      }

      // 数据指标框 (左下方)
      if (slide.keyPoints) {
        const kpY = 4.0; // 往下移
        const kpH = 0.8;
        master.addShape('rect', {
            x: margin, y: kpY, w: leftW - 0.4, h: kpH,
            fill: { color: primary }
        });
        slide.keyPoints.slice(0, 4).forEach((kp, i) => {
          const row = Math.floor(i / 2);
          const col = i % 2;
          master.addText(`• ${kp}`, {
              x: margin + 0.2 + (col * (leftW/2 - 0.2)),
              y: kpY + 0.12 + (row * 0.32),
              w: (leftW/2 - 0.4),
              fontSize: 7.5, color: 'FFFFFF', bold: true, fontFace: pptFont, valign: 'middle'
          });
        });
      }

      // 右侧图片 (黄金比例宽度)
      if (slide.imageUrl) {
        master.addImage({ 
            data: slide.imageUrl, 
            x: slideW - rightW - margin, y: 1.3, 
            w: rightW, h: slideH - 2.0 
        });
      }

      // 页脚 (绝对下方，防止重叠指标框)
      master.addText(`${index + 1} | Source: ${slide.sourceInfo || 'Internal Document'}`, {
        x: margin, y: slideH - 0.35, w: slideW - 1, fontSize: 7, color: 'CBD5E1', bold: true, fontFace: pptFont
      });
      });

      // Write the file
      await pptx.writeFile({ fileName: `PPTCrafter_${Date.now()}.pptx` });
      setIsExporting(false);
    } catch (error) {
      console.error('PPT Export Error:', error);
      alert('导出PPT失败，请重试');
      setIsExporting(false);
      setShowExportModal(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="no-print bg-white/90 backdrop-blur-md p-6 rounded-[2rem] border border-amber-50 soft-shadow flex justify-between items-center sticky top-4 z-50">
         <div className="flex items-center gap-4">
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-full transition-all"
              title="返回主页"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-xs font-bold">新建演示</span>
            </button>
            <div className="w-px h-6 bg-slate-200"></div>
            <div className="text-xs font-black uppercase tracking-widest text-slate-400">
                {config.style} | {config.aspectRatio} | {slides.length} 页
            </div>
            {selectedIds.length > 0 && (
                <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full border border-amber-200 fade-in">
                    <span className="text-[10px] font-bold text-amber-600">已选 {selectedIds.length} 页</span>
                    <input
                        className="bg-transparent border-none outline-none text-[10px] font-bold w-48 placeholder:text-amber-300"
                        placeholder="输入优化指令 (如: 内容更商务/重新画图)..."
                        value={refinePrompt}
                        onChange={(e) => setRefinePrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
                    />
                    <button onClick={handleRefine} disabled={isRefining} className="text-[10px] font-black uppercase text-amber-700 hover:text-amber-900 active:scale-90 transition-all">
                        {isRefining ? '执行中...' : '提交'}
                    </button>
                </div>
            )}
         </div>
         <div className="flex items-center gap-3">
           <button
             onClick={onRegenerateImages}
             className="flex items-center gap-2 px-4 py-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-full transition-all border border-amber-200"
             title="重新生成所有图片"
           >
             <span className="text-lg">🎨</span>
             <span className="text-xs font-bold">重新生成图片</span>
           </button>
           <button
             onClick={onRegenerateAll}
             className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-700 hover:bg-slate-50 rounded-full transition-all border border-slate-200"
             title="重新生成整个演示文稿"
           >
             <span className="text-lg">🔄</span>
             <span className="text-xs font-bold">重新生成全部</span>
           </button>
           <div className="w-px h-6 bg-slate-200"></div>
           <button onClick={() => setShowExportModal(true)} className="px-10 py-3 bg-amber-500 text-white rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-amber-100 active:scale-95 transition-all">
             导出文稿
           </button>
         </div>
      </div>

      <div className="grid grid-cols-1 gap-16">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            onClick={() => handleToggleSelect(slide.id)}
            className={`slide-card bg-white rounded-[3rem] border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col ${selectedIds.includes(slide.id) ? 'border-amber-400 ring-4 ring-amber-100' : 'border-amber-50 shadow-xl shadow-amber-900/5'}`}
            style={{
                borderTop: `16px solid ${theme.primary}`,
                aspectRatio: config.aspectRatio === '16:9' ? '16/9' : '4/3',
                width: '100%',
                fontFamily
            }}
          >
            {/* Dynamic layout content */}
            {renderSlideContent(slide, index)}

            {/* Footer */}
            <div className="px-10 lg:px-16 py-4 border-t border-slate-50 flex justify-between items-center text-[9px] font-black text-slate-300 uppercase tracking-widest bg-slate-50/20">
               <span>Source: {slide.sourceInfo || 'Internal Document'}</span>
               <span className="bg-white px-3 py-1 rounded-full shadow-sm">{index + 1} / {slides.length}</span>
            </div>
          </div>
        ))}
      </div>

      {showExportModal && (
        <div className="fixed inset-0 bg-[rgba(28,25,23,0.7)] backdrop-blur-xl z-[100] flex items-start justify-center pt-32 p-6 no-print animate-fadeIn">
           <div className="bg-white rounded-sm border border-[#e7e5e4] p-10 max-w-md w-full text-center shadow-[0_20px_60px_rgba(0,0,0,0.2)] animate-slideUp">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#fef3c7] rounded-full border-2 border-[#d97706] mb-4">
                  <svg className="w-8 h-8 text-[#d97706]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <h3 className="font-[Playfair_Display,serif] text-3xl font-bold text-[#1c1917] tracking-tight">Export Presentation</h3>
                <p className="text-sm text-[#57534e] mt-2">Choose your preferred format</p>
              </div>

              <div className="space-y-3">
                 <button
                   onClick={exportPPT}
                   className="group w-full py-5 px-6 bg-[#d97706] text-white rounded-sm font-bold text-sm uppercase tracking-[0.1em] hover:bg-[#b45309] transition-all duration-300 shadow-[0_10px_30px_rgba(217,119,6,0.3)] hover:shadow-[0_15px_40px_rgba(217,119,6,0.4)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-between"
                 >
                   <span className="flex-1">PowerPoint</span>
                   <span className="text-xs opacity-70">.pptx</span>
                   <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                   </svg>
                 </button>

                 <button
                   onClick={exportPDF}
                   className="group w-full py-5 px-6 bg-white border-2 border-[#e7e5e4] text-[#1c1917] rounded-sm font-bold text-sm uppercase tracking-[0.1em] hover:border-[#d97706] hover:bg-[#fafaf9] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-between"
                 >
                   <span className="flex-1">PDF Document</span>
                   <span className="text-xs text-[#a8a29e]">.pdf</span>
                   <svg className="w-5 h-5 ml-2 text-[#d97706] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                   </svg>
                 </button>
              </div>

              <button
                onClick={() => setShowExportModal(false)}
                className="mt-6 text-[#a8a29e] font-medium text-xs uppercase tracking-[0.15em] hover:text-[#1c1917] transition-colors"
              >
                Cancel
              </button>
           </div>
        </div>
      )}

      {isExporting && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-xl z-[200] flex flex-col items-center justify-center no-print">
           <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
           <p className="font-black text-slate-800 uppercase tracking-widest">排版引擎加速中...</p>
        </div>
      )}
    </div>
  );
};
