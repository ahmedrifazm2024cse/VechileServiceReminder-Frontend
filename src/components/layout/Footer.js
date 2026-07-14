import React from 'react';
import { Link } from 'react-router-dom';
import { MdDirectionsCar } from 'react-icons/md';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer style={{
      background: '#0f172a', color: '#94a3b8',
      padding: '60px 0 0',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 40, paddingBottom: 48,
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <MdDirectionsCar size={22} color="#fff" />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: '#f1f5f9' }}>VSR System</p>
                <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>Vehicle Service Reminder</p>
              </div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0 }}>
              Never miss a vehicle service again. Track, schedule, and get reminded automatically.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#f1f5f9', marginBottom: 16, fontSize: 14, fontWeight: 600 }}>Quick Links</h4>
            {[
              { to: '/', label: 'Home' },
              { to: '/about', label: 'About Us' },
              { to: '/services', label: 'Our Services' },
              { to: '/contact', label: 'Contact' },
              { to: '/login', label: 'Sign In' },
              { to: '/register', label: 'Register' },
            ].map(link => (
              <Link key={link.to} to={link.to} style={{
                display: 'block', color: '#94a3b8', fontSize: 14,
                marginBottom: 8, textDecoration: 'none',
                transition: 'color 0.15s',
              }}
                onMouseEnter={e => e.target.style.color = '#3b82f6'}
                onMouseLeave={e => e.target.style.color = '#94a3b8'}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Features */}
          <div>
            <h4 style={{ color: '#f1f5f9', marginBottom: 16, fontSize: 14, fontWeight: 600 }}>Features</h4>
            {[
              'Vehicle Tracking', 'Service Reminders', 'Email Notifications',
              'Service History', 'Reminder Settings', 'Admin Dashboard',
            ].map(f => (
              <p key={f} style={{ margin: '0 0 8px', fontSize: 14, color: '#64748b' }}>✓ {f}</p>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: '#f1f5f9', marginBottom: 16, fontSize: 14, fontWeight: 600 }}>Contact Us</h4>
            {[
              { icon: FiMail, text: 'support@vsrsystem.com' },
              { icon: FiPhone, text: '+91 98765 43210' },
              { icon: FiMapPin, text: 'Chennai, Tamil Nadu, India' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
                <item.icon size={15} color="#3b82f6" style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 14 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #1e293b', padding: '20px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12,
        }}>
          <p style={{ margin: 0, fontSize: 13 }}>
            © {new Date().getFullYear()} Vehicle Service Reminder System. All rights reserved.
          </p>
          <p style={{ margin: 0, fontSize: 13 }}>
            Built with ❤️ using React & Django
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
