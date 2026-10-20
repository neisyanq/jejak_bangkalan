from fastapi import APIRouter
from app.schemas.schemas import RegisterRequest, LoginRequest
from app.Controllers.auth_controller import register_user, login_user
from app.core.database import get_db_connection

router = APIRouter(prefix="/api", tags=["Auth & Heritage Data"])

@router.post("/auth/register")
def api_register(payload: RegisterRequest):
    return register_user(payload)

@router.post("/auth/login")
def api_login(payload: LoginRequest):
    return login_user(payload)

@router.get("/stats")
def api_stats():
    conn = get_db_connection()
    cur = conn.cursor()
    heritage_count = cur.execute("SELECT COUNT(id) FROM heritage_sites").fetchone()[0]
    archives_count = cur.execute("SELECT COUNT(id) FROM archives").fetchone()[0]
    vt_count = cur.execute("SELECT COUNT(id) FROM virtual_tours").fetchone()[0]
    users_count = cur.execute("SELECT COUNT(id) FROM users").fetchone()[0]
    conn.close()
    return {
        "heritage_sites": heritage_count,
        "archives": archives_count,
        "virtual_tours": vt_count,
        "users": users_count,
    }

@router.get("/heritage")
def api_heritage():
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM heritage_sites").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.get("/archives")
def api_archives():
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM archives").fetchall()
    conn.close()
    return [dict(r) for r in rows]
