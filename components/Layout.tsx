'use client';

import React from 'react';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {/* Fixed Header with Backdrop Blur */}
      <header className="fixed top-0 left-0 right-0 bg-[rgba(250,250,249,0.85)] backdrop-blur-[20px] border-b border-[#e7e5e4] z-[1000] animate-slideDown">
        <div className="max-w-[1400px] mx-auto px-12 py-6 flex justify-between items-center">
          {/* Left: Back to Home + Branding */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-[#57534e] hover:text-[#1c1917] transition-colors duration-300 no-underline group"
            >
              <span className="text-[#d97706] group-hover:-translate-x-1 transition-transform duration-300">←</span>
              <span className="font-medium">Home</span>
            </Link>

            <div className="h-6 w-[1px] bg-[#e7e5e4]"></div>

            <div>
              <h1 className="font-[Playfair_Display,serif] text-xl font-bold tracking-tight text-[#1c1917]">
                PPT Crafter
              </h1>
              <p className="font-mono text-[9px] font-medium uppercase tracking-[0.12em] text-[#d97706]">
                Transform • Create • Present
              </p>
            </div>
          </div>

          {/* Right: Tagline */}
          <div className="hidden md:block">
            <p className="text-sm text-[#57534e] font-light italic">
              "From documents to presentations in moments"
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-32 pb-24 w-full px-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        {children}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-[#e7e5e4] py-12 text-center no-print">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-[1px] bg-[#e7e5e4]"></div>
            <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#d97706]">
              Maygent Studio
            </span>
            <div className="w-16 h-[1px] bg-[#e7e5e4]"></div>
          </div>
          <p className="font-mono text-xs tracking-[0.05em] text-[#a8a29e]">
            PPT Crafter © 2024 — Built with Claude & Flux
          </p>
        </div>
      </footer>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) both;
        }

        @media print {
          header, footer {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
