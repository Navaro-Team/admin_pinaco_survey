import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { serverService } from "@/features/http/ServerService";
import { responseFailed, responseSuccess } from "../../../utils";

export async function POST(request: NextRequest) {
  const accessToken = (await cookies()).get('access_token')?.value;
  try {
    if (!accessToken) throw new Error('No access token');
    const body = await request.formData();
    const file = body.get('file');
    if (!file) throw new Error('File is required');

    const formData = new FormData();
    formData.append('file', file as Blob);
    formData.append('skipPhoneValidation', 'true');
    const response = await serverService.upload('/stores/import/validate', formData);
    return responseSuccess(response);
  } catch (error: any) {
    const payload = error as any;
    return responseFailed(payload, 'Import stores failed');
  }
}

