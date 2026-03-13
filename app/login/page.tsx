'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (res.ok) {
      const data = await res.json();
      // Simpan token ke brankas browser (LocalStorage)
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } else {
      alert('Login Gagal: Email atau Password salah');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 text-black">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Login Gunshop</h1>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full mb-4 p-2 border rounded" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full mb-6 p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-bold">Masuk</button>
        <p className="mt-4 text-sm text-center">Belum punya akun? <a href="/register" className="text-blue-600 font-bold">Register</a></p>
      </form>
    </div>
  );
}