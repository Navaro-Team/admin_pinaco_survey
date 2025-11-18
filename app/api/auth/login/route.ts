import { serverService } from '@/features/http/ServerService';
import { NextRequest, NextResponse } from 'next/server';
import { responseFailed, responseSuccess } from '../../utils';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = body.email as string;
  const password = body.password as string;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  try {
    const response = await serverService.post("auth/login", {
      email: email,
      password: password,
    });

    const responseData = response?.data;
    if (responseData?.success) {
      const accessToken = responseData?.data?.accessToken;
      const refreshToken = responseData?.data?.refreshToken;

      if (accessToken) {
        (await cookies()).set('accessToken', accessToken, {
          path: '/',
          httpOnly: true,
        });
      }
      if (refreshToken) {
        (await cookies()).set('refreshToken', refreshToken, {
          path: '/',
          httpOnly: true,
        });
      }
      (await cookies()).set('email', email, {
        path: '/',
        httpOnly: true,
      });
    }

    return responseSuccess(response);
  } catch (error) {
    const payload = error as any;
    return responseFailed(payload, 'Login failed');
  }
}
