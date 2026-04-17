import { serverService } from "@/features/http/ServerService";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { responseFailed, responseSuccess } from "../../utils";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const accessToken = (await cookies()).get('access_token')?.value;
  const payload = await request.json();
  const { id } = await params;
  try {
    if (!accessToken) throw new Error('No access token');
    const response = await serverService.put(`/campaigns/${id}`, payload);
    return responseSuccess(response);
  } catch (error: any) {
    const payload = error as any;
    return responseFailed(payload, 'Update campaign failed');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const accessToken = (await cookies()).get('access_token')?.value;
  const { id } = await params;
  try {
    if (!accessToken) throw new Error('No access token');
    const response = await serverService.delete(`/campaigns/${id}`, {});
    return responseSuccess(response);
  } catch (error: any) {
    const payload = error as any;
    return responseFailed(payload, 'Delete campaign failed');
  }
}