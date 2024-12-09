<?php
require 'db_cfg.php'; // Pastikan Anda sudah menyiapkan koneksi database

// Variabel untuk menampung hasil query dan input query
$queries = [];
$results = [];
$errors = [];
$input_query = ""; // Variabel untuk input query

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['query'])) {
    // Mengambil query dari form POST dan memisahkannya dengan tanda titik koma
    $input_query = $_POST['query']; // Menyimpan input query yang dimasukkan
    $queries = explode(";", $input_query); // Memisahkan query berdasarkan ';'
    
    foreach ($queries as $index => $query) {
        $query = trim($query);  // Menghapus spasi di awal dan akhir

        if (!empty($query)) {
            // Cek apakah query adalah SELECT
            if (stripos($query, "SELECT") === 0) {
                // Cek apakah sudah ada LIMIT dalam query
                if (stripos($query, "LIMIT") === false) {
                    // Menambahkan LIMIT 100 jika tidak ada LIMIT dalam query SELECT
                    $query .= " LIMIT 100";
                } else {
                    // Jika sudah ada LIMIT, kita periksa apakah nilai LIMIT lebih dari 100
                    preg_match('/LIMIT\s+(\d+)/i', $query, $matches);
                    if (isset($matches[1]) && $matches[1] > 100) {
                        // Jika nilai LIMIT lebih besar dari 100, ubah menjadi 100
                        $query = preg_replace('/LIMIT\s+\d+/i', 'LIMIT 100', $query);
                    }
                }

                try {
                    // Menyiapkan dan mengeksekusi query
                    // Menggunakan prepared statements dan parameter binding untuk query SELECT
                    $stmt = $pdo->prepare($query);

                    // Menjalankan query dengan parameter binding jika diperlukan
                    $stmt->execute();

                    // Menyimpan hasil query jika ada
                    $results[] = [
                        'query' => $query,
                        'data'  => $stmt->fetchAll(PDO::FETCH_ASSOC),
                        'id'    => 'table_' . $index // ID unik berdasarkan urutan
                    ];
                } catch (PDOException $e) {
                    // Menangani error query
                    $errors[] = "Terjadi kesalahan dalam query: " . $query . " - " . $e->getMessage();
                }
            } else {
                // Menambahkan error jika query bukan SELECT
                $errors[] = "Query tidak valid. Hanya query SELECT yang diperbolehkan.";
            }
        }
    }

    // Mengirimkan hasil query atau error dalam format JSON
    echo json_encode([
        'results' => $results,
        'errors'  => $errors
    ]);
}
?>
