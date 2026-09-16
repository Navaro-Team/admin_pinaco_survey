import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { serverService } from "@/features/http/ServerService";
import { responseFailed, responseSuccess } from "../utils";

export async function GET() {
  const accessToken = (await cookies()).get('access_token')?.value;
  try {
    if (!accessToken) throw new Error('No access token');
    const response = await serverService.get('/ai-classification-config');
    return responseSuccess(response);
  } catch (error: any) {
    const payload = error as any;
    return responseFailed(payload, 'Get AI classification config failed');
  }
}

export async function PUT(request: NextRequest) {
  const accessToken = (await cookies()).get('access_token')?.value;
  try {
    if (!accessToken) throw new Error('No access token');
    const body = await request.json();
    const response = await serverService.put('/ai-classification-config', body);
    return responseSuccess(response);
  } catch (error: any) {
    const payload = error as any;
    return responseFailed(payload, 'Update AI classification config failed');
  }
}
