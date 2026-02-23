import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * 生成占位符 SVG 图片 (Data URL 格式)
 * 当图片生成失败时使用
 */
function generatePlaceholderImage(style: string = 'apple'): string {
  const styleColors: Record<string, { bg: string; text: string }> = {
    apple: { bg: '#f5f5f7', text: '#1d1d1f' },
    internet: { bg: '#f4f5f7', text: '#0052cc' },
    magazine: { bg: '#f1faee', text: '#e63946' },
    datavis: { bg: '#f8fafc', text: '#051C2C' },
    oilpainting: { bg: '#fef3c7', text: '#78350f' },
    custom: { bg: '#f1f5f9', text: '#334155' }
  };

  const colors = styleColors[style] || styleColors.apple;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
    <rect width="1024" height="1024" fill="${colors.bg}"/>
    <g transform="translate(512, 512)">
      <circle cx="0" cy="-60" r="80" fill="${colors.text}" opacity="0.1"/>
      <path d="M -40 -20 L 0 -60 L 40 -20 L 20 -20 L 20 40 L -20 40 L -20 -20 Z" fill="${colors.text}" opacity="0.15"/>
      <text x="0" y="100" font-family="Arial, sans-serif" font-size="32" fill="${colors.text}" opacity="0.3" text-anchor="middle">Image Placeholder</text>
      <text x="0" y="140" font-family="Arial, sans-serif" font-size="20" fill="${colors.text}" opacity="0.2" text-anchor="middle">Generation unavailable</text>
    </g>
  </svg>`;

  // 转换为 Data URL
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body first to get config
    const { prompt, config } = await request.json();

    const apiKey = process.env.TOGETHER_API_KEY;

    if (!apiKey) {
      console.warn('[Together.ai] API key not configured, using placeholder image');
      return NextResponse.json({
        imageUrl: generatePlaceholderImage(config?.style),
        isPlaceholder: true,
        message: 'Image generation unavailable (API key not configured)'
      });
    }

    // Flux Schnell 优化的风格提示词
    // Flux 模型对自然语言理解更好，使用更简洁、更具描述性的提示词
    const styleModifiers: Record<string, string> = {
      apple: "minimalist product photography, clean white background, soft studio lighting, professional, modern aesthetic",
      internet: "flat design illustration, isometric view, corporate blue theme, tech startup style, clean geometric shapes",
      magazine: "editorial photography, high fashion, dramatic lighting, bold artistic composition, vogue style",
      datavis: "abstract data visualization, 3D rendered infographic, navy blue corporate theme, clean modern design",
      oilpainting: "impressionist oil painting, visible brushstrokes, warm natural lighting, monet style, artistic",
      custom: ""
    };

    const stylePrefix = styleModifiers[config?.style] || "";
    const fullPrompt = stylePrefix
      ? `${stylePrefix}, ${prompt}`
      : prompt;

    console.log('[Together.ai] Generating image with Flux Schnell');
    console.log('[Together.ai] Prompt:', fullPrompt.substring(0, 100) + '...');

    // 调用 Together.ai Images API
    const response = await fetch('https://api.together.xyz/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'black-forest-labs/FLUX.1-schnell',
        prompt: fullPrompt,
        width: 1024,
        height: 1024,
        steps: 4, // Schnell 模型推荐 4 steps（快速高质量）
        n: 1
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Together.ai] API Error:', response.status, errorText);

      // 特定错误处理
      if (response.status === 429) {
        console.warn('[Together.ai] Rate limit exceeded');
        return NextResponse.json({
          imageUrl: generatePlaceholderImage(config?.style),
          isPlaceholder: true,
          message: 'Rate limit exceeded, please try again later'
        });
      }

      if (response.status === 401) {
        console.error('[Together.ai] Invalid API key');
        return NextResponse.json({
          imageUrl: generatePlaceholderImage(config?.style),
          isPlaceholder: true,
          message: 'Invalid API key'
        });
      }

      if (response.status === 402) {
        console.error('[Together.ai] Insufficient credits');
        return NextResponse.json({
          imageUrl: generatePlaceholderImage(config?.style),
          isPlaceholder: true,
          message: 'Insufficient credits, please add funds to your Together.ai account'
        });
      }

      // 其他错误也降级为占位符
      console.warn('[Together.ai] Generation failed, using placeholder');
      return NextResponse.json({
        imageUrl: generatePlaceholderImage(config?.style),
        isPlaceholder: true,
        message: `Image generation failed: ${response.status}`
      });
    }

    const data = await response.json();

    // Together.ai 返回格式: { data: [{ url: "...", b64_json: "..." }] }
    if (data.data && data.data.length > 0) {
      const imageData = data.data[0];

      // 优先使用 b64_json（如果有），否则使用 url
      if (imageData.b64_json) {
        console.log('[Together.ai] ✓ Image generated successfully (base64)');
        return NextResponse.json({
          imageUrl: `data:image/png;base64,${imageData.b64_json}`
        });
      } else if (imageData.url) {
        // 将远程 URL 转换为 base64（用于 PPT 导出）
        try {
          console.log('[Together.ai] Fetching and converting image to base64...');
          const imageResponse = await fetch(imageData.url);

          if (!imageResponse.ok) {
            throw new Error(`Failed to fetch image: ${imageResponse.status}`);
          }

          const arrayBuffer = await imageResponse.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString('base64');
          const contentType = imageResponse.headers.get('content-type') || 'image/png';
          const base64DataUrl = `data:${contentType};base64,${base64}`;

          console.log('[Together.ai] ✓ Image generated successfully (converted to base64)');
          return NextResponse.json({ imageUrl: base64DataUrl });
        } catch (fetchError: any) {
          console.warn('[Together.ai] Failed to convert image to base64:', fetchError.message);
          return NextResponse.json({
            imageUrl: generatePlaceholderImage(config?.style),
            isPlaceholder: true,
            message: 'Failed to process generated image'
          });
        }
      }
    }

    // 数据格式异常
    console.warn('[Together.ai] Invalid response format:', JSON.stringify(data));
    return NextResponse.json({
      imageUrl: generatePlaceholderImage(config?.style),
      isPlaceholder: true,
      message: 'Invalid response from image API'
    });

  } catch (error: any) {
    console.error('[Together.ai] Generate Image API Error:', error);

    // 即使发生错误也返回占位符，不阻塞整个流程
    return NextResponse.json({
      imageUrl: generatePlaceholderImage('apple'),
      isPlaceholder: true,
      message: error.message || 'Failed to generate image'
    });
  }
}
