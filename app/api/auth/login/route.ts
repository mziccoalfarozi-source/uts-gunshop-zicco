import { NextResponse } from 'next/server';
import { users, User } from '@/lib/db';
import { signToken } from '@/lib/jwt';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const user = users.find((u: User) => u.email === email && u.password === password);

  if (!user) {
    // fallback kalau mau selalu terima credential Flutter
    if (email === 'admin@gmail.com' && password === '12345678') {
      const token = await signToken({ userId: 'admin', email }, '1h');
      return NextResponse.json({ message: 'Login berhasil', token }, { status: 200 });
    }

    return NextResponse.json(
      { error: 'Email atau password salah' },
      { status: 401 }
    );
  }

  const token = await signToken({ userId: user.id, email: user.email }, '1h');
  return NextResponse.json({ message: 'Login berhasil', token }, { status: 200 });
}