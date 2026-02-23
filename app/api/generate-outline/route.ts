import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { input, config } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Prepare input content
    let content: string;
    if (input.type === 'pdf') {
      // For PDF, we already have extracted text in base64
      const buffer = Buffer.from(input.data, 'base64');
      content = buffer.toString('utf-8');
    } else {
      content = input.data;
    }

    // System instruction for outline generation
    const systemInstruction = `You are an expert presentation outline generator.

Your task: Generate ONLY an outline of slide titles for a ${config.pageCount}-page presentation.

Requirements:
1. Generate exactly ${config.pageCount} slide titles
2. Each title should be clear, concise, and descriptive
3. First slide should be an introduction/overview
4. Last slide should be a conclusion or summary
5. Middle slides should cover key topics logically
6. Return ONLY a JSON array of title strings
7. ${config.language === 'bilingual'
    ? 'Each title should include both English and Chinese, separated by a pipe (|). Format: "English Title | 中文标题"'
    : config.language === 'english-only'
    ? 'All titles should be in English only'
    : config.language === 'chinese-only'
    ? 'All titles should be in Chinese only'
    : 'Detect the input language and use that language for titles'
  }

Example output format:
["Introduction to AI | AI简介", "Machine Learning Basics | 机器学习基础", "Deep Learning Applications | 深度学习应用"]

Do NOT include:
- Descriptions
- Key points
- Image prompts
- Any other metadata

Analyze the following content and generate a presentation outline:

${content.substring(0, 50000)}`;

    const result = await model.generateContent(systemInstruction);
    const responseText = result.response.text();

    // Extract JSON from response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to parse outline from AI response');
    }

    const outline: string[] = JSON.parse(jsonMatch[0]);

    if (!outline || outline.length === 0) {
      throw new Error('Generated outline is empty');
    }

    console.log(`[Outline] Generated ${outline.length} slide titles`);

    return NextResponse.json({ outline });
  } catch (error: any) {
    console.error('[Outline API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate outline' },
      { status: 500 }
    );
  }
}
