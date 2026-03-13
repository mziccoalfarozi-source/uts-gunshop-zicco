'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Product = { id: string; name: string; price: number };

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [editId, setEditId] = useState<string | null>(null); // State baru buat nandain lagi Edit atau ngga
  const router = useRouter();

  // Fungsi baca data (Read)
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

  // Fungsi buat Tambah (POST) DAN Edit (PUT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    // Kalau editId ada isinya, kita tembak URL edit (PUT), kalau kosong nembak tambah (POST)
    const url = editId ? `/api/products/${editId}` : '/api/products';
    const method = editId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ name, price: Number(price) }),
    });

    if (res.ok) {
      setName(''); setPrice(''); setEditId(null); // Bersihin form
      fetchProducts(); // Refresh tabel
    }
  };

  // Fungsi pas tombol Edit di tabel dipencet
  const handleEditClick = (p: Product) => {
    setName(p.name);
    setPrice(p.price.toString());
    setEditId(p.id); // Set ID senjata yang mau diedit
  };

  // Fungsi Hapus (DELETE)
  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus senjata ini?')) {
      const token = localStorage.getItem('token');
      await fetch(`/api/products/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchProducts();
    }
  };

  // Fungsi Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-gray-50 min-h-screen text-black">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Zicco Gunshop Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded font-bold">Logout</button>
      </div>

      {/* FORM MULTIFUNGSI: BISA TAMBAH, BISA EDIT */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-8 flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm mb-1 font-bold">Nama Senjata</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border rounded" />
        </div>
        <div className="flex-1">
          <label className="block text-sm mb-1 font-bold">Harga (Rp)</label>
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} required className="w-full p-2 border rounded" />
        </div>
        
        {/* Tombolnya berubah warna & tulisan tergantung lagi mode apa */}
        <button type="submit" className={`${editId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'} text-white px-6 py-2 rounded font-bold h-[42px]`}>
          {editId ? 'Update' : 'Tambah'}
        </button>
        
        {/* Tombol Batal cuma muncul kalau lagi mode Edit */}
        {editId && (
          <button type="button" onClick={() => {setEditId(null); setName(''); setPrice('');}} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-bold h-[42px]">
            Batal
          </button>
        )}
      </form>

      {/* TABEL DATA SENJATA */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-4 border-b">Nama</th>
              <th className="p-4 border-b">Harga</th>
              <th className="p-4 border-b text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan={3} className="p-4 text-center text-gray-500">Belum ada data senjata.</td></tr>
            ) : (
              products.map(p => (
                <tr key={p.id} className="hover:bg-gray-100 border-b">
                  <td className="p-4">{p.name}</td>
                  <td className="p-4">Rp {p.price.toLocaleString('id-ID')}</td>
                  <td className="p-4 text-center">
                    {/* Tombol Edit Baru */}
                    <button onClick={() => handleEditClick(p)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm font-bold mr-2">Edit</button>
                    {/* Tombol Hapus */}
                    <button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm font-bold">Hapus</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}