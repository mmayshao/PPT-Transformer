# LightDraft - AI Strategic Partner

Transform documents into beautiful presentations with AI-powered content analysis and image generation.

## Features

- 📄 **Multi-format Support**: Upload PDF, Word (.docx), TXT, or Markdown files
- 🎨 **Multiple Visual Styles**: Apple minimal, Internet tech, Magazine editorial, Data visualization, Oil painting
- 🖼️ **AI Image Generation**: Automatic image generation using Gemini 2.5 Flash Image
- 📊 **Smart Content Analysis**: Extract key points and insights from your documents
- 🔧 **Customizable**: Adjust page count, aspect ratio (16:9 or 4:3), and fonts
- 📤 **Export Options**: Export to PowerPoint (.pptx) or PDF
- 🔒 **Secure**: API keys stored safely on the server, never exposed to the client

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **AI**: Google Gemini API (Gemini 2.5 Flash + Imagen 3.0)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Runtime**: Node.js

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd PPT-Transformer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.local.example .env.local
   ```

   Then edit `.env.local` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Security Features

This application implements a secure architecture:

- ✅ API keys are stored in server-side environment variables (`.env.local`)
- ✅ All Gemini API calls are made from Next.js API routes (server-side)
- ✅ Client-side code never has access to API keys
- ✅ `.env.local` is excluded from git via `.gitignore`

## Project Structure

```
PPT-Transformer/
├── app/
│   ├── api/                    # Server-side API routes
│   │   ├── analyze/           # Content analysis endpoint
│   │   ├── generate-image/    # Image generation endpoint
│   │   └── refine-slide/      # Slide refinement endpoint
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   └── globals.css            # Global styles
├── components/                 # React components
│   ├── App.tsx                # Main application component
│   ├── Layout.tsx             # Layout wrapper
│   ├── Uploader.tsx           # File upload component
│   └── SlideView.tsx          # Slide display and editing
├── services/
│   └── clientService.ts       # Client-side API wrapper
├── types.ts                   # TypeScript type definitions
├── .env.local.example         # Example environment file
└── next.config.ts             # Next.js configuration
```

## How It Works

1. **Upload**: User uploads a document or inputs text
2. **Configure**: Select visual style, aspect ratio, and page count
3. **Analyze**: Server-side API calls Gemini to extract structured content
4. **Generate**: AI generates images for each slide based on content
5. **Refine**: User can select slides and refine them with custom instructions
6. **Export**: Export final presentation to PowerPoint or PDF

## API Routes

### POST `/api/analyze`
Analyzes document content and generates slide structure.

### POST `/api/generate-image`
Generates AI images based on prompts and style settings.

### POST `/api/refine-slide`
Refines existing slide content based on user instructions.

## Building for Production

```bash
npm run build
npm run start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
