import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import LoadingScreen from './components/LoadingScreen';

// Lazy Loading (Code-Splitting) per halaman agar ringan & bebas lag saat pertama dibuka
const BerandaPage = lazy(() => import('./pages/BerandaPage'));
const WarisanBudayaPage = lazy(() => import('./pages/WarisanBudayaPage'));
const VirtualTourPage = lazy(() => import('./pages/VirtualTourPage'));
const GamePage = lazy(() => import('./pages/GamePage'));
const LabirinPage = lazy(() => import('./pages/LabirinPage'));
const LautPage = lazy(() => import('./pages/LautPage'));
const AsistenCerdasPage = lazy(() => import('./pages/AsistenCerdasPage'));
const TentangKamiPage = lazy(() => import('./pages/TentangKamiPage'));

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route element={<MainLayout />}>
              {/* Rute Modern Clean URL */}
              <Route path="/" element={<BerandaPage />} />
              <Route path="/warisan-budaya" element={<WarisanBudayaPage />} />
              <Route path="/virtual-tour" element={<VirtualTourPage />} />
              <Route path="/game" element={<GamePage />} />
              <Route path="/labirin" element={<LabirinPage />} />
              <Route path="/laut" element={<LautPage />} />
              <Route path="/asisten-cerdas" element={<AsistenCerdasPage />} />
              <Route path="/tentang-kami" element={<TentangKamiPage />} />

              {/* Dukungan penuh kompatibilitas URL lama (.php) */}
              <Route path="/index.php" element={<Navigate to="/" replace />} />
              <Route path="/beranda.php" element={<Navigate to="/" replace />} />
              <Route path="/warisan_budaya.php" element={<Navigate to="/warisan-budaya" replace />} />
              <Route path="/virtual_tour.php" element={<Navigate to="/virtual-tour" replace />} />
              <Route path="/game.php" element={<Navigate to="/game" replace />} />
              <Route path="/labirin.php" element={<Navigate to="/labirin" replace />} />
              <Route path="/laut.php" element={<Navigate to="/laut" replace />} />
              <Route path="/asisten_cerdas.php" element={<Navigate to="/asisten-cerdas" replace />} />
              <Route path="/tentang_kami.php" element={<Navigate to="/tentang-kami" replace />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
