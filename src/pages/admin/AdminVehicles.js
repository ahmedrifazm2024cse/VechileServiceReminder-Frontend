import React, { useState, useEffect } from 'react';
import { FiSearch, FiTrash2, FiUser, FiTruck, FiAlertCircle, FiSettings } from 'react-icons/fi';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import SearchBar from '../../components/common/SearchBar';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { adminService } from '../../services/adminService';
import { formatDate } from '../../utils/helpers';

const AdminVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, vehicleId: null });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchVehicles = (query = '') => {
    setLoading(true);
    adminService.getVehicles({ search: query })
      .then(res => {
        if (res.data && res.data.success) {
          setVehicles(res.data.vehicles);
        }
      })
      .catch(err => {
        toast.error('Failed to load vehicles.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchVehicles(searchQuery);
  }, []);

  const handleSearch = (val) => {
    setSearchQuery(val);
    fetchVehicles(val);
  };

  const openDeleteConfirm = (id) => {
    setDeleteConfirm({ isOpen: true, vehicleId: id });
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({ isOpen: false, vehicleId: null });
  };

  const handleDeleteVehicle = () => {
    setActionLoading(true);
    adminService.deleteVehicle(deleteConfirm.vehicleId)
      .then(res => {
        toast.success(res.data.message || 'Vehicle deleted successfully.');
        setVehicles(vehicles.filter(v => v.id !== deleteConfirm.vehicleId));
        closeDeleteConfirm();
      })
      .catch(err => {
        toast.error(err.response?.data?.message || 'Failed to delete vehicle.');
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

  const getFuelBadge = (fuel) => {
    const map = {
      petrol: 'warning',
      diesel: 'primary',
      electric: 'success',
      hybrid: 'purple',
    };
    return map[fuel?.toLowerCase()] || 'gray';
  };

  return (
    <DashboardLayout isAdmin>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        {/* Header */}
        <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0f172a' }}>Vehicle Fleet</h1>
            <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>Monitor and manage all user vehicles registered on the system</p>
          </div>
          <div style={{ width: 300 }}>
            <SearchBar
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search vehicles, plate, owner..."
            />
          </div>
        </div>

        {/* Content Card */}
        <div style={cardStyle}>
          {loading ? (
            <Loader text="Loading vehicles..." />
          ) : vehicles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
              <FiTruck size={48} style={{ marginBottom: 12, opacity: 0.5 }} />
              <p style={{ margin: 0, fontSize: 16 }}>No vehicles registered on the platform.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={tableHeaderStyle}>Vehicle Info</th>
                    <th style={tableHeaderStyle}>Registration</th>
                    <th style={tableHeaderStyle}>Owner</th>
                    <th style={tableHeaderStyle}>Fuel Type</th>
                    <th style={tableHeaderStyle}>Odometer</th>
                    <th style={tableHeaderStyle}>Last Service Date</th>
                    <th style={tableHeaderStyle} className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map(v => (
                    <tr key={v.id}>
                      <td style={tableCellStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: 8,
                            background: '#eff6ff', color: '#2563eb',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <FiTruck size={18} />
                          </div>
                          <div>
                            <p style={{ margin: 0, fontWeight: 600, color: '#0f172a' }}>{v.name}</p>
                            <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>{v.brand} {v.model} ({v.year})</p>
                          </div>
                        </div>
                      </td>
                      <td style={tableCellStyle}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 600, background: '#f1f5f9', padding: '3px 8px', borderRadius: 4 }}>
                          {v.registration_number}
                        </span>
                      </td>
                      <td style={tableCellStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <FiUser size={14} style={{ color: '#64748b' }} />
                          <div>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{v.owner_name || 'System User'}</p>
                            <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>{v.owner_email || v.owner}</p>
                          </div>
                        </div>
                      </td>
                      <td style={tableCellStyle}>
                        <Badge variant={getFuelBadge(v.fuel_type)}>
                          {v.fuel_type ? v.fuel_type.toUpperCase() : 'N/A'}
                        </Badge>
                      </td>
                      <td style={tableCellStyle}>{v.odometer_reading ? `${v.odometer_reading.toLocaleString()} km` : '0 km'}</td>
                      <td style={tableCellStyle}>
                        {v.last_service_date ? formatDate(v.last_service_date) : 'No recorded service'}
                      </td>
                      <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <button
                            onClick={() => openDeleteConfirm(v.id)}
                            style={{
                              border: 'none', background: 'none', cursor: 'pointer',
                              padding: 6, borderRadius: 6, display: 'flex', alignItems: 'center',
                              color: '#ef4444',
                            }}
                            title="Delete Vehicle"
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
        onConfirm={handleDeleteVehicle}
        title="Delete Vehicle Profile"
        message="Are you sure you want to permanently remove this vehicle from the system? Its entire service history and settings will be deleted. This cannot be undone."
        confirmText="Delete Vehicle"
        loading={actionLoading}
        variant="danger"
      />
    </DashboardLayout>
  );
};

export default AdminVehicles;
