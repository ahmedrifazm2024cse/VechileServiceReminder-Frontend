import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { MdDirectionsCar } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { getErrorMessage } from '../../utils/helpers';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
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
      const { data } = await authService.login(form);
      login(data.user, data.tokens);
      toast.success(`Welcome back, ${data.user.first_name}!`);
      const dest = data.user.role === 'admin' ? '/admin' : from;
      navigate(dest, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (err) => ({
    width: '100%', padding: '11px 14px 11px 42px',
    border: `1px solid ${err ? '#ef4444' : '#e2e8f0'}`,
    borderRadius: 10, fontSize: 14, outline: 'none',
    boxSizing: 'border-box', color: '#0f172a',
    transition: 'border-color 0.2s',
  });

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: '44px 40px',
        width: '100%', maxWidth: 440,
        boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
        animation: 'fadeIn 0.4s ease',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 28 }}>
            <div style={{
              width: 46, height: 46, borderRadius: 12,
              background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MdDirectionsCar size={26} color="#fff" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: '#0f172a' }}>VSR System</p>
              <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>Vehicle Service Reminder</p>
            </div>
          </Link>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Welcome Back</h1>
          <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: 14 }}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#374151' }}>
              Email Address <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <FiMail size={16} color="#94a3b8" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="you@example.com"
                style={inputStyle(errors.email)}
                onFocus={e => { if (!errors.email) e.target.style.borderColor = '#3b82f6'; }}
                onBlur={e => { if (!errors.email) e.target.style.borderColor = '#e2e8f0'; }}
              />
            </div>
            {errors.email && <p style={{ margin: '5px 0 0', fontSize: 12, color: '#ef4444' }}>{errors.email}</p>}
          </div>

          {/* Password */}
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#374151' }}>
              Password <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <FiLock size={16} color="#94a3b8" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPwd ? 'text' : 'password'} name="password" value={form.password}
                onChange={handleChange} placeholder="Enter your password"
                style={{ ...inputStyle(errors.password), paddingRight: 44 }}
                onFocus={e => { if (!errors.password) e.target.style.borderColor = '#3b82f6'; }}
                onBlur={e => { if (!errors.password) e.target.style.borderColor = '#e2e8f0'; }}
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', padding: 2,
              }}>
                {showPwd ? <FiEyeOff size={16} color="#94a3b8" /> : <FiEye size={16} color="#94a3b8" />}
              </button>
            </div>
            {errors.password && <p style={{ margin: '5px 0 0', fontSize: 12, color: '#ef4444' }}>{errors.password}</p>}
          </div>

          <div style={{ textAlign: 'right', marginBottom: 24 }}>
            <Link to="/forgot-password" style={{ fontSize: 13, color: '#3b82f6', textDecoration: 'none', fontWeight: 500 }}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '13px', borderRadius: 10, border: 'none',
            background: loading ? '#93c5fd' : 'linear-gradient(135deg, #1e40af, #3b82f6)',
            color: '#fff', fontWeight: 700, fontSize: 15, cursor: loading ? 'wait' : 'pointer',
            transition: 'opacity 0.2s',
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#64748b' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}>
            Create one
          </Link>
        </p>
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

export default LoginPage;
