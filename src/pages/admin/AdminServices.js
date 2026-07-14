import React, { useState, useEffect } from 'react';
import { FiTool, FiUser, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Loader from '../../components/common/Loader';
import SearchBar from '../../components/common/SearchBar';
import { adminService } from '../../services/adminService';
import { formatDate } from '../../utils/helpers';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    adminService.getServices()
      .then(res => {
        if (res.data && res.data.success) {
          setServices(res.data.services);
        }
      })
      .catch(err => {
        toast.error('Failed to load services.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSearch = (val) => {
    setSearchQuery(val);
  };

  const filteredServices = services.filter(s => {
    const q = searchQuery.toLowerCase();
    return (
      s.vehicle_name?.toLowerCase().includes(q) ||
      s.vehicle?.name?.toLowerCase().includes(q) ||
      s.vehicle?.registration_number?.toLowerCase().includes(q) ||
      s.service_center?.toLowerCase().includes(q) ||
      s.description?.toLowerCase().includes(q)
    );
  });

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
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0f172a' }}>Global Service History</h1>
            <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>View all maintenance and service records across the system</p>
          </div>
          <div style={{ width: 300 }}>
            <SearchBar
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search by vehicle, shop, description..."
            />
          </div>
        </div>

        {/* Content Card */}
        <div style={cardStyle}>
          {loading ? (
            <Loader text="Loading services..." />
          ) : filteredServices.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
              <FiTool size={48} style={{ marginBottom: 12, opacity: 0.5 }} />
              <p style={{ margin: 0, fontSize: 16 }}>No service records found.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={tableHeaderStyle}>Vehicle</th>
                    <th style={tableHeaderStyle}>Registration</th>
                    <th style={tableHeaderStyle}>Service Date</th>
                    <th style={tableHeaderStyle}>Odometer</th>
                    <th style={tableHeaderStyle}>Cost</th>
                    <th style={tableHeaderStyle}>Service Center</th>
                    <th style={tableHeaderStyle}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map(s => (
                    <tr key={s.id}>
                      <td style={tableCellStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: 8,
                            background: '#fffbeb', color: '#d97706',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <FiTool size={16} />
                          </div>
                          <div>
                            <p style={{ margin: 0, fontWeight: 600, color: '#0f172a' }}>{s.vehicle_name || s.vehicle?.name}</p>
                          </div>
                        </div>
                      </td>
                      <td style={tableCellStyle}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 600, background: '#f1f5f9', padding: '3px 8px', borderRadius: 4 }}>
                          {s.vehicle_registration || s.vehicle?.registration_number}
                        </span>
                      </td>
                      <td style={tableCellStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b' }}>
                          <FiCalendar size={14} />
                          {formatDate(s.service_date)}
                        </div>
                      </td>
                      <td style={tableCellStyle}>{s.odometer ? `${s.odometer.toLocaleString()} km` : '0 km'}</td>
                      <td style={tableCellStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', fontWeight: 600, color: '#10b981' }}>
                          <FiDollarSign size={13} />
                          {parseFloat(s.cost).toFixed(2)}
                        </div>
                      </td>
                      <td style={tableCellStyle}>{s.service_center || 'Not specified'}</td>
                      <td style={{ ...tableCellStyle, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={s.description}>
                        {s.description || 'N/A'}
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

export default AdminServices;
