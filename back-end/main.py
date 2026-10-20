import sys
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Tambahkan folder app/ai agar modul rag.py & config.py dapat diimpor langsung
AI_DIR = Path(__file__).resolve().parent / "app" / "ai"
if str(AI_DIR) not in sys.path:
    sys.path.insert(0, str(AI_DIR))

from app.core.config import HOST, PORT
from app.schemas.schemas import ChatRequest, ChatResponse
from app.routers.api_router import router as api_router

app = FastAPI(
    title="Jejak Bangkalan Heritage - Unified Backend & RAG AI API",
    description="REST API untuk Autentikasi Game, Katalog Budaya, Statistik, dan Chatbot RAG Gemini",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get("/", tags=["Health Check"])
def root_check():
    return {
        "status": "online",
        "service": "Jejak Bangkalan Heritage Backend & RAG AI",
        "version": "2.0.0",
    }

@app.post("/chat", response_model=ChatResponse, tags=["Chatbot RAG"])
def handle_chat(payload: ChatRequest):
    user_msg = payload.message.strip()
    if not user_msg:
        raise HTTPException(status_code=400, detail="Pesan tidak boleh kosong.")

    try:
        from rag import query_rag
        rag_result = query_rag(user_msg)
        return ChatResponse(
            status="success",
            answer=rag_result["answer"],
            sources=rag_result.get("sources", []),
        )
    except Exception as err:
        err_str = str(err).lower()
        if any(m in err_str for m in ("503", "unavailable", "high demand", "resource_exhausted", "429")):
            raise HTTPException(
                status_code=503,
                detail="Layanan AI sedang sibuk atau mencapai batas kuota. Silakan coba kembali beberapa saat lagi.",
            )
        raise HTTPException(
            status_code=500,
            detail=f"Terjadi kendala saat memproses pertanyaan: {err}",
        )

if __name__ == "__main__":
    print(f"=== Menjalankan Server Backend & RAG Jejak Bangkalan di http://{HOST}:{PORT} ===")
    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)
