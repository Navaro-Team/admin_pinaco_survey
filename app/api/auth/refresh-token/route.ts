import { serverService } from '@/features/http/ServerService';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const refreshToken = (await cookies()).get('refreshToken')?.value;
  if (!refreshToken) {
    return NextResponse.json({ error: 'Refresh token is required' }, { status: 400 });
  }

  try {
    const response = await serverService.post('/auth/refresh', {
      refreshToken: refreshToken,
    });
    const accessToken = response?.data?.accessToken;
    if (accessToken) {
      (await cookies()).set('accessToken', accessToken, {
        path: '/',
        httpOnly: true,
      });
    }

    return NextResponse.json({ status: response.status, data: { accessToken: accessToken } });
  } catch (err: any) {
    const payload = err as any;
    (await cookies()).delete('accessToken');
    (await cookies()).delete('refreshToken');
    (await cookies()).delete('email');
    return NextResponse.json({ error: payload?.message || 'Session Expired' }, { status: 401 });
  }
}
