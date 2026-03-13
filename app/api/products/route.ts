import { NextResponse } from 'next/server';
import { products } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

// Fungsi bantuan buat ngecek token
async function checkAuth(request: Request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  if (!token) return false;
  const payload = await verifyToken(token);
  return payload ? true : false;
}

export async function GET(request: Request) {
  const isAuth = await checkAuth(request);
  if (!isAuth) return NextResponse.json({ error: 'Belum login' }, { status: 401 });

  return NextResponse.json({ data: products }, { status: 200 });
}

export async function POST(request: Request) {
  const isAuth = await checkAuth(request);
  if (!isAuth) return NextResponse.json({ error: 'Belum login' }, { status: 401 });

  const body = await request.json();
  const newProduct = { id: Date.now().toString(), name: body.name, price: body.price };
  
  products.push(newProduct);
  return NextResponse.json({ message: 'Produk ditambah', data: newProduct }, { status: 201 });
}