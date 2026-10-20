/**
 * Runtime Sandbox & Memory/Performance Optimizer
 * Mencegah memory leak, penumpukan event listener, dan lag animasi/peta saat berpindah halaman SPA
 */

export function createPageSandbox() {
  const windowListeners = [];
  const docListeners = [];
  const intervals = new Set();
  const timeouts = new Set();
  const rafs = new Set();
  const audios = new Set();
  let disposed = false;

  const origWinAdd = window.addEventListener.bind(window);
  const origWinRemove = window.removeEventListener.bind(window);
  const origDocAdd = document.addEventListener.bind(document);
  const origDocRemove = document.removeEventListener.bind(document);
  const origSetInterval = window.setInterval.bind(window);
  const origClearInterval = window.clearInterval.bind(window);
  const origSetTimeout = window.setTimeout.bind(window);
  const origClearTimeout = window.clearTimeout.bind(window);
  const origRAF = window.requestAnimationFrame.bind(window);
  const origCancelRAF = window.cancelAnimationFrame.bind(window);
  const OrigAudio = window.Audio;

  // Proxy window & document untuk menangkap semua listener & loop
  const sandboxWindow = new Proxy(window, {
    get(target, prop) {
      if (prop === 'addEventListener') {
        return (type, handler, options) => {
          if (type === 'DOMContentLoaded' || type === 'load') {
            // Di React SPA, DOM sudah siap saat useEffect berjalan
            const id = origSetTimeout(() => {
              if (!disposed) handler(new Event(type));
            }, 0);
            timeouts.add(id);
            return;
          }
          // Throttle scroll listener secara otomatis dengan passive: true agar anti-lag
          const opts = type === 'scroll' && options === undefined ? { passive: true } : options;
          origWinAdd(type, handler, opts);
          windowListeners.push({ type, handler, opts });
        };
      }
      if (prop === 'setInterval') {
        return (fn, delay, ...args) => {
          const id = origSetInterval((...a) => {
            if (!disposed) fn(...a);
          }, delay, ...args);
          intervals.add(id);
          return id;
        };
      }
      if (prop === 'clearInterval') {
        return (id) => {
          intervals.delete(id);
          return origClearInterval(id);
        };
      }
      if (prop === 'setTimeout') {
        return (fn, delay, ...args) => {
          const id = origSetTimeout((...a) => {
            timeouts.delete(id);
            if (!disposed) fn(...a);
          }, delay, ...args);
          timeouts.add(id);
          return id;
        };
      }
      if (prop === 'clearTimeout') {
        return (id) => {
          timeouts.delete(id);
          return origClearTimeout(id);
        };
      }
      if (prop === 'requestAnimationFrame') {
        return (cb) => {
          if (disposed) return 0;
          const id = origRAF((ts) => {
            rafs.delete(id);
            if (!disposed) cb(ts);
          });
          rafs.add(id);
          return id;
        };
      }
      if (prop === 'cancelAnimationFrame') {
        return (id) => {
          rafs.delete(id);
          return origCancelRAF(id);
        };
      }
      if (prop === 'Audio') {
        return function (src) {
          const cleanSrc = typeof src === 'string' ? src.replace(/^\/?public\//, '/') : src;
          const audio = new OrigAudio(cleanSrc);
          audios.add(audio);
          return audio;
        };
      }
      const val = Reflect.get(target, prop);
      return typeof val === 'function' ? val.bind(target) : val;
    },
    set(target, prop, value) {
      if (prop === 'onload' && typeof value === 'function') {
        const id = origSetTimeout(() => {
          if (!disposed) value(new Event('load'));
        }, 0);
        timeouts.add(id);
        return true;
      }
      target[prop] = value;
      return true;
    },
  });

  const sandboxDocument = new Proxy(document, {
    get(target, prop) {
      if (prop === 'addEventListener') {
        return (type, handler, options) => {
          if (type === 'DOMContentLoaded') {
            const id = origSetTimeout(() => {
              if (!disposed) handler(new Event('DOMContentLoaded'));
            }, 0);
            timeouts.add(id);
            return;
          }
          origDocAdd(type, handler, options);
          docListeners.push({ type, handler, options });
        };
      }
      const val = Reflect.get(target, prop);
      return typeof val === 'function' ? val.bind(target) : val;
    },
  });

  const cleanup = () => {
    disposed = true;
    windowListeners.forEach(({ type, handler, opts }) => origWinRemove(type, handler, opts));
    docListeners.forEach(({ type, handler, options }) => origDocRemove(type, handler, options));
    intervals.forEach((id) => origClearInterval(id));
    timeouts.forEach((id) => origClearTimeout(id));
    rafs.forEach((id) => origCancelRAF(id));
    audios.forEach((a) => {
      try {
        a.pause();
        a.currentTime = 0;
      } catch (e) {}
    });
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
  };

  return { sandboxWindow, sandboxDocument, cleanup };
}
