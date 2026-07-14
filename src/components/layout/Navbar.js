import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiMoon, FiSun, FiBell, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { MdDirectionsCar } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../hooks/useNotifications';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/contact', label: 'Contact' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const styles = {
    nav: {
      background: isDark ? '#1e293b' : '#fff',
      borderBottom: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
      padding: '0 24px',
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    },
    inner: {
      maxWidth: 1280, margin: '0 auto',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: 64,
    },
    logo: {
      display: 'flex', alignItems: 'center', gap: 8,
      textDecoration: 'none',
    },
    link: (active) => ({
      color: active ? '#3b82f6' : isDark ? '#94a3b8' : '#475569',
      fontWeight: active ? 600 : 400,
      fontSize: 14, textDecoration: 'none', padding: '4px 2px',
      borderBottom: active ? '2px solid #3b82f6' : '2px solid transparent',
      transition: 'all 0.15s',
    }),
    iconBtn: {
      background: isDark ? '#334155' : '#f1f5f9',
      border: 'none', cursor: 'pointer',
      width: 38, height: 38, borderRadius: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
    },
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <MdDirectionsCar size={22} color="#fff" />
          </div>
          <div className="hide-mobile">
            <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: isDark ? '#f1f5f9' : '#0f172a' }}>
              VSR System
            </p>
            <p style={{ margin: 0, fontSize: 10, color: '#64748b' }}>Service Reminder</p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hide-mobile" style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} style={styles.link(isActive(link.to))}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button style={styles.iconBtn} onClick={toggleTheme} title="Toggle theme">
            {isDark ? <FiSun size={17} color="#fbbf24" /> : <FiMoon size={17} color="#475569" />}
          </button>

          {isAuthenticated ? (
            <>
              <Link to="/notifications" style={{ ...styles.iconBtn, textDecoration: 'none' }}>
                <FiBell size={17} color={isDark ? '#94a3b8' : '#475569'} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: 6, right: 6,
                    width: 8, height: 8, borderRadius: '50%',
                    background: '#ef4444', border: '2px solid #fff',
                  }} />
                )}
              </Link>

              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    ...styles.iconBtn,
                    background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                    color: '#fff', fontWeight: 700, fontSize: 13,
                  }}
                >
                  {user?.first_name?.[0]?.toUpperCase() || 'U'}
                </button>

                {dropdownOpen && (
                  <div style={{
                    position: 'absolute', top: 46, right: 0,
                    background: '#fff', borderRadius: 12, minWidth: 200,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                    border: '1px solid #f1f5f9', zIndex: 200,
                    animation: 'fadeIn 0.15s ease',
                  }}>
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#0f172a' }}>
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>{user?.email}</p>
                    </div>
                    {[
                      { to: user?.role === 'admin' ? '/admin' : '/dashboard', icon: FiUser, label: 'Dashboard' },
                      { to: '/profile', icon: FiSettings, label: 'Profile' },
                    ].map(item => (
                      <Link key={item.to} to={item.to} onClick={() => setDropdownOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', color: '#475569', fontSize: 14, textDecoration: 'none' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = ''}
                      >
                        <item.icon size={15} /> {item.label}
                      </Link>
                    ))}
                    <button onClick={() => { setDropdownOpen(false); handleLogout(); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', color: '#ef4444', fontSize: 14, width: '100%', background: 'none', border: 'none', cursor: 'pointer', borderTop: '1px solid #f1f5f9' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}
                    >
                      <FiLogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="hide-mobile" style={{ display: 'flex', gap: 10 }}>
              <Link to="/login" style={{
                padding: '8px 18px', borderRadius: 8, border: '1px solid #e2e8f0',
                color: '#475569', fontSize: 13, fontWeight: 500, textDecoration: 'none',
              }}>
                Sign In
              </Link>
              <Link to="/register" style={{
                padding: '8px 18px', borderRadius: 8,
                background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none',
              }}>
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button className="hide-desktop" style={{ ...styles.iconBtn }}
            onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="hide-desktop" style={{
          background: isDark ? '#1e293b' : '#fff',
          borderTop: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
          padding: '12px 24px',
          animation: 'fadeIn 0.2s ease',
        }}>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}
              style={{ display: 'block', padding: '10px 0', color: isDark ? '#94a3b8' : '#475569', fontSize: 14, textDecoration: 'none' }}
            >
              {link.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <div style={{ display: 'flex', gap: 10, paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
              <Link to="/login" onClick={() => setMenuOpen(false)}
                style={{ flex: 1, textAlign: 'center', padding: '9px', border: '1px solid #e2e8f0', borderRadius: 8, color: '#475569', textDecoration: 'none', fontSize: 14 }}>
                Sign In
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}
                style={{ flex: 1, textAlign: 'center', padding: '9px', background: '#3b82f6', borderRadius: 8, color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
