import { serverService } from "@/features/http/ServerService";
import { responseFailed, responseSuccess } from "../../utils";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const response = await serverService.get(`/dashboard/staff-by-area?${params}`);
    return responseSuccess(response);
  } catch (error: any) {
    return responseFailed(error, 'Get staff by area failed');
  }
}
