export interface Submission {
  _id: string;
  submissionId: string;
  surveyId: string;
  submittedBy: string;
  submittedAt: string;
  store: any,
  answers: any[],
  metadata: any,
  createdAt: string;
  updatedAt: string;

}

export function parseSubmission(data: any): Submission {
  return {
    _id: data._id,
    submissionId: data.submissionId,
    surveyId: data.surveyId,
    submittedBy: data.submittedBy,
    submittedAt: data.submittedAt,
    store: data.store,
    answers: data.answers,
    metadata: data.metadata,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export function parseSubmissions(data: any): Submission[] {
  if (!Array.isArray(data)) return [];
  return data.map(parseSubmission);
}