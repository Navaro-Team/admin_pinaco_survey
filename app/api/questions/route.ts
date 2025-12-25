import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { serverService } from "@/features/http/ServerService";
import { responseFailed, responseSuccess } from "../utils";

export async function GET(request: NextRequest) {
  const accessToken = (await cookies()).get('accessToken')?.value;
  const params = request.nextUrl.searchParams;
  try {
    if (!accessToken) throw new Error('No access token');
    const urlParams = new URLSearchParams();
    
    // Pagination
    if (params.get('page')) {
      urlParams.set('page', params.get('page') ?? '1');
    }
    if (params.get('limit')) {
      urlParams.set('limit', params.get('limit') ?? '10');
    }
    
    // Filtering
    if (params.get('questionType')) {
      urlParams.set('questionType', params.get('questionType') ?? '');
    }
    if (params.get('status')) {
      urlParams.set('status', params.get('status') ?? 'active');
    }
    if (params.get('isActive')) {
      urlParams.set('isActive', params.get('isActive') ?? 'true');
    }
    if (params.get('search')) {
      urlParams.set('search', params.get('search') ?? '');
    }
    
    // Sorting
    if (params.get('sortBy')) {
      urlParams.set('sortBy', params.get('sortBy') ?? 'createdAt');
    }
    if (params.get('sortOrder')) {
      urlParams.set('sortOrder', params.get('sortOrder') ?? 'desc');
    }
    
    const response = await serverService.get(`/questions?${urlParams.toString()}`);
    return responseSuccess(response);
  } catch (error: any) {
    const payload = error as any;
    console.log('error: ', payload);
    return responseFailed(payload, 'Get questions failed');
  }
}
