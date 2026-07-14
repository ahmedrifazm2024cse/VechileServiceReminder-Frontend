import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiBell, FiTruck, FiShield, FiMail, FiCheckCircle,
  FiArrowRight, FiStar, FiClock, FiBarChart2
} from 'react-icons/fi';
import { MdDirectionsCar } from 'react-icons/md';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const LandingPage = () => {
  const features = [
    { icon: FiTruck, title: 'Vehicle Management', desc: 'Add and manage all your vehicles in one place. Track details, odometer, fuel type and more.', color: '#3b82f6', bg: '#eff6ff' },
    { icon: FiBell, title: 'Smart Reminders', desc: 'Get reminded 30, 15, 7, 3 or 1 day before your service is due. Never miss a service again.', color: '#10b981', bg: '#ecfdf5' },
    { icon: FiMail, title: 'Email Notifications', desc: 'Automatic reminder emails sent directly to your inbox with all vehicle service details.', color: '#f59e0b', bg: '#fffbeb' },
    { icon: FiShield, title: 'Insurance Tracking', desc: 'Track insurance expiry and pollution certificate dates for all your vehicles.', color: '#8b5cf6', bg: '#f5f3ff' },
    { icon: FiBarChart2, title: 'Service History', desc: 'Maintain a complete service history with costs, odometer readings and service centers.', color: '#06b6d4', bg: '#ecfeff' },
    { icon: FiCheckCircle, title: 'Overdue Alerts', desc: 'Instantly identify overdue services with visual indicators and priority alerts.', color: '#ef4444', bg: '#fff5f5' },
  ];

  const stats = [
    { value: '10K+', label: 'Vehicles Tracked' },
    { value: '50K+', label: 'Reminders Sent' },
    { value: '98%', label: 'On-time Services' },
    { value: '5K+', label: 'Happy Users' },
  ];

  const steps = [
    { step: '01', title: 'Register & Add Vehicle', desc: 'Create your account and add your vehicles with service details.' },
    { step: '02', title: 'Enable Reminders', desc: 'Set your preferred reminder days — 30, 15, 7, 3 or 1 day before service.' },
    { step: '03', title: 'Get Notified', desc: 'Receive automatic email reminders and in-app notifications on time.' },
  ];

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1e40af 100%)',
        padding: '80px 24px 100px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Background decorations */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(59,130,246,0.1)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(99,102,241,0.1)' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)',
            borderRadius: 20, padding: '6px 16px', marginBottom: 28,
          }}>
            <FiBell size={13} color="#60a5fa" />
            <span style={{ color: '#93c5fd', fontSize: 13, fontWeight: 500 }}>Automated Service Reminders</span>
          </div>

          <h1 style={{
            color: '#f8fafc', fontSize: 'clamp(32px, 5vw, 60px)',
            fontWeight: 800, lineHeight: 1.15, margin: '0 0 22px',
            letterSpacing: '-1px',
          }}>
            Never Miss a Vehicle
            <span style={{ display: 'block', background: 'linear-gradient(135deg, #60a5fa, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Service Again
            </span>
          </h1>

          <p style={{
            color: '#94a3b8', fontSize: 18, maxWidth: 580,
            margin: '0 auto 40px', lineHeight: 1.8,
          }}>
            Track all your vehicles, get automatic email reminders before service due dates,
            and maintain complete service history — all in one dashboard.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', borderRadius: 10,
              background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
              color: '#fff', fontWeight: 700, fontSize: 16, textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(59,130,246,0.4)',
              transition: 'transform 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = ''}
            >
              Get Started Free <FiArrowRight size={18} />
            </Link>
            <Link to="/about" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#e2e8f0', fontWeight: 500, fontSize: 16, textDecoration: 'none',
              background: 'rgba(255,255,255,0.05)',
            }}>
              Learn More
            </Link>
          </div>

          {/* Hero Stats */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 20, marginTop: 64,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16, padding: '24px 32px',
          }}>
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: 30, fontWeight: 800, color: '#60a5fa' }}>{s.value}</p>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ color: '#3b82f6', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Everything You Need</span>
            <h2 style={{ margin: '10px 0 16px', fontSize: 36, fontWeight: 800, color: '#0f172a' }}>
              Complete Vehicle Service Management
            </h2>
            <p style={{ color: '#64748b', fontSize: 17, maxWidth: 500, margin: '0 auto' }}>
              All the tools you need to stay on top of every vehicle's service schedule.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24,
          }}>
            {features.map((f, i) => (
              <div key={i} style={{
                background: '#fff', borderRadius: 16, padding: '28px 24px',
                border: '1px solid #f1f5f9',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 12,
                  background: f.bg, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', marginBottom: 18,
                }}>
                  <f.icon size={24} color={f.color} />
                </div>
                <h3 style={{ margin: '0 0 10px', fontSize: 17, fontWeight: 700, color: '#0f172a' }}>{f.title}</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ color: '#10b981', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Simple Process</span>
            <h2 style={{ margin: '10px 0', fontSize: 36, fontWeight: 800, color: '#0f172a' }}>How It Works</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px', fontSize: 20, fontWeight: 800, color: '#fff',
                }}>
                  {s.step}
                </div>
                <h3 style={{ margin: '0 0 10px', fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{s.title}</h3>
                <p style={{ margin: 0, color: '#64748b', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{
        padding: '72px 24px',
        background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <MdDirectionsCar size={52} color="rgba(255,255,255,0.3)" style={{ marginBottom: 20 }} />
          <h2 style={{ color: '#fff', fontSize: 36, fontWeight: 800, margin: '0 0 16px' }}>
            Ready to Get Started?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 17, marginBottom: 36, lineHeight: 1.7 }}>
            Join thousands of vehicle owners who never miss a service date. It's free to get started.
          </p>
          <Link to="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '15px 36px', borderRadius: 10,
            background: '#fff', color: '#1e40af',
            fontWeight: 700, fontSize: 16, textDecoration: 'none',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          }}>
            Create Free Account <FiArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
