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
    if (params.get('createdAt')) {
      urlParams.set('createdAt', params.get('createdAt') ?? '');
    }
    if (params.get('startDate')) {
      urlParams.set('startDate', params.get('startDate') ?? '');
    }
    if (params.get('endDate')) {
      urlParams.set('endDate', params.get('endDate') ?? '');
    }
    if (params.get('page')) {
      urlParams.set('page', params.get('page') ?? '1');
    }
    if (params.get('limit')) {
      urlParams.set('limit', params.get('limit') ?? '50');
    }
    if (params.get('q')) {
      urlParams.set('q', params.get('q') ?? '');
    }
    if (params.get('area')) {
      urlParams.set('area', params.get('area') ?? '');
    }

    const response = await serverService.get(`/submissions?${urlParams.toString()}`);
    return responseSuccess(response);
  } catch (error: any) {
    const payload = error as any;
    return responseFailed(payload, 'Get submissions failed');
  }
}
