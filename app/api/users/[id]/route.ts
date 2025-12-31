import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { serverService } from "@/features/http/ServerService";
import { responseFailed, responseSuccess } from "../../utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const accessToken = (await cookies()).get('access_token')?.value;
  try {
    if (!accessToken) throw new Error('No access token');
    const { id } = await params;
    const response = await serverService.get(`/users/${id}`);
    return responseSuccess(response);
  } catch (error: any) {
    const payload = error as any;
    console.log('error: ', payload);
    return responseFailed(payload, 'Get user failed');
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const accessToken = (await cookies()).get('access_token')?.value;
  try {
    if (!accessToken) throw new Error('No access token');
    const { id } = await params;
    const body = await request.json();
    const response = await serverService.put(`/users/${id}`, body);
    return responseSuccess(response);
  } catch (error: any) {
    const payload = error as any;
    console.log('error: ', payload);
    return responseFailed(payload, 'Update user failed');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const accessToken = (await cookies()).get('access_token')?.value;
  try {
    if (!accessToken) throw new Error('No access token');
    const { id } = await params;
    const response = await serverService.delete(`/users/${id}`, {});
    return responseSuccess(response);
  } catch (error: any) {
    const payload = error as any;
    console.log('error: ', payload);
    return responseFailed(payload, 'Delete user failed');
  }
}

