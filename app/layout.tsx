import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'PPT Crafter - Maygent Studio',
  description: 'Transform documents into beautiful presentations with AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased bg-gradient-to-br from-amber-50 via-white to-yellow-50">
        {children}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.2/mammoth.browser.min.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
