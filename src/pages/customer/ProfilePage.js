import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiPhone, FiLock, FiImage, FiEye, FiEyeOff, FiSave } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { getErrorMessage, getInitials } from '../../utils/helpers';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const [profile, setProfile] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    profile_picture: user?.profile_picture || ''
  });
  const [profilePreview, setProfilePreview] = useState(user?.profile_picture_url || null);
  const [profileLoading, setProfileLoading] = useState(false);

  const [pwd, setPwd] = useState({ old_password: '', new_password: '', confirm_new_password: '' });
  const [pwdErrors, setPwdErrors] = useState({});
  const [pwdLoading, setPwdLoading] = useState(false);
  const [showPwd, setShowPwd] = useState({ old: false, new: false, confirm: false });

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profile.first_name.trim() || !profile.last_name.trim()) {
      toast.error('Name fields are required'); return;
    }
    setProfileLoading(true);
    try {
      const { data } = await authService.updateProfile(profile);
      updateUser(data.user);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally { setProfileLoading(false); }
  };

  const handlePwdSave = async (e) => {
    e.preventDefault();
    const e2 = {};
    if (!pwd.old_password) e2.old_password = 'Current password is required';
    if (!pwd.new_password) e2.new_password = 'New password is required';
    else if (pwd.new_password.length < 8) e2.new_password = 'Min 8 characters';
    if (pwd.confirm_new_password !== pwd.new_password) e2.confirm_new_password = 'Passwords do not match';
    if (Object.keys(e2).length) { setPwdErrors(e2); return; }
    setPwdLoading(true);
    try {
      await authService.changePassword(pwd);
      toast.success('Password changed successfully');
      setPwd({ old_password: '', new_password: '', confirm_new_password: '' });
      setPwdErrors({});
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally { setPwdLoading(false); }
  };

  const inputStyle = (err) => ({
    width: '100%', padding: '10px 14px 10px 42px',
    border: `1px solid ${err ? '#ef4444' : '#e2e8f0'}`,
    borderRadius: 10, fontSize: 14, outline: 'none',
    boxSizing: 'border-box', color: '#0f172a',
  });

  return (
    <DashboardLayout>
      <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: 700 }}>
        <h1 style={{ margin: '0 0 24px', fontSize: 22, fontWeight: 700, color: '#0f172a' }}>My Profile</h1>

        {/* Tab Selector */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: '#f1f5f9', borderRadius: 10, padding: 4, width: 'fit-content' }}>
          {[
            { id: 'profile', label: 'Profile Info' },
            { id: 'password', label: 'Change Password' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: tab === t.id ? '#fff' : 'transparent',
              color: tab === t.id ? '#0f172a' : '#64748b',
              fontWeight: tab === t.id ? 600 : 400, fontSize: 14,
              boxShadow: tab === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s',
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'profile' ? (
          <div style={{ background: '#fff', borderRadius: 16, padding: '28px 32px', border: '1px solid #f1f5f9' }}>
            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', fontSize: 26, fontWeight: 700, color: '#fff',
                }}>
                  {profilePreview ? (
                    <img
                      src={profilePreview}
                      alt="Profile"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : getInitials(`${user?.first_name} ${user?.last_name}`)}
                </div>
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 18, color: '#0f172a' }}>{user?.first_name} {user?.last_name}</p>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>{user?.email}</p>
                <span style={{ display: 'inline-block', marginTop: 6, padding: '2px 10px', borderRadius: 20, background: user?.role === 'admin' ? '#f5f3ff' : '#eff6ff', color: user?.role === 'admin' ? '#7c3aed' : '#2563eb', fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>
                  {user?.role}
                </span>
              </div>
            </div>

            <form onSubmit={handleProfileSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
                {[
                  { name: 'first_name', label: 'First Name', icon: FiUser, required: true },
                  { name: 'last_name', label: 'Last Name', icon: FiUser, required: true },
                ].map(({ name, label, icon: Icon, required }) => (
                  <div key={name} style={{ marginBottom: 18 }}>
                    <label htmlFor={name} style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#374151' }}>
                      {label}{required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Icon size={16} color="#94a3b8" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
                      <input id={name} type="text" name={name} value={profile[name]} onChange={e => setProfile({ ...profile, [name]: e.target.value })}
                        style={inputStyle(false)}
                        onFocus={e => e.target.style.borderColor = '#3b82f6'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#374151' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <FiMail size={16} color="#94a3b8" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="email" value={user?.email} disabled style={{ ...inputStyle(false), background: '#f8fafc', color: '#94a3b8' }} />
                </div>
                <p style={{ margin: '5px 0 0', fontSize: 12, color: '#94a3b8' }}>Email cannot be changed</p>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#374151' }}>Profile Picture URL</label>
                <div style={{ position: 'relative' }}>
                  <FiImage size={16} color="#94a3b8" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="text" name="profile_picture" value={profile.profile_picture} onChange={e => { setProfile({ ...profile, profile_picture: e.target.value }); setProfilePreview(e.target.value); }} placeholder="https://example.com/profile.jpg"
                    style={inputStyle(false)}
                    onFocus={e => e.target.style.borderColor = '#3b82f6'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#374151' }}>Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <FiPhone size={16} color="#94a3b8" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="tel" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="+91 98765 43210"
                    style={inputStyle(false)}
                    onFocus={e => e.target.style.borderColor = '#3b82f6'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
              </div>

              <button type="submit" disabled={profileLoading} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 28px', borderRadius: 10, border: 'none',
                background: profileLoading ? '#93c5fd' : 'linear-gradient(135deg, #1e40af, #3b82f6)',
                color: '#fff', fontWeight: 700, fontSize: 15, cursor: profileLoading ? 'wait' : 'pointer',
              }}>
                <FiSave size={16} /> {profileLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 16, padding: '28px 32px', border: '1px solid #f1f5f9' }}>
            <form onSubmit={handlePwdSave}>
              {[
                { name: 'old_password', label: 'Current Password', showKey: 'old' },
                { name: 'new_password', label: 'New Password', showKey: 'new' },
                { name: 'confirm_new_password', label: 'Confirm New Password', showKey: 'confirm' },
              ].map(({ name, label, showKey }) => (
                <div key={name} style={{ marginBottom: 20 }}>
                  <label htmlFor={name} style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#374151' }}>
                    {label} <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <FiLock size={16} color="#94a3b8" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      id={name}
                      type={showPwd[showKey] ? 'text' : 'password'}
                      value={pwd[name]}
                      onChange={e => { setPwd({ ...pwd, [name]: e.target.value }); setPwdErrors({ ...pwdErrors, [name]: '' }); }}
                      style={inputStyle(pwdErrors[name])}
                      onFocus={e => { if (!pwdErrors[name]) e.target.style.borderColor = '#3b82f6'; }}
                      onBlur={e => { if (!pwdErrors[name]) e.target.style.borderColor = '#e2e8f0'; }}
                    />
                    <button type="button" onClick={() => setShowPwd(s => ({ ...s, [showKey]: !s[showKey] }))}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                      {showPwd[showKey] ? <FiEyeOff size={16} color="#94a3b8" /> : <FiEye size={16} color="#94a3b8" />}
                    </button>
                  </div>
                  {pwdErrors[name] && <p style={{ margin: '5px 0 0', fontSize: 12, color: '#ef4444' }}>{pwdErrors[name]}</p>}
                </div>
              ))}
              <button type="submit" disabled={pwdLoading} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 28px', borderRadius: 10, border: 'none',
                background: pwdLoading ? '#93c5fd' : 'linear-gradient(135deg, #1e40af, #3b82f6)',
                color: '#fff', fontWeight: 700, fontSize: 15, cursor: pwdLoading ? 'wait' : 'pointer',
              }}>
                <FiLock size={16} /> {pwdLoading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
