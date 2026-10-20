/**
 * Service Komunikasi AI RAG (Retrieval-Augmented Generation)
 * Menghubungkan halaman Asisten Cerdas dengan Backend FastAPI RAG + ChromaDB + Gemini
 */

export const FASTAPI_RAG_URL = import.meta.env?.VITE_RAG_API_URL || 'http://127.0.0.1:8000/chat';

export async function sendRagChatMessage(message) {
  const nowRealtime = new Date();
  const realtimeContext = {
    current_time: nowRealtime.toISOString(),
    local_time: nowRealtime.toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' }),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  const response = await fetch(FASTAPI_RAG_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: message.trim(),
      realtime: true,
      context: realtimeContext,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(errText || `HTTP Error ${response.status}`);
  }

  return await response.json();
}
