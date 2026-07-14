import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, title, children, size = 'md', footer }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidths = { sm: 440, md: 600, lg: 800, xl: 1000 };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)',
      padding: 16,
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: '#fff', borderRadius: 16, width: '100%',
        maxWidth: maxWidths[size], maxHeight: '90vh',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 50px rgba(0,0,0,0.18)',
        animation: 'slideUp 0.2s ease',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px', borderBottom: '1px solid #e2e8f0',
        }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: '#0f172a' }}>{title}</h2>
          <button onClick={onClose} style={{
            background: '#f1f5f9', border: 'none', cursor: 'pointer',
            width: 32, height: 32, borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FiX size={18} color="#64748b" />
          </button>
        </div>
        {/* Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>
        {/* Footer */}
        {footer && (
          <div style={{
            padding: '16px 24px', borderTop: '1px solid #e2e8f0',
            display: 'flex', gap: 10, justifyContent: 'flex-end',
          }}>
            {footer}
          </div>
        )}
      </div>
      <style>{`@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </div>
  );
};

export default Modal;
