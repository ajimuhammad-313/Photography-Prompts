export type NavSection =
  | 'dashboard'
  | 'generator'
  | 'presets'
  | 'library'
  | 'favorites'
  | 'settings'
  | 'about';

export type PromptLanguage = 'en' | 'id';
export type PromptFormat = 'natural' | 'structured';
export type ThemeMode = 'dark' | 'light';

export interface PhotographyStyleItem {
  id: string;
  name: string;
  nameId: string;
  description: string;
  group: 'Editorial & People' | 'Cinema & Street' | 'Commercial & Detail' | 'Nature & Space';
  previewMotif: 'portrait' | 'street' | 'macro' | 'product' | 'landscape' | 'cinema' | 'architecture' | 'sports' | 'food' | 'film';
  palette: [string, string, string];
  suggestedLens: string;
  suggestedAperture: string;
}

export interface PhotographyConfig {
  style: string;
  cameraType: string;
  customCamera: string;
  lens: string;
  aperture: string;
  iso: string;
  shutterSpeed: string;
  focalLength: string;
  depthOfField: string;
  focusDistance: string;
  sensorFormat: string;
  lighting: string;
  customLighting: string;
  cameraAngle: string;
  composition: string;
  subjectCategory: string;
  customSubject: string;
  portraitFraming: string;
  pose: string;
  facialExpression: string;
  humanDetails: string[];
  environment: string;
  weather: string;
  customBackground: string;
  colorGrading: string;
  aspectRatio: string;
  quality: string;
  customDetails: string;
  useEnhancer: boolean;
}

export interface PhotographyPreset {
  id: string;
  name: string;
  category: string;
  summary: string;
  previewImage?: string;
  config: Partial<PhotographyConfig>;
}

export interface CompatibilityIssue {
  id: string;
  severity: 'warning' | 'tip';
  title: string;
  message: string;
  recommendationLabel: string;
  patch: Partial<PhotographyConfig>;
}

export interface GeneratedPrompts {
  naturalLanguage: string;
  structured: string;
  negativePrompt: string;
  completePrompt: string;
  enhancedSubject: string;
  enhancedBackground: string;
  language: PromptLanguage;
  wordCount: number;
}

export interface SavedPromptItem {
  id: string;
  title: string;
  createdAt: string;
  language: PromptLanguage;
  format: PromptFormat;
  config: PhotographyConfig;
  prompts: GeneratedPrompts;
}

export interface StudioSettings {
  theme: ThemeMode;
  defaultLanguage: PromptLanguage;
  defaultFormat: PromptFormat;
  showCompatibilityWarnings: boolean;
  autoSaveHistoryOnCopy: boolean;
  defaultCameraType: string;
  defaultQuality: string;
}

export interface LibraryReferenceTemplate {
  id: string;
  title: string;
  style: string;
  notes: string;
  config: Partial<PhotographyConfig>;
}
