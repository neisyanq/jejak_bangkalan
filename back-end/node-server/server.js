/**
 * Server Backend Node.js (Express) - Jejak Bangkalan Heritage
 * Menggantikan koneksi.php (Register, Login, Profil, Statistik, Katalog) & terhubung ke layanan RAG AI
 */
import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.NODE_PORT || 5000;
const RAG_PYTHON_URL = process.env.RAG_PYTHON_URL || 'http://127.0.0.1:8000/chat';
const DB_PATH = path.resolve(__dirname, '../../database/jejak_bangkalan.db');

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database(DB_PATH);

function hashPassword(pw) {
  return crypto.createHash('sha256').update(String(pw)).digest('hex');
}

app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Jejak Bangkalan Heritage - Node.js Express API',
    version: '2.0.0',
  });
});

// Endpoint Statistik Real-Time (Pengganti query COUNT di index.php)
app.get('/api/stats', (req, res) => {
  db.get(
    `SELECT
      (SELECT COUNT(id) FROM heritage_sites) AS heritage_sites,
      (SELECT COUNT(id) FROM archives) AS archives,
      (SELECT COUNT(id) FROM virtual_tours) AS virtual_tours,
      (SELECT COUNT(id) FROM users) AS users`,
    [],
    (err, row) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(row);
    }
  );
});

// Endpoint Registrasi Game (Pengganti $_POST['register_game'] di koneksi.php)
app.post('/api/auth/register', (req, res) => {
  const { nama_lengkap, username, email, password, avatar = 'avatar1.png', jenis_kelamin = 'Laki-laki' } = req.body;
  if (!nama_lengkap || !username || !email || !password) {
    return res.status(400).json({ detail: 'Seluruh kolom wajib diisi!' });
  }

  db.get('SELECT id FROM users WHERE username = ? OR email = ?', [username, email], (err, row) => {
    if (err) return res.status(500).json({ detail: err.message });
    if (row) return res.status(400).json({ detail: 'Username atau Email sudah terdaftar!' });

    const hashed = hashPassword(password);
    db.run(
      'INSERT INTO users (nama_lengkap, username, email, password, avatar, jenis_kelamin) VALUES (?, ?, ?, ?, ?, ?)',
      [nama_lengkap, username, email, hashed, avatar, jenis_kelamin],
      function (insertErr) {
        if (insertErr) return res.status(500).json({ detail: insertErr.message });
        res.json({
          status: 'success',
          message: `Registrasi Berhasil! Selamat datang, ${nama_lengkap}!`,
          user: { id: this.lastID, nama_lengkap, username, email, avatar, jenis_kelamin },
        });
      }
    );
  });
});

// Endpoint Login Game (Pengganti $_POST['login_game'] di koneksi.php)
app.post('/api/auth/login', (req, res) => {
  const { login_user, login_password } = req.body;
  db.get('SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1', [login_user, login_user], (err, row) => {
    if (err) return res.status(500).json({ detail: err.message });
    if (!row) return res.status(404).json({ detail: 'Username atau Email tidak ditemukan!' });

    const hashed = hashPassword(login_password);
    if (row.password !== hashed && row.password !== login_password) {
      return res.status(401).json({ detail: 'Kata Sandi yang Anda masukkan salah!' });
    }

    res.json({
      status: 'success',
      message: `Login Berhasil! Selamat datang kembali, ${row.nama_lengkap}!`,
      user: {
        id: row.id,
        nama_lengkap: row.nama_lengkap,
        username: row.username,
        email: row.email,
        avatar: row.avatar,
        jenis_kelamin: row.jenis_kelamin,
      },
    });
  });
});

// Endpoint Proxy /chat ke Layanan Python RAG AI
app.post('/chat', async (req, res) => {
  try {
    const response = await fetch(RAG_PYTHON_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(503).json({
      detail: 'Layanan RAG AI belum aktif. Pastikan server Python FastAPI dijalankan di port 8000.',
    });
  }
});

app.listen(PORT, () => {
  console.log(`=== Node.js Express Backend berjalan di http://localhost:${PORT} ===`);
});
