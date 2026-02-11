import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.JIMENG_API_KEY;
    const apiBase = process.env.JIMENG_API_BASE || 'http://localhost:8000';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'JIMENG_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const { prompt, config } = await request.json();

    const styleModifiers: Record<string, string> = {
      apple: "Clean studio photography, minimal white background, soft lighting, 8k resolution, product focus",
      internet: "Flat vector illustration, corporate technology style, isometric, bright blue palette, clean lines",
      magazine: "High fashion editorial photography, bold artistic composition, moody lighting, Vogue style",
      datavis: "Abstract financial data visualization, 3D network nodes, deep navy tech aesthetic, clean graphs",
      oilpainting: "Classic impressionist oil painting, visible brushstrokes, Monet style light, textured canvas, artistic",
      custom: ""
    };

    const stylePrefix = styleModifiers[config?.style] || "";
    const fullPrompt = stylePrefix ? `${stylePrefix}: ${prompt}. High quality, professional.` : prompt;

    // 调用即梦AI图像生成API (兼容OpenAI格式) - 带重试机制
    const maxRetries = 3;
    let lastError: any = null;
    let data: any = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[Attempt ${attempt}/${maxRetries}] Generating image for prompt: ${fullPrompt.substring(0, 50)}...`);

        const response = await fetch(`${apiBase}/v1/images/generations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'jimeng-3.0',
            prompt: fullPrompt,
            negativePrompt: '',
            width: 1024,
            height: 1024,
            sample_strength: 0.5
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[Attempt ${attempt}] Jimeng API Error:`, response.status, errorText);

          if (response.status === 429) {
            return NextResponse.json(
              { error: 'API rate limit exceeded. Please wait a moment and try again.' },
              { status: 429 }
            );
          }

          lastError = new Error(`Image generation failed: ${response.status}`);

          // 等待后重试
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
            continue;
          }

          return NextResponse.json(
            { error: `Image generation failed after ${maxRetries} attempts: ${response.status}` },
            { status: response.status }
          );
        }

        data = await response.json();

        // 检查返回数据是否有效
        if (data.data && data.data.length > 0 && data.data[0].url) {
          console.log(`[Attempt ${attempt}] Image generated successfully`);
          break; // 成功，退出重试循环
        } else {
          console.error(`[Attempt ${attempt}] Invalid response:`, JSON.stringify(data));
          lastError = new Error('Invalid response from image API');

          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
            continue;
          }
        }
      } catch (fetchError: any) {
        console.error(`[Attempt ${attempt}] Fetch error:`, fetchError.message);
        lastError = fetchError;

        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
          continue;
        }
      }
    }

    if (!data || !data.data || data.data.length === 0 || !data.data[0].url) {
      console.error('All retry attempts failed, returning empty image');
      return NextResponse.json({ imageUrl: '', error: lastError?.message || 'Image generation failed' });
    }

    // 即梦API返回格式: { data: [{ url: "..." }] }
    if (data.data && data.data.length > 0 && data.data[0].url) {
      const imageUrl = data.data[0].url;

      // 将图片 URL 转换为 base64 格式，以便 pptxgenjs 导出使用
      try {
        const imageResponse = await fetch(imageUrl);
        const arrayBuffer = await imageResponse.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const contentType = imageResponse.headers.get('content-type') || 'image/png';
        const base64DataUrl = `data:${contentType};base64,${base64}`;
        return NextResponse.json({ imageUrl: base64DataUrl });
      } catch (fetchError) {
        // 如果转换失败，返回原始 URL
        console.error('Failed to convert image to base64:', fetchError);
        return NextResponse.json({ imageUrl });
      }
    }

    return NextResponse.json({ imageUrl: '' });
  } catch (error: any) {
    console.error('Generate Image API Error:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}
