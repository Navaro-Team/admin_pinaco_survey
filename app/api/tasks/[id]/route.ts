import { responseFailed, responseSuccess } from "../../utils";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { serverService } from "@/features/http/ServerService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const accessToken = (await cookies()).get('access_token')?.value;
  const id = (await params).id;
  try {
    if (!accessToken) throw new Error('No access token');
    if (!id) {
      return responseFailed({ message: 'Task ID is required' }, 'Get task failed');
    }

    const response = await serverService.get(`/tasks/${id}`);
    return responseSuccess(response);
  } catch (error: any) {
    const payload = error as any;
    return responseFailed(payload, 'Get task failed');
  }
}

