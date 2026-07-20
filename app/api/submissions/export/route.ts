import { serverService } from "@/features/http/ServerService";
import { cookies } from "next/headers";
import { responseSuccess, responseFailed } from "../../utils";

export async function GET() {
  const accessToken = (await cookies()).get('access_token')?.value;
  try {
    if (!accessToken) throw new Error('No access token');
    const response = await serverService.get("/submissions/team/export");
    return responseSuccess(response);
  } catch (error: any) {
    const payload = error as any;
    return responseFailed(payload, 'Export team submissions failed');
  }
}