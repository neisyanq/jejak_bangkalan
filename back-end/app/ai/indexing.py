
import json

import os

import chromadb

from google import genai

from config import GEMINI_API_KEY, CHROMA_DB_DIR



def run_indexing():

    print("=== MEMULAI PROSES INDEXING RAG HERITAGE ===")



    # Inisialisasi Google GenAI Client

    client = genai.Client(api_key=GEMINI_API_KEY)



    # Path file Knowledge Base JSON

    base_dir = os.path.dirname(os.path.abspath(__file__))

    json_path = os.path.join(base_dir, "data", "knowledge_base.json")



    if not os.path.exists(json_path):

        raise FileNotFoundError(f"File data pengetahuan tidak ditemukan di: {json_path}")



    with open(json_path, "r", encoding="utf-8") as f:

        documents_data = json.load(f)



    # Inisialisasi Client Persistent ChromaDB

    chroma_client = chromadb.PersistentClient(path=CHROMA_DB_DIR)



    # Buat atau ambil koleksi 'bangkalan_heritage'

    collection = chroma_client.get_or_create_collection(name="bangkalan_heritage")



    ids = []

    documents = []

    metadatas = []

    embeddings = []



    print(f"Membaca {len(documents_data)} item dokumen...")



    for idx, item in enumerate(documents_data, 1):

        doc_id = str(item.get("id", f"doc_{idx}"))



        # Ekstraksi field dengan fleksibilitas tinggi (support schema: situs, topik, isi)

        situs = str(item.get("situs") or "").strip()

        topik = str(item.get("topik") or "").strip()



        # Penentuan Title

        title = item.get("title") or item.get("judul")

        if not title:

            if situs and topik:

                title = f"{situs} - {topik}"

            elif situs:

                title = situs

            elif topik:

                title = topik

            else:

                title = f"Dokumen {doc_id}"



        # Penentuan Category

        category = item.get("category") or item.get("kategori") or situs or item.get("jenis") or "Umum"



        # Penentuan Isi/Content

        content = item.get("content") or item.get("isi")



        # Jika content kosong, lewati item tersebut

        if not content:

            print(f"[PERINGATAN] Item ke-{idx} (ID: {doc_id}) dilewati karena tidak memiliki isi/content yang valid.")

            continue



        text_content = f"Judul: {title}\nKategori: {category}\nIsi: {content}"



        try:

            embed_res = client.models.embed_content(

                model="gemini-embedding-001",

                contents=text_content

            )



            # Ekstraksi nilai vektor secara fleksibel berdasarkan respon SDK google-genai

            if hasattr(embed_res, "embeddings") and embed_res.embeddings:

                embedding_vector = embed_res.embeddings[0].values

            elif hasattr(embed_res, "embedding") and hasattr(embed_res.embedding, "values"):

                embedding_vector = embed_res.embedding.values

            elif hasattr(embed_res, "embedding"):

                embedding_vector = embed_res.embedding

            else:

                raise AttributeError("Objek respon embedding tidak memiliki atribut 'embeddings' maupun 'embedding'.")



            ids.append(doc_id)

            documents.append(text_content)

            metadatas.append({

                "title": str(title),

                "category": str(category)

            })

            embeddings.append(embedding_vector)

            print(f"[OK] Embedding berhasil ({idx}/{len(documents_data)}) ID: {doc_id}")



        except Exception as e:

            print(f"[ERROR] Gagal membuat embedding untuk ID {doc_id}: {e}")



    if ids:

        # Menyimpan vector embedding dan dokumen ke ChromaDB

        collection.upsert(

            ids=ids,

            documents=documents,

            metadatas=metadatas,

            embeddings=embeddings

        )

        print(f"\n[SUKSES] Berhasil menyimpan {len(ids)} dokumen ke ChromaDB di '{CHROMA_DB_DIR}'.")

    else:

        print("\n[GAGAL] Tidak ada dokumen yang berhasil diindeks.")



if __name__ == "__main__":

    run_indexing()
