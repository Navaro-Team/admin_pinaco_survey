import { serverService } from "@/features/http/ServerService";
import { responseFailed, responseSuccess } from "../../utils";

export async function GET() {
  try {
    const response = await serverService.get(`/submissions/report/open-question-16/filters`);
    return responseSuccess(response);
  } catch (error: any) {
    return responseFailed(error, 'Get open-question-16 filter options failed');
  }
}
