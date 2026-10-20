import os
from dotenv import load_dotenv

# Muat variabel dari file .env
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
CHROMA_DB_DIR = os.getenv("CHROMA_DB_DIR", "./chroma_db")
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 8000))

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY tidak ditemukan! Pastikan telah diatur di file .env")