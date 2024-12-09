<?php
// Setelan konfigurasi koneksi database
$host = 'localhost';       // Ganti dengan alamat host database Anda
$username = 'root';        // Ganti dengan username database Anda
$password = '123456';            // Ganti dengan password database Anda

try {
    $dsn = "mysql:host=$host;";
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    error_log("Koneksi database gagal: " . $e->getMessage());
    echo "Terjadi masalah pada server. Silakan coba lagi nanti.";
    exit();
}
?>
