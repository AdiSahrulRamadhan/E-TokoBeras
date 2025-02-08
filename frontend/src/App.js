import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, Link, Navigate } from 'react-router-dom';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Login from './components/Login';
import Register from './components/Register';
import PaymentPage from './components/PaymentPage';
import PesananPage from './components/PesananPage';
import DataProduk from './components/DataProduk'; // Untuk penjual
import DataPesanan from './components/DataPesanan'; // Untuk penjual
import DataAkun from './components/DataAkun'; // Untuk penjual
import { login, getProduk, getCart, addToCart, removeFromCart } from './api';
import styled from 'styled-components';

const Navbar = styled.nav`
  background-color: #3f51b5;
  color: white;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoTitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LogoImage = styled.img`
  width: 70px;
  height: 70px;
  object-fit: contain;
`;

const Button = styled.button`
  background-color: #f44336;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #e53935;
  }
  margin-left: 20px;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 16px;

  &:hover {
    background-color: #3f5142;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #3f51b5;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SidebarLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 18px;
  padding: 10px;
  border-radius: 5px;

  &:hover {
    background-color: #5c6bc0;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
`;

const Footer = styled.footer`
  background-color: black;
  color: white;
  text-align: center;
  padding: 10px;
  margin-top: auto;
`;

const HeaderTitle = styled.h1`
  font-family: 'Roboto', sans-serif;
  font-size: 2.5rem;
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

const SubHeaderTitle = styled.h2`
  font-family: 'Roboto', sans-serif;
  font-size: 1.8rem;
  text-align: center;
  color: #555;
  margin-bottom: 15px;
`;

const Title = styled.h1`
  font-size: 30px;
  font-family: 'Roboto', sans-serif;
  margin-left: 0;
`;

function App() {
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (role === 'pembeli') {
      fetchCart();
      fetchProducts();
    }
  }, [role]);

  const fetchCart = async () => {
    const userId = localStorage.getItem('userId');
    const cartData = await getCart(userId);
    setCart(cartData);
  };

  const fetchProducts = async () => {
    const productData = await getProduk();
    setProducts(productData);
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await login(username, password);
      if (response.error) {
        alert('Login Gagal!');
      } else {
        setRole(response.role);
        localStorage.setItem('role', response.role);
        localStorage.setItem('userId', response.id);
        navigate('/home');
      }
    } catch (error) {
      alert('kesalahan saat login!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setRole(null);
    setCart([]);
    navigate('/login');
  };

  const handleAddToCart = async (product) => {
    const userId = localStorage.getItem('userId');
    const response = await addToCart(userId, product.id, 1);
    if (response.message) {
      fetchCart();
      alert('Produk Ditambahkan Ke Keranjang!');
    }
  };

  const handleRemoveFromCart = async (id) => {
    const userId = localStorage.getItem('userId');
    try {
      const response = await removeFromCart(userId, id);
      if (response.message) {
        fetchCart();
        alert('Produk berhasil dihapus dari keranjang!');
      } else {
        alert('Gagal menghapus produk dari keranjang: ' + response.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat menghapus produk.');
    }
  };

  const handlePayment = (metodePembayaran, nomorRekening) => {
    alert(`Pembayaran berhasil dengan metode ${metodePembayaran}. Nomor rekening: ${nomorRekening}`);
    navigate('/home');
  };

  return (
    <Container>
      <Navbar>
        <LogoTitleContainer>
          <LogoImage src="/images/logo.png" alt="Logo" />
          <Title>E-Toko Beras</Title>
        </LogoTitleContainer>
        <NavLinks>
          {role && role === 'pembeli' && (
            <>
              <NavLink to="/home">Home</NavLink>
              <NavLink to="/keranjang">Keranjang</NavLink>
              <NavLink to="/pesanan">Pesanan</NavLink>
            </>
          )}
          {role ? (
            <>
              <span className="text-white me-3">Welcome, {role}</span>
              <Button onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </NavLinks>
      </Navbar>

      <div style={{ display: 'flex', flex: 1 }}>
        {role === 'penjual' && (
          <Sidebar>
            <SidebarLink to="/data-produk">Data Produk</SidebarLink>
            <SidebarLink to="/data-pesanan">Data Pesanan</SidebarLink>
            <SidebarLink to="/data-akun">Data Akun</SidebarLink>
          </Sidebar>
        )}

        <Content>
          <Routes>
            <Route
              path="/home"
              element={
                role === 'pembeli' ? (
                  <div>
                    <HeaderTitle>Welcome, Pembeli!</HeaderTitle>
                    <SubHeaderTitle>Daftar Produk</SubHeaderTitle>
                    <ProductList products={products} onAddToCart={handleAddToCart} />
                  </div>
                ) : (
                  <Navigate to="/data-produk" />
                )
              }
            />
            <Route
              path="/data-produk"
              element={role === 'penjual' ? <DataProduk /> : <Navigate to="/login" />}
            />
            <Route
              path="/data-pesanan"
              element={role === 'penjual' ? <DataPesanan /> : <Navigate to="/login" />}
            />
            <Route
              path="/data-akun"
              element={role === 'penjual' ? <DataAkun /> : <Navigate to="/login" />}
            />
            <Route
              path="/keranjang"
              element={
                role === 'pembeli' ? <Cart cart={cart} onRemoveFromCart={handleRemoveFromCart} /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/pesanan"
              element={
                role === 'pembeli' ? <PesananPage /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/payment"
              element={
                role === 'pembeli' ? <PaymentPage cart={cart} onPayment={handlePayment} /> : <Navigate to="/login" />
              }
            />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Content>
      </div>

      <Footer>
        <p>&copy; 2024 E-Toko Beras. Semua Hak Dilindungi.</p>
      </Footer>
    </Container>
  );
}

export default App;
