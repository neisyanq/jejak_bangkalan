import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(BASE_DIR / ".env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
CHROMA_DB_DIR = os.getenv("CHROMA_DB_DIR", str(BASE_DIR.parent / "chroma_db"))
SQLITE_DB_PATH = os.getenv("SQLITE_DB_PATH", str(BASE_DIR.parent / "database" / "jejak_bangkalan.db"))
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 8000))
