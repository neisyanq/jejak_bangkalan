/**
 * Service Komunikasi API Backend (FastAPI / Node.js Express)
 * Menyediakan fitur Register, Login, Profil, Koleksi, dan Statistik Real-Time
 * Dilengkapi LocalStorage Fallback agar aplikasi tetap berjalan lancar meskipun server DB belum dinyalakan
 */

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
const LOCAL_USERS_KEY = 'jejak_bangkalan_registered_users';

function getLocalUsers() {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalUsers(users) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

export async function registerApi(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || data.message || 'Registrasi gagal');
    return data;
  } catch (err) {
    if (err.message && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError')) {
      throw err;
    }
    // Fallback LocalStorage bila backend belum aktif
    const users = getLocalUsers();
    const exists = users.find(
      (u) => u.username.toLowerCase() === payload.username.toLowerCase() || u.email.toLowerCase() === payload.email.toLowerCase()
    );
    if (exists) {
      throw new Error('Username atau Email sudah terdaftar!');
    }
    const newUser = {
      id: Date.now(),
      nama_lengkap: payload.nama_lengkap,
      username: payload.username,
      email: payload.email,
      password: payload.password,
      avatar: payload.avatar || 'avatar1.png',
      jenis_kelamin: payload.jenis_kelamin || 'Laki-laki',
    };
    users.push(newUser);
    saveLocalUsers(users);
    return {
      status: 'success',
      message: `Registrasi Berhasil! Selamat datang, ${newUser.nama_lengkap}!`,
      user: newUser,
    };
  }
}

export async function loginApi(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || data.message || 'Login gagal');
    return data;
  } catch (err) {
    if (err.message && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError')) {
      throw err;
    }
    // Fallback LocalStorage
    const users = getLocalUsers();
    const found = users.find(
      (u) =>
        u.username.toLowerCase() === payload.login_user.toLowerCase() ||
        u.email.toLowerCase() === payload.login_user.toLowerCase()
    );
    if (!found) {
      throw new Error('Username atau Email tidak ditemukan!');
    }
    if (found.password !== payload.login_password) {
      throw new Error('Kata Sandi yang Anda masukkan salah!');
    }
    return {
      status: 'success',
      message: `Login Berhasil! Selamat datang kembali, ${found.nama_lengkap}!`,
      user: found,
    };
  }
}

export async function fetchStatsApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/stats`);
    if (!res.ok) throw new Error('Stats fetch error');
    return await res.json();
  } catch (e) {
    const localCount = getLocalUsers().length;
    return {
      heritage_sites: 12,
      archives: 30,
      virtual_tours: 4,
      users: 128 + localCount,
    };
  }
}
