export interface Question {
  _id: string;
  code: string;
  questionType: string;
  title: string;
  instruction?: string;
  source?: string;
  rows?: any[];
  validation?: {
    required?: boolean;
    minValue?: number;
    allowDecimals?: boolean;
  };
  scale?: Array<{
    value: number;
    label: string;
  }>;
  items?: Array<{
    code: string;
    title: string;
  }>;
  fileCount?: number;
  createdBy: string;
  updatedBy: string;
  status: 'active' | 'deleted';
  isActive?: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface QuestionsResponse {
  questions: Question[];
  total: number;
}

export const parseQuestion = (question: any): Question => {
  return {
    _id: question._id,
    code: question.code,
    questionType: question.questionType,
    title: question.title,
    instruction: question.instruction,
    source: question.source,
    rows: question.rows,
    validation: question.validation,
    scale: question.scale,
    items: question.items,
    fileCount: question.fileCount,
    createdBy: question.createdBy,
    updatedBy: question.updatedBy,
    status: question.status,
    isActive: question.isActive,
    createdAt: question.createdAt,
    updatedAt: question.updatedAt,
  };
};

