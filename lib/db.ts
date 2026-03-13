const globalStore = globalThis as any;

// Paku data user biar nggak hilang
if (!globalStore.users) {
  globalStore.users = [
    { id: 'admin-1', email: 'admin@gmail.com', password: '123' }
  ];
}

// Paku data senjata biar nggak hilang
if (!globalStore.products) {
  globalStore.products = [
    { id: '1', name: 'AK-47', price: 12000000 },
    { id: '2', name: 'M4A1', price: 15000000 }
  ];
}

export const users = globalStore.users;
export const products = globalStore.products;