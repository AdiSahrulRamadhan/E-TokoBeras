import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Cart({ cart, onRemoveFromCart }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  const handleCheckboxChange = (item, isChecked) => {
    if (isChecked) {
      setSelectedItems((prevSelectedItems) => [...prevSelectedItems, item]);
    } else {
      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.filter((selectedItem) => selectedItem.id !== item.id)
      );
    }
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert('Silakan pilih produk yang ingin dibeli.');
    } else {
      navigate('/payment', { state: { items: selectedItems } });
    }
  };

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      margin: '20px auto',
      maxWidth: '800px',
    },
    title: {
      textAlign: 'center',
      color: '#333',
      marginBottom: '20px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px',
    },
    th: {
      border: '1px solid #ddd',
      padding: '10px',
      textAlign: 'left',
      backgroundColor: '#4CAF50',
      color: 'white',
    },
    td: {
      border: '1px solid #ddd',
      padding: '10px',
      textAlign: 'left',
    },
    rowEven: {
      backgroundColor: '#f2f2f2',
    },
    rowHover: {
      cursor: 'pointer',
    },
    buttonHapus: {
      padding: '5px 10px',
      color: 'white',
      backgroundColor: 'red',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    buttonHapusHover: {
      backgroundColor: 'darkred',
    },
    buttonProses: {
      marginTop: '20px',
      padding: '10px 20px',
      color: 'white',
      backgroundColor: '#4CAF50',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      display: 'block',
      width: '100%',
      fontSize: '16px',
    },
    buttonProsesDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Keranjang Belanja</h2>
      {cart.length === 0 ? (
        <p>Keranjang belanja Anda kosong</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Pilih</th>
              <th style={styles.th}>Nama Produk</th>
              <th style={styles.th}>Harga</th>
              <th style={styles.th}>Jumlah</th>
              <th style={styles.th}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, index) => (
              <tr
                key={item.id}
                style={index % 2 === 0 ? styles.rowEven : null}
              >
                <td style={styles.td}>
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      handleCheckboxChange(item, e.target.checked)
                    }
                    checked={selectedItems.some(
                      (selectedItem) => selectedItem.id === item.id
                    )}
                  />
                </td>
                <td style={styles.td}>{item.nama}</td>
                <td style={styles.td}>
                  Rp {item.harga.toLocaleString()} / Kg
                </td>
                <td style={styles.td}>{item.quantity}</td>
                <td style={styles.td}>
                  <button
                    onClick={() => onRemoveFromCart(item.id)}
                    style={styles.buttonHapus}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
        onClick={handleCheckout}
        disabled={selectedItems.length === 0}
        style={
          selectedItems.length === 0
            ? { ...styles.buttonProses, ...styles.buttonProsesDisabled }
            : styles.buttonProses
        }
      >
        Proses Pembayaran
      </button>
    </div>
  );
}

export default Cart;
