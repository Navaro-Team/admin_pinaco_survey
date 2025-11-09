import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
export async function POST(req: NextRequest) {
    const body = await req.json();
    console.log('POST request received for /token',body);
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not defined');
    const { refresh_token } = body;
    if (!refresh_token) {
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    const token = jwt.sign(body, secret, { expiresIn: '1h' });
    return NextResponse.json({token});
}