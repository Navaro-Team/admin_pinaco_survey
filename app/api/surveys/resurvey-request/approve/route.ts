import { responseFailed, responseSuccess } from "../../../utils";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { serverService } from "@/features/http/ServerService";

export async function POST(request: NextRequest) {
  const accessToken = (await cookies()).get('access_token')?.value;
  const { id } = await request.json();
  try {
    if (!accessToken) throw new Error('No access token');
    if (!id) {
      return responseFailed({ message: 'Resurvey request ID is required' }, 'Approve resurvey request failed');
    }

    const response = await serverService.post(`/resurvey-requests/${id}/approve`);
    return responseSuccess(response);
  } catch (error: any) {
    const payload = error as any;
    return responseFailed(payload, 'Approve resurvey request failed');
  }
}

