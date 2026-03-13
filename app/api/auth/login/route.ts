import { NextResponse } from 'next/server';
import { users } from '@/lib/db';
import { signToken } from '@/lib/jwt';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });

  // Bikin token JWT
  const token = await signToken({ userId: user.id, email: user.email }, '1h');

  // NGIRIM TOKEN KE FRONTEND (Ini yang tadi gua lupa kasih!)
  return NextResponse.json({ message: 'Login berhasil', token }, { status: 200 });
}