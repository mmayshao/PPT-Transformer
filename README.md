# Maygent Studio

**Intelligence Tools for Modern PE/VC Analysts**

Maygent Studio is an open-source platform featuring AI news aggregation and vibe coding tools. Built for investment professionals who need curated insights and powerful automation.

🔗 **Live Demo**: [https://maygent-studio.vercel.app](https://maygent-studio.vercel.app)

## Platform Modules

### 1. AI News Aggregation
Stay informed with daily AI intelligence from 10+ major companies:
- OpenAI, Anthropic, Meta, DeepSeek, Grok
- Zhipu, MiniMax, Kimi, Doubao, Qwen, Yuanbao
- 7-day rolling window
- Curated for quality and relevance

### 2. PPT Crafter
Transform documents into stunning presentations with AI.

**Core Features:**
- 📄 **Multi-format Support**: PDF, Word (.docx), TXT, Markdown, or direct text input
- 🎨 **7 Layout Templates**: Golden ratio, equal split, top-bottom, image background, reverse, text-only, image-focus
- 🖼️ **AI Image Generation**: Flux Schnell via Together.ai API
- 📊 **Smart Content Analysis**: Google Gemini for content synthesis
- 🌐 **4 Language Modes**: Bilingual, English-only, Chinese-only, Auto-detect
- 🔄 **Outline Preview**: Review and edit structure before full generation
- 📈 **Enhanced Progress Feedback**: Phase-based indicators with time estimates
- ♻️ **Regeneration Options**: Full regeneration, per-slide, or images-only
- 📤 **Export Options**: PowerPoint (.pptx) or PDF

### 3. Future Tools (Roadmap)
- **Company Intelligence Analyzer**: Financial metrics, competitive analysis
- **Market Mapper**: Industry landscape visualization
- **Deal Memo Generator**: Investment thesis synthesis
- **Portfolio Tracker**: KPI monitoring and reporting

## Tech Stack

- **Framework**: Next.js 15 with App Router + React 19
- **AI Models**:
  - Google Gemini 2.0 Flash Exp (outline generation)
  - Google Gemini 3 Flash (content analysis)
  - Google Gemini 2.5 Flash (refinement)
  - Together.ai Flux Schnell (image generation)
- **Document Processing**: pdfjs-dist, mammoth
- **PPT Generation**: pptxgenjs 4.0.1
- **Styling**: Tailwind CSS 3.4.17
- **Language**: TypeScript 5.8.2
- **Runtime**: Node.js 18+

## Getting Started

### Prerequisites

- Node.js 18+ installed
- [Gemini API key](https://aistudio.google.com/app/apikey) (required)
- [Together.ai API key](https://api.together.xyz/settings/api-keys) (optional, for image generation)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/maygent-studio
   cd maygent-studio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local`:
   ```env
   # Required
   GEMINI_API_KEY=your_gemini_api_key_here

   # Optional (for image generation)
   TOGETHER_API_KEY=your_together_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## PPT Crafter Workflow

1. **Upload Document** - PDF/Word/Text or paste directly
2. **Configure Style** - Choose from 6 visual styles and 7 layout templates
3. **Review Outline** - AI generates outline → you confirm/edit
4. **Generate Content** - Detailed slide content created (30s)
5. **Generate Images** - AI creates images for each slide (15-20s each)
6. **Refine** - Edit slides, regenerate as needed
7. **Export** - Download as PowerPoint or PDF

## Layout Templates

| Template | Description | Best For |
|----------|-------------|----------|
| **Golden Ratio** (61.8:38.2) | Content-heavy left, image right | Professional presentations |
| **Equal Split** (50:50) | Balanced content and visuals | Comparison slides |
| **Top-Bottom** | Image on top, content below | Horizontal emphasis |
| **Image Background** | Full-screen image with text overlay | Dramatic openings |
| **Right-Left** | Image left, content right | Reverse narrative flow |
| **Text Only** | Pure content, no images | Data-focused slides |
| **Image Focus** | Large image, minimal text | Visual storytelling |

## Visual Styles

| Style | Description | Use Case |
|-------|-------------|----------|
| **Apple** | Minimalist, clean white background | Product launches, tech |
| **Internet** | Flat vector, isometric, blue palette | SaaS, startups, corporate |
| **Magazine** | Editorial photography, bold composition | Creative portfolios |
| **Data Visualization** | Abstract 3D, deep navy, clean graphs | Financial reports, analytics |
| **Oil Painting** | Impressionist style, visible brushstrokes | Art, creative projects |
| **Custom** | User-defined style with custom prompt | Any specific vision |

## Project Structure

```
maygent-studio/
├── app/
│   ├── page.tsx                    # Landing page (Maygent Studio)
│   ├── ppt-crafter/
│   │   └── page.tsx                # PPT Crafter tool
│   ├── api/                        # Server-side API routes
│   │   ├── analyze/                # Content analysis
│   │   ├── generate-outline/       # Outline generation (NEW)
│   │   ├── generate-image/         # Image generation (Together.ai)
│   │   └── refine-slide/           # Slide refinement
│   └── globals.css                 # Global styles
├── components/
│   ├── App.tsx                     # Main application
│   ├── Layout.tsx                  # Layout wrapper
│   ├── Uploader.tsx                # File upload
│   ├── SlideView.tsx               # Slide display & editing
│   ├── LayoutTemplateSelector.tsx  # Layout picker (NEW)
│   ├── OutlinePreview.tsx          # Outline editing (NEW)
│   └── ProgressIndicator.tsx       # Enhanced progress (NEW)
├── data/
│   └── news.json                   # AI news feed data
├── services/
│   └── clientService.ts            # Client-side API wrapper
├── types.ts                        # TypeScript types
└── .env.local.example              # Environment template
```

## API Documentation

### POST `/api/generate-outline`
Generates a presentation outline (slide titles only).

**Input**: Document + config (pageCount)
**Output**: Array of slide titles
**Speed**: ~10-15 seconds

### POST `/api/analyze`
Generates detailed slide content from outline.

**Input**: Document + config + outline
**Output**: Full slide data with titles, descriptions, image prompts
**Speed**: ~30 seconds

### POST `/api/generate-image`
Generates AI images using Together.ai Flux Schnell.

**Input**: Image prompt + style config
**Output**: Base64 data URL
**Speed**: ~15-20 seconds per image
**Cost**: $0.015 per image (1024×1024)

### POST `/api/refine-slide`
Refines slide content based on user instructions.

**Input**: Current slide + instruction
**Output**: Refined slide
**Model**: Gemini 2.5 Flash

## Configuration Options

### Language Modes
- **Bilingual**: English + Chinese (default)
- **English Only**: English content only
- **Chinese Only**: Chinese content only
- **Auto**: Detect input language

### Fonts
- Microsoft YaHei (Chinese-optimized)
- Inter (Modern sans-serif)
- Playfair Display (Elegant serif)
- Arial (Classic)
- PingFang SC (Apple's Chinese font)
- Helvetica (Professional)
- Courier New (Monospace)

### Page Count
- Range: 3-20 pages
- Default: 6 pages
- Recommendation: 5-10 pages for most presentations

### Aspect Ratios
- **16:9**: Widescreen (recommended for screens)
- **4:3**: Traditional (better for print)

## Cost Estimate

Per 8-slide presentation:
- **Gemini API**: $0.03-0.05 (outline + content + refinement)
- **Together.ai Flux**: $0.12 (8 images × $0.015)
- **Total**: ~$0.15-0.17 per presentation

## Security Features

✅ API keys stored server-side only (`.env.local`)
✅ All AI API calls made from Next.js API routes
✅ Client never has access to API keys
✅ `.env.local` excluded from git via `.gitignore`

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `GEMINI_API_KEY` (required)
   - `TOGETHER_API_KEY` (optional)
4. Deploy

### Docker
```bash
# Build
docker build -t maygent-studio .

# Run
docker run -p 3000:3000 \
  -e GEMINI_API_KEY=your_key \
  -e TOGETHER_API_KEY=your_key \
  maygent-studio
```

See [docker-compose.yml](docker-compose.yml) for full Docker setup.

## Development Roadmap

### Q1 2024 - Foundation ✅
- [x] Core PPT generation
- [x] Multiple visual styles
- [x] PDF & PPTX export
- [x] Together.ai integration

### Q2 2024 - Platform Launch (Current) 🚧
- [x] Maygent Studio landing page
- [x] AI news aggregation module
- [x] 7 layout templates
- [x] Outline preview workflow
- [x] Enhanced progress feedback
- [x] Regeneration options
- [ ] Product documentation

### Q3 2024 - Expansion 📅
- [ ] Automated news fetching (RSS/API)
- [ ] Company Intelligence Analyzer (beta)
- [ ] User authentication
- [ ] Presentation history
- [ ] Template marketplace

### Q4 2024 - Enterprise Features 📅
- [ ] Market Mapper tool
- [ ] Deal Memo Generator
- [ ] Portfolio Tracker
- [ ] Team collaboration
- [ ] SSO integration
- [ ] Custom branding

## Contributing

Contributions are welcome! Priority areas:
- New layout templates
- News source integrations
- Documentation improvements
- Bug fixes
- Performance optimizations

Please open an issue before starting major work.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/maygent-studio/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/maygent-studio/discussions)

---

**Built with Claude & Flux** | © 2024 Maygent Studio
