import React, { useState } from 'react';
import { LanguageMode } from '../types';

interface OutlinePreviewProps {
  outline: string[];
  language: LanguageMode;
  onConfirm: (editedOutline: string[]) => void;
  onRegenerate: () => void;
  onBack: () => void;
}

export default function OutlinePreview({
  outline,
  language,
  onConfirm,
  onRegenerate,
  onBack,
}: OutlinePreviewProps) {
  const [editedOutline, setEditedOutline] = useState<string[]>(outline);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleTitleChange = (index: number, newTitle: string) => {
    const newOutline = [...editedOutline];
    newOutline[index] = newTitle;
    setEditedOutline(newOutline);
  };

  const handleAddSlide = (afterIndex: number) => {
    const newOutline = [...editedOutline];
    const newTitle = language === 'bilingual'
      ? 'New Slide | 新幻灯片'
      : language === 'english-only'
      ? 'New Slide'
      : language === 'chinese-only'
      ? '新幻灯片'
      : 'New Slide';
    newOutline.splice(afterIndex + 1, 0, newTitle);
    setEditedOutline(newOutline);
  };

  const handleRemoveSlide = (index: number) => {
    if (editedOutline.length <= 3) {
      alert('Presentation must have at least 3 slides');
      return;
    }
    const newOutline = editedOutline.filter((_, i) => i !== index);
    setEditedOutline(newOutline);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newOutline = [...editedOutline];
    [newOutline[index - 1], newOutline[index]] = [newOutline[index], newOutline[index - 1]];
    setEditedOutline(newOutline);
  };

  const handleMoveDown = (index: number) => {
    if (index === editedOutline.length - 1) return;
    const newOutline = [...editedOutline];
    [newOutline[index], newOutline[index + 1]] = [newOutline[index + 1], newOutline[index]];
    setEditedOutline(newOutline);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 lg:p-12 rounded-[2.5rem] border border-amber-50 soft-shadow fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">确认演示大纲</h2>
        <p className="text-sm text-slate-500">
          Review and edit the presentation outline before generating full content
        </p>
        <p className="text-xs text-amber-600 mt-2">
          {editedOutline.length} slides • Click to edit, drag to reorder
        </p>
      </div>

      <div className="space-y-3 mb-8 max-h-[500px] overflow-y-auto">
        {editedOutline.map((title, index) => (
          <div
            key={index}
            className="group relative bg-slate-50 hover:bg-white border-2 border-slate-100 hover:border-amber-200 rounded-2xl p-4 transition-all"
          >
            <div className="flex items-start gap-4">
              {/* Slide number */}
              <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-xs font-bold text-amber-700">
                {index + 1}
              </div>

              {/* Title */}
              <div className="flex-1 min-w-0">
                {editingIndex === index ? (
                  <textarea
                    value={title}
                    onChange={(e) => handleTitleChange(index, e.target.value)}
                    onBlur={() => setEditingIndex(null)}
                    autoFocus
                    className="w-full px-3 py-2 text-sm font-semibold text-slate-800 bg-white border-2 border-amber-300 rounded-lg outline-none resize-none"
                    rows={2}
                  />
                ) : (
                  <div
                    onClick={() => setEditingIndex(index)}
                    className="text-sm font-semibold text-slate-800 leading-relaxed cursor-text hover:text-amber-700 transition-colors"
                  >
                    {title}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="p-1.5 bg-slate-200 hover:bg-slate-300 disabled:opacity-30 disabled:cursor-not-allowed rounded text-xs"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={index === editedOutline.length - 1}
                  className="p-1.5 bg-slate-200 hover:bg-slate-300 disabled:opacity-30 disabled:cursor-not-allowed rounded text-xs"
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  onClick={() => handleAddSlide(index)}
                  className="p-1.5 bg-green-100 hover:bg-green-200 rounded text-xs"
                  title="Add slide after"
                >
                  +
                </button>
                <button
                  onClick={() => handleRemoveSlide(index)}
                  className="p-1.5 bg-red-100 hover:bg-red-200 rounded text-xs"
                  title="Remove slide"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-full hover:bg-slate-200 transition-all"
        >
          ← Back
        </button>
        <div className="flex gap-4">
          <button
            onClick={onRegenerate}
            className="px-6 py-3 bg-white border-2 border-amber-200 text-amber-600 font-bold rounded-full hover:bg-amber-50 transition-all"
          >
            🔄 Regenerate Outline
          </button>
          <button
            onClick={() => onConfirm(editedOutline)}
            className="px-8 py-3 bg-amber-500 text-white font-black uppercase tracking-wider rounded-full hover:bg-amber-600 shadow-xl shadow-amber-200 transition-all"
          >
            Looks Good! Generate Slides →
          </button>
        </div>
      </div>
    </div>
  );
}
