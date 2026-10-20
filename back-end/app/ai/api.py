from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uvicorn

from config import HOST, PORT
from rag import query_rag

app = FastAPI(
    title="API RAG Jejak Bangkalan Heritage",
    description="Backend Service RAG untuk Asisten Cerdas Jejak Bangkalan",
    version="1.0.0"
)

# Mengizinkan akses dari front-end PHP (Localhost / Laragon / XAMPP)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str = Field(
        ...,
        json_schema_extra={"example": "Ceritakan sejarah Masjid Agung Bangkalan"},
        description="Pesan pertanyaan dari pengguna"
    )

class ChatResponse(BaseModel):
    status: str
    answer: str
    sources: list

@app.get("/", tags=["Health Check"])
def root_check():
    return {
        "status": "online",
        "service": "RAG Heritage Bangkalan API",
        "version": "1.0.0"
    }


@app.post("/chat", response_model=ChatResponse, tags=["Chatbot RAG"])
def handle_chat(payload: ChatRequest):
    user_msg = payload.message.strip()

    if not user_msg:
        raise HTTPException(
            status_code=400,
            detail="Pesan tidak boleh kosong."
        )

    try:
        rag_result = query_rag(user_msg)

        return ChatResponse(
            status="success",
            answer=rag_result["answer"],
            sources=rag_result["sources"]
        )

    except Exception as err:
        print(
            f"[ERROR] Gagal memproses /chat: "
            f"{type(err).__name__}: {err}"
        )

        error_message = str(err).lower()

        if any(
            marker in error_message
            for marker in (
                "503",
                "unavailable",
                "high demand",
                "resource_exhausted",
                "429"
            )
        ):
            raise HTTPException(
                status_code=503,
                detail=(
                    "Layanan AI sedang sibuk atau tidak tersedia. "
                    "Silakan coba kembali beberapa saat lagi."
                )
            )

        raise HTTPException(
            status_code=500,
            detail=(
                "Terjadi kendala saat memproses pertanyaan. "
                "Silakan coba kembali."
            )
        )


if __name__ == "__main__":
    print(f"=== Menjalankan Server API RAG Heritage di http://{HOST}:{PORT} ===")
    uvicorn.run("api:app", host=HOST, port=PORT, reload=True)