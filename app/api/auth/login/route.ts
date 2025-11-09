import { serverService } from '@/features/http/ServerService';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { responseFailed, responseSuccess } from '../../utils';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const username = body.username as string;
  const password = body.password as string;

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
  }

  try {
    const response = await serverService.post("/auth/login", {
      username: username,
      password: password,
    });

    const tokens = response?.data?.data?.output?.tokens;
    if (tokens) {
      const accessToken = tokens?.access;
      const refreshToken = tokens?.refresh;
      if (accessToken) {
        (await cookies()).set('access_token', accessToken, {
          path: '/',
          httpOnly: true,
        });
      }
      if (refreshToken) {
        (await cookies()).set('refresh_token', refreshToken, {
          path: '/',
          httpOnly: true,
        });
      }
      (await cookies()).set('username', username, {
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
