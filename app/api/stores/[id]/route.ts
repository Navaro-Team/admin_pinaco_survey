import { serverService } from "@/features/http/ServerService";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { responseFailed, responseSuccess } from "../../utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const accessToken = (await cookies()).get('access_token')?.value;
  try {
    if (!accessToken) throw new Error('No access token');
    const { id } = await params;
    const response = await serverService.get(`/stores/${id}`);
    return responseSuccess(response);
  } catch (error: any) {
    const payload = error as any;
    console.log('error: ', payload);
    return responseFailed(payload, 'Get store failed');
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
    const response = await serverService.put(`/stores/${id}`, body);
    return responseSuccess(response);
  } catch (error: any) {
    const payload = error as any;
    console.log('error: ', payload);
    return responseFailed(payload, 'Update store failed');
  }
}

export async function POST(
  request: NextRequest,
) {
  const accessToken = (await cookies()).get('access_token')?.value;
  try {
    if (!accessToken) throw new Error('No access token');
    const body = await request.json();
    const response = await serverService.post(`/stores`, body);
    return responseSuccess(response);
  } catch (error: any) {
    const payload = error as any;
    console.log('error: ', payload);
    return responseFailed(payload, 'Create store failed');
  }
}