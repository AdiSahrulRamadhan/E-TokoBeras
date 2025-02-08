import React from 'react';

function ProductItem({ product, onAddToCart }) {
  // Check if the product is missing or incomplete
  if (!product || !product.harga || !product.nama) {
    return <p>Product not available</p>; // Fallback for missing product data
  }

  return (
    <div style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '15px', borderRadius: '8px' }}>
      <h3>{product.nama}</h3>
      {/* Only format harga if it's a valid number */}
      <p>Harga: Rp {product.harga ? product.harga.toLocaleString() : 'N/A'}</p>
      <button 
        onClick={() => onAddToCart(product)} 
        style={{
          padding: '8px 16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Tambah ke Keranjang
      </button>
    </div>
  );
}

export default ProductItem;
