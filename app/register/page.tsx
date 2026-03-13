'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      alert('Register Berhasil! Silakan Login.');
      router.push('/login');
    } else {
      const data = await res.json();
      alert(`Gagal: ${data.error}`);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 text-black">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Register Gunshop</h1>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full mb-4 p-2 border rounded" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full mb-6 p-2 border rounded" />
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 font-bold">Daftar Sekarang</button>
        <p className="mt-4 text-sm text-center">Sudah punya akun? <a href="/login" className="text-blue-600 font-bold">Login</a></p>
      </form>
    </div>
  );
}