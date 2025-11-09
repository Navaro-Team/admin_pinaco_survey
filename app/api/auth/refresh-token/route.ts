import { serverService } from '@/features/http/ServerService';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const username = (await cookies()).get('username')?.value;
  const refreshToken = (await cookies()).get('refresh_token')?.value;
  if (!refreshToken || !username) {
    return NextResponse.json({ error: 'Refresh token and username are required' }, { status: 400 });
  }

  try {
    const response = await serverService.post('/auth/refresh', {
      username: username,
      refreshToken: refreshToken,
    });
    const accessToken = response?.data?.data?.output?.accessToken;
    if (accessToken) {
      (await cookies()).set('access_token', accessToken, {
        path: '/',
        httpOnly: true,
      });
    }

    return NextResponse.json({ status: response.status, data: { accessToken: accessToken } });
  } catch (err: any) {
    console.error('Failed to refresh token:', err);
    (await cookies()).delete('access_token');
    (await cookies()).delete('refresh_token');
    (await cookies()).delete('username');
    return NextResponse.json({ error: 'Session Expired' }, { status: 401 });
  }
}
