'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Product = { id: string; name: string; price: number; category: string };

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('rifle');
  const [editId, setEditId] = useState<string | null>(null);
  const router = useRouter();

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/products', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const { data } = await res.json();
      setProducts(data);
    } else {
      router.push('/login');
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const url = editId ? `/api/products/${editId}` : '/api/products';
    const method = editId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ name, price: Number(price), category }),
    });

    if (res.ok) {
      setName(''); setPrice(''); setCategory('rifle'); setEditId(null);
      fetchProducts();
    }
  };

  const handleEditClick = (p: Product) => {
    setName(p.name);
    setPrice(p.price.toString());
    setCategory(p.category);
    setEditId(p.id);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this weapon?')) {
      const token = localStorage.getItem('token');
      await fetch(`/api/products/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchProducts();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-red-500/20 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-6 bg-red-500"></div>
              <h1 className="text-xl font-bold tracking-tight">ARSENAL INVENTORY</h1>
            </div>
            <p className="text-xs text-slate-400">Manage your weapons collection</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => router.push('/')}
              className="px-4 py-2 text-sm font-medium border border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white transition-all"
            >
              Back
            </button>
            <button 
              onClick={handleLogout} 
              className="px-4 py-2 text-sm font-medium border border-red-500/50 text-red-400 hover:border-red-500 hover:bg-red-500/10 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Form Section */}
        <div className="mb-12">
          <h2 className="text-lg font-bold mb-4">
            {editId ? 'Edit Weapon' : 'Add New Weapon'}
          </h2>
          
          <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-slate-700/50 rounded p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-2">Weapon Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="Enter weapon name"
                  required 
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-2">Price (RP)</label>
                <input 
                  type="number" 
                  value={price} 
                  onChange={e => setPrice(e.target.value)} 
                  placeholder="Enter price"
                  required 
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-2">Category</label>
                <select 
                  value={category} 
                  onChange={e => setCategory(e.target.value)} 
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors"
                >
                  <option value="handgun">Handgun</option>
                  <option value="rifle">Rifle</option>
                  <option value="shotgun">Shotgun</option>
                  <option value="sniper">Sniper</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 pt-2">
              <button 
                type="submit" 
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-all"
              >
                {editId ? 'Update' : 'Add'}
              </button>
              
              {editId && (
                <button 
                  type="button" 
                  onClick={() => {setEditId(null); setName(''); setPrice(''); setCategory('rifle');}} 
                  className="px-6 py-2 border border-slate-600 text-slate-300 hover:border-slate-500 text-sm font-medium transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table Section */}
        <div>
          <h2 className="text-lg font-bold mb-4">Weapons Collection</h2>
          
          <div className="border border-slate-700/50 rounded overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50 bg-slate-900/50">
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-300">Category</th>
                  <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-300">Price</th>
                  <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500 text-sm">
                      No weapons in inventory
                    </td>
                  </tr>
                ) : (
                  products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-white">{p.name}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 text-xs font-semibold bg-red-500/20 text-red-300 rounded-full">
                          {((p.category || 'rifle').charAt(0).toUpperCase() + (p.category || 'rifle').slice(1))}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-red-400 font-semibold">Rp {p.price.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => handleEditClick(p)} 
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded transition-colors"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(p.id)} 
                            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium rounded transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}