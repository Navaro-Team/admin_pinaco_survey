import { serverService } from "@/features/http/ServerService";
import { cookies } from "next/headers";
import { responseFailed, responseSuccess } from "../../utils";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const accessToken = (await cookies()).get('access_token')?.value;
    if (!accessToken) throw new Error('No access token');
    const response = await serverService.get(`/dashboard/distribution?${params}`);
    return responseSuccess(response);
  } catch (error: any) {
    const payload = error as any;
    return responseFailed(payload, 'Get dashboard distribution failed');
  }
}
