import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { serverService } from "@/features/http/ServerService";
import { responseFailed, responseSuccess } from "../../../utils";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const accessToken = (await cookies()).get('access_token')?.value;
  const body = await request.json();
  const { reason } = body;
  const id = (await params).id;

  try {
    if (!accessToken) throw new Error('No access token');
    if (!id) {
      return responseFailed({ message: 'Task ID is required' }, 'Cancel task failed');
    }

    const response = await serverService.patch(`/tasks/${id}/cancel`, { reason: reason });
    return responseSuccess(response);
  } catch (error: any) {
    const payload = error as any;
    return responseFailed(payload, 'Cancel task failed');
  }
}
