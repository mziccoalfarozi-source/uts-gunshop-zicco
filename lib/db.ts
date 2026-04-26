const globalStore = globalThis as any;

// Define types
export interface User {
  id: string;
  email: string;
  password: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
}

// Paku data user biar nggak hilang
if (!globalStore.users) {
  globalStore.users = [
    { id: 'admin-1', email: 'admin@gmail.com', password: '12345678' }
  ];
}

// Paku data senjata biar nggak hilang
if (!globalStore.products) {
  globalStore.products = [
    { id: '1', name: 'AK-47', price: 12000000, category: 'rifle', stock: 5 },
    { id: '2', name: 'M4A1', price: 15000000, category: 'rifle', stock: 3 },
    { id: '3', name: 'Glock 18', price: 2500000, category: 'handgun', stock: 10 },
    { id: '4', name: 'Desert Eagle', price: 7000000, category: 'handgun', stock: 2 },
    { id: '5', name: 'AWP Dragon Lore', price: 50000000, category: 'sniper', stock: 1 },
    { id: '6', name: 'SSG 08', price: 8000000, category: 'sniper', stock: 4 },
    { id: '7', name: 'XM1014', price: 5000000, category: 'shotgun', stock: 6 },
    { id: '8', name: 'MAG-7', price: 2000000, category: 'shotgun', stock: 8 }
  ];
}

export const users: User[] = globalStore.users;
export const products: Product[] = globalStore.products;