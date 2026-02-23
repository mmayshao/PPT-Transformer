# Maygent Studio - Product Documentation

## Vision

Intelligence tools for modern PE/VC analysts. Combining curated AI insights with purpose-built automation to help investment professionals work smarter.

**Mission**: Transform how analysts discover AI trends and create professional deliverables—faster, smarter, and with better quality.

## Target Users

- **PE/VC Analysts**: Due diligence presentations, investment memos, portfolio tracking
- **Investment Professionals**: Market research, competitive analysis, board materials
- **Tech Researchers**: Technology landscape mapping, trend analysis
- **Strategy Consultants**: Client presentations, industry reports, strategic recommendations

## Platform Overview

Maygent Studio is an open-source intelligence platform with two core modules:

1. **AI News Aggregation** - Stay ahead of AI industry developments
2. **PPT Crafter** - Transform documents into stunning presentations with AI

---

## Module 1: AI News Aggregation

### Purpose
Stay informed on AI industry developments with curated daily updates from major companies and research labs.

### Features
- ✅ Daily updates from 10+ major AI companies
- ✅ 7-day rolling window (last week of news)
- ⏳ Category filtering (Model Release, Research, Product, Funding) - Coming Soon
- ⏳ Source filtering by company - Coming Soon
- ✅ One-click access to original articles

### Data Sources
**Currently tracking:**
- OpenAI (GPT updates, API releases)
- Anthropic (Claude models, research)
- Meta (Llama, AI Research)
- DeepSeek (Open-source models)
- Grok (xAI developments)
- Zhipu (GLM models)
- MiniMax (Multimodal AI)
- Kimi (Moonshot AI, long-context)
- Doubao (ByteDance AI)
- Qwen (Alibaba)
- Yuanbao (Tencent)

### Update Strategy
- **MVP**: Manual curation 3x daily
- **Q3 2024**: Automated RSS/API integration
- **Q4 2024**: Real-time updates, email digests

### User Value
- **Time Savings**: 15 minutes daily vs. 1+ hour manually checking sources
- **Quality**: Human-curated for relevance to PE/VC professionals
- **Context**: Focused on developments that impact investment decisions

---

## Module 2: PPT Crafter

### Purpose
Transform documents into stunning presentations in 90 seconds, powered by Google Gemini and Together.ai Flux.

### Core Features

✅ **Implemented:**
- 📄 Multi-format support: PDF, Word (.docx), TXT, Markdown, direct text input
- 🎨 7 layout templates with distinct visual styles
- 🖼️ AI image generation via Together.ai Flux Schnell
- 📊 Smart content analysis with Google Gemini
- 🌐 4 language modes: Bilingual, English-only, Chinese-only, Auto-detect
- 🔄 Outline preview with edit capability before full generation
- 📈 Enhanced progress feedback with phase-based indicators
- ♻️ Regeneration options: Full, per-slide, images-only
- 📤 Export to PowerPoint (.pptx) and PDF

⏳ **Planned:**
- Template marketplace (Q3 2024)
- Presentation history (Q3 2024)
- Collaborative editing (Q4 2024)
- Brand kit integration (Q4 2024)

### Layout Templates

| Template | Layout Ratio | Best For | Example Use Case |
|----------|--------------|----------|------------------|
| **Golden Ratio** | 61.8:38.2 | Professional presentations | Investor pitch decks |
| **Equal Split** | 50:50 | Comparison slides | Before/After, Pros/Cons |
| **Top-Bottom** | Horizontal | Horizontal emphasis | Dashboard screenshots |
| **Image Background** | Full-screen | Dramatic openings | Cover slides, key messages |
| **Right-Left** | 38.2:61.8 (reversed) | Reverse narrative | Design-focused content |
| **Text Only** | 100:0 | Data-focused | Financial tables, metrics |
| **Image Focus** | 80:20 | Visual storytelling | Product showcases |

### Visual Styles

| Style | Description | Color Palette | AI Image Prompt Modifier |
|-------|-------------|---------------|--------------------------|
| **Apple** | Minimalist, clean white background | Black, White, Soft Gray | "Clean studio photography, minimal white background, soft lighting" |
| **Internet** | Flat vector, isometric tech | Blue (#0052cc), Corporate | "Flat vector illustration, isometric view, corporate blue theme" |
| **Magazine** | Editorial photography | Bold Red (#e63946), Navy | "High fashion editorial photography, dramatic lighting, bold composition" |
| **Data Visualization** | Abstract 3D graphs | Deep Navy (#051C2C), Blue | "Abstract financial data visualization, 3D network nodes, navy theme" |
| **Oil Painting** | Impressionist art | Warm Amber (#78350f), Gold | "Classic impressionist oil painting, visible brushstrokes, Monet style" |
| **Custom** | User-defined | User-defined | User's custom prompt |

### Configuration Matrix

| Dimension | Options | Default | Notes |
|-----------|---------|---------|-------|
| **Layout** | 7 templates | Golden Ratio | Affects content density |
| **Visual Style** | 6 styles | Apple | Determines image aesthetic |
| **Language** | 4 modes | Bilingual | Auto-detects input language |
| **Font** | 7 fonts | Microsoft YaHei | PPT-compatible fonts only |
| **Aspect Ratio** | 16:9, 4:3 | 16:9 | Modern screens vs. print |
| **Page Count** | 3-20 | 6 | Affects processing time |
| **Key Points** | 0-6 per slide | 4 | Data highlights in footer |

### Workflow

```
┌─────────────────────────────────────────────────────┐
│ 1. Upload Document                                  │
│    • PDF, Word, TXT, Markdown, or direct input     │
│    • Max 10MB recommended                           │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 2. Configure Style                                  │
│    • Visual style (Apple, Internet, etc.)           │
│    • Layout template (Golden Ratio, Equal, etc.)    │
│    • Language mode, font, aspect ratio              │
│    • Page count (3-20)                              │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 3. Review Outline (~15 seconds)                     │
│    • AI generates slide titles                      │
│    • User edits: add, remove, reorder slides        │
│    • Confirm outline                                │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 4. Generate Content (~30 seconds)                   │
│    • Gemini synthesizes detailed content            │
│    • Creates bilingual titles & descriptions        │
│    • Generates image prompts                        │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 5. Generate Images (~15-20s per image)              │
│    • Flux Schnell creates images                    │
│    • Style-specific prompts applied                 │
│    • Converts to base64 for export                  │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 6. Refine & Regenerate (optional)                   │
│    • Regenerate all: Start from outline             │
│    • Regenerate images: Keep text, new images       │
│    • Per-slide: Edit individual slides              │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 7. Export                                           │
│    • PowerPoint (.pptx): Editable format            │
│    • PDF: Print-ready, shareable                    │
└─────────────────────────────────────────────────────┘
```

### Technical Performance

| Metric | Target | Current | Notes |
|--------|--------|---------|-------|
| Time to Outline | < 15s | ~12s | Gemini 2.0 Flash Exp |
| Time to Content | < 60s | ~30s | Gemini 3 Flash |
| Time per Image | < 25s | ~18s | Flux Schnell |
| Total (8 slides) | < 180s | ~160s | End-to-end |
| API Success Rate | > 95% | ~98% | With retry logic |
| Cost per Presentation | < $0.20 | ~$0.15 | 8 slides |

---

## Module 3: Future Tools (Roadmap)

### Company Intelligence Analyzer (Q3 2024)
**Purpose**: Deep-dive analysis on target companies for due diligence.

**Planned Features:**
- Financial metrics extraction from public filings
- Competitive positioning analysis
- Growth signal detection (hiring, partnerships, funding)
- Executive team profiles and background checks
- News sentiment tracking over time

**Target Output**: Structured due diligence report in 5 minutes

---

### Market Mapper (Q3 2024)
**Purpose**: Visualize industry landscapes and identify investment opportunities.

**Planned Features:**
- Industry landscape visualization (D3.js interactive charts)
- White space identification
- Trend tracking (YoY growth, adoption curves)
- Competitive dynamics mapping
- TAM/SAM/SOM analysis

**Target Output**: Interactive market map + analysis report

---

### Deal Memo Generator (Q4 2024)
**Purpose**: Synthesize due diligence into investment committee memos.

**Planned Features:**
- Due diligence synthesis from multiple sources
- Investment thesis generation
- Risk highlight extraction
- Scenario modeling (base, upside, downside)
- Standardized IC memo format (customizable template)

**Target Output**: Investment memo in 15 minutes

---

### Portfolio Tracker (Q4 2024)
**Purpose**: Monitor portfolio companies with automated insights.

**Planned Features:**
- KPI dashboard (revenue, burn rate, CAC, LTV, etc.)
- Anomaly detection (unusual patterns, red flags)
- Automated quarterly reporting
- Board deck generation
- Benchmark comparison (vs. industry peers)

**Target Output**: Monthly portfolio summary + alerts

---

## Technical Architecture

### Stack

**Frontend:**
- Next.js 15 with App Router (React 19, Server Components)
- TypeScript 5.8.2
- Tailwind CSS 3.4.17
- Playfair Display + Inter fonts

**Backend (Serverless):**
- Next.js API Routes (Node.js 18)
- Google Gemini API (2.0 Flash Exp, 3 Flash, 2.5 Flash)
- Together.ai Flux Schnell API

**Document Processing:**
- pdfjs-dist 5.4.624 (PDF parsing)
- mammoth 1.11.0 (Word document extraction)

**PPT Generation:**
- pptxgenjs 4.0.1 (PowerPoint export)
- Browser print API (PDF export)

**Deployment:**
- Vercel (Serverless, Edge Network)
- Automatic HTTPS, CDN, caching

### Data Flow

```
┌─────────────┐
│  User Input │ (PDF/Word/Text)
└──────┬──────┘
       │
       ↓
┌─────────────────────┐
│  Client Processing  │ (Parse PDF in browser)
└──────┬──────────────┘
       │
       ↓
┌──────────────────────────────────┐
│  Next.js API Route:              │
│  /api/generate-outline           │
│  → Gemini 2.0 Flash Exp          │
└──────┬───────────────────────────┘
       │
       ↓ (Outline)
┌─────────────────────┐
│  User Confirmation  │ (Edit outline)
└──────┬──────────────┘
       │
       ↓
┌──────────────────────────────────┐
│  Next.js API Route:              │
│  /api/analyze                    │
│  → Gemini 3 Flash                │
└──────┬───────────────────────────┘
       │
       ↓ (Structured Content)
┌──────────────────────────────────┐
│  Next.js API Route:              │
│  /api/generate-image (parallel)  │
│  → Together.ai Flux Schnell      │
└──────┬───────────────────────────┘
       │
       ↓ (Images as Base64)
┌─────────────────────┐
│  Client Rendering   │ (Display slides)
└──────┬──────────────┘
       │
       ↓
┌─────────────────────┐
│  Export (pptxgenjs) │ (Download .pptx or PDF)
└─────────────────────┘
```

### Cost Structure

**Per 8-slide presentation:**

| Service | Usage | Cost | Notes |
|---------|-------|------|-------|
| **Gemini Outline** | ~10K tokens | $0.0007 | 2.0 Flash Exp |
| **Gemini Content** | ~50K tokens | $0.0125 | 3 Flash |
| **Gemini Refinement** | ~20K tokens | $0.003 | 2.5 Flash (optional) |
| **Flux Images** | 8 images | $0.12 | $0.015 each |
| **Vercel** | Edge request | $0 | Free tier |
| **Total** | | **$0.136** | ~$0.14 per presentation |

**Monthly cost estimates:**
- Personal use (20 presentations): ~$3/month
- Team use (100 presentations): ~$15/month
- Enterprise (500 presentations): ~$75/month

---

## Development Roadmap

### Q1 2024 - Foundation ✅

- [x] Core PPT generation engine
- [x] 6 visual styles (Apple, Internet, Magazine, DataVis, Oil Painting, Custom)
- [x] PDF & PPTX export
- [x] Google Gemini integration
- [x] Together.ai Flux Schnell integration

### Q2 2024 - Platform Launch (Current) 🚧

- [x] Maygent Studio landing page with editorial design
- [x] AI news aggregation module (static data MVP)
- [x] 7 layout templates
- [x] Outline preview workflow
- [x] Enhanced progress feedback with phase indicators
- [x] Regeneration options (full, per-slide, images-only)
- [x] 4 language modes (bilingual, English, Chinese, auto)
- [x] Product documentation (README, PRODUCT.md)

### Q3 2024 - Expansion 📅

- [ ] **Automated News Fetching**: RSS/API integration for real-time updates
- [ ] **Company Intelligence Analyzer** (beta): Financial metrics, competitive analysis
- [ ] **User Authentication**: NextAuth.js, save presentations
- [ ] **Presentation History**: PostgreSQL database, view past generations
- [ ] **Template Marketplace**: Community-contributed layouts and styles
- [ ] **API Rate Limiting**: Redis for production-grade rate limiting
- [ ] **Analytics Dashboard**: User metrics, popular styles, performance

### Q4 2024 - Enterprise Features 📅

- [ ] **Market Mapper** tool: Industry visualization with D3.js
- [ ] **Deal Memo Generator**: IC memo synthesis
- [ ] **Portfolio Tracker**: KPI monitoring dashboard
- [ ] **Team Collaboration**: Multi-user workspaces, shared presentations
- [ ] **SSO Integration**: SAML, OAuth for enterprise
- [ ] **Custom Branding**: White-label option, custom fonts/colors
- [ ] **API Access**: RESTful API for third-party integrations
- [ ] **Slack/Teams Integration**: Share presentations directly

---

## Success Metrics

### User Engagement (Q2 2024 Targets)

| Metric | Target | Measurement Method |
|--------|--------|--------------------|
| Daily Active Users | 100+ | Google Analytics |
| Presentations per User | 3+ | Backend logging |
| News Click-Through Rate | 15%+ | Event tracking |
| Tool Adoption Rate | 60%+ | Users who complete a presentation |

### Performance (Current Targets)

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Time to Outline | < 15s | ~12s | ✅ |
| Time to Full Presentation | < 90s | ~160s | ⚠️ (images bottleneck) |
| API Success Rate | > 99% | ~98% | ✅ |
| User Satisfaction | > 4.5/5 | TBD | 📊 Survey needed |

### Business (Q3 2024 Targets)

| Metric | Target | Notes |
|--------|--------|-------|
| User Retention (7-day) | > 40% | Return within 1 week |
| User Retention (30-day) | > 20% | Monthly active users |
| Average Cost per User | < $2/month | Including API costs |
| User-Generated Templates | > 100 | By Q3 end |
| GitHub Stars | > 500 | Community growth |
| Product Hunt Rank | Top 5 | Launch day |

---

## Competitive Analysis

### vs. Gamma / Tome / Beautiful.ai

**Strengths:**
- ✅ **Open Source**: Full code transparency, self-hostable
- ✅ **Cost Control**: User's own API keys, predictable pricing
- ✅ **Privacy**: No data sent to third-party SaaS, runs on your infrastructure
- ✅ **Customization**: Modify code for specific needs, add custom features
- ✅ **PE/VC Focus**: Industry-specific tools (News, Company Intel, Deal Memos)
- ✅ **No Vendor Lock-In**: Export to standard formats, no proprietary format

**Weaknesses:**
- ❌ **Setup Required**: Need to configure API keys, deploy yourself
- ❌ **No Hosting**: Must self-host or deploy to Vercel
- ❌ **Limited Templates**: 7 layouts vs. dozens in commercial tools

**Target Users**: Tech-savvy analysts, developers, privacy-conscious teams

---

### vs. Canva / PowerPoint

**Strengths:**
- ✅ **AI-Powered**: Automatic content synthesis in seconds vs. hours of manual work
- ✅ **Speed**: 90 seconds vs. 1-2 hours per presentation
- ✅ **Consistency**: Standardized layouts, professional quality guaranteed
- ✅ **Intelligence**: Built-in AI news aggregation, research tools
- ✅ **Batch Generation**: Multiple presentations from template

**Weaknesses:**
- ❌ **Design Flexibility**: Limited to 7 layouts vs. infinite in Canva/PPT
- ❌ **Manual Editing**: Can't edit individual elements after export (yet)
- ❌ **Animation**: No slide animations (yet)

**Target Users**: Analysts who value speed over pixel-perfect design

---

## Go-to-Market Strategy

### Phase 1: Community Building (Q2 2024 - Current)

**Channels:**
- GitHub (open-source repository)
- Product Hunt launch
- Hacker News post
- Reddit (r/productivity, r/investing)
- Twitter/X threads

**Target Audience:**
- Tech-savvy analysts
- Open-source enthusiasts
- Indie developers
- Small consulting firms

**Messaging:**
- "Open-source alternative to Gamma"
- "PPT generation in 90 seconds"
- "Built by analysts, for analysts"

**Goal**: 500 GitHub stars, 100 DAU

---

### Phase 2: PE/VC Outreach (Q3 2024)

**Channels:**
- Direct email outreach to 100 PE/VC firms
- LinkedIn posts targeting investment professionals
- Demos at industry conferences (SuperVenture, VC Summit)
- Case studies with early adopters

**Target Audience:**
- PE/VC analysts
- Investment associates
- VC partners
- Corporate development teams

**Messaging:**
- "Save 10 hours per week on pitch decks"
- "AI-powered due diligence tools"
- "Trusted by [X] firms for [Y] presentations"

**Goal**: 10 paying enterprise customers

---

### Phase 3: Enterprise Sales (Q4 2024)

**Offerings:**
- Hosted version with SLA
- White-label option (custom branding)
- Custom integrations (Salesforce, HubSpot, internal tools)
- Training & onboarding
- Dedicated support

**Target Audience:**
- Enterprise PE/VC firms (AUM > $500M)
- Management consulting firms (MBB, boutiques)
- Corporate strategy teams

**Pricing:**
- See "Pricing Model" section below

**Goal**: $10K MRR, 20 enterprise customers

---

## Pricing Model (Planned for Q3 2024)

### Free Tier (Self-Hosted)

**Price**: $0/month

**Features:**
- ✅ Self-hosted deployment
- ✅ Bring your own API keys (Gemini, Together.ai)
- ✅ Unlimited presentations
- ✅ All layout templates
- ✅ Community support (GitHub Issues)
- ❌ No hosted version
- ❌ No presentation history
- ❌ No team features

**Target**: Individual users, developers, students

---

### Pro Tier (Hosted)

**Price**: $29/month per user

**Features:**
- ✅ Hosted version (no setup required)
- ✅ Included API credits ($10/month, ~65 presentations)
- ✅ Presentation history (save & search)
- ✅ Priority support (24-hour response)
- ✅ Advanced templates (exclusive to Pro)
- ✅ Export analytics
- ❌ No team collaboration
- ❌ No SSO

**Target**: Professional analysts, consultants, researchers

---

### Enterprise (Custom Pricing)

**Price**: Starting at $499/month (5 users minimum)

**Features:**
- ✅ Dedicated instance (private deployment)
- ✅ Unlimited API usage
- ✅ SSO / SAML integration
- ✅ Custom integrations (Salesforce, HubSpot, etc.)
- ✅ SLA guarantee (99.9% uptime)
- ✅ Training & onboarding
- ✅ Dedicated success manager
- ✅ Custom branding (white-label)
- ✅ Team collaboration features
- ✅ Advanced analytics dashboard

**Add-ons:**
- Company Intelligence Analyzer: +$199/month
- Market Mapper: +$199/month
- Deal Memo Generator: +$299/month
- Portfolio Tracker: +$399/month

**Target**: PE/VC firms, consulting firms, corporate strategy teams

---

## Contributing

We welcome contributions! See `CONTRIBUTING.md` for guidelines.

### Priority Areas

1. **New Layout Templates**: Create new visual layouts
2. **News Source Integrations**: Add RSS feeds for more AI companies
3. **Documentation Improvements**: Tutorials, examples, API docs
4. **Bug Fixes**: Report and fix issues
5. **Performance Optimizations**: Speed up generation, reduce costs

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-layout`)
3. Commit your changes (`git commit -m 'Add amazing layout'`)
4. Push to the branch (`git push origin feature/amazing-layout`)
5. Open a Pull Request

**Before major work, please open an issue to discuss.**

---

## License

MIT License - See [LICENSE](LICENSE) file for details.

**TL;DR**: You can use, modify, and distribute this software commercially, as long as you include the original license.

---

## Contact

- **GitHub Issues**: [Report bugs and request features](https://github.com/yourusername/maygent-studio/issues)
- **GitHub Discussions**: [Ask questions and share ideas](https://github.com/yourusername/maygent-studio/discussions)
- **Email**: maygent-studio@example.com (update with real address)
- **Twitter/X**: @MaygentStudio (update with real handle)

---

**Last Updated**: 2024-02-23
**Version**: 2.0.0 (Maygent Studio Launch)
**Built with Claude & Flux** | © 2024 Maygent Studio
