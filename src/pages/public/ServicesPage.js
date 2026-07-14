import React from 'react';
import { Link } from 'react-router-dom';
import { FiTruck, FiBell, FiTool, FiFileText, FiShield, FiBarChart2, FiArrowRight, FiCheck } from 'react-icons/fi';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const ServicesPage = () => {
  const services = [
    {
      icon: FiTruck, title: 'Vehicle Management', color: '#3b82f6', bg: '#eff6ff',
      desc: 'Add unlimited vehicles with complete details including brand, model, fuel type, registration, and insurance expiry.',
      features: ['Multi-vehicle support', 'Image upload', 'Insurance tracking', 'PUC certificate tracking'],
    },
    {
      icon: FiBell, title: 'Smart Reminders', color: '#10b981', bg: '#ecfdf5',
      desc: 'Configure personalized reminders at 30, 15, 7, 3, or 1 day before your service is due.',
      features: ['5 reminder intervals', 'Enable/disable per vehicle', 'Automatic scheduling', 'Duplicate prevention'],
    },
    {
      icon: FiFileText, title: 'Email Notifications', color: '#f59e0b', bg: '#fffbeb',
      desc: 'Professional HTML email reminders sent automatically with all service details.',
      features: ['Beautiful email templates', 'Gmail SMTP integration', 'Vehicle details included', 'Service center info'],
    },
    {
      icon: FiTool, title: 'Service History', color: '#8b5cf6', bg: '#f5f3ff',
      desc: 'Maintain a comprehensive log of every service — costs, odometer, service center, and invoices.',
      features: ['Full service log', 'Invoice upload', 'Cost tracking', 'Excel export'],
    },
    {
      icon: FiBarChart2, title: 'Dashboard & Reports', color: '#06b6d4', bg: '#ecfeff',
      desc: 'Visual dashboard with charts showing upcoming services, overdue vehicles, and monthly trends.',
      features: ['Real-time stats', 'Service charts', 'Overdue alerts', 'Activity feed'],
    },
    {
      icon: FiShield, title: 'Security', color: '#ef4444', bg: '#fff5f5',
      desc: 'Your data is protected with JWT authentication, password hashing, and role-based access control.',
      features: ['JWT tokens', 'Bcrypt hashing', 'Role-based access', 'CORS protection'],
    },
  ];

  return (
    <div>
      <Navbar />
      <section style={{ background: 'linear-gradient(135deg, #0f172a, #1e40af)', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h1 style={{ color: '#f8fafc', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, margin: '0 0 20px' }}>Our Services</h1>
          <p style={{ color: '#94a3b8', fontSize: 17, lineHeight: 1.8, margin: 0 }}>
            Everything you need to manage your vehicle maintenance effectively, all in one platform.
          </p>
        </div>
      </section>

      <section style={{ padding: '72px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28 }}>
            {services.map((s, i) => (
              <div key={i} style={{
                background: '#fff', borderRadius: 16, padding: 28,
                border: '1px solid #f1f5f9',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <s.icon size={24} color={s.color} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{s.title}</h3>
                </div>
                <p style={{ margin: '0 0 18px', color: '#64748b', fontSize: 14, lineHeight: 1.7 }}>{s.desc}</p>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {s.features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: '#475569' }}>
                      <FiCheck size={14} color="#10b981" strokeWidth={3} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '72px 24px', background: 'linear-gradient(135deg, #1e40af, #3b82f6)', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ color: '#fff', fontSize: 32, fontWeight: 800, margin: '0 0 16px' }}>Try All Features Free</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, marginBottom: 32 }}>
            No credit card required. Get full access to all features instantly.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 10, background: '#fff', color: '#1e40af', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
              Get Started Free <FiArrowRight size={17} />
            </Link>
            <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.4)', color: '#fff', fontWeight: 500, fontSize: 15, textDecoration: 'none' }}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ServicesPage;
