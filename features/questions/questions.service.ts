import { clientService } from "../http/ClientService";
import { parseCommonHttpResult } from "../http/parseCommonResult";

export interface GetQuestionsParams {
  page?: number;
  limit?: number;
  questionType?: string;
  status?: 'active' | 'deleted';
  isActive?: boolean;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'questionType' | 'isActive';
  sortOrder?: 'asc' | 'desc';
}

class QuestionsService {
  async getQuestions(params?: GetQuestionsParams) {
    const queryParams: Record<string, string> = {};
    
    if (params?.page) queryParams.page = params.page.toString();
    if (params?.limit) queryParams.limit = params.limit.toString();
    if (params?.questionType) queryParams.questionType = params.questionType;
    if (params?.status) queryParams.status = params.status;
    if (params?.isActive !== undefined) queryParams.isActive = params.isActive.toString();
    if (params?.search) queryParams.search = params.search;
    if (params?.sortBy) queryParams.sortBy = params.sortBy;
    if (params?.sortOrder) queryParams.sortOrder = params.sortOrder;
    
    const response = await clientService.get('/questions', queryParams);
    return parseCommonHttpResult(response);
  }

  async getQuestionById(id: string) {
    const response = await clientService.get(`/questions/${id}`);
    return parseCommonHttpResult(response);
  }

  async updateQuestion(id: string, data: any) {
    const response = await clientService.put(`/questions/${id}`, data);
    return parseCommonHttpResult(response);
  }
}

export const questionsService = new QuestionsService();