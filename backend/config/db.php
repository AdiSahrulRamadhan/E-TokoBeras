<?php
$host = 'localhost';  // Ganti dengan 'localhost' atau IP server jika tidak menggunakan Docker
$dbname = 'etokoberas';
$username = 'root';  // Ganti dengan username MySQL Anda
$password = '';  // Ganti dengan password MySQL Anda jika ada

try {
    // Menggunakan PDO untuk koneksi ke database
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // Menangani error dengan pengecualian
} catch (PDOException $e) {
    // Menampilkan pesan error jika koneksi gagal
    die("Koneksi gagal: " . $e->getMessage());
}
?>
