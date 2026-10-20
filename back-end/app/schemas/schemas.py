from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class RegisterRequest(BaseModel):
    nama_lengkap: str
    username: str
    email: str
    password: str
    avatar: Optional[str] = "avatar1.png"
    jenis_kelamin: Optional[str] = "Laki-laki"

class LoginRequest(BaseModel):
    login_user: str
    login_password: str

class ChatRequest(BaseModel):
    message: str = Field(..., description="Pesan pertanyaan dari pengguna")
    realtime: Optional[bool] = True
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    status: str
    answer: str
    sources: List[Dict[str, Any]] = []
