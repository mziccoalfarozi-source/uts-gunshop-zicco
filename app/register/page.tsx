'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      setSuccess('Account created! Redirecting...');
      setTimeout(() => router.push('/login'), 2000);
    } else {
      const data = await res.json();
      setError(data.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <div className="w-full max-w-md px-6">
        <div className="bg-slate-900/50 border border-slate-700/50 rounded p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-red-500"></div>
            <h1 className="text-2xl font-bold text-white">REGISTER</h1>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-2">Email</label>
              <input 
                type="email" 
                placeholder="agent@arsenal.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 block mb-2">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded p-3">
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-500/10 border border-green-500/50 rounded p-3">
                <p className="text-green-400 text-sm font-medium">{success}</p>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 text-sm font-medium transition-all"
            >
              Register
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <p className="text-sm text-slate-400">
              Have an account?{' '}
              <a href="/login" className="text-red-400 font-medium hover:text-red-300 transition-colors">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}