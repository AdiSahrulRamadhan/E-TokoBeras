import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background-color: #3f51b5;
  color: white;
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
`;

const SidebarLink = styled(Link)`
  color: white;
  text-decoration: none;
  margin: 10px 0;
  font-size: 18px;
  width: 100%;
  text-align: center;
  padding: 10px;
  border-radius: 5px;

  &:hover {
    background-color: #283593;
  }
`;

const Sidebar = () => {
  return (
    <SidebarContainer>
      <h2>Menu Penjual</h2>
      <SidebarLink to="/data-produk">Data Produk</SidebarLink>
      <SidebarLink to="/data-pesanan">Data Pesanan</SidebarLink>
      <SidebarLink to="/data-akun">Data Akun</SidebarLink>
    </SidebarContainer>
  );
};

export default Sidebar;
