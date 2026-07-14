import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiLock, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import { MdDirectionsCar } from 'react-icons/md';
import { authService } from '../../services/authService';
import { getErrorMessage } from '../../utils/helpers';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [form, setForm] = useState({ new_password: '', confirm_new_password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [show, setShow] = useState({ pwd: false, confirm: false });

  const validate = () => {
    const e = {};
    if (!form.new_password) e.new_password = 'Password is required';
    else if (form.new_password.length < 8) e.new_password = 'Min 8 characters';
    else if (!/[A-Z]/.test(form.new_password)) e.new_password = 'Must contain uppercase letter';
    else if (!/[0-9]/.test(form.new_password)) e.new_password = 'Must contain a number';
    if (form.confirm_new_password !== form.new_password) e.confirm_new_password = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) { toast.error('Invalid reset link. Please request a new one.'); return; }
    if (!validate()) return;
    setLoading(true);
    try {
      await authService.resetPassword({ token, ...form });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a8a)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: 40, maxWidth: 400, textAlign: 'center' }}>
          <p style={{ color: '#ef4444', marginBottom: 16 }}>Invalid or missing reset token.</p>
          <Link to="/forgot-password" style={{ color: '#3b82f6' }}>Request a new reset link</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a8a)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '44px 40px', width: '100%', maxWidth: 440, boxShadow: '0 25px 60px rgba(0,0,0,0.25)', animation: 'fadeIn 0.4s ease', textAlign: 'center' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 28 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #1e40af, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MdDirectionsCar size={24} color="#fff" />
          </div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: '#0f172a' }}>VSR System</p>
        </Link>

        {success ? (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <FiCheckCircle size={36} color="#10b981" />
            </div>
            <h2 style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Password Reset!</h2>
            <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7 }}>
              Your password has been reset successfully. Redirecting you to login...
            </p>
          </div>
        ) : (
          <>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <FiLock size={30} color="#3b82f6" />
            </div>
            <h1 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Set New Password</h1>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 28 }}>
              Create a strong new password for your account.
            </p>

            <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
              {[
                { key: 'new_password', label: 'New Password', show: show.pwd, toggle: () => setShow(s => ({ ...s, pwd: !s.pwd })) },
                { key: 'confirm_new_password', label: 'Confirm Password', show: show.confirm, toggle: () => setShow(s => ({ ...s, confirm: !s.confirm })) },
              ].map(({ key, label, show: s, toggle }) => (
                <div key={key} style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#374151' }}>
                    {label} <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <FiLock size={16} color="#94a3b8" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type={s ? 'text' : 'password'} value={form[key]}
                      onChange={e => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: '' }); }}
                      placeholder={key === 'new_password' ? 'Min 8 chars, 1 uppercase, 1 number' : 'Re-enter password'}
                      style={{ width: '100%', padding: '11px 44px 11px 42px', border: `1px solid ${errors[key] ? '#ef4444' : '#e2e8f0'}`, borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', color: '#0f172a' }}
                    />
                    <button type="button" onClick={toggle} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                      {s ? <FiEyeOff size={16} color="#94a3b8" /> : <FiEye size={16} color="#94a3b8" />}
                    </button>
                  </div>
                  {errors[key] && <p style={{ margin: '5px 0 0', fontSize: 12, color: '#ef4444' }}>{errors[key]}</p>}
                </div>
              ))}

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: 13, borderRadius: 10, border: 'none',
                background: loading ? '#93c5fd' : 'linear-gradient(135deg, #1e40af, #3b82f6)',
                color: '#fff', fontWeight: 700, fontSize: 15, cursor: loading ? 'wait' : 'pointer', marginBottom: 16,
              }}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>

              <Link to="/login" style={{ display: 'block', textAlign: 'center', color: '#64748b', fontSize: 14, textDecoration: 'none' }}>
                Back to Sign In
              </Link>
            </form>
          </>
        )}
      </div>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
};

export default ResetPasswordPage;
