import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * MainLayout menjaga tampilan asli setiap halaman 100% utuh
 * tanpa mengubah struktur DOM maupun class CSS bawaan.
 */
export default function MainLayout() {
  return (
    <div className="jejak-app-root">
      <Outlet />
    </div>
  );
}
