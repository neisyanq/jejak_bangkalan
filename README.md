# Jejak Bangkalan Heritage (React JSX + Node.js + FastAPI RAG AI)

Arsitektur Full-Stack Modern untuk platform pelestarian budaya **Jejak Bangkalan Heritage**. Seluruh tampilan visual, animasi, peta interaktif Leaflet, Virtual Tour 360, Game Edukasi (Peta Level, Kuis, Labirin 3D/Canvas, Petualangan Laut Sakera), dan Chatbot Asisten Cerdas RAG AI dipertahankan **100% identik** dengan peningkatan struktur kode yang rapi, modular, dan profesional.

---

## Susunan Struktur Folder (`jejak_bangkalan/`)

```text
jejak_bangkalan/
├── front-end/                          # FRONTEND (React 18 JSX + Vite + CSS Modular)
│   ├── public/
│   │   └── img/                        # Tempat seluruh aset gambar, logo, museum, sound, & data 360
│   ├── src/
│   │   ├── assets/styles/              # CSS Modular untuk masing-masing halaman
│   │   │   ├── beranda.css
│   │   │   ├── warisanBudaya.css
│   │   │   ├── virtualTour.css
│   │   │   ├── game.css
│   │   │   ├── labirin.css
│   │   │   ├── laut.css
│   │   │   ├── asistenCerdas.css
│   │   │   └── tentangKami.css
│   │   ├── components/
│   │   │   └── LoadingScreen.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # State Login/Register/Profil User
│   │   ├── data/
│   │   │   └── heritageData.js         # Data Koleksi Museum (30 item) & Warisan Budaya (29 item)
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx
│   │   ├── pages/                      # Komponen Halaman React (JSX)
│   │   │   ├── BerandaPage.jsx         # Dari index.php
│   │   │   ├── WarisanBudayaPage.jsx   # Dari warisan_budaya.php
│   │   │   ├── VirtualTourPage.jsx     # Dari virtual_tour.php
│   │   │   ├── GamePage.jsx            # Dari game.php
│   │   │   ├── LabirinPage.jsx         # Dari labirin.php
│   │   │   ├── LautPage.jsx            # Dari laut.php
│   │   │   ├── AsistenCerdasPage.jsx   # Dari asisten_cerdas.php
│   │   │   └── TentangKamiPage.jsx     # Dari tentang_kami.php
│   │   ├── services/
│   │   │   ├── apiService.js           # Client API Auth & Statistik (dengan LocalStorage Fallback)
│   │   │   └── ragService.js           # Client API Chatbot RAG AI
│   │   ├── utils/
│   │   │   ├── authDomSync.js          # Pengganti koneksi.php di sisi client
│   │   │   ├── navigationHelper.js     # Router SPA tanpa reload halaman
│   │   │   └── *Controller.js          # Controller JS untuk tiap halaman
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── script.js
│   │   └── style.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── back-end/                           # BACKEND UTAMA (FastAPI + Node.js Express)
│   ├── app/
│   │   ├── ai/                         # Modul RAG AI terintegrasi
│   │   ├── Controllers/                # Logic Register & Login (Pengganti koneksi.php)
│   │   ├── core/                       # Konfigurasi & koneksi SQLite/MySQL
│   │   ├── routers/                    # Endpoint /api/auth/*, /api/stats, /api/heritage
│   │   └── schemas/                    # Validasi Pydantic
│   ├── migrations/
│   │   └── 001_init_jejak_bangkalan.sql
│   ├── node-server/                    # Alternatif Backend menggunakan Node.js + Express
│   │   ├── server.js
│   │   └── package.json
│   ├── .env.example
│   ├── main.py                         # Entrypoint Server FastAPI (Port 8000)
│   └── requirements.txt
│
├── rag-heritage/                       # STANDALONE SERVICE AI RAG (ChromaDB + Gemini)
│   ├── data/
│   │   └── knowledge_base.json         # Basis pengetahuan 59 dokumen sejarah & budaya Bangkalan
│   ├── tests/
│   │   └── pertanyaan_uji.json
│   ├── .env.example
│   ├── .gitignore
│   ├── api.py
│   ├── chat_terminal.py
│   ├── config.py
│   ├── indexing.py
│   ├── rag.py
│   └── requirements.txt
│
├── database/
│   └── jejak_bangkalan.db              # Database SQLite siap pakai (terisi data awal)
├── docker-compose.yml
└── package.json
```

---

## Cara Menjalankan Proyek

### 1. Menyiapkan Aset Gambar & Suara
Salin folder `public/` (berisi `img/`, `sound/`, `logo/`, `museum/`) dan folder `data/` (Virtual Tour 360) dari proyek lama Anda ke dalam `front-end/public/`.

### 2. Menjalankan Backend & RAG AI (Port 8000)
```bash
cd back-end
cp .env.example .env
# Isi GEMINI_API_KEY Anda di dalam file .env
pip install -r requirements.txt

# (Opsional) Jalankan indexing ke ChromaDB bila belum terindeks:
python ../rag-heritage/indexing.py

# Jalankan server Backend + RAG AI:
python main.py
```
*(Atau jika ingin menjalankan backend versi Node.js Express: `cd back-end/node-server && npm install && npm start`)*

### 3. Menjalankan Frontend React JSX (Port 5173)
```bash
cd front-end
npm install
npm run dev
```
Buka `http://localhost:5173` di browser.
