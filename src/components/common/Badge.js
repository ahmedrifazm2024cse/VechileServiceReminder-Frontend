import React from 'react';

const variants = {
  success: { background: '#d1fae5', color: '#065f46' },
  danger:  { background: '#fee2e2', color: '#991b1b' },
  warning: { background: '#fef3c7', color: '#92400e' },
  info:    { background: '#e0e7ff', color: '#3730a3' },
  primary: { background: '#eff6ff', color: '#1d4ed8' },
  gray:    { background: '#f1f5f9', color: '#475569' },
  purple:  { background: '#f5f3ff', color: '#6d28d9' },
};

const Badge = ({ children, variant = 'gray', style = {} }) => {
  const v = variants[variant] || variants.gray;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 10px', borderRadius: 20,
      fontSize: 12, fontWeight: 600,
      ...v, ...style,
    }}>
      {children}
    </span>
  );
};

export default Badge;
