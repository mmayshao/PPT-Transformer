import React, { useEffect, useState } from 'react';

interface ProgressPhase {
  id: 'content' | 'images' | 'complete';
  label: string;
  status: 'completed' | 'in_progress' | 'pending';
  duration?: number;
}

interface ProgressIndicatorProps {
  currentPhase: 'generating_outline' | 'outline_ready' | 'analyzing' | 'generating_images' | 'ready';
  imageProgress?: { current: number; total: number };
  message?: string;
}

export default function ProgressIndicator({
  currentPhase,
  imageProgress,
  message,
}: ProgressIndicatorProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [phaseTimes, setPhaseTimes] = useState<Record<string, number>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Track phase completion times
  useEffect(() => {
    if (currentPhase === 'generating_images' && !phaseTimes.content) {
      setPhaseTimes((prev) => ({ ...prev, content: elapsedTime }));
    }
  }, [currentPhase, elapsedTime, phaseTimes]);

  // Calculate progress - Only 3 steps now
  const getProgress = (): { phases: ProgressPhase[]; percentage: number; estimatedRemaining: number } => {
    const phases: ProgressPhase[] = [
      {
        id: 'content',
        label: 'Content Synthesized',
        status: currentPhase === 'analyzing' || currentPhase === 'generating_outline' ? 'in_progress' :
                ['generating_images', 'ready'].includes(currentPhase) ? 'completed' : 'pending',
        duration: phaseTimes.content
      },
      {
        id: 'images',
        label: `Generating Images${imageProgress ? ` (${imageProgress.current}/${imageProgress.total})` : ''}`,
        status: currentPhase === 'generating_images' ? 'in_progress' :
                currentPhase === 'ready' ? 'completed' : 'pending',
      },
      {
        id: 'complete',
        label: 'Finalizing',
        status: currentPhase === 'ready' ? 'completed' : 'pending',
      },
    ];

    // Calculate percentage
    let percentage = 0;
    if (currentPhase === 'generating_outline' || currentPhase === 'analyzing') percentage = 30;
    else if (currentPhase === 'generating_images' && imageProgress) {
      percentage = 30 + (imageProgress.current / imageProgress.total) * 60;
    } else if (currentPhase === 'ready') percentage = 100;

    // Estimate remaining time
    let estimatedRemaining = 0;
    if (currentPhase === 'analyzing' || currentPhase === 'generating_outline') estimatedRemaining = 30;
    else if (currentPhase === 'generating_images' && imageProgress) {
      const remainingImages = imageProgress.total - imageProgress.current;
      estimatedRemaining = remainingImages * 20;
    }

    return { phases, percentage, estimatedRemaining };
  };

  const { phases, percentage, estimatedRemaining } = getProgress();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'in_progress':
        return '→';
      case 'pending':
        return '⏳';
      default:
        return '';
    }
  };

  return (
    <div className="w-full fade-in">
      {/* Horizontal Progress Steps at Top */}
      <div className="sticky top-0 z-50 bg-white border-b border-[#e7e5e4] shadow-sm">
        <div className="max-w-[1400px] mx-auto px-8 py-6">
          {/* Steps Row */}
          <div className="flex items-center justify-between gap-4 mb-4">
            {phases.map((phase, idx) => (
              <React.Fragment key={phase.id}>
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm font-bold transition-all ${
                      phase.status === 'completed'
                        ? 'bg-[#d97706] text-white'
                        : phase.status === 'in_progress'
                        ? 'bg-[#fef3c7] text-[#d97706] border-2 border-[#d97706] animate-pulse'
                        : 'bg-[#fafaf9] text-[#a8a29e] border-2 border-[#e7e5e4]'
                    }`}
                  >
                    {getStatusIcon(phase.status)}
                  </div>
                  <div className="flex-1">
                    <div
                      className={`font-medium text-sm transition-colors ${
                        phase.status === 'completed'
                          ? 'text-[#1c1917]'
                          : phase.status === 'in_progress'
                          ? 'text-[#d97706]'
                          : 'text-[#a8a29e]'
                      }`}
                    >
                      {phase.label}
                    </div>
                    {phase.duration && (
                      <div className="text-xs text-[#a8a29e] mt-0.5">{phase.duration}s</div>
                    )}
                  </div>
                </div>
                {idx < phases.length - 1 && (
                  <div className="flex-shrink-0 w-12 h-0.5 bg-[#e7e5e4]">
                    <div
                      className="h-full bg-[#d97706] transition-all duration-500"
                      style={{
                        width: phase.status === 'completed' ? '100%' : '0%',
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-[#fafaf9] rounded-full overflow-hidden border border-[#e7e5e4]">
            <div
              className="h-full bg-gradient-to-r from-[#d97706] to-[#fbbf24] transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Status Message */}
          <div className="flex items-center justify-between mt-3">
            <div className="text-sm text-[#57534e]">{message || 'Processing...'}</div>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-[#a8a29e]">{Math.round(percentage)}% Complete</span>
              {estimatedRemaining > 0 && (
                <span className="text-[#d97706] font-medium">~{estimatedRemaining}s remaining</span>
              )}
            </div>
          </div>

          {/* Image generation note */}
          {currentPhase === 'generating_images' && (
            <div className="mt-3 text-xs text-[#a8a29e] text-center">
              为避免 API 限制，每张图片间隔 15 秒生成
            </div>
          )}
        </div>
      </div>

      {/* Content Area - Shows slides as they're being generated */}
      <div className="max-w-[1400px] mx-auto px-8 py-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#fef3c7] border-2 border-[#d97706] rounded-full mb-6">
            <svg className="w-8 h-8 text-[#d97706] animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="font-[Playfair_Display,serif] text-2xl font-semibold text-[#1c1917] mb-2">
            Generating Your Presentation
          </h2>
          <p className="text-sm text-[#57534e]">Please wait while we craft your slides...</p>
        </div>
      </div>
    </div>
  );
}
