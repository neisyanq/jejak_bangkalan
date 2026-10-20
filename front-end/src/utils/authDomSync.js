/**
 * Modul Sinkronisasi Autentikasi & Sesi Pengguna (Pengganti koneksi.php)
 * Terhubung ke Backend API (/api/auth/login & /api/auth/register) serta fallback LocalStorage
 */
import { loginApi, registerApi, fetchStatsApi } from '../services/apiService';

const STORAGE_KEY = 'jejak_bangkalan_user_session';

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function setCurrentUser(userObj) {
  if (!userObj) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj));
  }
  syncAuthDOM();
}

export function logoutUser(navigate) {
  localStorage.removeItem(STORAGE_KEY);
  syncAuthDOM();
  // Tutup modal Bootstrap jika sedang terbuka
  try {
    const modals = document.querySelectorAll('.modal.show');
    modals.forEach((m) => {
      const instance = window.bootstrap?.Modal?.getInstance(m);
      if (instance) instance.hide();
    });
    document.querySelectorAll('.modal-backdrop').forEach((b) => b.remove());
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');
  } catch (e) {}

  if (navigate) navigate('/');
}

export function syncAuthDOM() {
  const user = getCurrentUser();
  const isLogged = Boolean(user && user.nama_lengkap);

  const fullName = isLogged ? user.nama_lengkap : 'Tamu';
  const firstName = isLogged ? user.nama_lengkap.trim().split(' ')[0] : 'Petualang';
  const username = isLogged ? (user.username || user.nama_lengkap) : 'User Baru';
  const email = isLogged ? (user.email || '-') : 'Belum ada email';
  const jk = isLogged ? (user.jenis_kelamin || '-') : '-';
  const avatar = isLogged && user.avatar ? user.avatar : 'avatar1.png';

  // Global variable untuk game.php & labirin.php
  window.userAvatarGlobal = avatar;

  // Toggle elemen khusus user login vs guest
  document.querySelectorAll('.js-nav-user-wrapper').forEach((el) => {
    el.style.display = isLogged ? 'block' : 'none';
  });
  document.querySelectorAll('.js-auth-logged-in').forEach((el) => {
    el.style.display = isLogged ? 'inline-flex' : 'none';
  });
  document.querySelectorAll('.js-auth-guest').forEach((el) => {
    el.style.display = isLogged ? 'none' : 'inline-flex';
  });

  // Update teks & gambar profil
  document.querySelectorAll('[data-js-user-firstname]').forEach((el) => {
    el.textContent = firstName;
  });
  document.querySelectorAll('[data-js-user-fullname]').forEach((el) => {
    el.textContent = fullName;
  });
  document.querySelectorAll('[data-js-user-username]').forEach((el) => {
    el.textContent = username;
  });
  document.querySelectorAll('[data-js-user-email]').forEach((el) => {
    el.textContent = email;
  });
  document.querySelectorAll('[data-js-user-jk]').forEach((el) => {
    el.textContent = jk;
  });
  document.querySelectorAll('img[data-js-user-avatar]').forEach((img) => {
    img.src = `/img/${avatar}`;
  });

  // Update statistik pengunjung aktif jika ada di halaman Beranda
  fetchStatsApi().then((stats) => {
    if (stats && typeof stats.users === 'number') {
      document.querySelectorAll('.js-stat-users').forEach((el) => {
        el.textContent = String(stats.users);
      });
    }
  }).catch(() => {});
}

export function bindAuthForms(navigate) {
  const forms = document.querySelectorAll('form[method="POST"]');
  forms.forEach((form) => {
    if (form.dataset.boundAuth === 'true') return;
    form.dataset.boundAuth = 'true';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const isRegister = form.querySelector('[name="register_game"]') !== null || formData.has('nama_lengkap');
      const isLogin = form.querySelector('[name="login_game"]') !== null || formData.has('login_user');

      try {
        if (isRegister) {
          const payload = {
            nama_lengkap: formData.get('nama_lengkap'),
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            jenis_kelamin: formData.get('jenis_kelamin') || 'Laki-laki',
            avatar: formData.get('avatar') || 'avatar1.png',
          };
          const res = await registerApi(payload);
          setCurrentUser(res.user);
          alert(res.message || `Registrasi Berhasil! Selamat datang, ${payload.nama_lengkap}!`);
          closeBootstrapModals();
          if (typeof window.openGameMap === 'function') window.openGameMap();
        } else if (isLogin) {
          const payload = {
            login_user: formData.get('login_user'),
            login_password: formData.get('login_password'),
          };
          const res = await loginApi(payload);
          setCurrentUser(res.user);
          alert(res.message || `Login Berhasil! Selamat datang kembali, ${res.user.nama_lengkap}!`);
          closeBootstrapModals();
          if (typeof window.openGameMap === 'function') window.openGameMap();
        }
      } catch (err) {
        alert(err.message || 'Terjadi kesalahan saat memproses autentikasi.');
      }
    });
  });
}

function closeBootstrapModals() {
  try {
    document.querySelectorAll('.modal.show').forEach((m) => {
      const inst = window.bootstrap?.Modal?.getInstance(m);
      if (inst) inst.hide();
    });
    document.querySelectorAll('.modal-backdrop').forEach((b) => b.remove());
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');
  } catch (e) {}
}
