import { clientService } from "../http/ClientService";
import { parseCommonHttpResult } from "../http/parseCommonResult";
import type {
  CleanupAction,
  CleanupItem,
  CleanupPreview,
  RemoveResult,
  ResurveyResult,
} from "./survey-cleanup.types";

/** Unwraps proxy → backend envelopes: { data: { data: { data: result } } } */
const unwrap = <T>(result: ReturnType<typeof parseCommonHttpResult>): T => {
  const payload = result as any;
  return (payload?.data?.data?.data ?? payload?.data?.data ?? payload?.data) as T;
};

class SurveyCleanupService {
  async preview(action: CleanupAction, items: CleanupItem[], campaignId?: string) {
    const response = await clientService.post("/survey-cleanup/preview", {
      action,
      items,
      ...(action === "RESURVEY" && campaignId && { campaignId }),
    });
    return unwrap<CleanupPreview>(parseCommonHttpResult(response));
  }

  async remove(items: CleanupItem[]) {
    const response = await clientService.post("/survey-cleanup/remove", { items });
    return unwrap<RemoveResult>(parseCommonHttpResult(response));
  }

  async resurvey(items: CleanupItem[], dueDate: string, campaignId?: string) {
    const response = await clientService.post("/survey-cleanup/resurvey", {
      items,
      dueDate,
      ...(campaignId && { campaignId }),
    });
    return unwrap<ResurveyResult>(parseCommonHttpResult(response));
  }
}

export const surveyCleanupService = new SurveyCleanupService();
