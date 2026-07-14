import React, { useState, useEffect } from 'react';
import { FiBell, FiPlay, FiCheckCircle, FiXCircle, FiTruck, FiUser, FiClock } from 'react-icons/fi';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import { adminService } from '../../services/adminService';
import { formatDate } from '../../utils/helpers';

const AdminReminderLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [triggering, setTriggering] = useState(false);

  const fetchLogs = (status = '') => {
    setLoading(true);
    adminService.getReminderLogs({ status })
      .then(res => {
        if (res.data && res.data.success) {
          setLogs(res.data.logs);
        }
      })
      .catch(err => {
        toast.error('Failed to load reminder logs.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLogs(statusFilter);
  }, []);

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    fetchLogs(status);
  };

  const handleTriggerReminders = () => {
    setTriggering(true);
    adminService.triggerReminders()
      .then(res => {
        toast.success(res.data.message || 'Reminders triggered successfully!');
        // Refresh logs after brief delay to let cron run/simulate logs creation
        setTimeout(() => {
          fetchLogs(statusFilter);
        }, 1500);
      })
      .catch(err => {
        toast.error(err.response?.data?.message || 'Failed to trigger reminders.');
      })
      .finally(() => {
        setTriggering(false);
      });
  };

  const cardStyle = {
    background: '#fff',
    borderRadius: 14,
    padding: '24px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  };

  const tableHeaderStyle = {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: 12,
    fontWeight: 600,
    color: '#64748b',
    borderBottom: '1px solid #f1f5f9',
    background: '#f8fafc',
  };

  const tableCellStyle = {
    padding: '16px',
    fontSize: 14,
    color: '#334155',
    borderBottom: '1px solid #f1f5f9',
  };

  return (
    <DashboardLayout isAdmin>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        {/* Header */}
        <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0f172a' }}>Reminder Logs</h1>
            <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>View notifications sent to users and manually trigger reminders</p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              style={{
                padding: '9px 14px',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                fontSize: 14,
                outline: 'none',
                background: '#fff',
                cursor: 'pointer',
              }}
            >
              <option value="">All Statuses</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
            </select>

            <button
              onClick={handleTriggerReminders}
              disabled={triggering}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                borderRadius: 10,
                background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                color: '#fff',
                fontWeight: 600,
                fontSize: 14,
                border: 'none',
                cursor: triggering ? 'wait' : 'pointer',
                opacity: triggering ? 0.7 : 1,
                boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)',
              }}
            >
              {triggering ? (
                <span>Triggering...</span>
              ) : (
                <>
                  <FiPlay size={14} /> Run Reminders Engine
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content Card */}
        <div style={cardStyle}>
          {loading ? (
            <Loader text="Loading logs..." />
          ) : logs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
              <FiBell size={48} style={{ marginBottom: 12, opacity: 0.5 }} />
              <p style={{ margin: 0, fontSize: 16 }}>No reminder logs generated yet.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={tableHeaderStyle}>User</th>
                    <th style={tableHeaderStyle}>Vehicle</th>
                    <th style={tableHeaderStyle}>Reminder Message</th>
                    <th style={tableHeaderStyle}>Scheduled Service</th>
                    <th style={tableHeaderStyle}>Sent At</th>
                    <th style={tableHeaderStyle}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log.id}>
                      <td style={tableCellStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <FiUser size={14} style={{ color: '#94a3b8' }} />
                          <div>
                            <p style={{ margin: 0, fontWeight: 500, fontSize: 14 }}>{log.user_name || 'System User'}</p>
                            <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>{log.user_email || log.user}</p>
                          </div>
                        </div>
                      </td>
                      <td style={tableCellStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <FiTruck size={14} style={{ color: '#3b82f6' }} />
                          <div>
                            <p style={{ margin: 0, fontWeight: 500 }}>{log.vehicle_name || 'Vehicle'}</p>
                            <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>{log.vehicle_registration}</p>
                          </div>
                        </div>
                      </td>
                      <td style={tableCellStyle}>
                        <p style={{ margin: 0, fontSize: 13, color: '#475569', maxWidth: 320, lineHeight: 1.4 }}>
                          {log.message}
                        </p>
                      </td>
                      <td style={tableCellStyle}>
                        {log.scheduled_service_date ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b' }}>
                            <FiClock size={13} />
                            {formatDate(log.scheduled_service_date)}
                          </div>
                        ) : 'N/A'}
                      </td>
                      <td style={tableCellStyle}>
                        {log.sent_at ? formatDate(log.sent_at, 'MMM dd, yyyy HH:mm') : 'Pending'}
                      </td>
                      <td style={tableCellStyle}>
                        <Badge variant={log.status === 'sent' ? 'success' : 'danger'}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            {log.status === 'sent' ? <FiCheckCircle size={12} /> : <FiXCircle size={12} />}
                            {log.status === 'sent' ? 'Sent' : 'Failed'}
                          </span>
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminReminderLogs;
