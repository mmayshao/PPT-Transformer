
export type VisualStyle = 'apple' | 'internet' | 'magazine' | 'datavis' | 'oilpainting' | 'custom';
export type AspectRatio = '16:9' | '4:3';
export type Typography = 'microsoft-yahei' | 'arial' | 'inter' | 'playfair' | 'mono' | 'pingfang' | 'helvetica';

export interface SlideContent {
  id: string;
  titleEn: string;
  titleZh: string;
  descriptionEn: string;
  descriptionZh: string;
  imagePrompt: string;
  imageUrl?: string;
  isDataSlide: boolean;
  keyPoints?: string[];
  sourceInfo?: string;
  selected?: boolean;
}

export interface UserConfig {
  style: VisualStyle;
  customStylePrompt?: string;
  pageCount: number;
  font: Typography;
  aspectRatio: AspectRatio;
}

export interface AnalysisInput {
  type: 'pdf' | 'text';
  data: string; // Base64 for PDF, raw string for text
}

export interface AppState {
  status: 'idle' | 'configuring' | 'analyzing' | 'generating_images' | 'ready' | 'error';
  slides: SlideContent[];
  config: UserConfig;
  error?: string;
  inputData?: AnalysisInput;
  imageProgress: { current: number; total: number };
}
