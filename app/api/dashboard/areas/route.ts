import { serverService } from "@/features/http/ServerService";
import { responseFailed, responseSuccess } from "../../utils";

export async function GET() {
  try {
    const response = await serverService.get('/dashboard/areas');
    return responseSuccess(response);
  } catch (error: any) {
    return responseFailed(error, 'Get areas failed');
  }
}
