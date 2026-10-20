import React from 'react';

export default function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FAF6EC',
        color: '#8C6228',
        fontFamily: "'Playfair Display', serif",
      }}
    >
      <div className="spinner-border mb-3" role="status" style={{ color: '#A83232' }} />
      <h4>Memuat Jejak Bangkalan Heritage...</h4>
    </div>
  );
}
