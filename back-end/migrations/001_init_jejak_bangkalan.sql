-- ============================================================================
-- MIGRASI DATABASE JEJAK BANGKALAN HERITAGE (MySQL / MariaDB & SQLite Ready)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS jejak_bangkalan_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE jejak_bangkalan_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_lengkap VARCHAR(150) NOT NULL,
    username VARCHAR(80) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(100) DEFAULT 'avatar1.png',
    jenis_kelamin VARCHAR(30) DEFAULT 'Laki-laki',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS heritage_sites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    cat_label VARCHAR(50) NOT NULL,
    location VARCHAR(150) NOT NULL,
    image VARCHAR(255),
    description TEXT
);

CREATE TABLE IF NOT EXISTS archives (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(150) NOT NULL,
    kategori VARCHAR(50) NOT NULL,
    gambar VARCHAR(255),
    keterangan TEXT
);

CREATE TABLE IF NOT EXISTS virtual_tours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(150) NOT NULL,
    lokasi VARCHAR(150) NOT NULL,
    folder_path VARCHAR(255) NOT NULL
);
