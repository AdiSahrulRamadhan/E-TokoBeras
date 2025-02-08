import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getAkun, addAkun, updateAkun, deleteAkun } from '../api'; // API helper functions

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

const Button = styled.button`
  padding: 10px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  color: white;
  background-color: #4caf50;

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

const Select = styled.select`
  margin: 5px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: calc(100% - 20px);
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

const DataAkun = () => {
  const [akunList, setAkunList] = useState([]);
  const [form, setForm] = useState({
    username: '',
    password: '',
    role: 'pembeli', // Default role
  });
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchAkun();
  }, []);

  const fetchAkun = async () => {
    try {
      const data = await getAkun();
      setAkunList(data);
    } catch (error) {
      console.error('Failed to fetch akun:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleEditAkun = (akun) => {
    setEditId(akun.id);
    setForm({
      username: akun.username,
      password: '', // Kosongkan password untuk keamanan
      role: akun.role,
    });
  };

  const handleAddAkun = async () => {
    if (form.username && form.password && form.role) {
      try {
        await addAkun(form);
        fetchAkun();
        setForm({ username: '', password: '', role: 'pembeli' }); // Reset form
        alert('Akun berhasil ditambahkan.');
      } catch (error) {
        console.error('Failed to add akun:', error);
        alert('Gagal menambahkan akun.');
      }
    } else {
      alert('Mohon isi semua data akun.');
    }
  };
  
  const handleUpdateAkun = async () => {
    if (editId && form.username && form.role) {
      try {
        await updateAkun(editId, form);
        fetchAkun();
        setEditId(null);
        setForm({ username: '', password: '', role: 'pembeli' }); // Reset form
        alert('Akun berhasil diperbarui.');
      } catch (error) {
        console.error('Failed to update akun:', error);
        alert('Gagal memperbarui akun.');
      }
    } else {
      alert('Mohon isi semua data akun.');
    }
  };
  
  const handleDeleteAkun = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus akun ini?')) {
      try {
        await deleteAkun(id);
        fetchAkun();
        alert('Akun berhasil dihapus.');
      } catch (error) {
        console.error('Failed to delete akun:', error);
        alert('Gagal menghapus akun.');
      }
    }
  };
  

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = akunList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(akunList.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <Container>
      <h2>Data Akun</h2>
      <FormContainer>
        <Input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleInputChange}
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleInputChange}
        />
        <Select name="role" value={form.role} onChange={handleInputChange}>
          <option value="pembeli">pembeli</option>
          <option value="penjual">penjual</option>
        </Select>
        {editId ? (
          <Button onClick={handleUpdateAkun}>Update Akun</Button>
        ) : (
          <Button onClick={handleAddAkun}>Tambah Akun</Button>
        )}
      </FormContainer>
      <Table>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Username</Th>
            <Th>Role</Th>
            <Th>Aksi</Th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((akun) => (
            <tr key={akun.id}>
              <Td>{akun.id}</Td>
              <Td>{akun.username}</Td>
              <Td>{akun.role}</Td>
              <Td>
                <Button onClick={() => handleEditAkun(akun)}>Edit</Button>
                <DeleteButton onClick={() => handleDeleteAkun(akun.id)}>Hapus</DeleteButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
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

export default DataAkun;
