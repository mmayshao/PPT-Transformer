import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const runtime = 'nodejs';

/**
 * 诊断工具：列出当前 API Key 可用的所有 Gemini 模型
 */
export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    console.log('[List Models] Fetching available models...');

    // 列出所有可用模型
    const models = await ai.models.list();

    console.log('[List Models] Available models:', models);

    // 过滤出支持 generateContent 的 Gemini 模型
    const geminiModels = models
      .filter((model: any) =>
        model.name?.includes('gemini') &&
        model.supportedGenerationMethods?.includes('generateContent')
      )
      .map((model: any) => ({
        name: model.name,
        displayName: model.displayName,
        supportedMethods: model.supportedGenerationMethods,
        description: model.description
      }));

    return NextResponse.json({
      success: true,
      totalModels: models.length,
      geminiModels: geminiModels,
      allModels: models.map((m: any) => m.name || m.displayName)
    });

  } catch (error: any) {
    console.error('[List Models] Error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to list models',
        details: error.toString()
      },
      { status: 500 }
    );
  }
}
