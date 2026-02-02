import { responseFailed, responseSuccess } from "../utils";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { serverService } from "@/features/http/ServerService";

export async function GET(
  request: NextRequest,
) {
  const params = request.nextUrl.searchParams;
  const accessToken = (await cookies()).get('access_token')?.value;
  try {
    if (!accessToken) throw new Error('No access token');
    const urlParams = new URLSearchParams();

    if (params.get('status')) {
      urlParams.set('status', params.get('status') ?? '');
    }
    if (params.get('limit')) {
      urlParams.set('limit', params.get('limit') ?? '20');
    }
    if (params.get('skip')) {
      urlParams.set('skip', params.get('skip') ?? '0');
    }

    const response = await serverService.get(`/submissions?${urlParams.toString()}`);
    return responseSuccess(response);
  } catch (error: any) {
    const payload = error as any;
    return responseFailed(payload, 'Get submissions failed');
  }
}
