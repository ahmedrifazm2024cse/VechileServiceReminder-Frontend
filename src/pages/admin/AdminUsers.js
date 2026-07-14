import React, { useState, useEffect } from 'react';
import { FiSearch, FiTrash2, FiUserCheck, FiUserX, FiMail, FiCalendar, FiShield } from 'react-icons/fi';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import SearchBar from '../../components/common/SearchBar';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { adminService } from '../../services/adminService';
import { formatDate } from '../../utils/helpers';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals / Dialogs state
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, userId: null });
  const [toggleConfirm, setToggleConfirm] = useState({ isOpen: false, userId: null, currentStatus: null });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = (query = '') => {
    setLoading(true);
    adminService.getUsers({ search: query })
      .then(res => {
        if (res.data && res.data.success) {
          setUsers(res.data.users);
        }
      })
      .catch(err => {
        toast.error('Failed to load users.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers(searchQuery);
  }, []);

  const handleSearch = (val) => {
    setSearchQuery(val);
    fetchUsers(val);
  };

  const openDeleteConfirm = (id) => {
    setDeleteConfirm({ isOpen: true, userId: id });
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({ isOpen: false, userId: null });
  };

  const handleDeleteUser = () => {
    setActionLoading(true);
    adminService.deleteUser(deleteConfirm.userId)
      .then(res => {
        toast.success(res.data.message || 'User deleted successfully.');
        setUsers(users.filter(u => u.id !== deleteConfirm.userId));
        closeDeleteConfirm();
      })
      .catch(err => {
        const msg = err.response?.data?.message || 'Failed to delete user.';
        toast.error(msg);
      })
      .finally(() => {
        setActionLoading(false);
      });
  };

  const openToggleConfirm = (id, status) => {
    setToggleConfirm({ isOpen: true, userId: id, currentStatus: status });
  };

  const closeToggleConfirm = () => {
    setToggleConfirm({ isOpen: false, userId: null, currentStatus: null });
  };

  const handleToggleStatus = () => {
    setActionLoading(true);
    const newStatus = !toggleConfirm.currentStatus;
    adminService.toggleUserStatus(toggleConfirm.userId, newStatus)
      .then(res => {
        toast.success(res.data.message || 'User status updated.');
        setUsers(users.map(u => u.id === toggleConfirm.userId ? { ...u, is_active: newStatus } : u));
        closeToggleConfirm();
      })
      .catch(err => {
        toast.error(err.response?.data?.message || 'Failed to update user status.');
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

  return (
    <DashboardLayout isAdmin>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        {/* Header */}
        <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0f172a' }}>User Management</h1>
            <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>Manage user accounts, roles, and status</p>
          </div>
          <div style={{ width: 300 }}>
            <SearchBar
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search by name or email..."
            />
          </div>
        </div>

        {/* Content Card */}
        <div style={cardStyle}>
          {loading ? (
            <Loader text="Loading users..." />
          ) : users.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
              <FiMail size={48} style={{ marginBottom: 12, opacity: 0.5 }} />
              <p style={{ margin: 0, fontSize: 16 }}>No users found matching your search.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={tableHeaderStyle}>User</th>
                    <th style={tableHeaderStyle}>Email</th>
                    <th style={tableHeaderStyle}>Role</th>
                    <th style={tableHeaderStyle}>Joined Date</th>
                    <th style={tableHeaderStyle}>Status</th>
                    <th style={tableHeaderStyle} className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td style={tableCellStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: u.is_admin ? '#eff6ff' : '#f5f3ff',
                            color: u.is_admin ? '#2563eb' : '#7c3aed',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 600, fontSize: 14
                          }}>
                            {u.first_name ? u.first_name[0].toUpperCase() : 'U'}
                          </div>
                          <div>
                            <p style={{ margin: 0, fontWeight: 600, color: '#0f172a' }}>{u.first_name} {u.last_name}</p>
                            {u.phone_number && <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>{u.phone_number}</p>}
                          </div>
                        </div>
                      </td>
                      <td style={tableCellStyle}>{u.email}</td>
                      <td style={tableCellStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {u.is_admin ? (
                            <Badge variant="purple"><FiShield size={12} /> Admin</Badge>
                          ) : (
                            <Badge variant="primary">Customer</Badge>
                          )}
                        </div>
                      </td>
                      <td style={tableCellStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b' }}>
                          <FiCalendar size={14} />
                          {formatDate(u.date_joined)}
                        </div>
                      </td>
                      <td style={tableCellStyle}>
                        <Badge variant={u.is_active ? 'success' : 'danger'}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                          <button
                            onClick={() => openToggleConfirm(u.id, u.is_active)}
                            disabled={u.is_admin} // Don't allow toggling self/admin accounts easily
                            style={{
                              border: 'none', background: 'none', cursor: u.is_admin ? 'not-allowed' : 'pointer',
                              padding: 6, borderRadius: 6, display: 'flex', alignItems: 'center',
                              color: u.is_active ? '#eab308' : '#10b981',
                              opacity: u.is_admin ? 0.3 : 1
                            }}
                            title={u.is_active ? 'Deactivate User' : 'Activate User'}
                          >
                            {u.is_active ? <FiUserX size={18} /> : <FiUserCheck size={18} />}
                          </button>
                          <button
                            onClick={() => openDeleteConfirm(u.id)}
                            disabled={u.is_admin} // Safe check
                            style={{
                              border: 'none', background: 'none', cursor: u.is_admin ? 'not-allowed' : 'pointer',
                              padding: 6, borderRadius: 6, display: 'flex', alignItems: 'center',
                              color: '#ef4444',
                              opacity: u.is_admin ? 0.3 : 1
                            }}
                            title="Delete User"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={closeDeleteConfirm}
        onConfirm={handleDeleteUser}
        title="Delete User Account"
        message="Are you sure you want to permanently delete this user? All their associated vehicles and service logs will be permanently deleted as well. This action cannot be undone."
        confirmText="Delete User"
        loading={actionLoading}
        variant="danger"
      />

      {/* Toggle Status Confirmation */}
      <ConfirmDialog
        isOpen={toggleConfirm.isOpen}
        onClose={closeToggleConfirm}
        onConfirm={handleToggleStatus}
        title={toggleConfirm.currentStatus ? 'Deactivate Account' : 'Activate Account'}
        message={`Are you sure you want to ${toggleConfirm.currentStatus ? 'deactivate' : 'activate'} this user account? ${toggleConfirm.currentStatus ? 'The user will be unable to log in until reactivated.' : 'The user will regain login access.'}`}
        confirmText={toggleConfirm.currentStatus ? 'Deactivate' : 'Activate'}
        loading={actionLoading}
        variant={toggleConfirm.currentStatus ? 'warning' : 'primary'}
      />
    </DashboardLayout>
  );
};

export default AdminUsers;
