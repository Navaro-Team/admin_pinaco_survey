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
  performedBy: string;
  performedByInfo: any;
  answers: any[],
  supervisorReview: any,
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
    performedBy: data.performedBy,
    performedByInfo: data.performedByInfo,
    supervisorReview: data.supervisorReview,
  };
}

export function parseSubmissions(data: any): Submission[] {
  if (!Array.isArray(data)) return [];
  return data.map(parseSubmission);
}

export function getStatusSupervisorReview(submission: Submission): string | null {
  switch (submission?.supervisorReview?.status) {
    case "PASSED":
      return "đạt"
    case "FAILED":
      return "không đạt";
    default:
      return null;
  }
}