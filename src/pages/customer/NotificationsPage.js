import React from 'react';
import { FiBell, FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import { useNotifications } from '../../hooks/useNotifications';
import { formatDate } from '../../utils/helpers';

const iconMap = {
  reminder: { icon: FiBell, color: '#3b82f6', bg: '#eff6ff' },
  overdue: { icon: FiAlertCircle, color: '#ef4444', bg: '#fff5f5' },
  insurance: { icon: FiAlertTriangle, color: '#f59e0b', bg: '#fffbeb' },
  puc: { icon: FiAlertTriangle, color: '#f59e0b', bg: '#fffbeb' },
  system: { icon: FiInfo, color: '#6366f1', bg: '#f5f3ff' },
};

const NotificationsPage = () => {
  const { notifications, unreadCount, loading, markRead, markAllRead } = useNotifications();

  if (loading) return <DashboardLayout><Loader text="Loading notifications..." /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0f172a' }}>
              Notifications
              {unreadCount > 0 && (
                <span style={{ marginLeft: 10, background: '#3b82f6', color: '#fff', fontSize: 12, fontWeight: 700, padding: '2px 9px', borderRadius: 12 }}>
                  {unreadCount}
                </span>
              )}
            </h1>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>{notifications.length} total</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 9, border: '1px solid #e2e8f0',
              background: '#fff', color: '#475569', cursor: 'pointer', fontSize: 13, fontWeight: 500,
            }}>
              <FiCheckCircle size={14} /> Mark all read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '72px 0', background: '#fff', borderRadius: 14, border: '1px solid #f1f5f9' }}>
            <FiBell size={52} color="#cbd5e1" style={{ marginBottom: 16 }} />
            <h3 style={{ margin: '0 0 8px', color: '#334155' }}>All Caught Up!</h3>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: 14 }}>No notifications yet. We'll let you know when something needs your attention.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {notifications.map(notification => {
              const config = iconMap[notification.notification_type] || iconMap.system;
              const IconComp = config.icon;
              return (
                <div
                  key={notification.id}
                  onClick={() => !notification.is_read && markRead(notification.id)}
                  style={{
                    background: notification.is_read ? '#fff' : '#f0f7ff',
                    borderRadius: 12, padding: '16px 20px',
                    border: `1px solid ${notification.is_read ? '#f1f5f9' : '#bfdbfe'}`,
                    cursor: notification.is_read ? 'default' : 'pointer',
                    display: 'flex', gap: 14, alignItems: 'flex-start',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { if (!notification.is_read) e.currentTarget.style.background = '#e0f0ff'; }}
                  onMouseLeave={e => { if (!notification.is_read) e.currentTarget.style.background = '#f0f7ff'; }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: config.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <IconComp size={18} color={config.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                      <p style={{ margin: 0, fontWeight: notification.is_read ? 500 : 700, fontSize: 14, color: '#0f172a' }}>
                        {notification.title}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        {!notification.is_read && (
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }} />
                        )}
                        <span style={{ fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                          {formatDate(notification.created_at, 'MMM dd, HH:mm')}
                        </span>
                      </div>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
                      {notification.message}
                    </p>
                    {notification.related_vehicle_name && (
                      <Badge variant="info" style={{ marginTop: 8 }}>
                        {notification.related_vehicle_name}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
