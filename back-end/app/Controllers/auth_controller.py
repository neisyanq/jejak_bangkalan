import hashlib
from fastapi import HTTPException
from app.core.database import get_db_connection
from app.schemas.schemas import RegisterRequest, LoginRequest

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def register_user(payload: RegisterRequest):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT id FROM users WHERE username = ? OR email = ?",
        (payload.username.strip(), payload.email.strip())
    )
    if cur.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Username atau Email sudah terdaftar!")

    hashed = hash_password(payload.password)
    cur.execute(
        """INSERT INTO users (nama_lengkap, username, email, password, avatar, jenis_kelamin)
           VALUES (?, ?, ?, ?, ?, ?)""",
        (
            payload.nama_lengkap.strip(),
            payload.username.strip(),
            payload.email.strip(),
            hashed,
            payload.avatar or "avatar1.png",
            payload.jenis_kelamin or "Laki-laki",
        ),
    )
    conn.commit()
    user_id = cur.lastrowid
    conn.close()

    return {
        "status": "success",
        "message": f"Registrasi Berhasil! Selamat datang, {payload.nama_lengkap}!",
        "user": {
            "id": user_id,
            "nama_lengkap": payload.nama_lengkap,
            "username": payload.username,
            "email": payload.email,
            "avatar": payload.avatar or "avatar1.png",
            "jenis_kelamin": payload.jenis_kelamin or "Laki-laki",
        },
    }

def login_user(payload: LoginRequest):
    conn = get_db_connection()
    cur = conn.cursor()
    user_or_email = payload.login_user.strip()
    cur.execute(
        "SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1",
        (user_or_email, user_or_email),
    )
    row = cur.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Username atau Email tidak ditemukan!")

    hashed_input = hash_password(payload.login_password)
    if row["password"] != hashed_input and row["password"] != payload.login_password:
        raise HTTPException(status_code=401, detail="Kata Sandi yang Anda masukkan salah!")

    return {
        "status": "success",
        "message": f"Login Berhasil! Selamat datang kembali, {row['nama_lengkap']}!",
        "user": {
            "id": row["id"],
            "nama_lengkap": row["nama_lengkap"],
            "username": row["username"],
            "email": row["email"],
            "avatar": row["avatar"],
            "jenis_kelamin": row["jenis_kelamin"],
        },
    }
