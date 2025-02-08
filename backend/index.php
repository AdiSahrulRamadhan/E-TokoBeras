<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Mengimpor file konfigurasi database
require 'config/db.php';

// Route untuk root path (menampilkan pesan sambutan)
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_SERVER['REQUEST_URI'] === '/') {
    echo 'Selamat Datang di API E-Toko Beras
Gunakan endpoint yang sesuai untuk mendapatkan data.';
    exit; // Pastikan script berhenti di sini agar tidak melanjutkan ke route lain
}

// Fungsi untuk registrasi
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/register') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Cek apakah data yang diperlukan ada
    if (isset($data['username'], $data['password'])) {
        // Hash password
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

        // Insert user ke database
        $stmt = $pdo->prepare('INSERT INTO akun (username, password, role) VALUES (:username, :password, :role)');
        $stmt->execute([
            'username' => $data['username'],
            'password' => $hashedPassword,
            'role' => 'pembeli' // Set role pembeli
        ]);

        echo json_encode(['message' => 'User successfully registered']);
    } else {
        echo json_encode(['error' => 'Required data missing']);
    }
}

// Fungsi untuk login
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/login') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Ambil data user berdasarkan username
    $stmt = $pdo->prepare('SELECT * FROM akun WHERE username = :username');
    $stmt->execute(['username' => $data['username']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($data['password'], $user['password'])) {
        // Jika username ditemukan dan password cocok
        echo json_encode(['message' => 'Login sukses', 'role' => $user['role'], 'id' => $user['id']]);
    } else {
        // Jika username tidak ditemukan atau password salah
        echo json_encode(['error' => 'Username atau password salah']);
    }
}

// Endpoint to fetch all products
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_SERVER['REQUEST_URI'] === '/produk') {
    $stmt = $pdo->query('SELECT * FROM produk');
    $produk = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($produk); // Send the product data as JSON response
}

// Endpoint untuk pemesanan produk (dari pembeli)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/pesan') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Validasi data
    if (isset($data['id_pembeli'], $data['id_produk'], $data['jumlah'], $data['metode_pembayaran'], $data['nomor_rekening'])) {
        try {
            // Tambahkan data ke tabel pesanan
            $stmt = $pdo->prepare('
                INSERT INTO pesanan (id_pembeli, id_produk, jumlah, status, metode_pembayaran, nomor_rekening)
                VALUES (:id_pembeli, :id_produk, :jumlah, :status, :metode_pembayaran, :nomor_rekening)
            ');

            $stmt->execute([
                'id_pembeli' => $data['id_pembeli'],
                'id_produk' => $data['id_produk'],
                'jumlah' => $data['jumlah'],
                'status' => 'dibayar', // Set status menjadi 'dibayar'
                'metode_pembayaran' => $data['metode_pembayaran'],
                'nomor_rekening' => $data['nomor_rekening'],
            ]);

            echo json_encode(['message' => 'Pesanan berhasil diproses']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Gagal memproses pesanan: ' . $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Data pesanan tidak lengkap']);
    }
}


// Route to add a product to the cart
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/cart/add') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Check if required data exists
    if (isset($data['userId'], $data['productId'], $data['quantity'])) {
        $stmt = $pdo->prepare('INSERT INTO cart (user_id, product_id, quantity) VALUES (:user_id, :product_id, :quantity)');
        $stmt->execute([
            'user_id' => $data['userId'],
            'product_id' => $data['productId'],
            'quantity' => $data['quantity']
        ]);
        echo json_encode(['message' => 'Produk Telah ditambahkan Ke Keranjang']);
    } else {
        echo json_encode(['error' => 'Data Permintaan Tidak Valid']);
    }
}

// Route to fetch cart items for a user
if ($_SERVER['REQUEST_METHOD'] === 'GET' && preg_match('/^\/cart\/(\d+)$/', $_SERVER['REQUEST_URI'], $matches)) {
    $userId = $matches[1];
    $stmt = $pdo->prepare('SELECT p.*, c.quantity FROM cart c JOIN produk p ON c.product_id = p.id WHERE c.user_id = :user_id');
    $stmt->execute(['user_id' => $userId]);
    $cartItems = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($cartItems);
}

// Route to remove a product from the cart
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && $_SERVER['REQUEST_URI'] === '/cart/remove') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Ensure that the required data exists
    if (isset($data['userId'], $data['productId'])) {
        $stmt = $pdo->prepare('DELETE FROM cart WHERE user_id = :user_id AND product_id = :product_id');
        $stmt->execute([
            'user_id' => $data['userId'],
            'product_id' => $data['productId']
        ]);

        // Check if any row was deleted
        if ($stmt->rowCount() > 0) {
            echo json_encode(['message' => 'Produk Dihapus Dari Keranjang']);
        } else {
            echo json_encode(['error' => 'Produk Tidak Ada Dikeranjang']);
        }
    } else {
        echo json_encode(['error' => 'Data Permintaan Tidak Valid']);
    }
}
// Route to handle payment processing and update order status
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/pesan') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);

        // Validasi data
        if (!isset($data['id_pembeli'], $data['items'], $data['metode_pembayaran'], $data['nomor_rekening'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Data pesanan tidak lengkap']);
            exit; // Tambahkan exit agar script berhenti di sini
        }

        if (!is_array($data['items']) || count($data['items']) === 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Items tidak valid']);
            exit; // Pastikan hanya satu respons dikirim
        }

        $pdo->beginTransaction();

        // Proses pesanan dan tambahkan ke tabel pesanan
        foreach ($data['items'] as $item) {
            if (!isset($item['id_produk'], $item['jumlah']) || $item['jumlah'] <= 0) {
                $pdo->rollBack(); // Rollback jika item tidak valid
                http_response_code(400);
                echo json_encode(['error' => 'Item tidak valid: ' . json_encode($item)]);
                exit;
            }

            $stmt = $pdo->prepare('
                INSERT INTO pesanan (id_pembeli, id_produk, jumlah, status, metode_pembayaran, nomor_rekening)
                VALUES (:id_pembeli, :id_produk, :jumlah, :status, :metode_pembayaran, :nomor_rekening)
            ');

            $stmt->execute([
                'id_pembeli' => $data['id_pembeli'],
                'id_produk' => $item['id_produk'],
                'jumlah' => $item['jumlah'],
                'status' => 'Pesanan Diproses',
                'metode_pembayaran' => $data['metode_pembayaran'],
                'nomor_rekening' => $data['nomor_rekening'],
            ]);

            // Kurangi stok produk
            $updateStokStmt = $pdo->prepare('
                UPDATE produk SET stok = stok - :jumlah WHERE id = :id_produk AND stok >= :jumlah
            ');

            $updateStokStmt->execute([
                'jumlah' => $item['jumlah'],
                'id_produk' => $item['id_produk'],
            ]);

            if ($updateStokStmt->rowCount() === 0) {
                $pdo->rollBack(); // Rollback jika stok tidak cukup
                http_response_code(400);
                echo json_encode(['error' => 'Stok tidak cukup untuk produk ID: ' . $item['id_produk']]);
                exit;
            }
        }

        // Hapus item dari keranjang
        $stmt = $pdo->prepare('DELETE FROM cart WHERE user_id = :user_id AND product_id = :product_id');
        foreach ($data['items'] as $item) {
            $stmt->execute([
                'user_id' => $data['id_pembeli'],
                'product_id' => $item['id_produk'],
            ]);
        }

        $pdo->commit();

        // Kirim respons sukses
        http_response_code(200);
        echo json_encode(['message' => 'Pesanan berhasil diproses dan item dihapus dari keranjang']);
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['error' => 'Gagal memproses pesanan: ' . $e->getMessage()]);
    }
}

// Route to update payment status
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/payment') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Pastikan data yang diperlukan ada
    if (isset($data['userId'], $data['cartItems'])) {
        foreach ($data['cartItems'] as $item) {
            // Update status pesanan menjadi 'dibayar' untuk item yang ada di keranjang
            $stmt = $pdo->prepare('UPDATE pesanan SET status = "dibayar" WHERE id_pembeli = :user_id AND id_produk = :product_id');
            $stmt->execute([
                'user_id' => $data['userId'],
                'product_id' => $item['product_id']
            ]);
        }
        echo json_encode(['message' => 'Pembayaran berhasil, status pesanan diperbarui']);
    } else {
        echo json_encode(['error' => 'Data Tidak Valid']);
    }
}
// Endpoint to fetch pesanan (orders) including product details and payment info
if ($_SERVER['REQUEST_METHOD'] === 'GET' && preg_match('/^\/pesanan\/(\d+)$/', $_SERVER['REQUEST_URI'], $matches)) {
    $userId = $matches[1];
    try {
        $stmt = $pdo->prepare('
            SELECT pesanan.id, pesanan.jumlah, pesanan.status, pesanan.metode_pembayaran, pesanan.nomor_rekening, 
                   produk.nama AS produk_nama, produk.gambar AS produk_gambar 
            FROM pesanan
            JOIN produk ON pesanan.id_produk = produk.id
            WHERE pesanan.id_pembeli = :id_pembeli
        ');
        $stmt->execute(['id_pembeli' => $userId]);
        $pesanan = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($pesanan); // Output valid JSON
    } catch (Exception $e) {
        echo json_encode(['error' => 'Gagal memuat pesanan']);
    }
}


// Ini Khusus Untuk Penjual
// Add a new product
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/produk') {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $pdo->prepare('INSERT INTO produk (nama, harga, stok) VALUES (:nama, :harga, :stok)');
    $stmt->execute([
        'nama' => $data['nama'],
        'harga' => $data['harga'],
        'stok' => $data['stok'],
    ]);
    echo json_encode(['message' => 'Produk berhasil ditambahkan']);
}

// Update a product
if ($_SERVER['REQUEST_METHOD'] === 'PUT' && preg_match('/^\/produk\/(\d+)$/', $_SERVER['REQUEST_URI'], $matches)) {
    $id = $matches[1];
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $pdo->prepare('UPDATE produk SET nama = :nama, harga = :harga, stok = :stok WHERE id = :id');
    $stmt->execute([
        'id' => $id,
        'nama' => $data['nama'],
        'harga' => $data['harga'],
        'stok' => $data['stok'],
    ]);
    echo json_encode(['message' => 'Produk berhasil diperbarui']);
}

// Delete a product
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && preg_match('/^\/produk\/(\d+)$/', $_SERVER['REQUEST_URI'], $matches)) {
    $id = $matches[1];
    $stmt = $pdo->prepare('DELETE FROM produk WHERE id = :id');
    $stmt->execute(['id' => $id]);
    echo json_encode(['message' => 'Produk berhasil dihapus']);
}
// Endpoint untuk mendapatkan daftar pesanan
if ($_SERVER['REQUEST_METHOD'] === 'GET' && preg_match('/^\/pesanan$/', $_SERVER['REQUEST_URI'])) {
    try {
        $stmt = $pdo->prepare('
            SELECT pesanan.id, pesanan.jumlah, pesanan.status, pesanan.metode_pembayaran, pesanan.nomor_rekening, 
                   produk.nama AS produk_nama, produk.harga AS produk_harga
            FROM pesanan
            JOIN produk ON pesanan.id_produk = produk.id
            WHERE pesanan.status IN ("Pesanan Diproses", "Pesanan Dikirim")
            ORDER BY pesanan.id DESC
        ');
        $stmt->execute();
        $pesanan = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($pesanan);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Gagal mengambil data pesanan: ' . $e->getMessage()]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT' && preg_match('/^\/pesanan\/konfirmasi\/(\d+)$/', $_SERVER['REQUEST_URI'], $matches)) {
    $id = $matches[1];
    try {
        $stmt = $pdo->prepare('UPDATE pesanan SET status = "Pesanan Dikirim" WHERE id = :id');
        $stmt->execute(['id' => $id]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(['message' => 'Pesanan berhasil dikonfirmasi sebagai "Pesanan Dikirim".']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Pesanan tidak ditemukan.']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Gagal mengkonfirmasi pesanan: ' . $e->getMessage()]);
    }
}
// Endpoint untuk menghapus pesanan
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && preg_match('/^\/pesanan\/(\d+)$/', $_SERVER['REQUEST_URI'], $matches)) {
    $id = $matches[1];
    try {
        $stmt = $pdo->prepare('DELETE FROM pesanan WHERE id = :id');
        $stmt->execute(['id' => $id]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(['message' => 'Pesanan berhasil dihapus.']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Pesanan tidak ditemukan.']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Gagal menghapus pesanan: ' . $e->getMessage()]);
    }
}
// Endpoint: GET /akun
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_SERVER['REQUEST_URI'] === '/akun') {
    try {
        $stmt = $pdo->prepare('SELECT id, username, role FROM akun ORDER BY id DESC');
        $stmt->execute();
        $akun = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($akun);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Gagal mengambil data akun: ' . $e->getMessage()]);
    }
}
// Endpoint: POST /akun
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/akun') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['username'], $data['password'], $data['role'])) {
        try {
            $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

            $stmt = $pdo->prepare('INSERT INTO akun (username, password, role) VALUES (:username, :password, :role)');
            $stmt->execute([
                'username' => $data['username'],
                'password' => $hashedPassword,
                'role' => $data['role']
            ]);

            echo json_encode(['message' => 'Akun berhasil ditambahkan']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Gagal menambahkan akun: ' . $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Data tidak lengkap']);
    }
}
// Endpoint: PUT /akun/:id
if ($_SERVER['REQUEST_METHOD'] === 'PUT' && preg_match('/^\/akun\/(\d+)$/', $_SERVER['REQUEST_URI'], $matches)) {
    $id = $matches[1];
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['username'], $data['role'])) {
        try {
            // Update tanpa mengubah password
            $stmt = $pdo->prepare('UPDATE akun SET username = :username, role = :role WHERE id = :id');
            $stmt->execute([
                'username' => $data['username'],
                'role' => $data['role'],
                'id' => $id
            ]);

            echo json_encode(['message' => 'Akun berhasil diperbarui']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Gagal memperbarui akun: ' . $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Data tidak lengkap']);
    }
}
// Endpoint: DELETE /akun/:id
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && preg_match('/^\/akun\/(\d+)$/', $_SERVER['REQUEST_URI'], $matches)) {
    $id = $matches[1];

    try {
        $stmt = $pdo->prepare('DELETE FROM akun WHERE id = :id');
        $stmt->execute(['id' => $id]);

        echo json_encode(['message' => 'Akun berhasil dihapus']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Gagal menghapus akun: ' . $e->getMessage()]);
    }
}

?>
