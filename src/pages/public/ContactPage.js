import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { contactService } from '../../services/contactService';
import { getErrorMessage } from '../../utils/helpers';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.message.trim() || form.message.trim().length < 10) e.message = 'Message must be at least 10 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await contactService.send(form);
      toast.success('Message sent! We will get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (err) => ({
    width: '100%', padding: '11px 14px', boxSizing: 'border-box',
    border: `1px solid ${err ? '#ef4444' : '#e2e8f0'}`,
    borderRadius: 10, fontSize: 14, outline: 'none', color: '#0f172a',
    transition: 'border-color 0.2s',
  });

  const contactInfo = [
    { icon: FiMail, title: 'Email', value: 'support@vsrsystem.com' },
    { icon: FiPhone, title: 'Phone', value: '+91 98765 43210' },
    { icon: FiMapPin, title: 'Location', value: 'Chennai, Tamil Nadu, India' },
  ];

  return (
    <div>
      <Navbar />
      <section style={{ background: 'linear-gradient(135deg, #0f172a, #1e40af)', padding: '72px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h1 style={{ color: '#f8fafc', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, margin: '0 0 16px' }}>Contact Us</h1>
          <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.8, margin: 0 }}>
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section style={{ padding: '72px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
          {/* Contact Info */}
          <div>
            <h2 style={{ margin: '0 0 24px', fontSize: 22, fontWeight: 700, color: '#0f172a' }}>Get in Touch</h2>
            <p style={{ color: '#64748b', lineHeight: 1.8, marginBottom: 32 }}>
              Fill out the form and we'll get back to you within 24 hours. You can also reach us directly through the following channels.
            </p>
            {contactInfo.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <c.icon size={20} color="#3b82f6" />
                </div>
                <div>
                  <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{c.title}</p>
                  <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>{c.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '32px 28px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
            <h2 style={{ margin: '0 0 24px', fontSize: 20, fontWeight: 700, color: '#0f172a' }}>Send a Message</h2>
            <form onSubmit={handleSubmit} noValidate>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                {['name', 'email'].map(field => (
                  <div key={field} style={{ marginBottom: 18 }}>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#374151' }}>
                      {field === 'name' ? 'Your Name' : 'Email Address'} <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      name={field} value={form[field]} onChange={handleChange}
                      placeholder={field === 'name' ? 'John Doe' : 'you@example.com'}
                      style={inputStyle(errors[field])}
                      onFocus={e => { if (!errors[field]) e.target.style.borderColor = '#3b82f6'; }}
                      onBlur={e => { if (!errors[field]) e.target.style.borderColor = '#e2e8f0'; }}
                    />
                    {errors[field] && <p style={{ margin: '5px 0 0', fontSize: 12, color: '#ef4444' }}>{errors[field]}</p>}
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#374151' }}>
                  Subject <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text" name="subject" value={form.subject}
                  onChange={handleChange} placeholder="How can we help?"
                  style={inputStyle(errors.subject)}
                  onFocus={e => { if (!errors.subject) e.target.style.borderColor = '#3b82f6'; }}
                  onBlur={e => { if (!errors.subject) e.target.style.borderColor = '#e2e8f0'; }}
                />
                {errors.subject && <p style={{ margin: '5px 0 0', fontSize: 12, color: '#ef4444' }}>{errors.subject}</p>}
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#374151' }}>
                  Message <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  name="message" value={form.message}
                  onChange={handleChange} placeholder="Tell us more..."
                  rows={5}
                  style={{ ...inputStyle(errors.message), resize: 'vertical', fontFamily: 'inherit' }}
                  onFocus={e => { if (!errors.message) e.target.style.borderColor = '#3b82f6'; }}
                  onBlur={e => { if (!errors.message) e.target.style.borderColor = '#e2e8f0'; }}
                />
                {errors.message && <p style={{ margin: '5px 0 0', fontSize: 12, color: '#ef4444' }}>{errors.message}</p>}
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '13px', borderRadius: 10, border: 'none',
                background: loading ? '#93c5fd' : 'linear-gradient(135deg, #1e40af, #3b82f6)',
                color: '#fff', fontWeight: 700, fontSize: 15, cursor: loading ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                {loading ? 'Sending...' : <><FiSend size={16} /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ContactPage;
