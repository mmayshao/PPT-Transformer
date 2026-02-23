
export type VisualStyle = 'apple' | 'internet' | 'magazine' | 'datavis' | 'oilpainting' | 'custom';
export type AspectRatio = '16:9' | '4:3';
export type Typography = 'microsoft-yahei' | 'arial' | 'inter' | 'playfair' | 'mono' | 'pingfang' | 'helvetica';

// Layout template types
export type LayoutTemplate =
  | 'left-right-golden'    // 左右分栏（61.8:38.2）- 默认黄金比例
  | 'left-right-equal'     // 左右分栏（50:50）
  | 'top-bottom'           // 上下分栏
  | 'image-background'     // 全图背景
  | 'right-left'           // 右图左文（反向布局）
  | 'text-only'            // 纯文字（无图片）
  | 'image-focus';         // 图片主导（极简文字）

// Language mode types
export type LanguageMode =
  | 'bilingual'      // 双语（英文+中文）- 默认
  | 'english-only'   // 仅英文
  | 'chinese-only'   // 仅中文
  | 'auto';          // 根据输入内容自动判断

// Key points configuration
export interface KeyPointsConfig {
  count: number;                                                    // 关键点数量 (0-6)
  position: 'left-bottom' | 'right-bottom' | 'full-bottom' | 'none'; // 位置
  style: 'boxed' | 'list';                                          // 样式：带背景框 or 列表式
}

// Visual elements configuration
export interface VisualElementsConfig {
  showTopBar: boolean;      // 显示顶部彩条
  showDecoLine: boolean;    // 显示装饰线
  showFooter: boolean;      // 显示页脚信息
}

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
  layout: LayoutTemplate;
  language: LanguageMode;
  keyPointsConfig: KeyPointsConfig;
  visualElements: VisualElementsConfig;
}

export interface AnalysisInput {
  type: 'pdf' | 'text';
  data: string; // Base64 for PDF, raw string for text
}

export interface AppState {
  status: 'idle' | 'configuring' | 'generating_outline' | 'outline_ready' | 'analyzing' | 'generating_images' | 'ready' | 'error';
  slides: SlideContent[];
  config: UserConfig;
  error?: string;
  inputData?: AnalysisInput;
  outline?: string[]; // Slide titles outline for preview
  imageProgress: { current: number; total: number };
  progressMessage?: string; // 详细进度消息
}
