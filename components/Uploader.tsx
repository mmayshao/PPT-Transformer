
import React, { useRef, useState } from 'react';
import { AnalysisInput } from '../types';

interface UploaderProps {
  onInputReady: (input: AnalysisInput) => void;
  isLoading: boolean;
}

export const Uploader: React.FC<UploaderProps> = ({ onInputReady, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'file' | 'text'>('file');
  const [textInput, setTextInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOver, setIsOver] = useState(false);

  const processFile = async (file: File) => {
    if (!file) return;
    
    if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        onInputReady({ type: 'pdf', data: base64 });
      };
      reader.readAsDataURL(file);
    } 
    else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      file.name.endsWith('.docx')
    ) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        // @ts-ignore
        if (window.mammoth) {
            // @ts-ignore
            const result = await window.mammoth.extractRawText({ arrayBuffer });
            onInputReady({ type: 'text', data: result.value });
        } else {
            alert("文档解析组件未加载，请刷新页面重试");
        }
      };
      reader.readAsArrayBuffer(file);
    }
    else if (file.type === 'text/plain' || file.name.endsWith('.md')) {
        const text = await file.text();
        onInputReady({ type: 'text', data: text });
    } else {
        alert("不支持的文件格式。请上传 PDF, Word 或 Txt。");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="max-w-3xl mx-auto text-center fade-in">
      <div className="flex justify-center mb-8">
        <div className="bg-white p-1 rounded-full border border-slate-200 inline-flex soft-shadow">
          <button 
            onClick={() => setActiveTab('file')}
            className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'file' ? 'bg-amber-400 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            上传文档
          </button>
          <button 
            onClick={() => setActiveTab('text')}
            className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'text' ? 'bg-amber-400 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            输入大纲
          </button>
        </div>
      </div>

      {activeTab === 'file' ? (
        <div 
            onClick={() => !isLoading && fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
            onDragLeave={() => setIsOver(false)}
            onDrop={handleDrop}
            className={`
            group relative w-full p-20 border-4 border-dashed rounded-[3rem]
            flex flex-col items-center justify-center cursor-pointer transition-all duration-500
            ${isOver ? 'border-amber-400 bg-amber-50/50 scale-[1.02]' : 'border-amber-100 bg-white hover:border-amber-300 hover:bg-amber-50/30'}
            ${isLoading ? 'opacity-50 pointer-events-none' : 'soft-shadow'}
            `}
        >
            <input 
            type="file" 
            className="hidden" 
            accept=".pdf,.docx,.txt,.md"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
            disabled={isLoading}
            />
            
            <div className="mb-8 w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <svg className="w-12 h-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">
            {isLoading ? '正在解析...' : '上传 PDF / Word / Txt'}
            </h3>
            
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
            支持各类文档格式<br/>AI 将自动提取核心洞察并转化为演示文稿
            </p>
        </div>
      ) : (
        <div className="w-full bg-white rounded-[3rem] p-8 border-4 border-amber-50 soft-shadow flex flex-col gap-4">
            <textarea 
                className="w-full h-64 p-6 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:border-amber-400 outline-none resize-none font-sans text-sm text-slate-700 transition-all"
                placeholder="在此粘贴您的文章内容、会议记录或大纲..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
            />
            <button 
                disabled={!textInput.trim() || isLoading}
                onClick={() => onInputReady({ type: 'text', data: textInput })}
                className="w-full py-4 bg-amber-500 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-amber-600 disabled:opacity-50 transition-all shadow-lg shadow-amber-100"
            >
                开始生成
            </button>
        </div>
      )}
    </div>
  );
};
