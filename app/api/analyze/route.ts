import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const { input, config } = await request.json();

    const ai = new GoogleGenAI({ apiKey });

    type StyleKey = 'apple' | 'internet' | 'magazine' | 'datavis' | 'oilpainting' | 'custom';

    const stylePrompts: Record<StyleKey, string> = {
      apple: "Minimalist, high-end white space, San Francisco type aesthetic, product-launch style.",
      internet: "Modern tech company corporate report style, professional blue accents, clean grids.",
      magazine: "Bold typography, editorial layout, high contrast, artistic branding photography.",
      datavis: "McKinsey/Bloomberg style, highly structured, data-centric, navy and slate tones.",
      oilpainting: "Impressionist style, Monet/Van Gogh textures, warm natural lighting, painterly details.",
      custom: config.customStylePrompt || "Professional and clean."
    };

    const styleKey = (config.style as StyleKey) || 'apple';
    const selectedStyle = stylePrompts[styleKey] || stylePrompts.apple;

    // 语言模式指令
    const languageInstructions: Record<string, string> = {
      'bilingual': 'Generate both English and Chinese content for all fields (titleEn, titleZh, descriptionEn, descriptionZh). Both languages must be complete and meaningful.',
      'english-only': 'Generate ONLY English content. Fill titleEn and descriptionEn with proper content. Leave titleZh and descriptionZh as empty strings.',
      'chinese-only': 'Generate ONLY Chinese content. Fill titleZh and descriptionZh with proper content. Leave titleEn and descriptionEn as empty strings.',
      'auto': 'Detect the input language automatically. If the input is primarily English, generate English-only content. If primarily Chinese, generate Chinese-only content. If mixed, generate bilingual content.'
    };

    const languageMode = config.language || 'bilingual';
    const languageInstruction = languageInstructions[languageMode] || languageInstructions['bilingual'];

    // 关键点数量配置
    const keyPointsCount = config.keyPointsConfig?.count || 4;

    const systemInstruction = `
      You are a world-class Presentation Strategist.
      Synthesize the provided content into exactly ${config.pageCount} slides.
      Style: ${selectedStyle}

      CRITICAL RULES:
      1. Language Mode: ${languageInstruction}
      2. Extract concise metric-based "keyPoints" (${keyPointsCount} items max).
      3. Provide a vivid "imagePrompt" matching the ${styleKey} style.
      4. Ensure titles are punchy (max 6 words).
      5. Descriptions should be summaries, not walls of text (max 40 words).
    `;

    // 构建请求内容
    let contentsPayload: any[] = [];
    if (input.type === 'pdf') {
       contentsPayload = [{
          parts: [
              { inlineData: { data: input.data, mimeType: 'application/pdf' } },
              { text: `Synthesize this PDF document into exactly ${config.pageCount} slides.` }
          ]
       }];
    } else {
       // Text Mode (Word/Txt)
       contentsPayload = [{
          parts: [
              { text: `Source Content:\n${input.data}\n\nTask: Synthesize this text into exactly ${config.pageCount} slides.` }
          ]
       }];
    }

    // 模型降级策略：使用从 API 诊断中获取的正确模型名称（包含 models/ 前缀）
    // 优先使用别名（latest），自动指向最新稳定版本
    const models = [
      'models/gemini-flash-latest',     // ✅ 别名：最新 Flash（推荐）
      'models/gemini-2.5-flash',        // ✅ Gemini 2.5 Flash 稳定版
      'models/gemini-pro-latest',       // ✅ 别名：最新 Pro
      'models/gemini-2.0-flash',        // ✅ Gemini 2.0 Flash 备用
      'models/gemini-3-flash-preview'   // ✅ Gemini 3 Flash 预览版
    ];

    const requestConfig = {
      systemInstruction,
      responseMimeType: "application/json" as const,
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            titleEn: { type: Type.STRING },
            titleZh: { type: Type.STRING },
            descriptionEn: { type: Type.STRING },
            descriptionZh: { type: Type.STRING },
            imagePrompt: { type: Type.STRING },
            isDataSlide: { type: Type.BOOLEAN },
            sourceInfo: { type: Type.STRING },
            keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    };

    let lastError: any = null;

    for (const model of models) {
      try {
        console.log(`[Gemini] Trying model: ${model}`);

        const response = await ai.models.generateContent({
          model,
          contents: contentsPayload,
          config: requestConfig
        });

        const slides = JSON.parse(response.text || '[]');
        console.log(`[Gemini] Success with model: ${model}`);
        return NextResponse.json({ slides, model });

      } catch (error: any) {
        lastError = error;
        const errorMessage = error.message || '';
        const statusCode = error.status || error.statusCode || 0;

        console.error(`[Gemini] Model ${model} failed:`, statusCode, errorMessage);

        // 判断是否应该降级到下一个模型
        const isQuotaError = statusCode === 429 || statusCode === 503 ||
          errorMessage.includes('quota') ||
          errorMessage.includes('rate limit') ||
          errorMessage.includes('Resource has been exhausted');

        // 网络错误也尝试下一个模型（可能是临时问题）
        const isNetworkError = statusCode === 0 ||
          errorMessage.includes('fetch failed') ||
          errorMessage.includes('ECONNREFUSED') ||
          errorMessage.includes('ETIMEDOUT') ||
          errorMessage.includes('network');

        if (isQuotaError || isNetworkError) {
          console.log(`[Gemini] Falling back to next model... (${isQuotaError ? 'quota' : 'network'} issue)`);
          continue;
        }

        // 其他错误（如 API key 无效、请求格式错误等）直接抛出
        throw error;
      }
    }

    // 所有模型都失败了
    console.error('[Gemini] All models exhausted');
    return NextResponse.json(
      { error: lastError?.message || 'All Gemini models quota exhausted' },
      { status: 429 }
    );

  } catch (error: any) {
    console.error('Analyze API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze content' },
      { status: 500 }
    );
  }
}
