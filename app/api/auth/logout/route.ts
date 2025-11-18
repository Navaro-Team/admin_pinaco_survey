import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { serverService } from '@/features/http/ServerService';

export async function POST() {
  try {
    const refreshToken = (await cookies()).get('refreshToken')?.value;
    if (!refreshToken) {
      return NextResponse.json({ error: 'Session Expired' }, { status: 401 });
    }
    await serverService.post('/auth/logout', {
      refreshToken: refreshToken
    });
    (await cookies()).delete('accessToken');
    (await cookies()).delete('refreshToken');
    (await cookies()).delete('email');
    return NextResponse.json({ status: 204 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Logout failed' }, { status: 400 });
  }
}