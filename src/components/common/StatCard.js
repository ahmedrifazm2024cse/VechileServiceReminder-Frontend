import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = '#3b82f6', bg = '#eff6ff', trend, trendLabel, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff', borderRadius: 14, padding: '22px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        animation: 'fadeIn 0.4s ease',
      }}
      onMouseEnter={e => { if (onClick) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)'; } }}
      onMouseLeave={e => { if (onClick) { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; } }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ margin: '0 0 8px', fontSize: 13, color: '#64748b', fontWeight: 500 }}>{title}</p>
          <p style={{ margin: 0, fontSize: 30, fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>
            {value ?? '—'}
          </p>
          {trendLabel && (
            <p style={{ margin: '8px 0 0', fontSize: 12, color: trend >= 0 ? '#10b981' : '#ef4444' }}>
              {trend >= 0 ? '↑' : '↓'} {trendLabel}
            </p>
          )}
        </div>
        {Icon && (
          <div style={{
            width: 52, height: 52, borderRadius: 12,
            background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={24} color={color} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
