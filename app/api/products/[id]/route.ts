import { NextResponse } from 'next/server';
import { products } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

async function checkAuth(request: Request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  if (!token) return false;
  const payload = await verifyToken(token);
  return payload ? true : false;
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const isAuth = await checkAuth(request);
  if (!isAuth) return NextResponse.json({ error: 'Belum login' }, { status: 401 });
  const params = await context.params;
  const index = products.findIndex(p => p.id === params.id);
  if (index !== -1) products.splice(index, 1);
  return NextResponse.json({ message: 'Produk dihapus' }, { status: 200 });
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const isAuth = await checkAuth(request);
  if (!isAuth) return NextResponse.json({ error: 'Belum login' }, { status: 401 });
  const params = await context.params;
  const body = await request.json();
  const index = products.findIndex(p => p.id === params.id);
  if (index === -1) return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 });
  products[index] = { ...products[index], name: body.name, price: Number(body.price) };
  return NextResponse.json({ message: 'Berhasil diedit' }, { status: 200 });
}