import { serverService } from "@/features/http/ServerService";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { responseSuccess, responseFailed } from "../../utils";

export async function GET(request: NextRequest) {
  const accessToken = (await cookies()).get('access_token')?.value;
  const params = request.nextUrl.searchParams;
  try {
    if (!accessToken) throw new Error('No access token');
    const urlParams = new URLSearchParams();
    for (const key of ['region', 'staff', 'business_type', 'q', 'status', 'startDate', 'endDate']) {
      const value = params.get(key);
      if (value) urlParams.set(key, value);
    }
    const queryString = urlParams.toString();
    const response = await serverService.get(`/submissions/team/export${queryString ? `?${queryString}` : ''}`);
    return responseSuccess(response);
  } catch (error: any) {
    const payload = error as any;
    return responseFailed(payload, 'Export team submissions failed');
  }
}
