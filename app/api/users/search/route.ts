import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { serverService } from "@/features/http/ServerService";
import { responseFailed, responseSuccess } from "../../utils";

export async function GET(request: NextRequest) {
  const accessToken = (await cookies()).get('access_token')?.value;
  const params = request.nextUrl.searchParams;
  try {
    if (!accessToken) throw new Error('No access token');
    const urlParams = new URLSearchParams();

    const hasSearchQuery = params.get('q');
    if (hasSearchQuery) {
      urlParams.set('q', hasSearchQuery);
    } else {
      if (params.get('limit')) {
        urlParams.set('limit', params.get('limit') ?? '20');
      }
    }

    if (params.get('page')) {
      urlParams.set('page', params.get('page') ?? '1');
    }

    if (params.get('status')) {
      urlParams.set('status', params.get('status') ?? '');
    }
    if (params.get('phone')) {
      urlParams.set('phone', params.get('phone') ?? '');
    }

    const queryString = urlParams.toString();
    const url = queryString ? `/users/search?${queryString}` : '/users/search';
    const response = await serverService.get(url);
    return responseSuccess(response);
  } catch (error: any) {
    const payload = error as any;
    console.log('error: ', payload);
    return responseFailed(payload, 'Search users failed');
  }
}

