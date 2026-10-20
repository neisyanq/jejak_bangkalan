/**
 * Controller Interaktif Teroptimasi (initTentangKamiPage)
 * Dilengkapi Runtime Sandbox agar bebas memory leak, bebas lag, dan mendukung penuh React SPA
 */
import { syncAuthDOM, bindAuthForms } from './authDomSync';
import { createPageSandbox } from './runtimeSandbox';

export function initTentangKamiPage(navigate) {
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
            "\n        // Init animasi\n        AOS.init({ once: true, offset: 50, duration: 800 });\n\n        // Efek Scroll Navbar (sama dengan Beranda)\n        window.addEventListener('scroll', function () {\n            var navbar = document.querySelector('.navbar');\n            if (navbar) {\n                if (window.scrollY > 50) {\n                    navbar.classList.add('scrolled');\n                } else {\n                    navbar.classList.remove('scrolled');\n                }\n            }\n        });\n\n        // FUNGSI UNTUK MEMBUKA MODAL TUTORIAL 360 DAN MENGHAPUS OVERLAY\n        function openTutorial360(overlayElement) {\n            // 1. Mulai animasi menghilang\n            overlayElement.style.opacity = '0';\n            \n            // 2. Munculkan Modal Panduan\n            var tutorialModal = new bootstrap.Modal(document.getElementById('tutorial360Modal'));\n            tutorialModal.show();\n            \n            // 3. HAPUS elemen overlay sepenuhnya setelah animasi selesai agar tidak menghalangi iframe\n            setTimeout(() => {\n                if(overlayElement && overlayElement.parentNode) {\n                    overlayElement.parentNode.removeChild(overlayElement);\n                }\n            }, 300);\n        }\n\n        // FUNGSI UNTUK TOGGLE FULLSCREEN\n        function toggleFullscreen() {\n            var carouselContainer = document.getElementById('sliderVirtualTour');\n            \n            if (!document.fullscreenElement) {\n                if (carouselContainer.requestFullscreen) {\n                    carouselContainer.requestFullscreen();\n                } else if (carouselContainer.webkitRequestFullscreen) { /* Safari */\n                    carouselContainer.webkitRequestFullscreen();\n                } else if (carouselContainer.msRequestFullscreen) { /* IE11 */\n                    carouselContainer.msRequestFullscreen();\n                }\n            } else {\n                if (document.exitFullscreen) {\n                    document.exitFullscreen();\n                } else if (document.webkitExitFullscreen) { /* Safari */\n                    document.webkitExitFullscreen();\n                } else if (document.msExitFullscreen) { /* IE11 */\n                    document.msExitFullscreen();\n                }\n            }\n        }\n\n// Ekspos fungsi ke global window agar inline onclick/onchange tetap berfungsi 100% identik\nif (typeof openTutorial360 !== 'undefined') window.openTutorial360 = openTutorial360;\nif (typeof toggleFullscreen !== 'undefined') window.toggleFullscreen = toggleFullscreen;\n"
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
        console.warn('[initTentangKamiPage] Script init warning:', err);
    }

    return () => {
        cleanup();
    };
}