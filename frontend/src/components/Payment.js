import React from 'react';

function Payment({ cart, totalPrice, onConfirmPayment }) {
  return (
    <div>
      <h2>Proses Pembayaran</h2>
      {cart.length === 0 ? (
        <p>Keranjang Anda kosong, tidak ada produk untuk dibayar.</p>
      ) : (
        <div>
          <h3>Total Harga: Rp {totalPrice.toLocaleString()}</h3>
          <ul>
            {cart.map(item => (
              <li key={item.id}>
                {item.nama} - Rp {item.harga.toLocaleString()} x {item.jumlah} kg
              </li>
            ))}
          </ul>
          <button onClick={onConfirmPayment}>Konfirmasi Pembayaran</button>
        </div>
      )}
    </div>
  );
}

export default Payment;
