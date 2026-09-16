export interface AiClassificationConfig {
  id: string;
  provider: string;
  modelName: string;
  apiKey: string; // masked (e.g. "AIza***xyz9") — never the raw key
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const parseAiClassificationConfig = (data: any): AiClassificationConfig => {
  return {
    id: data.id,
    provider: data.provider,
    modelName: data.modelName,
    apiKey: data.apiKey || '',
    isActive: data.isActive,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};
