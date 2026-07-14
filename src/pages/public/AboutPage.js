import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiBell, FiTruck, FiMail, FiArrowRight } from 'react-icons/fi';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const AboutPage = () => {
  const values = [
    { icon: FiShield, title: 'Reliability', desc: 'Dependable reminders and accurate tracking you can count on.', color: '#3b82f6', bg: '#eff6ff' },
    { icon: FiBell, title: 'Proactivity', desc: 'Stay ahead of maintenance with intelligent early warnings.', color: '#10b981', bg: '#ecfdf5' },
    { icon: FiTruck, title: 'Simplicity', desc: 'Clean, intuitive interface designed for everyone.', color: '#f59e0b', bg: '#fffbeb' },
    { icon: FiMail, title: 'Communication', desc: 'Clear, timely notifications that actually get noticed.', color: '#8b5cf6', bg: '#f5f3ff' },
  ];

  return (
    <div>
      <Navbar />
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0f172a, #1e40af)', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h1 style={{ color: '#f8fafc', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, margin: '0 0 20px' }}>About VSR System</h1>
          <p style={{ color: '#94a3b8', fontSize: 17, lineHeight: 1.8, margin: 0 }}>
            We built the Vehicle Service Reminder System to solve a simple but costly problem — people forgetting to service their vehicles. Our platform makes vehicle maintenance effortless.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: '72px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, alignItems: 'center' }}>
          <div>
            <span style={{ color: '#3b82f6', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Our Mission</span>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: '12px 0 20px' }}>
              Keep Every Vehicle Running Smoothly
            </h2>
            <p style={{ color: '#64748b', lineHeight: 1.8, marginBottom: 16 }}>
              Regular vehicle maintenance is essential for safety and longevity — yet it's one of the most commonly neglected tasks. We created VSR System to bridge that gap.
            </p>
            <p style={{ color: '#64748b', lineHeight: 1.8 }}>
              Our automated reminder system ensures you never miss a service date, helping you protect your investment and stay safe on the road.
            </p>
          </div>
          <div style={{ background: '#f8fafc', borderRadius: 16, padding: 32 }}>
            {[
              { label: 'Vehicle Tracking', value: '10,000+' },
              { label: 'Reminders Sent', value: '50,000+' },
              { label: 'Active Users', value: '5,000+' },
              { label: 'Uptime', value: '99.9%' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: i < 3 ? '1px solid #e2e8f0' : 'none' }}>
                <span style={{ color: '#64748b', fontSize: 14 }}>{s.label}</span>
                <span style={{ fontWeight: 700, color: '#3b82f6', fontSize: 16 }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '72px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: 0 }}>Our Core Values</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {values.map((v, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 14, padding: 28, border: '1px solid #f1f5f9', textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: v.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                  <v.icon size={26} color={v.color} />
                </div>
                <h3 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{v.title}</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: 14, lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '72px 24px', background: 'linear-gradient(135deg, #1e40af, #3b82f6)', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ color: '#fff', fontSize: 32, fontWeight: 800, margin: '0 0 16px' }}>Start Tracking Today</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, marginBottom: 32 }}>
            Join thousands of vehicle owners who rely on VSR System to keep their vehicles in top condition.
          </p>
          <Link to="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 32px', borderRadius: 10, background: '#fff',
            color: '#1e40af', fontWeight: 700, fontSize: 15, textDecoration: 'none',
          }}>
            Get Started Free <FiArrowRight size={17} />
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AboutPage;
