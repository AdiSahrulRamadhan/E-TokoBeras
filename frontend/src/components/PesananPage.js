import React, { useState, useEffect } from 'react';
import { getPesanan } from '../api'; // Import API method to fetch orders

const PesananPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null); // State for error handling
  const userId = localStorage.getItem('userId'); // Get the userId from localStorage

  useEffect(() => {
    // Fetch the orders for the logged-in user
    const fetchOrders = async () => {
      try {
        const ordersData = await getPesanan(userId); // Call API method
        if (ordersData.error) {
          setError(ordersData.error);
        } else {
          setOrders(ordersData); // Set fetched orders to state
        }
      } catch (err) {
        setError('Gagal memuat pesanan. Silakan coba lagi.'); // Handle fetch errors
        console.error(err);
      }
    };

    if (userId) {
      fetchOrders();
    } else {
      setError('User ID tidak ditemukan. Silakan login ulang.');
    }
  }, [userId]);

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      margin: '20px auto',
      maxWidth: '800px',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      border: '1px solid #ddd',
      borderRadius: '8px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      border: '1px solid #ddd',
      padding: '10px',
      backgroundColor: '#f2f2f2',
      textAlign: 'left',
    },
    td: {
      border: '1px solid #ddd',
      padding: '10px',
      textAlign: 'left',
    },
    statusDikirim: {
      backgroundColor: 'green',
      color: 'black',
      fontWeight: 'bold',
      padding: '5px 10px',
      borderRadius: '5px',
      textAlign: 'center',
      display: 'inline-block',
    },
    statusProses: {
      backgroundColor: 'orange',
      color: 'black',
      fontWeight: 'bold',
      padding: '5px 10px',
      borderRadius: '5px',
      textAlign: 'center',
      display: 'inline-block',
    },
  };

  return (
    <div style={styles.container}>
      <h2>Pesanan Anda</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
      {orders.length === 0 && !error ? (
        <p>Anda belum memiliki pesanan.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Produk</th>
              <th style={styles.th}>Jumlah</th>
              <th style={styles.th}>Metode Pembayaran</th>
              <th style={styles.th}>Nomor Rekening</th>
              <th style={styles.th}>Status Pesanan</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td style={styles.td}>{order.produk_nama}</td>
                <td style={styles.td}>{order.jumlah} kg</td>
                <td style={styles.td}>{order.metode_pembayaran}</td>
                <td style={styles.td}>{order.nomor_rekening}</td>
                <td style={styles.td}>
                  <span
                    style={
                      order.status === 'Pesanan Dikirim'
                        ? styles.statusDikirim
                        : styles.statusProses
                    }
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PesananPage;
