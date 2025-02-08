const API_URL = 'http://localhost:4000'; // Ensure this matches your backend API URL

// Register function
export const register = async (username, password) => {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return response.json();
  };
  
  // Login function (already existing)
  export const login = async (username, password) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return response.json();
  };

// Fetch all products
export const getProduk = async () => {
  const response = await fetch(`${API_URL}/produk`);
  return response.json();
};

// Add product to cart
export const addToCart = async (userId, productId, quantity) => {
  const response = await fetch(`${API_URL}/cart/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, productId, quantity }),
  });
  return response.json();
};

// Fetch cart items for a user
export const getCart = async (userId) => {
  const response = await fetch(`${API_URL}/cart/${userId}`);
  return response.json();
};

// Remove product from cart
export const removeFromCart = async (userId, productId) => {
    if (!userId || !productId) {
      console.error('Invalid data:', { userId, productId });
      return { error: 'Invalid data' };
    }
  
    const response = await fetch(`${API_URL}/cart/remove`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, productId }),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to remove item');
    }
  
    return response.json();
  };  

export const processPayment = async (userId, selectedItems, metodePembayaran, nomorRekening) => {
    const response = await fetch(`${API_URL}/payment/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, selectedItems, metodePembayaran, nomorRekening }),
    });
    return response.json();
  };  

  export const createOrder = async (userId, items, metodePembayaran, nomorRekening) => {
    const response = await fetch(`${API_URL}/pesan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, items, metodePembayaran, nomorRekening }),
    });
    return response.json();
  };
  
export const getPesanan = async (userId) => {
    const response = await fetch(`http://localhost:4000/pesanan/${userId}`);
    return response.json();
  };
  
// Khusus untuk Penjual
// Add new product
export const addProduk = async (data) => {
    const response = await fetch(`${API_URL}/produk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  };
  
  // Update product
  export const updateProduk = async (id, data) => {
    const response = await fetch(`${API_URL}/produk/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  };
  
  // Delete product
  export const deleteProduk = async (id) => {
    const response = await fetch(`${API_URL}/produk/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  };

// Perbarui status pesanan
export const getFilteredPesanan = async () => {
    const response = await fetch(`${API_URL}/pesanan`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  };
  
  // Konfirmasi pesanan (ubah status menjadi "Pesanan Dikirim")
  export const confirmPesanan = async (id) => {
    const response = await fetch(`${API_URL}/pesanan/konfirmasi/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  };
  
  export const deletePesanan = async (id) => {
    const response = await fetch(`${API_URL}/pesanan/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Gagal menghapus pesanan');
    }
    return response.json();
  };  
  export const getAkun = async () => {
    const response = await fetch(`${API_URL}/akun`);
    return response.json();
  };
  
  export const addAkun = async (data) => {
    const response = await fetch(`${API_URL}/akun`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  };
  
  export const updateAkun = async (id, data) => {
    const response = await fetch(`${API_URL}/akun/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  };
  
  export const deleteAkun = async (id) => {
    const response = await fetch(`${API_URL}/akun/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  };
  