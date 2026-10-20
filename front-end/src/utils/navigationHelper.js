/**
 * Helper Navigasi SPA (Single Page Application)
 * Mengubah seluruh tautan lama (.php) menjadi rute React Router tanpa reload halaman
 */
import { logoutUser } from './authDomSync';

export const PHP_TO_ROUTE_MAP = {
  'index.php': '/',
  'beranda.php': '/',
  'warisan_budaya.php': '/warisan-budaya',
  'virtual_tour.php': '/virtual-tour',
  'game.php': '/game',
  'labirin.php': '/labirin',
  'laut.php': '/laut',
  'asisten_cerdas.php': '/asisten-cerdas',
  'tentang_kami.php': '/tentang-kami',
};

export function mapPhpUrlToRoute(rawHref) {
  if (!rawHref) return null;
  const trimmed = rawHref.trim();

  if (trimmed === '?logout=true' || trimmed.includes('logout=true')) {
    return '__LOGOUT__';
  }

  // Pisahkan path dan query string / hash
  const [pathPart, queryOrHash] = trimmed.split(/(?=[?#])/);
  const cleanFile = pathPart.replace(/^\.\//, '').replace(/^\//, '');

  if (PHP_TO_ROUTE_MAP[cleanFile]) {
    return PHP_TO_ROUTE_MAP[cleanFile] + (queryOrHash || '');
  }
  return null;
}

export function interceptInternalLinks(container, navigate) {
  if (!container) return () => {};

  // Pasang helper global untuk pemanggilan dari script inline (onclick="window.location.href=...")
  window.__jejakNavigate = (targetUrl) => {
    const mapped = mapPhpUrlToRoute(targetUrl);
    if (mapped === '__LOGOUT__') {
      logoutUser(navigate);
    } else if (mapped) {
      navigate(mapped);
    } else if (targetUrl) {
      navigate(targetUrl);
    }
  };

  const handleClick = (e) => {
    const anchor = e.target.closest('a[href]');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) {
      return;
    }

    const mappedRoute = mapPhpUrlToRoute(href);
    if (mappedRoute === '__LOGOUT__') {
      e.preventDefault();
      logoutUser(navigate);
      return;
    }

    if (mappedRoute) {
      e.preventDefault();
      navigate(mappedRoute);
    }
  };

  container.addEventListener('click', handleClick);
  return () => container.removeEventListener('click', handleClick);
}
