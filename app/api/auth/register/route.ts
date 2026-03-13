import { NextResponse } from 'next/server';
import { users } from '@/lib/db';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  
  // Cek kalau email sudah ada
  if (users.find(u => u.email === email)) {
    return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 });
  }

  // Simpan ke array (tanpa bcrypt biar cepet)
  users.push({ id: Date.now().toString(), email, password });
  return NextResponse.json({ message: 'Register berhasil' }, { status: 201 });
}