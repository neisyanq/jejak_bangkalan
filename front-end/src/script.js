/**
 * Global Helper Script - Jejak Bangkalan Heritage
 */
export function initGlobalEffects() {
  if (window.AOS) {
    window.AOS.init({ once: true, offset: 50, duration: 800 });
  }
}
