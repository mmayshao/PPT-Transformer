import { LayoutTemplate } from '../types';

interface LayoutTemplateSelectorProps {
  selected: LayoutTemplate;
  onChange: (layout: LayoutTemplate) => void;
}

const layoutOptions: Array<{
  value: LayoutTemplate;
  name: string;
  description: string;
  preview: React.ReactNode;
}> = [
  {
    value: 'left-right-golden',
    name: 'Golden Ratio',
    description: 'Left content (61.8%) + Right image (38.2%)',
    preview: (
      <div className="flex gap-0.5 h-8">
        <div className="bg-slate-300 rounded" style={{ width: '61.8%' }} />
        <div className="bg-amber-200 rounded" style={{ width: '38.2%' }} />
      </div>
    ),
  },
  {
    value: 'left-right-equal',
    name: 'Equal Split',
    description: 'Left content (50%) + Right image (50%)',
    preview: (
      <div className="flex gap-0.5 h-8">
        <div className="bg-slate-300 rounded w-1/2" />
        <div className="bg-amber-200 rounded w-1/2" />
      </div>
    ),
  },
  {
    value: 'top-bottom',
    name: 'Top-Bottom',
    description: 'Image on top, content below',
    preview: (
      <div className="flex flex-col gap-0.5 h-8">
        <div className="bg-amber-200 rounded h-1/2" />
        <div className="bg-slate-300 rounded h-1/2" />
      </div>
    ),
  },
  {
    value: 'image-background',
    name: 'Image Background',
    description: 'Full-screen image with text overlay',
    preview: (
      <div className="relative h-8 bg-amber-200 rounded overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-slate-300/80" />
      </div>
    ),
  },
  {
    value: 'right-left',
    name: 'Reverse Layout',
    description: 'Image on left (38.2%) + content on right',
    preview: (
      <div className="flex gap-0.5 h-8">
        <div className="bg-amber-200 rounded" style={{ width: '38.2%' }} />
        <div className="bg-slate-300 rounded" style={{ width: '61.8%' }} />
      </div>
    ),
  },
  {
    value: 'text-only',
    name: 'Text Only',
    description: 'Pure content, no images',
    preview: (
      <div className="h-8 bg-slate-300 rounded flex items-center justify-center text-xs text-slate-600">
        Text
      </div>
    ),
  },
  {
    value: 'image-focus',
    name: 'Image Focus',
    description: 'Large image with minimal text',
    preview: (
      <div className="relative h-8 bg-amber-200 rounded">
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-slate-300/70" />
      </div>
    ),
  },
];

export default function LayoutTemplateSelector({
  selected,
  onChange,
}: LayoutTemplateSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-stone-700">
        Layout Template
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {layoutOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              relative p-3 rounded-lg border-2 transition-all duration-200
              hover:shadow-md
              ${
                selected === option.value
                  ? 'border-amber-500 bg-amber-50 shadow-sm'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }
            `}
          >
            <div className="space-y-2">
              {option.preview}
              <div className="text-left">
                <div className="text-xs font-semibold text-stone-800">
                  {option.name}
                </div>
                <div className="text-[10px] text-stone-500 line-clamp-2">
                  {option.description}
                </div>
              </div>
            </div>
            {selected === option.value && (
              <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
