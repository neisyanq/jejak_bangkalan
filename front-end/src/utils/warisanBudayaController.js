/**
 * Controller Interaktif Teroptimasi (initWarisanBudayaPage)
 * Dilengkapi Runtime Sandbox agar bebas memory leak, bebas lag, dan mendukung penuh React SPA
 */
import { syncAuthDOM, bindAuthForms } from './authDomSync';
import { createPageSandbox } from './runtimeSandbox';

export function initWarisanBudayaPage(navigate) {
  const { sandboxWindow, sandboxDocument, cleanup } = createPageSandbox();

  syncAuthDOM();
  bindAuthForms(navigate);

  try {
    const runPageScript = new Function(
      'window',
      'document',
      'setInterval',
      'clearInterval',
      'setTimeout',
      'clearTimeout',
      'requestAnimationFrame',
      'cancelAnimationFrame',
      'Audio',
      'navigate',
      "\n        AOS.init({ once: true, offset: 50, duration: 800 });\n\n        // Navbar Scroll Effect\n        window.addEventListener('scroll', function () {\n            const navbar = document.querySelector('.navbar');\n            if (navbar) {\n                if (window.scrollY > 50) {\n                    navbar.classList.add('scrolled');\n                } else {\n                    navbar.classList.remove('scrolled');\n                }\n            }\n        });\n\n        // ==============================================\n        // LOGIKA FILTER KATEGORI WARISAN BUDAYA\n        // ==============================================\n        document.addEventListener('DOMContentLoaded', function () {\n            const filterBtns = document.querySelectorAll('.warisan-filter-btn');\n            const items = document.querySelectorAll('.warisan-item');\n\n            filterBtns.forEach(btn => {\n                btn.addEventListener('click', function () {\n                    // 1. Hapus kelas aktif dari semua tombol filter\n                    filterBtns.forEach(b => b.classList.remove('active'));\n                    // 2. Tambahkan kelas aktif ke tombol yang diklik\n                    this.classList.add('active');\n\n                    // 3. Ambil nilai kategori yang dipilih\n                    const filterValue = this.getAttribute('data-filter');\n\n                    // 4. Looping semua item budaya untuk ditampilkan/disembunyikan\n                    items.forEach(item => {\n                        if (filterValue === 'semua' || item.getAttribute('data-category') === filterValue) {\n                            item.classList.remove('hidden');\n                        } else {\n                            item.classList.add('hidden');\n                        }\n                    });\n                });\n            });\n        });\n\n        // ==============================================\n        // LOGIKA MODAL POP-UP DAN TEXT-TO-SPEECH (TTS)\n        // ==============================================\n        let currentUtterance = null;\n\n        function openBudayaModal(title, image, rawDesc, category) {\n            // Isi Konten Modal\n            document.getElementById('modalBudayaTitle').innerText = title;\n            document.getElementById('modalBudayaImg').src = image;\n            document.getElementById('modalBudayaDesc').innerHTML = rawDesc;\n            document.getElementById('modalBudayaDesc').setAttribute('data-raw-text', rawDesc);\n            document.getElementById('modalBudayaCat').innerText = category;\n\n            // Hentikan audio yang sedang berjalan (jika ada) sebelum buka modal baru\n            stopAudio();\n\n            // Tampilkan Modal\n            var myModal = new bootstrap.Modal(document.getElementById('budayaDetailModal'));\n            myModal.show();\n        }\n\n        function playAudio() {\n            const descElement = document.getElementById('modalBudayaDesc');\n            const titleElement = document.getElementById('modalBudayaTitle');\n            if (!descElement || !titleElement) return;\n\n            if ('speechSynthesis' in window) {\n                stopAudio(); // Reset audio sebelumnya\n\n                // Gabungkan Judul dan Deskripsi agar dibacakan sekaligus\n                const textToRead = titleElement.innerText + \". \" + descElement.getAttribute('data-raw-text');\n\n                currentUtterance = new SpeechSynthesisUtterance(textToRead);\n                currentUtterance.lang = 'id-ID'; // Mengatur bahasa ke Indonesia\n                currentUtterance.rate = 0.9;     // Kecepatan membaca agak dilambatkan agar jelas\n\n                currentUtterance.onstart = function () {\n                    const playBtn = document.getElementById('btnPlayAudio');\n                    const stopBtn = document.getElementById('btnStopAudio');\n                    if (playBtn) playBtn.innerHTML = '<i class=\"fa-solid fa-waveform\"></i> Sedang Membaca...';\n                    if (stopBtn) stopBtn.style.display = 'inline-flex';\n                };\n\n                currentUtterance.onend = function () { resetAudioButtons(); };\n                currentUtterance.onerror = function () { resetAudioButtons(); };\n\n                window.speechSynthesis.speak(currentUtterance);\n            } else {\n                alert(\"Maaf, browser Anda tidak mendukung fitur Text-to-Speech.\");\n            }\n        }\n\n        function stopAudio() {\n            if ('speechSynthesis' in window) {\n                window.speechSynthesis.cancel();\n            }\n            resetAudioButtons();\n        }\n\n        function resetAudioButtons() {\n            const btnPlay = document.getElementById('btnPlayAudio');\n            const btnStop = document.getElementById('btnStopAudio');\n            if (btnPlay && btnStop) {\n                btnPlay.innerHTML = '<i class=\"fa-solid fa-volume-high\"></i> Dengarkan Audio';\n                btnStop.style.display = 'none';\n            }\n        }\n\n        // Hentikan audio saat modal Pop-Up diclose/diklik di luar area\n        document.addEventListener('DOMContentLoaded', function () {\n            var modalEl = document.getElementById('budayaDetailModal');\n            if (modalEl) {\n                modalEl.addEventListener('hidden.bs.modal', function () {\n                    stopAudio();\n                });\n            }\n        });\n    \n\n// Ekspos fungsi ke global window agar inline onclick/onchange tetap berfungsi 100% identik\nif (typeof openBudayaModal !== 'undefined') window.openBudayaModal = openBudayaModal;\nif (typeof playAudio !== 'undefined') window.playAudio = playAudio;\nif (typeof resetAudioButtons !== 'undefined') window.resetAudioButtons = resetAudioButtons;\nif (typeof stopAudio !== 'undefined') window.stopAudio = stopAudio;\n"
    );
    runPageScript(
      sandboxWindow,
      sandboxDocument,
      sandboxWindow.setInterval,
      sandboxWindow.clearInterval,
      sandboxWindow.setTimeout,
      sandboxWindow.clearTimeout,
      sandboxWindow.requestAnimationFrame,
      sandboxWindow.cancelAnimationFrame,
      sandboxWindow.Audio,
      navigate
    );
  } catch (err) {
    console.warn('[initWarisanBudayaPage] Script init warning:', err);
  }

  return () => {
    cleanup();
  };
}
