import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

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

    const { currentSlide, instruction, config } = await request.json();

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Modify slide: ${JSON.stringify(currentSlide)}. Instructions: ${instruction}. Style: ${config.style}`,
      config: { responseMimeType: "application/json" }
    });

    const refinedSlide = JSON.parse(response.text || '{}');
    return NextResponse.json({ slide: refinedSlide });
  } catch (error: any) {
    console.error('Refine Slide API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to refine slide' },
      { status: 500 }
    );
  }
}
