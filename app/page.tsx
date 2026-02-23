'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function HomePage() {
  const [selectedNav, setSelectedNav] = useState('home');
  const [language, setLanguage] = useState<'zh' | 'en'>('en');

  const t = {
    zh: {
      tagline: 'Vibe Coding Platform',
      hero: {
        title: '现代分析师的智能工具',
        subtitle: '为 PE/VC 专业人士提供精选的 AI 洞察和专用工具。保持信息灵通，更智能地工作，更快行动。'
      },
      nav: {
        intelligence: '动态',
        tools: '工具',
        about: '关于'
      },
      aiIntelligence: {
        title: 'AI Intelligence',
        description: '每日更新人工智能前沿动态。精选自 OpenAI、Anthropic、Meta、DeepSeek 等领军企业。',
        viewAll: '查看全部更新'
      },
      vibeTools: {
        title: 'Vibe Coding Tools',
        description: '为 PE/VC 分析师打造的专用工具。转换文档、分析市场、生成洞察。',
        pptCrafter: {
          desc: '将文档转换为精美演示文稿。AI 驱动的布局、Flux 图片生成、多种导出格式。'
        },
        insightMaker: {
          name: 'Insight Maker',
          desc: '从复杂数据中提取关键洞察。AI 驱动的数据分析、趋势识别、智能报告生成。'
        },
        valueCreator: {
          name: 'Value Creator',
          desc: '生成价值创造方案。投资后价值提升路径、运营优化建议、增长战略规划。'
        },
        available: '可用',
        comingSoon: '即将推出'
      },
      about: {
        title: '关于 Maygent Studio',
        mission: '我们为现代 PE/VC 分析师构建智能工具，结合精选的 AI 洞察与专用自动化工具，帮助投资专业人士更智能地工作。',
        vision: '打造开源、透明、可控的智能平台，让专业人士拥有强大工具的同时保持数据隐私与自主权。',
        opensource: '开源项目',
        opensourceDesc: '完全开源，可自行部署，使用自己的 API 密钥，确保数据隐私与成本可控。'
      },
      footer: '© 2024 — Built with Claude & Flux'
    },
    en: {
      tagline: 'Vibe Coding Platform',
      hero: {
        title: 'Intelligence Tools for Modern Analysts',
        subtitle: 'Curated AI insights and purpose-built tools for PE/VC professionals. Stay informed, work smarter, move faster.'
      },
      nav: {
        intelligence: 'Intelligence',
        tools: 'Tools',
        about: 'About'
      },
      aiIntelligence: {
        title: 'AI Intelligence',
        description: 'Daily updates from the frontier of artificial intelligence. Curated from OpenAI, Anthropic, Meta, DeepSeek, and emerging leaders.',
        viewAll: 'View All Updates'
      },
      vibeTools: {
        title: 'Vibe Coding Tools',
        description: 'Purpose-built agents and utilities for PE/VC analysts. Transform documents, analyze markets, generate insights.',
        pptCrafter: {
          desc: 'Transform documents into stunning presentations. AI-powered layouts, Flux image generation, multiple export formats.'
        },
        insightMaker: {
          name: 'Insight Maker',
          desc: 'Extract key insights from complex data. AI-driven analysis, trend identification, intelligent report generation.'
        },
        valueCreator: {
          name: 'Value Creator',
          desc: 'Generate value creation plans. Post-investment value enhancement paths, operational optimization, growth strategies.'
        },
        available: 'Available',
        comingSoon: 'Coming Soon'
      },
      about: {
        title: 'About Maygent Studio',
        mission: 'We build intelligence tools for modern PE/VC analysts, combining curated AI insights with purpose-built automation to help investment professionals work smarter.',
        vision: 'Creating an open-source, transparent, and controllable intelligence platform that empowers professionals with powerful tools while maintaining data privacy and autonomy.',
        opensource: 'Open Source',
        opensourceDesc: 'Fully open-source, self-hostable, use your own API keys. Ensure data privacy and cost control.'
      },
      footer: '© 2024 — Built with Claude & Flux'
    }
  };

  const currentLang = t[language];

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-[rgba(250,250,249,0.85)] backdrop-blur-[20px] border-b border-[#e7e5e4] z-[1000] animate-slideDown">
        <div className="max-w-[1400px] mx-auto px-12 py-6 flex justify-between items-center">
          <button
            onClick={() => setSelectedNav('home')}
            className="font-[Playfair_Display,serif] text-2xl font-bold tracking-tight text-[#1c1917] no-underline relative group bg-transparent border-0 cursor-pointer"
          >
            Maygent Studio
            <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-[#d97706] transition-all duration-[400ms] group-hover:w-full"></span>
          </button>

          <nav className="flex gap-12 items-center">
            {['intelligence', 'tools', 'about'].map((nav) => (
              <button
                key={nav}
                onClick={() => setSelectedNav(nav)}
                className={`text-sm font-medium tracking-wide uppercase relative transition-colors duration-300 ${
                  selectedNav === nav ? 'text-[#1c1917]' : 'text-[#57534e]'
                }`}
              >
                {currentLang.nav[nav as keyof typeof currentLang.nav]}
                {selectedNav === nav && (
                  <span className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#d97706] rounded-full"></span>
                )}
              </button>
            ))}

            {/* Language Switcher */}
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => setLanguage('zh')}
                className={`text-xs font-bold px-2 py-1 rounded transition-all ${
                  language === 'zh'
                    ? 'bg-[#d97706] text-white'
                    : 'text-[#57534e] hover:text-[#1c1917]'
                }`}
              >
                中文
              </button>
              <span className="text-[#e7e5e4]">|</span>
              <button
                onClick={() => setLanguage('en')}
                className={`text-xs font-bold px-2 py-1 rounded transition-all ${
                  language === 'en'
                    ? 'bg-[#d97706] text-white'
                    : 'text-[#57534e] hover:text-[#1c1917]'
                }`}
              >
                EN
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero - Only show on home */}
      {selectedNav === 'home' && (
      <section className="mt-20 px-12 py-24 max-w-[1400px] mx-auto animate-fadeInUp relative">
        <div className="max-w-[800px]">
          <div className="font-mono text-xs font-medium tracking-[0.1em] uppercase text-[#d97706] mb-6">
            {currentLang.tagline}
          </div>
          <h1 className="font-[Playfair_Display,serif] text-[clamp(3rem,6vw,5rem)] font-bold leading-[1.1] tracking-[-0.03em] text-[#1c1917] mb-6">
            {currentLang.hero.title}
          </h1>
          <p className="text-xl font-light leading-[1.7] text-[#57534e] max-w-[600px]">
            {currentLang.hero.subtitle}
          </p>
        </div>

        {/* Decorative AI/Robot SVG - Playful Intelligence */}
        <div className="absolute top-0 right-12 w-[500px] h-[500px] opacity-[0.12] pointer-events-none hidden lg:block">
          <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background Grid Pattern */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d97706" strokeWidth="0.5" opacity="0.2"/>
              </pattern>
            </defs>
            <rect width="500" height="500" fill="url(#grid)"/>

            {/* Neural Network Layers */}
            <g opacity="0.5">
              <circle cx="250" cy="80" r="6" fill="#d97706"/>
              <circle cx="180" cy="150" r="6" fill="#d97706"/>
              <circle cx="320" cy="150" r="6" fill="#d97706"/>
              <circle cx="120" cy="240" r="6" fill="#d97706"/>
              <circle cx="220" cy="240" r="6" fill="#d97706"/>
              <circle cx="280" cy="240" r="6" fill="#d97706"/>
              <circle cx="380" cy="240" r="6" fill="#d97706"/>
              <circle cx="250" cy="380" r="6" fill="#d97706"/>

              {/* Animated Connections */}
              <path d="M250 80 L180 150 M250 80 L320 150 M180 150 L120 240 M180 150 L220 240 M320 150 L280 240 M320 150 L380 240 M220 240 L250 380 M280 240 L250 380"
                    stroke="#d97706" strokeWidth="1" opacity="0.3" strokeDasharray="4 4">
                <animate attributeName="stroke-dashoffset" from="0" to="8" dur="1s" repeatCount="indefinite"/>
              </path>
            </g>

            {/* Central Robot Character */}
            <g transform="translate(250, 200)">
              {/* Robot Body */}
              <rect x="-50" y="20" width="100" height="80" rx="15" stroke="#d97706" strokeWidth="3.5" fill="none"/>

              {/* Robot Head */}
              <rect x="-45" y="-50" width="90" height="70" rx="12" stroke="#d97706" strokeWidth="3.5" fill="none"/>

              {/* Eyes - Blinking Animation */}
              <circle cx="-20" cy="-25" r="10" fill="#d97706" opacity="0.7">
                <animate attributeName="r" values="10;10;2;10;10" dur="4s" repeatCount="indefinite"/>
              </circle>
              <circle cx="20" cy="-25" r="10" fill="#d97706" opacity="0.7">
                <animate attributeName="r" values="10;10;2;10;10" dur="4s" repeatCount="indefinite"/>
              </circle>

              {/* Smile */}
              <path d="M-25 0 Q0 10 25 0" stroke="#d97706" strokeWidth="3" fill="none" strokeLinecap="round"/>

              {/* Antenna with Broadcasting Signal */}
              <line x1="0" y1="-50" x2="0" y2="-80" stroke="#d97706" strokeWidth="3"/>
              <circle cx="0" cy="-85" r="8" fill="#d97706">
                <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
              </circle>

              {/* Radio Waves */}
              <circle cx="0" cy="-85" r="15" stroke="#d97706" strokeWidth="1.5" fill="none" opacity="0">
                <animate attributeName="r" values="15;30;45" dur="2s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.6;0.3;0" dur="2s" repeatCount="indefinite"/>
              </circle>
              <circle cx="0" cy="-85" r="15" stroke="#d97706" strokeWidth="1.5" fill="none" opacity="0">
                <animate attributeName="r" values="15;30;45" dur="2s" begin="0.5s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.6;0.3;0" dur="2s" begin="0.5s" repeatCount="indefinite"/>
              </circle>

              {/* Robot Arms */}
              <rect x="-70" y="35" width="15" height="50" rx="7" stroke="#d97706" strokeWidth="2.5" fill="none">
                <animateTransform attributeName="transform" type="rotate" values="0 -62.5 60; -10 -62.5 60; 0 -62.5 60" dur="3s" repeatCount="indefinite"/>
              </rect>
              <rect x="55" y="35" width="15" height="50" rx="7" stroke="#d97706" strokeWidth="2.5" fill="none">
                <animateTransform attributeName="transform" type="rotate" values="0 62.5 60; 10 62.5 60; 0 62.5 60" dur="3s" begin="0.3s" repeatCount="indefinite"/>
              </rect>

              {/* Control Panel on Body */}
              <circle cx="-15" cy="50" r="4" fill="#d97706" opacity="0.5">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite"/>
              </circle>
              <circle cx="0" cy="50" r="4" fill="#d97706" opacity="0.5">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" begin="0.3s" repeatCount="indefinite"/>
              </circle>
              <circle cx="15" cy="50" r="4" fill="#d97706" opacity="0.5">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" begin="0.6s" repeatCount="indefinite"/>
              </circle>

              {/* Display Screen */}
              <rect x="-30" y="65" width="60" height="25" rx="3" stroke="#d97706" strokeWidth="2" fill="none"/>
              <text x="0" y="81" fontFamily="monospace" fontSize="12" fill="#d97706" textAnchor="middle" opacity="0.6">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
                AI
              </text>
            </g>

            {/* Floating Data Particles */}
            <circle cx="100" cy="150" r="3" fill="#d97706" opacity="0.6">
              <animateTransform attributeName="transform" type="translate" values="0 0; 0 -20; 0 0" dur="3s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="400" cy="200" r="3" fill="#d97706" opacity="0.6">
              <animateTransform attributeName="transform" type="translate" values="0 0; 0 20; 0 0" dur="4s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.6;0;0.6" dur="4s" repeatCount="indefinite"/>
            </circle>
            <circle cx="150" cy="350" r="3" fill="#d97706" opacity="0.6">
              <animateTransform attributeName="transform" type="translate" values="0 0; -15 -15; 0 0" dur="3.5s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.6;0;0.6" dur="3.5s" repeatCount="indefinite"/>
            </circle>

            {/* Orbiting Satellites */}
            <circle cx="250" cy="200" r="150" stroke="#d97706" strokeWidth="0.8" strokeDasharray="6 6" opacity="0.25">
              <animateTransform attributeName="transform" type="rotate" from="0 250 200" to="360 250 200" dur="40s" repeatCount="indefinite"/>
            </circle>
            <circle cx="400" cy="200" r="6" fill="#d97706" opacity="0.5">
              <animateTransform attributeName="transform" type="rotate" from="0 250 200" to="360 250 200" dur="40s" repeatCount="indefinite"/>
            </circle>
            <circle cx="100" cy="200" r="6" fill="#d97706" opacity="0.5">
              <animateTransform attributeName="transform" type="rotate" from="180 250 200" to="540 250 200" dur="40s" repeatCount="indefinite"/>
            </circle>

            {/* Code Brackets */}
            <text x="50" y="100" fontFamily="monospace" fontSize="24" fill="#d97706" opacity="0.3">&lt;</text>
            <text x="430" y="320" fontFamily="monospace" fontSize="24" fill="#d97706" opacity="0.3">/&gt;</text>
          </svg>
        </div>
      </section>
      )}

      {/* Main Content */}
      <div className={`max-w-[1400px] mx-auto px-12 pb-24 animate-fadeInUp ${selectedNav === 'home' ? 'py-8' : 'pt-32 py-12'}`} style={{ animationDelay: '0.4s' }}>
        {/* Home View - Two Column Layout */}
        {selectedNav === 'home' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* AI Intelligence Section */}
          <section className="bg-white border border-[#e7e5e4] rounded-sm overflow-hidden transition-all duration-[400ms] hover:border-[#d97706] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] hover:-translate-y-1 relative group">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#d97706] to-[#fbbf24] scale-x-0 origin-left transition-transform duration-[600ms] group-hover:scale-x-100"></div>

          <div className="p-10 pb-8 border-b border-[#e7e5e4]">
            <div className="w-12 h-12 bg-[#fafaf9] border border-[#e7e5e4] rounded-full flex items-center justify-center mb-6 text-2xl transition-all duration-300 group-hover:bg-[#d97706] group-hover:border-[#d97706] group-hover:rotate-[5deg] group-hover:scale-110">
              📡
            </div>
            <h2 className="font-[Playfair_Display,serif] text-[2rem] font-semibold tracking-tight mb-3 text-[#1c1917]">
              {currentLang.aiIntelligence.title}
            </h2>
            <p className="text-[0.95rem] leading-[1.7] text-[#57534e]">
              {currentLang.aiIntelligence.description}
            </p>
          </div>

          <div className="p-6">
            {[
              { source: 'OpenAI', time: language === 'zh' ? '2小时前' : '2 hours ago', title: 'GPT-5 Capabilities Expand with New Multimodal Features', excerpt: 'OpenAI announces significant improvements in reasoning and context understanding...', url: 'https://openai.com/blog' },
              { source: 'Anthropic', time: language === 'zh' ? '5小时前' : '5 hours ago', title: 'Claude 3.5 Sonnet Sets New Benchmarks in Code Generation', excerpt: 'Latest model achieves 96% accuracy on SWE-bench, surpassing previous records...', url: 'https://www.anthropic.com/news' },
              { source: 'DeepSeek', time: language === 'zh' ? '1天前' : '1 day ago', title: 'Open-Source LLM Achieves Competitive Performance at Lower Cost', excerpt: 'DeepSeek\'s latest release demonstrates enterprise-grade capabilities...', url: 'https://www.deepseek.com' },
              { source: 'Meta', time: language === 'zh' ? '2天前' : '2 days ago', title: 'Llama 4 Architecture Reveals Novel Training Approaches', excerpt: 'Meta\'s research team publishes findings on scaling laws and efficiency...', url: 'https://ai.meta.com/blog' }
            ].map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-5 border-b last:border-b-0 border-[#e7e5e4] transition-all duration-200 cursor-pointer hover:bg-[#f5f5f4] hover:translate-x-1 no-underline group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-[0.7rem] font-medium tracking-[0.05em] uppercase text-[#d97706]">
                    {item.source}
                  </span>
                  <span className="text-xs text-[#a8a29e]">{item.time}</span>
                  <span className="ml-auto text-[#d97706] text-sm opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </div>
                <h3 className="text-[0.95rem] font-medium leading-[1.5] text-[#1c1917] mb-1">
                  {item.title}
                </h3>
                <p className="text-[0.85rem] leading-[1.6] text-[#57534e]">
                  {item.excerpt}
                </p>
              </a>
            ))}
          </div>

          <div className="text-center p-6">
            <button
              onClick={() => setSelectedNav('intelligence')}
              className="text-sm font-medium tracking-wide uppercase px-8 py-3.5 bg-[#1c1917] text-[#fafaf9] rounded-sm cursor-pointer transition-all duration-300 relative overflow-hidden group/btn hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
            >
              <span className="absolute top-1/2 left-1/2 w-0 h-0 rounded-full bg-[#d97706] transform -translate-x-1/2 -translate-y-1/2 transition-all duration-[600ms] group-hover/btn:w-[300px] group-hover/btn:h-[300px]"></span>
              <span className="relative z-10">{currentLang.aiIntelligence.viewAll}</span>
            </button>
          </div>
        </section>

          {/* Tools Section */}
          <section className="bg-white border border-[#e7e5e4] rounded-sm overflow-hidden transition-all duration-[400ms] hover:border-[#d97706] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] hover:-translate-y-1 relative group">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#d97706] to-[#fbbf24] scale-x-0 origin-left transition-transform duration-[600ms] group-hover:scale-x-100"></div>

          <div className="p-10 pb-8 border-b border-[#e7e5e4]">
            <div className="w-12 h-12 bg-[#fafaf9] border border-[#e7e5e4] rounded-full flex items-center justify-center mb-6 text-2xl transition-all duration-300 group-hover:bg-[#d97706] group-hover:border-[#d97706] group-hover:rotate-[5deg] group-hover:scale-110">
              🛠️
            </div>
            <h2 className="font-[Playfair_Display,serif] text-[2rem] font-semibold tracking-tight mb-3 text-[#1c1917]">
              {currentLang.vibeTools.title}
            </h2>
            <p className="text-[0.95rem] leading-[1.7] text-[#57534e]">
              {currentLang.vibeTools.description}
            </p>
          </div>

          <div className="p-6 grid gap-4">
            {/* PPT Crafter - Available */}
            <Link
              href="/ppt-crafter"
              className="bg-[#fafaf9] border border-[#e7e5e4] rounded-sm p-7 transition-all duration-300 cursor-pointer relative overflow-hidden group/tool hover:bg-white hover:border-[#d97706] hover:translate-x-1 block no-underline"
            >
              <span className="absolute top-7 right-7 text-xl text-[#d97706] opacity-0 -translate-x-2.5 transition-all duration-300 group-hover/tool:opacity-100 group-hover/tool:translate-x-0">
                →
              </span>
              <h3 className="font-[Playfair_Display,serif] text-[1.35rem] font-semibold tracking-tight mb-2 text-[#1c1917]">
                PPT Crafter
              </h3>
              <p className="text-sm leading-[1.6] text-[#57534e] max-w-[85%]">
                {currentLang.vibeTools.pptCrafter.desc}
              </p>
              <span className="inline-block mt-3 font-mono text-[0.7rem] font-medium tracking-[0.05em] uppercase px-3 py-1 bg-[#d97706] text-white rounded-full">
                {currentLang.vibeTools.available}
              </span>
            </Link>

            {/* Insight Maker - Coming Soon */}
            <div className="bg-[#fafaf9] border border-[#e7e5e4] rounded-sm p-7 transition-all duration-300 cursor-not-allowed opacity-60">
              <h3 className="font-[Playfair_Display,serif] text-[1.35rem] font-semibold tracking-tight mb-2 text-[#1c1917]">
                {currentLang.vibeTools.insightMaker.name}
              </h3>
              <p className="text-sm leading-[1.6] text-[#57534e] max-w-[85%]">
                {currentLang.vibeTools.insightMaker.desc}
              </p>
              <span className="inline-block mt-3 font-mono text-[0.7rem] font-medium tracking-[0.05em] uppercase px-3 py-1 bg-[#a8a29e] text-white rounded-full">
                {currentLang.vibeTools.comingSoon}
              </span>
            </div>

            {/* Value Creator - Coming Soon */}
            <div className="bg-[#fafaf9] border border-[#e7e5e4] rounded-sm p-7 transition-all duration-300 cursor-not-allowed opacity-60">
              <h3 className="font-[Playfair_Display,serif] text-[1.35rem] font-semibold tracking-tight mb-2 text-[#1c1917]">
                {currentLang.vibeTools.valueCreator.name}
              </h3>
              <p className="text-sm leading-[1.6] text-[#57534e] max-w-[85%]">
                {currentLang.vibeTools.valueCreator.desc}
              </p>
              <span className="inline-block mt-3 font-mono text-[0.7rem] font-medium tracking-[0.05em] uppercase px-3 py-1 bg-[#a8a29e] text-white rounded-full">
                {currentLang.vibeTools.comingSoon}
              </span>
            </div>
          </div>
        </section>
        </div>
        )}

        {/* Intelligence Expanded View */}
        {selectedNav === 'intelligence' && (
        <section className="bg-white border border-[#e7e5e4] rounded-sm overflow-hidden transition-all duration-[400ms] hover:border-[#d97706] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] relative group">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#d97706] to-[#fbbf24] scale-x-0 origin-left transition-transform duration-[600ms] group-hover:scale-x-100"></div>

          <div className="p-10 pb-8 border-b border-[#e7e5e4]">
            <div className="w-12 h-12 bg-[#fafaf9] border border-[#e7e5e4] rounded-full flex items-center justify-center mb-6 text-2xl transition-all duration-300 group-hover:bg-[#d97706] group-hover:border-[#d97706] group-hover:rotate-[5deg] group-hover:scale-110">
              📡
            </div>
            <h2 className="font-[Playfair_Display,serif] text-[2rem] font-semibold tracking-tight mb-3 text-[#1c1917]">
              {currentLang.aiIntelligence.title}
            </h2>
            <p className="text-[0.95rem] leading-[1.7] text-[#57534e]">
              {currentLang.aiIntelligence.description}
            </p>
          </div>

          <div className="p-6">
            {[
              { source: 'OpenAI', time: language === 'zh' ? '2小时前' : '2 hours ago', title: 'GPT-5 Capabilities Expand with New Multimodal Features', excerpt: 'OpenAI announces significant improvements in reasoning and context understanding...', url: 'https://openai.com/blog' },
              { source: 'Anthropic', time: language === 'zh' ? '5小时前' : '5 hours ago', title: 'Claude 3.5 Sonnet Sets New Benchmarks in Code Generation', excerpt: 'Latest model achieves 96% accuracy on SWE-bench, surpassing previous records...', url: 'https://www.anthropic.com/news' },
              { source: 'DeepSeek', time: language === 'zh' ? '1天前' : '1 day ago', title: 'Open-Source LLM Achieves Competitive Performance at Lower Cost', excerpt: 'DeepSeek\'s latest release demonstrates enterprise-grade capabilities...', url: 'https://www.deepseek.com' },
              { source: 'Meta', time: language === 'zh' ? '2天前' : '2 days ago', title: 'Llama 4 Architecture Reveals Novel Training Approaches', excerpt: 'Meta\'s research team publishes findings on scaling laws and efficiency...', url: 'https://ai.meta.com/blog' }
            ].map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-5 border-b last:border-b-0 border-[#e7e5e4] transition-all duration-200 cursor-pointer hover:bg-[#f5f5f4] hover:translate-x-1 no-underline group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-[0.7rem] font-medium tracking-[0.05em] uppercase text-[#d97706]">
                    {item.source}
                  </span>
                  <span className="text-xs text-[#a8a29e]">{item.time}</span>
                  <span className="ml-auto text-[#d97706] text-sm opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </div>
                <h3 className="text-[0.95rem] font-medium leading-[1.5] text-[#1c1917] mb-1">
                  {item.title}
                </h3>
                <p className="text-[0.85rem] leading-[1.6] text-[#57534e]">
                  {item.excerpt}
                </p>
              </a>
            ))}
          </div>

          <div className="text-center p-6">
            <button
              onClick={() => setSelectedNav('intelligence')}
              className="text-sm font-medium tracking-wide uppercase px-8 py-3.5 bg-[#1c1917] text-[#fafaf9] rounded-sm cursor-pointer transition-all duration-300 relative overflow-hidden group/btn hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
            >
              <span className="absolute top-1/2 left-1/2 w-0 h-0 rounded-full bg-[#d97706] transform -translate-x-1/2 -translate-y-1/2 transition-all duration-[600ms] group-hover/btn:w-[300px] group-hover/btn:h-[300px]"></span>
              <span className="relative z-10">{currentLang.aiIntelligence.viewAll}</span>
            </button>
          </div>
        </section>
        )}

        {/* Tools Expanded View */}
        {selectedNav === 'tools' && (
        <section className="bg-white border border-[#e7e5e4] rounded-sm overflow-hidden transition-all duration-[400ms] hover:border-[#d97706] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] relative group">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#d97706] to-[#fbbf24] scale-x-0 origin-left transition-transform duration-[600ms] group-hover:scale-x-100"></div>

          <div className="p-10 pb-8 border-b border-[#e7e5e4]">
            <div className="w-12 h-12 bg-[#fafaf9] border border-[#e7e5e4] rounded-full flex items-center justify-center mb-6 text-2xl transition-all duration-300 group-hover:bg-[#d97706] group-hover:border-[#d97706] group-hover:rotate-[5deg] group-hover:scale-110">
              🛠️
            </div>
            <h2 className="font-[Playfair_Display,serif] text-[2rem] font-semibold tracking-tight mb-3 text-[#1c1917]">
              {currentLang.vibeTools.title}
            </h2>
            <p className="text-[0.95rem] leading-[1.7] text-[#57534e]">
              {currentLang.vibeTools.description}
            </p>
          </div>

          <div className="p-6 grid gap-4">
            {/* PPT Crafter - Available */}
            <Link
              href="/ppt-crafter"
              className="bg-[#fafaf9] border border-[#e7e5e4] rounded-sm p-7 transition-all duration-300 cursor-pointer relative overflow-hidden group/tool hover:bg-white hover:border-[#d97706] hover:translate-x-1 block no-underline"
            >
              <span className="absolute top-7 right-7 text-xl text-[#d97706] opacity-0 -translate-x-2.5 transition-all duration-300 group-hover/tool:opacity-100 group-hover/tool:translate-x-0">
                →
              </span>
              <h3 className="font-[Playfair_Display,serif] text-[1.35rem] font-semibold tracking-tight mb-2 text-[#1c1917]">
                PPT Crafter
              </h3>
              <p className="text-sm leading-[1.6] text-[#57534e] max-w-[85%]">
                {currentLang.vibeTools.pptCrafter.desc}
              </p>
              <span className="inline-block mt-3 font-mono text-[0.7rem] font-medium tracking-[0.05em] uppercase px-3 py-1 bg-[#d97706] text-white rounded-full">
                {currentLang.vibeTools.available}
              </span>
            </Link>

            {/* Insight Maker - Coming Soon */}
            <div className="bg-[#fafaf9] border border-[#e7e5e4] rounded-sm p-7 transition-all duration-300 cursor-not-allowed opacity-60">
              <h3 className="font-[Playfair_Display,serif] text-[1.35rem] font-semibold tracking-tight mb-2 text-[#1c1917]">
                {currentLang.vibeTools.insightMaker.name}
              </h3>
              <p className="text-sm leading-[1.6] text-[#57534e] max-w-[85%]">
                {currentLang.vibeTools.insightMaker.desc}
              </p>
              <span className="inline-block mt-3 font-mono text-[0.7rem] font-medium tracking-[0.05em] uppercase px-3 py-1 bg-[#a8a29e] text-white rounded-full">
                {currentLang.vibeTools.comingSoon}
              </span>
            </div>

            {/* Value Creator - Coming Soon */}
            <div className="bg-[#fafaf9] border border-[#e7e5e4] rounded-sm p-7 transition-all duration-300 cursor-not-allowed opacity-60">
              <h3 className="font-[Playfair_Display,serif] text-[1.35rem] font-semibold tracking-tight mb-2 text-[#1c1917]">
                {currentLang.vibeTools.valueCreator.name}
              </h3>
              <p className="text-sm leading-[1.6] text-[#57534e] max-w-[85%]">
                {currentLang.vibeTools.valueCreator.desc}
              </p>
              <span className="inline-block mt-3 font-mono text-[0.7rem] font-medium tracking-[0.05em] uppercase px-3 py-1 bg-[#a8a29e] text-white rounded-full">
                {currentLang.vibeTools.comingSoon}
              </span>
            </div>
          </div>
        </section>
        )}

        {/* About Section */}
        {selectedNav === 'about' && (
        <section className="bg-white border border-[#e7e5e4] rounded-sm overflow-hidden transition-all duration-[400ms] hover:border-[#d97706] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] relative group">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#d97706] to-[#fbbf24] scale-x-0 origin-left transition-transform duration-[600ms] group-hover:scale-x-100"></div>

          <div className="p-10 pb-8 border-b border-[#e7e5e4]">
            <div className="w-12 h-12 bg-[#fafaf9] border border-[#e7e5e4] rounded-full flex items-center justify-center mb-6 text-2xl transition-all duration-300 group-hover:bg-[#d97706] group-hover:border-[#d97706] group-hover:rotate-[5deg] group-hover:scale-110">
              ✨
            </div>
            <h2 className="font-[Playfair_Display,serif] text-[2rem] font-semibold tracking-tight mb-3 text-[#1c1917]">
              {currentLang.about.title}
            </h2>
          </div>

          <div className="p-10 space-y-8">
            <div>
              <h3 className="font-[Playfair_Display,serif] text-xl font-semibold mb-3 text-[#1c1917]">
                {language === 'zh' ? '使命' : 'Mission'}
              </h3>
              <p className="text-[0.95rem] leading-[1.8] text-[#57534e]">
                {currentLang.about.mission}
              </p>
            </div>

            <div>
              <h3 className="font-[Playfair_Display,serif] text-xl font-semibold mb-3 text-[#1c1917]">
                {language === 'zh' ? '愿景' : 'Vision'}
              </h3>
              <p className="text-[0.95rem] leading-[1.8] text-[#57534e]">
                {currentLang.about.vision}
              </p>
            </div>

            <div className="bg-[#fafaf9] border border-[#e7e5e4] rounded-sm p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🔓</div>
                <div>
                  <h4 className="font-bold text-[#1c1917] mb-2">
                    {currentLang.about.opensource}
                  </h4>
                  <p className="text-sm leading-[1.7] text-[#57534e]">
                    {currentLang.about.opensourceDesc}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center pt-4">
              <a
                href="https://github.com/yourusername/maygent-studio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm font-medium tracking-wide uppercase px-8 py-3.5 bg-[#1c1917] text-[#fafaf9] rounded-sm cursor-pointer transition-all duration-300 relative overflow-hidden group/btn hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)] no-underline"
              >
                <span className="absolute top-1/2 left-1/2 w-0 h-0 rounded-full bg-[#d97706] transform -translate-x-1/2 -translate-y-1/2 transition-all duration-[600ms] group-hover/btn:w-[300px] group-hover/btn:h-[300px]"></span>
                <span className="relative z-10">{language === 'zh' ? '查看 GitHub' : 'View on GitHub'}</span>
              </a>
            </div>
          </div>
        </section>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[#e7e5e4] py-12 text-center">
        <div className="max-w-[1400px] mx-auto">
          <p className="font-mono text-xs tracking-[0.05em] text-[#a8a29e]">
            Maygent Studio {currentLang.footer}
          </p>
        </div>
      </footer>

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
      `}</style>
    </div>
  );
}
