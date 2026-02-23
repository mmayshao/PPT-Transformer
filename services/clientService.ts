import { SlideContent, UserConfig, AnalysisInput } from "../types";

/**
 * Client-side service that calls the backend API routes
 * This ensures the API key is never exposed to the client
 */

export const analyzeContent = async (input: AnalysisInput, config: UserConfig): Promise<SlideContent[]> => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input, config }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to analyze content');
  }

  const data = await response.json();
  return data.slides;
};

export const generateComicImage = async (prompt: string, config: UserConfig): Promise<string> => {
  const response = await fetch('/api/generate-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, config }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate image');
  }

  const data = await response.json();
  return data.imageUrl;
};

export const refineSlide = async (currentSlide: SlideContent, instruction: string, config: UserConfig): Promise<SlideContent> => {
  const response = await fetch('/api/refine-slide', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ currentSlide, instruction, config }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to refine slide');
  }

  const data = await response.json();
  return data.slide;
};

export const generateOutline = async (input: AnalysisInput, config: UserConfig): Promise<string[]> => {
  const response = await fetch('/api/generate-outline', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input, config }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate outline');
  }

  const data = await response.json();
  return data.outline;
};
