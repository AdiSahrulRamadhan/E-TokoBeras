CREATE DATABASE IF NOT EXISTS etokoberas;

USE etokoberas;

-- Tabel untuk akun (pembeli dan penjual)
CREATE TABLE IF NOT EXISTS akun (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('pembeli', 'penjual') NOT NULL
);

-- Tabel untuk produk
CREATE TABLE IF NOT EXISTS produk (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    harga DECIMAL(10,2) NOT NULL,
    stok INT NOT NULL,
    gambar VARCHAR(255)
);

-- Tabel untuk pesanan
CREATE TABLE IF NOT EXISTS pesanan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_pembeli INT NOT NULL,
    id_produk INT NOT NULL,
    jumlah INT NOT NULL,
    status ENUM('menunggu pembayaran', 'dibayar', 'terkirim') DEFAULT 'menunggu pembayaran',
    metode_pembayaran VARCHAR(255), -- Optional: method of payment like bank transfer
    nomor_rekening VARCHAR(255),    -- Optional: the account number for transfer
    FOREIGN KEY (id_pembeli) REFERENCES akun(id),
    FOREIGN KEY (id_produk) REFERENCES produk(id)
);

-- Tabel untuk cart (keranjang belanja)
CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES akun(id),
    FOREIGN KEY (product_id) REFERENCES produk(id)
);

-- Insert data akun pembeli dan penjual
INSERT INTO akun (username, password, role) VALUES ('pembeli1', 'password', 'pembeli');
INSERT INTO akun (username, password, role) VALUES ('penjual1', 'password', 'penjual');

-- Insert data produk
INSERT INTO produk (nama, harga, stok, gambar) VALUES ('Beras Premium', 100000, 50, 'premium.jpg');
INSERT INTO produk (nama, harga, stok, gambar) VALUES ('Beras Organik', 120000, 30, 'organik.jpg');
INSERT INTO produk (nama, harga, stok, gambar) VALUES ('Beras Merakyat', 85000, 100, 'merakyat.jpg'); -- Tambahan produk

