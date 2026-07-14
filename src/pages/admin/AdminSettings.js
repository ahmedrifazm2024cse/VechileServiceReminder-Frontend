import React, { useState } from 'react';
import { FiSettings, FiMail, FiBell, FiShield, FiSave, FiDatabase, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/layout/DashboardLayout';

const AdminSettings = () => {
  const [smtp, setSmtp] = useState({
    host: 'smtp.gmail.com',
    port: '587',
    email: 'alerts@vsrsystem.com',
    useTls: true,
  });

  const [notification, setNotification] = useState({
    reminderBeforeDays: '30, 15, 7, 1',
    enableSms: false,
    enableEmail: true,
    enableWebPush: true,
  });

  const [system, setSystem] = useState({
    appName: 'Vehicle Service Reminder System',
    supportEmail: 'support@vsrsystem.com',
    allowRegistrations: true,
  });

  const [saving, setSaving] = useState(false);
  const [backingUp, setBackingUp] = useState(false);

  const handleSave = (e, section) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success(`${section} settings saved successfully!`);
    }, 800);
  };

  const handleBackup = () => {
    setBackingUp(true);
    setTimeout(() => {
      setBackingUp(false);
      toast.success('Database backup created successfully! download_backup.sql ready.');
    }, 1500);
  };

  const cardStyle = {
    background: '#fff',
    borderRadius: 14,
    padding: '24px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#475569',
    marginBottom: 6,
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid #e2e8f0',
    fontSize: 14,
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  const btnStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 18px',
    borderRadius: 10,
    background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
    color: '#fff',
    fontWeight: 600,
    fontSize: 14,
    border: 'none',
    cursor: 'pointer',
    marginTop: 12,
  };

  return (
    <DashboardLayout isAdmin>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0f172a' }}>System Settings</h1>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>Configure system parameters, notification rules, and email delivery settings</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
          {/* General App Settings */}
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiSettings style={{ color: '#3b82f6' }} /> Application Settings
            </h3>
            <form onSubmit={(e) => handleSave(e, 'General')}>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Application Title</label>
                <input
                  type="text"
                  value={system.appName}
                  onChange={(e) => setSystem({ ...system, appName: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Global Support Email</label>
                <input
                  type="email"
                  value={system.supportEmail}
                  onChange={(e) => setSystem({ ...system, supportEmail: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0' }}>
                <input
                  type="checkbox"
                  id="registrations"
                  checked={system.allowRegistrations}
                  onChange={(e) => setSystem({ ...system, allowRegistrations: e.target.checked })}
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                />
                <label htmlFor="registrations" style={{ fontSize: 14, color: '#334155', cursor: 'pointer' }}>
                  Enable new customer registrations
                </label>
              </div>
              <button type="submit" disabled={saving} style={btnStyle}>
                <FiSave size={14} /> Save General Settings
              </button>
            </form>
          </div>

          {/* Email SMTP Settings */}
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiMail style={{ color: '#8b5cf6' }} /> SMTP Mail Server
            </h3>
            <form onSubmit={(e) => handleSave(e, 'SMTP Mail')}>
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>SMTP Host</label>
                  <input
                    type="text"
                    value={smtp.host}
                    onChange={(e) => setSmtp({ ...smtp, host: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Port</label>
                  <input
                    type="text"
                    value={smtp.port}
                    onChange={(e) => setSmtp({ ...smtp, port: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Sender Email Identity</label>
                <input
                  type="email"
                  value={smtp.email}
                  onChange={(e) => setSmtp({ ...smtp, email: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0' }}>
                <input
                  type="checkbox"
                  id="useTls"
                  checked={smtp.useTls}
                  onChange={(e) => setSmtp({ ...smtp, useTls: e.target.checked })}
                  style={{ width: 16, height: 16 }}
                />
                <label htmlFor="useTls" style={{ fontSize: 14, color: '#334155' }}>
                  Use Secure Connection (TLS/SSL)
                </label>
              </div>
              <button type="submit" disabled={saving} style={btnStyle}>
                <FiSave size={14} /> Save SMTP Configurations
              </button>
            </form>
          </div>

          {/* Alert & Notification Settings */}
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiBell style={{ color: '#f59e0b' }} /> Reminder Rules
            </h3>
            <form onSubmit={(e) => handleSave(e, 'Reminder')}>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Default Reminder Frequencies (Days before)</label>
                <input
                  type="text"
                  value={notification.reminderBeforeDays}
                  onChange={(e) => setNotification({ ...notification, reminderBeforeDays: e.target.value })}
                  style={inputStyle}
                  placeholder="e.g. 30, 15, 7, 1"
                />
                <p style={{ margin: '4px 0 0', fontSize: 11, color: '#94a3b8' }}>Comma-separated numbers indicating how many days prior to service to trigger alerts.</p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '14px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input
                    type="checkbox"
                    id="enableEmail"
                    checked={notification.enableEmail}
                    onChange={(e) => setNotification({ ...notification, enableEmail: e.target.checked })}
                    style={{ width: 16, height: 16 }}
                  />
                  <label htmlFor="enableEmail" style={{ fontSize: 14, color: '#334155' }}>Enable Email Alerts</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input
                    type="checkbox"
                    id="enableWebPush"
                    checked={notification.enableWebPush}
                    onChange={(e) => setNotification({ ...notification, enableWebPush: e.target.checked })}
                    style={{ width: 16, height: 16 }}
                  />
                  <label htmlFor="enableWebPush" style={{ fontSize: 14, color: '#334155' }}>Enable In-App Notifications</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input
                    type="checkbox"
                    id="enableSms"
                    checked={notification.enableSms}
                    onChange={(e) => setNotification({ ...notification, enableSms: e.target.checked })}
                    style={{ width: 16, height: 16 }}
                  />
                  <label htmlFor="enableSms" style={{ fontSize: 14, color: '#334155' }}>Enable SMS Reminders (Twilio Gateway)</label>
                </div>
              </div>

              <button type="submit" disabled={saving} style={btnStyle}>
                <FiSave size={14} /> Save Alert Rules
              </button>
            </form>
          </div>

          {/* Database Backup Maintenance Settings */}
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiDatabase style={{ color: '#10b981' }} /> System Backups
            </h3>
            <div>
              <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 16 }}>
                Create full SQL snapshots of user details, vehicle specs, reminder schedules, and service log history. It is recommended to perform backups monthly.
              </p>
              
              <div style={{ background: '#f8fafc', padding: 14, borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: '#64748b' }}>Last Backup Created:</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>2 days ago</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: '#64748b' }}>Backup File Size:</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>12.8 MB</span>
                </div>
              </div>

              <button
                onClick={handleBackup}
                disabled={backingUp}
                style={{
                  ...btnStyle,
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  width: '100%',
                  justifyContent: 'center',
                }}
              >
                {backingUp ? <FiRefreshCw className="spin" size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <FiDatabase size={14} />}
                {backingUp ? 'Generating Backup...' : 'Create Snapshot Backup Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;
