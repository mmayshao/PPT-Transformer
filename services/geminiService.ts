
import { GoogleGenAI, Type } from "@google/genai";
import { SlideContent, UserConfig, AnalysisInput } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeContent = async (input: AnalysisInput, config: UserConfig): Promise<SlideContent[]> => {
  const ai = getAI();
  
  const stylePrompts = {
    apple: "Minimalist, high-end white space, San Francisco type aesthetic, product-launch style.",
    internet: "Modern tech company corporate report style, professional blue accents, clean grids.",
    magazine: "Bold typography, editorial layout, high contrast, artistic branding photography.",
    datavis: "McKinsey/Bloomberg style, highly structured, data-centric, navy and slate tones.",
    oilpainting: "Impressionist style, Monet/Van Gogh textures, warm natural lighting, painterly details.",
    custom: config.customStylePrompt || "Professional and clean."
  };

  const systemInstruction = `
    You are a world-class Presentation Strategist. 
    Synthesize the provided content into exactly ${config.pageCount} slides.
    Style: ${stylePrompts[config.style]}
    
    CRITICAL RULES:
    1. Bilingual Output (English/Chinese).
    2. Extract concise metric-based "keyPoints" (3-4 items max).
    3. Provide a vivid "imagePrompt" matching the ${config.style} style.
    4. Ensure "titleEn" is punchy (max 6 words).
    5. "descriptionEn" should be a summary, not a wall of text (max 40 words).
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

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: contentsPayload,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
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
    }
  });

  return JSON.parse(response.text || '[]');
};

export const generateComicImage = async (prompt: string, config: UserConfig): Promise<string> => {
  const ai = getAI();
  const styleModifiers = {
    apple: "Clean studio photography, minimal white background, soft lighting, 8k resolution, product focus",
    internet: "Flat vector illustration, corporate technology style, isometric, bright blue palette, clean lines",
    magazine: "High fashion editorial photography, bold artistic composition, moody lighting, Vogue style",
    datavis: "Abstract financial data visualization, 3D network nodes, deep navy tech aesthetic, clean graphs",
    oilpainting: "Classic impressionist oil painting, visible brushstrokes, Monet style light, textured canvas, artistic",
    custom: ""
  };

  const fullPrompt = `${styleModifiers[config.style]}: ${prompt}`;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: fullPrompt }] },
    config: { imageConfig: { aspectRatio: config.aspectRatio === '16:9' ? "16:9" : "4:3" } }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  return '';
};

export const refineSlide = async (currentSlide: SlideContent, instruction: string, config: UserConfig): Promise<SlideContent> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Modify slide: ${JSON.stringify(currentSlide)}. Instructions: ${instruction}. Style: ${config.style}`,
    config: { responseMimeType: "application/json" }
  });
  return JSON.parse(response.text || '{}');
};
