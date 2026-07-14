import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiHome, FiTruck, FiTool, FiBell, FiUser, FiLogOut,
  FiUsers, FiBarChart2, FiSettings, FiMessageSquare,
  FiChevronLeft, FiChevronRight, FiFileText, FiActivity
} from 'react-icons/fi';
import { MdDirectionsCar } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Sidebar = ({ isAdmin = false }) => {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const customerLinks = [
    { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { to: '/vehicles', icon: FiTruck, label: 'My Vehicles' },
    { to: '/service-history', icon: FiTool, label: 'Service History' },
    { to: '/reminder-settings', icon: FiBell, label: 'Reminders' },
    { to: '/notifications', icon: FiActivity, label: 'Notifications' },
    { to: '/profile', icon: FiUser, label: 'Profile' },
  ];

  const adminLinks = [
    { to: '/admin', icon: FiHome, label: 'Dashboard' },
    { to: '/admin/users', icon: FiUsers, label: 'Users' },
    { to: '/admin/vehicles', icon: FiTruck, label: 'Vehicles' },
    { to: '/admin/services', icon: FiTool, label: 'Services' },
    { to: '/admin/reminder-logs', icon: FiBell, label: 'Reminder Logs' },
    { to: '/admin/contacts', icon: FiMessageSquare, label: 'Contacts' },
    { to: '/admin/reports', icon: FiBarChart2, label: 'Reports' },
    { to: '/admin/settings', icon: FiSettings, label: 'Settings' },
  ];

  const links = isAdmin ? adminLinks : customerLinks;

  const bg = isDark ? '#1e293b' : '#fff';
  const border = isDark ? '#334155' : '#f1f5f9';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const activeColor = '#3b82f6';
  const activeBg = '#eff6ff';

  const isActive = (path) => {
    if (path === '/admin' || path === '/dashboard') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{
      width: collapsed ? 68 : 240, minHeight: '100vh',
      background: bg, borderRight: `1px solid ${border}`,
      display: 'flex', flexDirection: 'column',
      transition: 'width 0.25s ease',
      position: 'sticky', top: 0, height: '100vh',
      overflowY: 'auto', overflowX: 'hidden',
    }}>
      {/* Brand */}
      <div style={{
        padding: collapsed ? '20px 14px' : '20px 18px',
        borderBottom: `1px solid ${border}`,
        display: 'flex', alignItems: 'center',
        gap: 10, justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <MdDirectionsCar size={20} color="#fff" />
        </div>
        {!collapsed && (
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: isDark ? '#f1f5f9' : '#0f172a' }}>
              {isAdmin ? 'Admin Panel' : 'VSR System'}
            </p>
            <p style={{ margin: 0, fontSize: 10, color: textColor }}>
              {isAdmin ? 'Management' : 'Service Reminder'}
            </p>
          </div>
        )}
      </div>

      {/* Nav Links */}
      <nav style={{ flex: 1, padding: '12px 8px' }}>
        {links.map(({ to, icon: Icon, label }) => {
          const active = isActive(to);
          return (
            <Link key={to} to={to} title={collapsed ? label : ''} style={{
              display: 'flex', alignItems: 'center',
              gap: collapsed ? 0 : 10,
              padding: collapsed ? '11px' : '10px 12px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              borderRadius: 10, marginBottom: 2,
              background: active ? activeBg : 'transparent',
              color: active ? activeColor : textColor,
              textDecoration: 'none', fontSize: 14, fontWeight: active ? 600 : 400,
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = isDark ? '#334155' : '#f8fafc'; } }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: '12px 8px', borderTop: `1px solid ${border}` }}>
        {!collapsed && (
          <div style={{
            padding: '10px 12px', borderRadius: 10,
            background: isDark ? '#334155' : '#f8fafc',
            marginBottom: 8,
          }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: isDark ? '#f1f5f9' : '#0f172a' }}>
              {user?.first_name} {user?.last_name}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: textColor }}>{user?.email}</p>
          </div>
        )}
        <button onClick={handleLogout} title={collapsed ? 'Sign Out' : ''} style={{
          display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10,
          padding: collapsed ? '11px' : '10px 12px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          width: '100%', borderRadius: 10, border: 'none',
          background: 'transparent', color: '#ef4444',
          cursor: 'pointer', fontSize: 14, fontWeight: 500,
        }}
          onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <FiLogOut size={18} />
          {!collapsed && 'Sign Out'}
        </button>
      </div>

      {/* Collapse toggle */}
      <button onClick={() => setCollapsed(!collapsed)} style={{
        position: 'absolute', top: 72, right: -14,
        width: 28, height: 28, borderRadius: '50%',
        border: `1px solid ${border}`, background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        zIndex: 10,
      }}>
        {collapsed ? <FiChevronRight size={14} color={textColor} /> : <FiChevronLeft size={14} color={textColor} />}
      </button>
    </div>
  );
};

export default Sidebar;
