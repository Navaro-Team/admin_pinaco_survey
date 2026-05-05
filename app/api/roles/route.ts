import { serverService } from "@/features/http/ServerService";
import { responseFailed, responseSuccess } from "../utils";
import { cookies } from "next/headers";

export async function GET() {
  const accessToken = (await cookies()).get('access_token')?.value;
  try {
    if (!accessToken) throw new Error('No access token');
    const response = await serverService.get('/roles');
    return responseSuccess(response);
  } catch (error: any) {
    const payload = error as any;
    return responseFailed(payload, 'Get roles failed');
  }
} 