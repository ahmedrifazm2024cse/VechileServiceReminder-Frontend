import React from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const ConfirmDialog = ({
  isOpen, onClose, onConfirm, title = 'Confirm Action',
  message = 'Are you sure?', confirmText = 'Confirm',
  cancelText = 'Cancel', variant = 'danger', loading = false
}) => {
  if (!isOpen) return null;

  const colors = {
    danger: { btn: '#ef4444', hover: '#dc2626', icon: '#ef4444', iconBg: '#fee2e2' },
    warning: { btn: '#f59e0b', hover: '#d97706', icon: '#f59e0b', iconBg: '#fef3c7' },
    primary: { btn: '#3b82f6', hover: '#2563eb', icon: '#3b82f6', iconBg: '#eff6ff' },
  };
  const c = colors[variant] || colors.danger;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)',
      animation: 'fadeIn 0.15s ease',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: 28,
        maxWidth: 420, width: '90%', boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
        animation: 'slideUp 0.2s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: c.iconBg, display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0,
          }}>
            <FiAlertTriangle size={22} color={c.icon} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 600, color: '#0f172a' }}>{title}</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>{message}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <FiX size={20} color="#94a3b8" />
          </button>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} disabled={loading} style={{
            padding: '9px 20px', borderRadius: 8, border: '1px solid #e2e8f0',
            background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#475569',
          }}>
            {cancelText}
          </button>
          <button onClick={onConfirm} disabled={loading} style={{
            padding: '9px 20px', borderRadius: 8, border: 'none',
            background: c.btn, color: '#fff', cursor: loading ? 'wait' : 'pointer',
            fontSize: 14, fontWeight: 600, opacity: loading ? 0.7 : 1,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default ConfirmDialog;
