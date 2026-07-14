import React, { useState, useEffect } from 'react';
import { FiMessageSquare, FiMail, FiCalendar, FiCheckCircle, FiBookOpen, FiUser, FiEye } from 'react-icons/fi';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { adminService } from '../../services/adminService';
import { formatDate } from '../../utils/helpers';

const AdminContacts = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modal / Detail state
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchMessages = (status = '') => {
    setLoading(true);
    adminService.getContacts({ status })
      .then(res => {
        if (res.data && res.data.success) {
          setMessages(res.data.messages);
        }
      })
      .catch(err => {
        toast.error('Failed to load contact messages.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMessages(statusFilter);
  }, []);

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    fetchMessages(status);
  };

  const openDetailModal = (msg) => {
    setSelectedMessage(msg);
    setDetailModalOpen(true);
    
    // Automatically mark as read if it is unread
    if (msg.status === 'unread') {
      adminService.updateContactStatus(msg.id, 'read')
        .then(() => {
          setMessages(messages.map(m => m.id === msg.id ? { ...m, status: 'read' } : m));
        })
        .catch(() => {});
    }
  };

  const handleStatusUpdate = (id, newStatus) => {
    setActionLoading(true);
    adminService.updateContactStatus(id, newStatus)
      .then(res => {
        toast.success('Message status updated.');
        setMessages(messages.map(m => m.id === id ? { ...m, status: newStatus } : m));
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage({ ...selectedMessage, status: newStatus });
        }
      })
      .catch(err => {
        toast.error('Failed to update message status.');
      })
      .finally(() => {
        setActionLoading(false);
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

  const getStatusBadge = (status) => {
    const map = {
      unread: 'warning',
      read: 'info',
      replied: 'success',
    };
    return map[status] || 'gray';
  };

  return (
    <DashboardLayout isAdmin>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        {/* Header */}
        <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0f172a' }}>Contact Submissions</h1>
            <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>Read and manage messages received from the public contact page</p>
          </div>
          <div>
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
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
          </div>
        </div>

        {/* Content Card */}
        <div style={cardStyle}>
          {loading ? (
            <Loader text="Loading messages..." />
          ) : messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
              <FiMessageSquare size={48} style={{ marginBottom: 12, opacity: 0.5 }} />
              <p style={{ margin: 0, fontSize: 16 }}>No contact messages found.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={tableHeaderStyle}>Sender</th>
                    <th style={tableHeaderStyle}>Subject</th>
                    <th style={tableHeaderStyle}>Submitted At</th>
                    <th style={tableHeaderStyle}>Status</th>
                    <th style={tableHeaderStyle} className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map(msg => (
                    <tr key={msg.id} style={{ fontWeight: msg.status === 'unread' ? '600' : '400' }}>
                      <td style={tableCellStyle}>
                        <div>
                          <p style={{ margin: 0, color: '#0f172a' }}>{msg.name}</p>
                          <p style={{ margin: 0, fontSize: 12, color: '#64748b', fontWeight: '400' }}>{msg.email}</p>
                        </div>
                      </td>
                      <td style={tableCellStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {msg.status === 'unread' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }} />}
                          <span>{msg.subject}</span>
                        </div>
                      </td>
                      <td style={tableCellStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontWeight: '400' }}>
                          <FiCalendar size={14} />
                          {formatDate(msg.created_at || msg.submitted_at)}
                        </div>
                      </td>
                      <td style={tableCellStyle}>
                        <Badge variant={getStatusBadge(msg.status)}>
                          {msg.status?.toUpperCase()}
                        </Badge>
                      </td>
                      <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                        <button
                          onClick={() => openDetailModal(msg)}
                          style={{
                            border: 'none', background: '#eff6ff', cursor: 'pointer',
                            padding: '6px 12px', borderRadius: 8, display: 'inline-flex', alignItems: 'center',
                            gap: 6, color: '#2563eb', fontSize: 13, fontWeight: 600,
                          }}
                        >
                          <FiEye size={14} /> View Message
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <Modal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title="Contact Message Details"
        >
          <div style={{ padding: '8px 4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, borderBottom: '1px solid #f1f5f9', paddingBottom: 14 }}>
              <div>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 4px' }}>Sender</p>
                <p style={{ margin: 0, fontWeight: 600, color: '#0f172a' }}>{selectedMessage.name}</p>
                <p style={{ margin: 0, fontSize: 13, color: '#3b82f6' }}>{selectedMessage.email}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 4px' }}>Submitted At</p>
                <p style={{ margin: 0, fontSize: 13, color: '#475569' }}>
                  {formatDate(selectedMessage.created_at || selectedMessage.submitted_at, 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 4px' }}>Subject</p>
              <p style={{ margin: 0, fontWeight: 600, color: '#0f172a', fontSize: 15 }}>{selectedMessage.subject}</p>
            </div>

            <div style={{ marginBottom: 24, background: '#f8fafc', padding: 16, borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 8px' }}>Message Body</p>
              <p style={{ margin: 0, color: '#334155', whiteSpace: 'pre-line', fontSize: 14, lineHeight: 1.6 }}>{selectedMessage.message}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#64748b' }}>Status:</span>
                <Badge variant={getStatusBadge(selectedMessage.status)}>
                  {selectedMessage.status?.toUpperCase()}
                </Badge>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {selectedMessage.status !== 'replied' && (
                  <button
                    onClick={() => handleStatusUpdate(selectedMessage.id, 'replied')}
                    disabled={actionLoading}
                    style={{
                      border: 'none', background: '#d1fae5', color: '#065f46',
                      padding: '8px 16px', borderRadius: 8, cursor: 'pointer',
                      fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6
                    }}
                  >
                    <FiCheckCircle size={14} /> Mark Replied
                  </button>
                )}
                {selectedMessage.status === 'replied' && (
                  <button
                    onClick={() => handleStatusUpdate(selectedMessage.id, 'read')}
                    disabled={actionLoading}
                    style={{
                      border: '1px solid #e2e8f0', background: '#fff', color: '#475569',
                      padding: '8px 16px', borderRadius: 8, cursor: 'pointer',
                      fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6
                    }}
                  >
                    <FiBookOpen size={14} /> Revert to Read
                  </button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default AdminContacts;
