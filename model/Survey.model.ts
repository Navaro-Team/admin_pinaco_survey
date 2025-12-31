// Survey interface based on Survey response from API
export interface Survey {
  id: string;
  createdBy: string;
  createdByUser?: string;
  updatedBy?: string;
  updatedByUser?: string;
  surveyData?: {
    title?: string;
    description?: string;
    sources?: any;
    questions?: any[];
  };
  metadata?: {
    storeType?: string;
  };
  isActive?: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export const parseSurvey = (survey: any): Survey => {
  return {
    id: survey._id || survey.id,
    createdBy: survey.createdBy,
    createdByUser: survey.createdByUser,
    updatedBy: survey.updatedBy,
    updatedByUser: survey.updatedByUser,
    surveyData: survey.surveyData,
    metadata: survey.metadata,
    isActive: survey.isActive,
    createdAt: survey.createdAt,
    updatedAt: survey.updatedAt,
  };
};

// Helper function to get survey title
export const getSurveyTitle = (survey: Survey): string => {
  return survey.surveyData?.title || "Không có tiêu đề";
};

// Helper function to get survey description
export const getSurveyDescription = (survey: Survey): string => {
  return survey.surveyData?.description || "";
};

// Helper function to format date
export const formatSurveyDate = (date: Date | string): string => {
  if (!date) return "-";
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('vi-VN');
};

