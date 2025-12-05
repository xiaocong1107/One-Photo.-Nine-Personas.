export interface StyleConfig {
  id: string;
  title: string;
  description: string;
  prompt: string;
}

export interface GeneratedImage {
  styleId: string;
  isLoading: boolean;
  imageUrl?: string;
  error?: string;
}

export type GenerationStatus = 'idle' | 'uploading' | 'generating' | 'completed';