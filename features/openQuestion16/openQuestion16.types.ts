export interface OpenQuestionTopicStat {
  key: string;
  label: string;
  count: number;
  percentage: number;
  subTopics?: { label: string; count: number }[];
}

export interface OpenQuestionAnswer {
  submissionId: string;
  storeName?: string;
  text: string;
  topics: string[];
  confidence: number;
  needsReview: boolean;
}

export interface OpenQuestion16Report {
  totalValidAnswers: number;
  pendingCount: number;
  totalScanned: number;
  quotaExhausted: boolean;
  quotaResetAt: string | null;
  topics: OpenQuestionTopicStat[];
  confidence: {
    high: { count: number; percentage: number };
    medium: { count: number; percentage: number };
    low: { count: number; percentage: number };
  };
  answers: OpenQuestionAnswer[];
}

export interface OpenQuestion16FilterOptions {
  provinces: string[];
  storeGroups: string[];
}

export interface OpenQuestion16FilterState {
  campaignId: string;
  startDate: string;
  endDate: string;
  province: string;
  storeGroup: string;
}
