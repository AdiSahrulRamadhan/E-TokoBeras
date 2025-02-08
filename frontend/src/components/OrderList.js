// import React, { useState, useEffect } from 'react';

// function OrderList() {
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     // Ambil data pesanan dari API (menggunakan fetch)
//     fetch('http://localhost:4000/pesanan')
//       .then((res) => res.json())
//       .then((data) => setOrders(data));
//   }, []);

//   const handleConfirmOrder = (orderId) => {
//     fetch('http://localhost:4000/konfirmasi', {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ id: orderId, status: 'dikirim' }),
//     }).then((res) => res.json());
//   };

//   return (
//     <div>
//       <h2>Daftar Pesanan</h2>
//       <ul>
//         {orders.map((order) => (
//           <li key={order.id}>
//             Pesanan ID: {order.id} | Produk ID: {order.id_produk} | Jumlah: {order.jumlah} | Status: {order.status}
//             <button onClick={() => handleConfirmOrder(order.id)}>Konfirmasi Pengiriman</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default OrderList;
