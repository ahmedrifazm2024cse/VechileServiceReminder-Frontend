import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import { MdDirectionsCar } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { getErrorMessage } from '../../utils/helpers';

const Field = ({ label, name, type = 'text', icon: Icon, placeholder, required, rightEl, form, handleChange, errors }) => (
  <div style={{ marginBottom: 16 }}>
    <label htmlFor={name} style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#374151' }}>
      {label}{required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}
    </label>
    <div style={{ position: 'relative' }}>
      {Icon && <Icon size={16} color="#94a3b8" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />}
      <input
        id={name}
        type={type} name={name} value={form[name]} onChange={handleChange}
        placeholder={placeholder}
        style={{
          width: '100%', padding: `11px ${rightEl ? '44px' : '14px'} 11px ${Icon ? '42px' : '14px'}`,
          border: `1px solid ${errors[name] ? '#ef4444' : '#e2e8f0'}`,
          borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box',
          color: '#0f172a', transition: 'border-color 0.2s',
        }}
        onFocus={e => { if (!errors[name]) e.target.style.borderColor = '#3b82f6'; }}
        onBlur={e => { if (!errors[name]) e.target.style.borderColor = '#e2e8f0'; }}
      />
      {rightEl && <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>{rightEl}</span>}
    </div>
    {errors[name] && <p style={{ margin: '5px 0 0', fontSize: 12, color: '#ef4444' }}>{errors[name]}</p>}
  </div>
);

const ToggleBtn = ({ show, toggle }) => (
  <button type="button" onClick={toggle} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
    {show ? <FiEyeOff size={16} color="#94a3b8" /> : <FiEye size={16} color="#94a3b8" />}
  </button>
);

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '',
    phone: '', password: '', confirm_password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.first_name.trim()) e.first_name = 'First name is required';
    if (!form.last_name.trim()) e.last_name = 'Last name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    else if (!/[A-Z]/.test(form.password)) e.password = 'Password must contain an uppercase letter';
    else if (!/[0-9]/.test(form.password)) e.password = 'Password must contain a number';
    if (!form.confirm_password) e.confirm_password = 'Please confirm your password';
    else if (form.confirm_password !== form.password) e.confirm_password = 'Passwords do not match';
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
      const { data } = await authService.register(form);
      login(data.user, data.tokens);
      toast.success('Account created successfully! Welcome!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const fieldProps = (name, extra = {}) => ({
    name, form, handleChange, errors, ...extra
  });

  const pwdStrength = () => {
    const p = form.password;
    if (!p) return null;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const levels = [
      { label: 'Weak', color: '#ef4444' },
      { label: 'Fair', color: '#f59e0b' },
      { label: 'Good', color: '#3b82f6' },
      { label: 'Strong', color: '#10b981' },
    ];
    return levels[score - 1] || levels[0];
  };
  const strength = pwdStrength();

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: '40px',
        width: '100%', maxWidth: 500,
        boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
        animation: 'fadeIn 0.4s ease',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 24 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MdDirectionsCar size={24} color="#fff" />
            </div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: '#0f172a' }}>VSR System</p>
          </Link>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Create Your Account</h1>
          <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: 14 }}>Start managing your vehicle services</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Field label="First Name" icon={FiUser} placeholder="John" required {...fieldProps('first_name')} />
            <Field label="Last Name" icon={FiUser} placeholder="Doe" required {...fieldProps('last_name')} />
          </div>

          <Field label="Email Address" type="email" icon={FiMail} placeholder="you@example.com" required {...fieldProps('email')} />
          <Field label="Phone Number" icon={FiPhone} placeholder="+91 98765 43210" {...fieldProps('phone')} />

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#374151' }}>
              Password <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <FiLock size={16} color="#94a3b8" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPwd ? 'text' : 'password'} name="password" value={form.password}
                onChange={handleChange} placeholder="Min 8 chars, 1 uppercase, 1 number"
                style={{
                  width: '100%', padding: '11px 44px 11px 42px',
                  border: `1px solid ${errors.password ? '#ef4444' : '#e2e8f0'}`,
                  borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', color: '#0f172a',
                }}
                onFocus={e => { if (!errors.password) e.target.style.borderColor = '#3b82f6'; }}
                onBlur={e => { if (!errors.password) e.target.style.borderColor = '#e2e8f0'; }}
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                {showPwd ? <FiEyeOff size={16} color="#94a3b8" /> : <FiEye size={16} color="#94a3b8" />}
              </button>
            </div>
            {errors.password && <p style={{ margin: '5px 0 0', fontSize: 12, color: '#ef4444' }}>{errors.password}</p>}
            {strength && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= [1,'Fair','Good','Strong'].indexOf(strength.label) + 1 ? strength.color : '#e2e8f0' }} />
                ))}
                <span style={{ fontSize: 11, color: strength.color, fontWeight: 600 }}>{strength.label}</span>
              </div>
            )}
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#374151' }}>
              Confirm Password <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <FiLock size={16} color="#94a3b8" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showConfirm ? 'text' : 'password'} name="confirm_password" value={form.confirm_password}
                onChange={handleChange} placeholder="Re-enter your password"
                style={{
                  width: '100%', padding: '11px 44px 11px 42px',
                  border: `1px solid ${errors.confirm_password ? '#ef4444' : '#e2e8f0'}`,
                  borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', color: '#0f172a',
                }}
                onFocus={e => { if (!errors.confirm_password) e.target.style.borderColor = '#3b82f6'; }}
                onBlur={e => { if (!errors.confirm_password) e.target.style.borderColor = '#e2e8f0'; }}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                {showConfirm ? <FiEyeOff size={16} color="#94a3b8" /> : <FiEye size={16} color="#94a3b8" />}
              </button>
            </div>
            {errors.confirm_password && <p style={{ margin: '5px 0 0', fontSize: 12, color: '#ef4444' }}>{errors.confirm_password}</p>}
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '13px', borderRadius: 10, border: 'none',
            background: loading ? '#93c5fd' : 'linear-gradient(135deg, #1e40af, #3b82f6)',
            color: '#fff', fontWeight: 700, fontSize: 15, cursor: loading ? 'wait' : 'pointer',
          }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 22, fontSize: 14, color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
};

export default RegisterPage;
