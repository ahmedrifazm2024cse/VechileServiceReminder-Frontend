import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTruck, FiAlertCircle, FiCheckCircle, FiBell, FiPlus, FiArrowRight, FiClock } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import { dashboardService } from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';
import { formatDate, getServiceStatus } from '../../utils/helpers';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getCustomerDashboard()
      .then(res => setData(res.data.dashboard))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><Loader text="Loading dashboard..." /></DashboardLayout>;

  const d = data || {};

  return (
    <DashboardLayout>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        {/* Welcome */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#0f172a' }}>
            Good morning, {user?.first_name}! 👋
          </h1>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 15 }}>
            Here's an overview of your vehicles and upcoming services.
          </p>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
          <StatCard
            title="Total Vehicles"
            value={d.total_vehicles || 0}
            icon={FiTruck}
            color="#3b82f6" bg="#eff6ff"
            onClick={() => window.location.href = '/vehicles'}
          />
          <StatCard
            title="Upcoming Services"
            value={d.upcoming_services_count || 0}
            icon={FiClock}
            color="#f59e0b" bg="#fffbeb"
          />
          <StatCard
            title="Overdue Services"
            value={d.overdue_services_count || 0}
            icon={FiAlertCircle}
            color="#ef4444" bg="#fff5f5"
          />
          <StatCard
            title="Reminders Active"
            value={d.reminder_enabled_count || 0}
            icon={FiBell}
            color="#10b981" bg="#ecfdf5"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 24 }}>
          {/* Upcoming Services */}
          <div style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#0f172a' }}>Upcoming Services</h2>
              <Link to="/vehicles" style={{ fontSize: 13, color: '#3b82f6', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                View all <FiArrowRight size={13} />
              </Link>
            </div>
            {(d.upcoming_services || []).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '28px 0', color: '#94a3b8' }}>
                <FiCheckCircle size={36} color="#10b981" style={{ marginBottom: 10 }} />
                <p style={{ margin: 0, fontSize: 14 }}>No upcoming services in the next 30 days.</p>
              </div>
            ) : (
              d.upcoming_services.map(v => {
                const status = getServiceStatus(v.days_until_service);
                return (
                  <Link key={v.id} to={`/vehicles/${v.id}`} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 0', borderBottom: '1px solid #f1f5f9', textDecoration: 'none',
                  }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{v.name}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>{v.registration_number}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Badge variant={v.days_until_service <= 7 ? 'warning' : 'info'}>
                        {v.days_until_service}d left
                      </Badge>
                      <p style={{ margin: '4px 0 0', fontSize: 11, color: '#94a3b8' }}>{formatDate(v.next_service_date)}</p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {/* Overdue Services */}
          <div style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#0f172a' }}>
                Overdue Services
                {(d.overdue_services || []).length > 0 && (
                  <span style={{ marginLeft: 8, background: '#fee2e2', color: '#dc2626', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>
                    {d.overdue_services.length}
                  </span>
                )}
              </h2>
            </div>
            {(d.overdue_services || []).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '28px 0', color: '#94a3b8' }}>
                <FiCheckCircle size={36} color="#10b981" style={{ marginBottom: 10 }} />
                <p style={{ margin: 0, fontSize: 14 }}>All vehicles are up to date!</p>
              </div>
            ) : (
              d.overdue_services.map(v => (
                <Link key={v.id} to={`/vehicles/${v.id}`} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 0', borderBottom: '1px solid #f1f5f9', textDecoration: 'none',
                }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{v.name}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>{v.registration_number}</p>
                  </div>
                  <Badge variant="danger">{Math.abs(v.days_until_service)}d overdue</Badge>
                </Link>
              ))
            )}
          </div>

          {/* Recent Vehicles */}
          <div style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#0f172a' }}>Recently Added Vehicles</h2>
              <Link to="/vehicles/add" style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 8,
                background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                color: '#fff', fontWeight: 600, fontSize: 13, textDecoration: 'none',
              }}>
                <FiPlus size={14} /> Add Vehicle
              </Link>
            </div>
            {(d.recent_vehicles || []).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '28px 0', color: '#94a3b8' }}>
                <FiTruck size={36} style={{ marginBottom: 10 }} />
                <p style={{ margin: '0 0 12px', fontSize: 14 }}>No vehicles added yet.</p>
                <Link to="/vehicles/add" style={{ color: '#3b82f6', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                  Add your first vehicle →
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
                {d.recent_vehicles.map(v => {
                  const status = getServiceStatus(v.days_until_service);
                  return (
                    <Link key={v.id} to={`/vehicles/${v.id}`} style={{
                      display: 'block', padding: '14px 16px', borderRadius: 12,
                      border: `1px solid ${v.is_overdue ? '#fee2e2' : '#f1f5f9'}`,
                      background: v.is_overdue ? '#fff5f5' : '#f8fafc',
                      textDecoration: 'none',
                      transition: 'transform 0.15s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = ''}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{v.name}</p>
                          <p style={{ margin: '2px 0 4px', fontSize: 12, color: '#64748b' }}>{v.registration_number}</p>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: status.bg, color: status.color }}>
                          {status.label}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>
                        Next service: {formatDate(v.next_service_date)}
                      </p>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;
