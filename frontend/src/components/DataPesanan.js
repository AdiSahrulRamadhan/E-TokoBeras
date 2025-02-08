import React, { useEffect, useState } from 'react';
import { getFilteredPesanan, confirmPesanan, deletePesanan  } from '../api';
import styled from 'styled-components';

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
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const StatusBadge = styled.span`
  padding: 5px 10px;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  background-color: ${(props) =>
    props.status === 'Pesanan Diproses' ? '#ffc107' : '#4caf50'};
`;

const Button = styled.button`
  padding: 10px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  color: white;
  background-color: ${(props) =>
    props.disabled ? '#2196f3' : '#4caf50'};

  &:hover {
    background-color: ${(props) =>
      props.disabled ? '#1e88e5' : '#45a049'};
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
`;

const PaginationButton = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  color: white;
  background-color: ${(props) => (props.active ? '#2196f3' : '#4caf50')};

  &:hover {
    background-color: ${(props) => (props.active ? '#1e88e5' : '#45a049')};
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const DataPesanan = () => {
  const [pesananList, setPesananList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Jumlah item per halaman

  useEffect(() => {
    fetchPesanan();
  }, []);

  const fetchPesanan = async () => {
    try {
      const data = await getFilteredPesanan();
      setPesananList(data);
    } catch (error) {
      console.error('Failed to fetch pesanan:', error);
    }
  };

  const handleConfirm = async (id) => {
    try {
      await confirmPesanan(id);
      alert('Pesanan berhasil dikonfirmasi sebagai "Pesanan Dikirim".');
      fetchPesanan(); // Refresh data setelah konfirmasi
    } catch (error) {
      console.error('Failed to confirm pesanan:', error);
      alert('Gagal mengkonfirmasi pesanan.');
    }
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = pesananList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(pesananList.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
  const handleDeletePesanan = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pesanan ini?')) {
      try {
        await deletePesanan(id); // Panggil API untuk menghapus pesanan
        fetchPesanan(); // Refresh daftar pesanan setelah penghapusan
        alert('Pesanan berhasil dihapus.');
      } catch (error) {
        console.error(error);
        alert('Terjadi kesalahan saat menghapus pesanan.');
      }
    }
  };
  const DeleteButton = styled(Button)`
  background-color: #f44336;

  &:hover {
    background-color: #d32f2f;
  }
`;

  return (
    <Container>
      <h2>Data Pesanan</h2>
      <Table>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Produk</Th>
            <Th>Jumlah</Th>
            <Th>Harga</Th>
            <Th>Status</Th>
            <Th>Metode Pembayaran</Th>
            <Th>Nomor Rekening</Th>
            <Th>Aksi</Th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((pesanan) => (
            <tr key={pesanan.id}>
              <Td>{pesanan.id}</Td>
              <Td>{pesanan.produk_nama}</Td>
              <Td>{pesanan.jumlah}</Td>
              <Td>{pesanan.produk_harga}</Td>
              <Td>
                <StatusBadge status={pesanan.status}>{pesanan.status}</StatusBadge>
              </Td>
              <Td>{pesanan.metode_pembayaran}</Td>
              <Td>{pesanan.nomor_rekening}</Td>
              <Td>
                {pesanan.status === 'Pesanan Diproses' ? (
                  <Button onClick={() => handleConfirm(pesanan.id)}>Konfirmasi</Button>
                ) : (
                  <Button disabled>Dikirim</Button>
                )}
                <DeleteButton onClick={() => handleDeletePesanan(pesanan.id)}>Hapus</DeleteButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <PaginationContainer>
        <PaginationButton onClick={handlePrevious} disabled={currentPage === 1}>
          Previous
        </PaginationButton>
        {[...Array(totalPages)].map((_, index) => (
          <PaginationButton
            key={index}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </PaginationButton>
        ))}
        <PaginationButton onClick={handleNext} disabled={currentPage === totalPages}>
          Next
        </PaginationButton>
      </PaginationContainer>
    </Container>
  );
};

export default DataPesanan;
