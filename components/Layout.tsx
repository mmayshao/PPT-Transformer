
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <header className="w-full py-8 bg-white/50 backdrop-blur-md border-b border-amber-50 no-print">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg shadow-amber-200">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/></svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800">
                Light<span className="text-amber-500">Draft</span>
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">AI Strategic Partner</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-xs text-slate-400 italic">"Making insights beautiful."</span>
          </div>
        </div>
      </header>
      
      <main className="w-full max-w-6xl px-6 py-16">
        {children}
      </main>
      
      <footer className="w-full py-12 text-center no-print">
        <div className="w-12 h-0.5 bg-amber-200 mx-auto mb-6"></div>
        <p className="text-slate-400 text-xs font-medium tracking-wide">
          Crafted with warmth by AI Studio • Professional Strategy Series
        </p>
      </footer>
    </div>
  );
};
