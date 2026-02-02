export interface Submission {
  _id: string;
  surveyId: string;
  createdBy: string;
  store: any,
  metadata: any,
  status: string;
  pendingQuestionCodes: string[];
  checkinTime: string;
  checkoutTime: string;
  updateStore: boolean;
  createdAt: string;
  updatedAt: string;
  reviewAction: string;
  reviewNote: string;
  reviewedAt: string;
  reviewedBy: string;
  submissionId: string;
  submittedBy: string;
  submittedAt: string;
  answers: any[],
}

export function parseSubmission(data: any): Submission {
  return {
    _id: data._id,
    surveyId: data.surveyId,
    createdBy: data.createdBy,
    store: data.store,
    metadata: data.metadata,
    status: data.status,
    pendingQuestionCodes: data.pendingQuestionCodes,
    checkinTime: data.checkinTime,
    checkoutTime: data.checkoutTime,
    updateStore: data.updateStore,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    reviewAction: data.reviewAction,
    reviewNote: data.reviewNote,
    reviewedAt: data.reviewedAt,
    reviewedBy: data.reviewedBy,
    submissionId: data.submissionId,
    submittedBy: data.submittedBy,
    submittedAt: data.submittedAt,
    answers: data.answers,
  };
}

export function parseSubmissions(data: any): Submission[] {
  if (!Array.isArray(data)) return [];
  return data.map(parseSubmission);
}