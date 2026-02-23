'use client';

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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingFile, setProcessingFile] = useState<string | null>(null);

  const processFile = async (file: File) => {
    if (!file) return;

    // 文件大小验证 (最大 20MB)
    const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(1);
      alert(`文件过大（${sizeMB}MB），最大支持 20MB。请尝试较小的文件。`);
      return;
    }

    setProcessingFile(file.name);
    setUploadProgress(0);

    if (file.type === 'application/pdf') {
      const reader = new FileReader();

      // 进度反馈
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(progress);
        }
      };

      reader.onload = () => {
        try {
          const base64 = (reader.result as string).split(',')[1];
          if (!base64) {
            throw new Error('文件读取失败');
          }
          onInputReady({ type: 'pdf', data: base64 });
          setProcessingFile(null);
          setUploadProgress(0);
        } catch (error) {
          console.error('PDF processing error:', error);
          alert('PDF 文件处理失败，请重试或尝试其他文件。');
          setProcessingFile(null);
          setUploadProgress(0);
        }
      };

      reader.onerror = () => {
        alert('文件读取失败，请重试。');
        setProcessingFile(null);
        setUploadProgress(0);
      };

      reader.readAsDataURL(file);
    } 
    else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.name.endsWith('.docx')
    ) {
      const reader = new FileReader();

      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(progress);
        }
      };

      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          // @ts-ignore
          if (window.mammoth) {
            // @ts-ignore
            const result = await window.mammoth.extractRawText({ arrayBuffer });
            if (!result.value || result.value.trim().length === 0) {
              throw new Error('文档内容为空');
            }
            onInputReady({ type: 'text', data: result.value });
            setProcessingFile(null);
            setUploadProgress(0);
          } else {
            alert("文档解析组件未加载，请刷新页面重试");
            setProcessingFile(null);
            setUploadProgress(0);
          }
        } catch (error) {
          console.error('Word processing error:', error);
          alert('Word 文档处理失败，请重试或尝试其他格式。');
          setProcessingFile(null);
          setUploadProgress(0);
        }
      };

      reader.onerror = () => {
        alert('文件读取失败，请重试。');
        setProcessingFile(null);
        setUploadProgress(0);
      };

      reader.readAsArrayBuffer(file);
    }
    else if (file.type === 'text/plain' || file.name.endsWith('.md')) {
      try {
        const text = await file.text();
        if (!text || text.trim().length === 0) {
          alert('文件内容为空，请检查文件。');
          return;
        }
        onInputReady({ type: 'text', data: text });
        setProcessingFile(null);
        setUploadProgress(0);
      } catch (error) {
        console.error('Text file processing error:', error);
        alert('文本文件读取失败，请重试。');
        setProcessingFile(null);
        setUploadProgress(0);
      }
    } else {
      alert("不支持的文件格式。请上传 PDF, Word(.docx), TXT 或 Markdown(.md) 文件。");
      setProcessingFile(null);
      setUploadProgress(0);
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
        <div className="bg-white p-1 rounded-lg border border-[#e7e5e4] inline-flex shadow-sm">
          <button
            onClick={() => setActiveTab('file')}
            className={`px-8 py-3 rounded-md font-mono text-[10px] font-bold uppercase tracking-[0.1em] transition-all ${activeTab === 'file' ? 'bg-[#d97706] text-white' : 'text-[#57534e] hover:text-[#1c1917]'}`}
          >
            Upload Document
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`px-8 py-3 rounded-md font-mono text-[10px] font-bold uppercase tracking-[0.1em] transition-all ${activeTab === 'text' ? 'bg-[#d97706] text-white' : 'text-[#57534e] hover:text-[#1c1917]'}`}
          >
            Paste Text
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
            group relative w-full p-20 border-2 border-dashed rounded-xl
            flex flex-col items-center justify-center cursor-pointer transition-all duration-400
            ${isOver ? 'border-[#d97706] bg-[#fef3c7]/50 scale-[1.01]' : 'border-[#e7e5e4] bg-white hover:border-[#d97706] hover:bg-[#fafaf9]'}
            ${isLoading ? 'opacity-50 pointer-events-none' : 'shadow-[0_10px_30px_rgba(0,0,0,0.08)]'}
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

            <div className="mb-8 w-24 h-24 bg-[#fef3c7] rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300 border border-[#e7e5e4]">
            <svg className="w-12 h-12 text-[#d97706]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            </div>

            <h3 className="font-[Playfair_Display,serif] text-2xl font-semibold text-[#1c1917] mb-3 tracking-tight">
            {processingFile ? 'Processing File...' : isLoading ? 'Analyzing...' : 'Upload Document'}
            </h3>

            {processingFile ? (
              <div className="w-full max-w-sm">
                <p className="text-[#57534e] text-xs mb-2 truncate">{processingFile}</p>
                <div className="w-full bg-[#e7e5e4] rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-[#d97706] transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-[#57534e] text-xs mt-1">{uploadProgress}%</p>
              </div>
            ) : (
              <p className="text-[#57534e] text-sm max-w-sm leading-relaxed">
                PDF, Word, TXT, or Markdown (Max 20MB)<br/>AI will extract insights and transform them into presentations
              </p>
            )}
        </div>
      ) : (
        <div className="w-full bg-white rounded-xl p-8 border border-[#e7e5e4] shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex flex-col gap-4">
            <textarea
                className="w-full h-64 p-6 bg-[#fafaf9] border border-[#e7e5e4] rounded-lg focus:border-[#d97706] outline-none resize-none font-sans text-sm text-[#1c1917] transition-all"
                placeholder="Paste your article, meeting notes, or outline here..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
            />
            <button
                disabled={!textInput.trim() || isLoading}
                onClick={() => onInputReady({ type: 'text', data: textInput })}
                className="w-full py-4 bg-[#1c1917] text-[#fafaf9] font-bold uppercase tracking-[0.15em] rounded-sm hover:bg-[#d97706] disabled:opacity-50 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:-translate-y-0.5"
            >
                Generate Presentation
            </button>
        </div>
      )}
    </div>
  );
};
