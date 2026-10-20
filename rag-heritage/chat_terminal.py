import sys
from rag import query_rag

def start_terminal_chat():
    print("=" * 60)
    print(" 🤖 ASISTEN CERDAS JEJAK BANGKALAN HERITAGE (TERMINAL MODE)")
    print("=" * 60)
    print("Ketik pertanyaan Anda tentang Bangkalan (ketik 'keluar' atau 'exit' untuk berhenti).\n")

    while True:
        try:
            user_input = input("\n[Anda]: ").strip()
            if not user_input:
                continue
                
            if user_input.lower() in ["keluar", "exit", "q"]:
                print("\nTerima kasih telah menggunakan Asisten Cerdas Jejak Bangkalan! Sampai jumpa.")
                break

            print("\n[Asisten Cerdas]: Sedang mencari jawaban di database vector...")
            result = query_rag(user_input)

            print("\n" + "=" * 50)
            print("JAWABAN AI:")
            print("=" * 50)
            print(result["answer"])

            if result.get("sources"):
                print("\n--- SUMBER REFERENSI ---")
                unique_titles = list(set([s['title'] for s in result["sources"]]))
                for idx, title in enumerate(unique_titles, 1):
                    print(f"{idx}. {title}")
            print("=" * 50)

        except KeyboardInterrupt:
            print("\nSesi dihentikan.")
            break
        except Exception as e:
            print(f"\n[ERROR]: Terjadi kesalahan: {e}")

if __name__ == "__main__":
    start_terminal_chat()