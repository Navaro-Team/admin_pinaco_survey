import { serverService } from "@/features/http/ServerService";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { responseFailed, responseSuccess } from "../../utils";

export async function POST(request: NextRequest) {
  const accessToken = (await cookies()).get('access_token')?.value;
  try {
    if (!accessToken) throw new Error('No access token');
    const body = await request.json();
    const response = await serverService.post('/survey-cleanup/remove', body);
    return responseSuccess(response);
  } catch (error: any) {
    const payload = error as any;
    return responseFailed(payload, 'Survey cleanup remove failed');
  }
}
