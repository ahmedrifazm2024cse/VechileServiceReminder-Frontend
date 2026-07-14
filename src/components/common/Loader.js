import React from 'react';

const Loader = ({ fullScreen = false, size = 40, text = '' }) => {
  const spinner = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: size, height: size,
        border: `3px solid #e2e8f0`,
        borderTopColor: '#3b82f6',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      {text && <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>{text}</p>}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(255,255,255,0.9)', zIndex: 9999,
      }}>
        {spinner}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
      {spinner}
    </div>
  );
};

export default Loader;
