import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getProduk, addProduk, updateProduk, deleteProduk } from '../api'; // API Helper functions

// Styled Components
const Container = styled.div`
  padding: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  background-color: #f2f2f2;
  text-align: left;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const Button = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #f44336;

  &:hover {
    background-color: #d32f2f;
  }
`;

const FormContainer = styled.div`
  margin: 20px 0;
`;

const Input = styled.input`
  margin: 5px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: calc(100% - 20px);
`;

const PaginationContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
`;

const PaginationButton = styled(Button)`
  background-color: #007bff; /* Warna biru */
  &:hover {
    background-color: #0056b3; /* Warna biru gelap saat hover */
  }
`;

const DataProduk = () => {
  const [produkList, setProdukList] = useState([]); // Menyimpan data produk dari database
  const [form, setForm] = useState({
    nama: '',
    harga: '',
    stok: '',
  });
  const [editId, setEditId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1); // Halaman aktif
  const itemsPerPage = 3; // Batas data per halaman

  // Fetch data produk dari database saat komponen di-mount
  useEffect(() => {
    fetchProduk();
  }, []);

  const fetchProduk = async () => {
    const data = await getProduk(); // Ambil data dari API
    setProdukList(data); // Set data ke state produkList
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddProduk = async () => {
    if (form.nama && form.harga && form.stok) {
      await addProduk(form); // Tambah produk ke database melalui API
      fetchProduk(); // Refresh data produk
      setForm({ nama: '', harga: '', stok: '' }); // Reset form
    } else {
      alert('Mohon isi semua data produk.');
    }
  };

  const handleEditProduk = (produk) => {
    setEditId(produk.id);
    setForm({
      nama: produk.nama,
      harga: produk.harga,
      stok: produk.stok,
    });
  };

  const handleUpdateProduk = async () => {
    if (editId && form.nama && form.harga && form.stok) {
      await updateProduk(editId, form); // Update produk di database
      fetchProduk(); // Refresh data produk
      setEditId(null);
      setForm({ nama: '', harga: '', stok: '' }); // Reset form
    } else {
      alert('Mohon isi semua data produk.');
    }
  };

  const handleDeleteProduk = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      await deleteProduk(id); // Hapus produk dari database
      fetchProduk(); // Refresh data produk
    }
  };

  // Logic for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = produkList.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(produkList.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <Container>
      <h2>Data Produk</h2>
      {/* Form Tambah/Update Produk */}
      <FormContainer>
        <Input
          type="text"
          name="nama"
          placeholder="Nama Produk"
          value={form.nama}
          onChange={handleInputChange}
        />
        <Input
          type="number"
          name="harga"
          placeholder="Harga Produk"
          value={form.harga}
          onChange={handleInputChange}
        />
        <Input
          type="number"
          name="stok"
          placeholder="Stok Produk"
          value={form.stok}
          onChange={handleInputChange}
        />
        {editId ? (
          <Button onClick={handleUpdateProduk}>Update Produk</Button>
        ) : (
          <Button onClick={handleAddProduk}>Tambah Produk</Button>
        )}
      </FormContainer>

      {/* Tabel Data Produk */}
      <Table>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Nama Produk</Th>
            <Th>Harga</Th>
            <Th>Stok</Th>
            <Th>Aksi</Th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((produk) => (
            <tr key={produk.id}>
              <Td>{produk.id}</Td>
              <Td>{produk.nama}</Td>
              <Td>{produk.harga}</Td>
              <Td>{produk.stok}</Td>
              <Td>
                <Button onClick={() => handleEditProduk(produk)}>Edit</Button>
                <DeleteButton onClick={() => handleDeleteProduk(produk.id)}>
                  Hapus
                </DeleteButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <PaginationContainer>
        <PaginationButton onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
        </PaginationButton>
        <span>
            Halaman {currentPage} dari {totalPages}
        </span>
        <PaginationButton onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next
        </PaginationButton>
     </PaginationContainer>
    </Container>
  );
};

export default DataProduk;
