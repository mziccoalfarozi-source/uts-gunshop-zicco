'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface TabType {
  id: string;
  label: string;
  value: string;
}

const TABS: TabType[] = [
  { id: 'all', label: 'All Weapons', value: 'all' },
  { id: 'handgun', label: '🔫 Handgun', value: 'handgun' },
  { id: 'rifle', label: '🎯 Rifle', value: 'rifle' },
  { id: 'shotgun', label: '💣 Shotgun', value: 'shotgun' },
  { id: 'sniper', label: '🎲 Sniper', value: 'sniper' },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'rifle' });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    fetchProducts(storedToken);
  }, []);

  const fetchProducts = async (authToken: string | null) => {
    try {
      const headers: HeadersInit = {};
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const res = await fetch('/api/products', { headers });
      if (res.ok) {
        const data = await res.json();
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newProduct.name || !newProduct.price) return;

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          name: newProduct.name, 
          price: parseInt(newProduct.price),
          category: newProduct.category
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setProducts([...products, data.data]);
        setNewProduct({ name: '', price: '', category: 'rifle' });
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setProducts([]);
  };

  const filteredProducts = activeTab === 'all' 
    ? products 
    : products.filter(p => p.category === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-red-500/20 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-6 bg-red-500"></div>
            <h1 className="text-xl font-bold tracking-tight">ARSENAL</h1>
          </div>
          <div className="flex gap-3 items-center">
            {token ? (
              <>
                <span className="text-sm text-red-400">Agent Online</span>
                <Link href="/dashboard" className="px-4 py-2 text-sm font-medium border border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white transition-all">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium border border-red-500/50 text-red-400 hover:border-red-500 hover:bg-red-500/10 transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-sm font-medium border border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white transition-all">
                  Login
                </Link>
                <Link href="/register" className="px-4 py-2 text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-all">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold tracking-tight mb-2">Weapons Arsenal</h2>
          <p className="text-slate-400 text-sm">Browse and manage available weapons by category</p>
        </div>

        {/* Add Product Form */}
        {token && (
          <div className="bg-slate-900/50 border border-slate-700/50 rounded p-6 mb-12">
            <h3 className="text-lg font-bold mb-6">Add New Weapon</h3>
            <form onSubmit={handleAddProduct} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Weapon name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded text-sm placeholder-slate-500 text-white focus:outline-none focus:border-red-500/50 transition-colors"
              />
              <input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded text-sm placeholder-slate-500 text-white focus:outline-none focus:border-red-500/50 transition-colors"
              />
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors"
              >
                <option value="handgun">Handgun</option>
                <option value="rifle">Rifle</option>
                <option value="shotgun">Shotgun</option>
                <option value="sniper">Sniper</option>
              </select>
              <button type="submit" className="px-6 py-2 bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-all whitespace-nowrap">
                Add
              </button>
            </form>
          </div>
        )}

        {/* Tabs Section */}
        <div className="mb-12">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.value)}
                className={`relative px-6 py-3 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab.value
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                {tab.label}
                {/* Animated underline */}
                <div
                  className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-red-500 to-red-400 transition-all duration-300 ${
                    activeTab === tab.value ? 'w-full' : 'w-0'
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="h-px bg-gradient-to-r from-slate-700/50 via-slate-700/50 to-transparent"></div>
        </div>

        {/* Products Grid with Animation */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-slate-400 text-sm">Loading weapons...</p>
          </div>
        ) : (
          <div className="animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="group bg-slate-900/50 border border-slate-700/50 rounded p-6 hover:border-red-500/50 hover:bg-slate-900/70 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10 animate-slideUp"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-base font-bold mb-2 group-hover:text-red-400 transition-colors">
                        {product.name}
                      </h3>
                      <span className="inline-block px-3 py-1 text-xs font-semibold bg-red-500/20 text-red-300 rounded-full">
                        {((product.category || 'rifle').charAt(0).toUpperCase() + (product.category || 'rifle').slice(1))}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1 mt-6">
                    <span className="text-xl font-bold text-red-400">Rp</span>
                    <span className="text-2xl font-bold">{product.price.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-slate-500 text-sm">No weapons in this category</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

    </div>
  );
}
