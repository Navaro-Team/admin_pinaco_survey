import { serverService } from "@/features/http/ServerService";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { missingRequiredFieldsResponse, responseFailed, responseSuccess } from "../../utils";

export async function GET(request: NextRequest) {
  const accessToken = (await cookies()).get('access_token')?.value;
  const params = request.nextUrl.searchParams;
  try {
    if (!accessToken) throw new Error('No access token');
    const id = params.get('id');
    if (!id) throw new Error('User ID is required');
    const response = await serverService.get(`/users/${id}/manager`);
    return responseSuccess(response);
  } catch (error: any) {
    const payload = error as any;
    console.log('error: ', payload);
    return responseFailed(payload, 'Get user manager failed');
  }
}

export async function PUT(request: NextRequest) {
  const accessToken = (await cookies()).get('access_token')?.value;
  const body = await request.json();
  try {
    if (!accessToken) throw new Error('No access token');
    const id = body.id;
    if (!id) return missingRequiredFieldsResponse('id');
    const managerId = body.managerId;
    if (!managerId) return missingRequiredFieldsResponse('managerId');

    const response = await serverService.put(`/users/${id}/manager`, { managerId: managerId });
    return responseSuccess(response);
  } catch (error: any) {
    const payload = error as any;
    console.log('error: ', payload);
    return responseFailed(payload, 'Update user manager failed');
  }
}