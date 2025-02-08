import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const [metodePembayaran, setMetodePembayaran] = useState('');
  const [nomorRekening, setNomorRekening] = useState('');

  useEffect(() => {
    const items = location.state?.items || [];
    console.log('Initial items from location.state:', items);
    setSelectedItems(items);
  }, [location.state]);

  const processOrder = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Silakan login terlebih dahulu.');
      return;
    }
  
    if (!metodePembayaran.trim()) {
      alert('Metode pembayaran harus diisi.');
      return;
    }
  
    if (!nomorRekening.trim() || isNaN(nomorRekening)) {
      alert('Nomor rekening harus berupa angka.');
      return;
    }
  
    const validItems = selectedItems.map((item) => ({
      id_produk: item.id,
      jumlah: item.quantity || 0,
    })).filter((item) => item.jumlah > 0);
  
    if (validItems.length === 0) {
      alert('Tidak ada item valid untuk diproses.');
      return;
    }
  
    const payload = {
      id_pembeli: userId,
      items: validItems,
      metode_pembayaran: metodePembayaran,
      nomor_rekening: nomorRekening,
    };
  
    try {
      const response = await fetch('http://localhost:4000/pesan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        alert('Pesanan berhasil dibuat.');
        navigate('/pesanan');
      } else {
        alert('Terjadi kesalahan saat memproses pesanan.');
      }
    } catch (error) {
      alert('Terjadi kesalahan saat memproses pesanan.');
    }
  };  

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      margin: '20px auto',
      maxWidth: '800px',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    title: {
      textAlign: 'center',
      color: '#333',
      marginBottom: '20px',
    },
    formGroup: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
      color: '#333',
    },
    input: {
      width: '92%',
      padding: '10px',
      fontSize: '14px',
      border: '1px solid #ccc',
      borderRadius: '4px',
    },
    productList: {
      marginTop: '20px',
      listStyleType: 'none',
      padding: '0',
    },
    productItem: {
      backgroundColor: '#f4f4f4',
      marginBottom: '10px',
      padding: '10px',
      borderRadius: '4px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      border: '1px solid #ddd',
    },
    button: {
      marginTop: '20px',
      padding: '10px 20px',
      fontSize: '16px',
      color: 'white',
      backgroundColor: '#4CAF50',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      width: '100%',
    },
    buttonDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Halaman Pembayaran</h2>
      <form>
        <div style={styles.formGroup}>
          <label style={styles.label}>Metode Pembayaran:</label>
          <input
            type="text"
            value={metodePembayaran}
            onChange={(e) => setMetodePembayaran(e.target.value)}
            placeholder="Masukkan metode pembayaran"
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Nomor Rekening:</label>
          <input
            type="text"
            value={nomorRekening}
            onChange={(e) => setNomorRekening(e.target.value)}
            placeholder="Masukkan nomor rekening"
            style={styles.input}
          />
        </div>
        <h3 style={styles.label}>Produk yang Dibeli:</h3>
        <ul style={styles.productList}>
          {selectedItems.map((item) => (
            <li key={item.id} style={styles.productItem}>
              <span>{item.nama} - Rp {item.harga.toLocaleString()} x {item.quantity || 0} kg</span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={processOrder}
          style={metodePembayaran.trim() && nomorRekening.trim() ? styles.button : { ...styles.button, ...styles.buttonDisabled }}
          disabled={!metodePembayaran.trim() || !nomorRekening.trim()}
        >
          Pesan
        </button>
      </form>
    </div>
  );
}

export default PaymentPage;
