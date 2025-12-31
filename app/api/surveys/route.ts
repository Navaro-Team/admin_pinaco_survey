import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { serverService } from "@/features/http/ServerService";
import { responseFailed, responseSuccess } from "../utils";

export async function GET(request: NextRequest) {
  const accessToken = (await cookies()).get('access_token')?.value;
  const params = request.nextUrl.searchParams;
  try {
    if (!accessToken) throw new Error('No access token');
    const urlParams = new URLSearchParams();

    // Pagination
    if (params.get('page')) {
      urlParams.set('page', params.get('page') ?? '');
    }
    if (params.get('limit')) {
      urlParams.set('limit', params.get('limit') ?? '');
    }

    // Filtering
    if (params.get('createdBy')) {
      urlParams.set('createdBy', params.get('createdBy') ?? '');
    }
    if (params.get('isActive')) {
      urlParams.set('isActive', params.get('isActive') ?? '');
    }
    if (params.get('startDate')) {
      urlParams.set('startDate', params.get('startDate') ?? '');
    }
    if (params.get('endDate')) {
      urlParams.set('endDate', params.get('endDate') ?? '');
    }

    // Sorting
    if (params.get('sortBy')) {
      urlParams.set('sortBy', params.get('sortBy') ?? '');
    }
    if (params.get('sortOrder')) {
      urlParams.set('sortOrder', params.get('sortOrder') ?? '');
    }

    const queryString = urlParams.toString();
    const url = queryString ? `/surveys?${queryString}` : '/surveys';
    const response = await serverService.get(url);
    return responseSuccess(response);
  } catch (error: any) {
    const payload = error as any;
    console.log('error: ', payload);
    return responseFailed(payload, 'Get surveys failed');
  }
}

