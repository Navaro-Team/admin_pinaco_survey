import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { serverService } from "@/features/http/ServerService";
import { missingRequiredFieldsResponse, responseFailed, responseSuccess } from "../../../utils";

export async function POST(request: NextRequest) {
  const accessToken = (await cookies()).get('access_token')?.value;
  const body = await request.json();
  const { id, action, note } = body;
  try {
    if (!accessToken) throw new Error('No access token');
    if (!id) {
      return missingRequiredFieldsResponse('Submission ID');
    }
    if (!action) {
      return missingRequiredFieldsResponse('Action');
    }

    const response = await serverService.post(`/submissions/${id}/review`, { action: action, note: note });
    return responseSuccess(response);
  } catch (error: any) {
    const payload = error as any;
    return responseFailed(payload, 'Review submission failed');
  }
}