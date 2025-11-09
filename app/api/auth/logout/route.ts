import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    (await cookies()).delete('access_token');
    (await cookies()).delete('refresh_token');
    (await cookies()).delete('username');
    return NextResponse.json({ status: 204 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Logout failed' },
      { status: error?.response?.status || 404 }
    );
  }
}