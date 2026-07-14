import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { MdDirectionsCar } from 'react-icons/md';
import { authService } from '../../services/authService';
import { getErrorMessage } from '../../utils/helpers';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Email is required'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email'); return; }
    setLoading(true);
    setError('');
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: '44px 40px',
        width: '100%', maxWidth: 440,
        boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
        animation: 'fadeIn 0.4s ease', textAlign: 'center',
      }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 28 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #1e40af, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MdDirectionsCar size={24} color="#fff" />
          </div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: '#0f172a' }}>VSR System</p>
        </Link>

        {sent ? (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <FiCheckCircle size={36} color="#10b981" />
            </div>
            <h2 style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Email Sent!</h2>
            <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
              We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
            </p>
            <p style={{ color: '#64748b', fontSize: 13, marginBottom: 24 }}>
              Didn't receive the email? Check your spam folder or{' '}
              <button onClick={() => setSent(false)} style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                try again
              </button>
            </p>
            <Link to="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '11px 24px', borderRadius: 10,
              background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
              color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none',
            }}>
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <FiMail size={30} color="#3b82f6" />
            </div>
            <h1 style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Forgot Password?</h1>
            <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
              Enter your registered email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#374151' }}>
                  Email Address <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <FiMail size={16} color="#94a3b8" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
                    placeholder="you@example.com"
                    style={{
                      width: '100%', padding: '11px 14px 11px 42px',
                      border: `1px solid ${error ? '#ef4444' : '#e2e8f0'}`,
                      borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', color: '#0f172a',
                    }}
                    onFocus={e => { if (!error) e.target.style.borderColor = '#3b82f6'; }}
                    onBlur={e => { if (!error) e.target.style.borderColor = '#e2e8f0'; }}
                  />
                </div>
                {error && <p style={{ margin: '5px 0 0', fontSize: 12, color: '#ef4444' }}>{error}</p>}
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: 13, borderRadius: 10, border: 'none',
                background: loading ? '#93c5fd' : 'linear-gradient(135deg, #1e40af, #3b82f6)',
                color: '#fff', fontWeight: 700, fontSize: 15, cursor: loading ? 'wait' : 'pointer', marginBottom: 18,
              }}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <Link to="/login" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                color: '#64748b', fontSize: 14, textDecoration: 'none', fontWeight: 500,
              }}>
                <FiArrowLeft size={15} /> Back to Sign In
              </Link>
            </form>
          </>
        )}
      </div>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
};

export default ForgotPasswordPage;
