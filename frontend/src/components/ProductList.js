import React, { useState, useEffect } from 'react';
import { addToCart } from '../api'; // Assuming you have an API function to add products to the cart

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from the backend when the component mounts
    const fetchProducts = async () => {
      const response = await fetch('http://localhost:4000/produk'); // Your backend API URL
      const data = await response.json();
      setProducts(data); // Store the fetched data in state
    };

    fetchProducts(); // Call the fetch function
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const handleAddToCart = async (product) => {
    const userId = localStorage.getItem('userId');
    const response = await addToCart(userId, product.id, 1); // Add product to cart with quantity 1
    if (response.message) {
      alert(`${product.nama} has been added to the cart!`);
    }
  };

  return (
    <div className="product-list">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <div className="card h-100 shadow-sm">
            {/* Always use the same image for all products */}
            <img src="/images/background.png" alt="Default Product" />
            <div className="card-body product-info">
              <h5 className="card-title">{product.nama}</h5>
              <p className="card-text">Harga: Rp {product.harga.toLocaleString()}</p>
              <p className="card-text">Stok: {product.stok} kg</p>
              <button className="btn btn-success w-100" onClick={() => handleAddToCart(product)}>
                Tambah ke Keranjang
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
