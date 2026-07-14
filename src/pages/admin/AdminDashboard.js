import React, { useState, useEffect } from 'react';
import { FiUsers, FiTruck, FiTool, FiAlertCircle, FiBell, FiClock, FiMessageSquare } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import Loader from '../../components/common/Loader';
import { RegistrationsChart, ServicesChart, BrandDistributionChart } from '../../components/charts/DashboardCharts';
import { dashboardService } from '../../services/dashboardService';
import { formatDate } from '../../utils/helpers';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getAdminDashboard()
      .then(res => setData(res.data.dashboard))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout isAdmin><Loader text="Loading admin dashboard..." /></DashboardLayout>;

  const stats = data?.stats || {};
  const charts = data?.charts || {};
  const activities = data?.recent_activities || [];

  const activityIcon = (type) => {
    const map = { user_registered: { color: '#10b981', bg: '#ecfdf5', char: '👤' }, vehicle_added: { color: '#3b82f6', bg: '#eff6ff', char: '🚗' }, service_added: { color: '#f59e0b', bg: '#fffbeb', char: '🔧' } };
    return map[type] || { color: '#6366f1', bg: '#f5f3ff', char: '📋' };
  };

  return (
    <DashboardLayout isAdmin>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0f172a' }}>Admin Dashboard</h1>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>System overview and analytics</p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 18, marginBottom: 28 }}>
          <StatCard title="Total Users" value={stats.total_users} icon={FiUsers} color="#3b82f6" bg="#eff6ff" />
          <StatCard title="Total Vehicles" value={stats.total_vehicles} icon={FiTruck} color="#10b981" bg="#ecfdf5" />
          <StatCard title="Total Services" value={stats.total_services} icon={FiTool} color="#8b5cf6" bg="#f5f3ff" />
          <StatCard title="Upcoming Services" value={stats.upcoming_services} icon={FiClock} color="#f59e0b" bg="#fffbeb" />
          <StatCard title="Overdue Services" value={stats.overdue_services} icon={FiAlertCircle} color="#ef4444" bg="#fff5f5" />
          <StatCard title="Today's Reminders" value={stats.todays_reminders} icon={FiBell} color="#06b6d4" bg="#ecfeff" />
          <StatCard title="New Messages" value={stats.unread_messages} icon={FiMessageSquare} color="#f97316" bg="#fff7ed" />
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 24 }}>
          <RegistrationsChart data={charts.monthly_registrations || []} />
          <ServicesChart data={charts.monthly_services || []} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {/* Brand Distribution */}
          <BrandDistributionChart data={charts.brand_distribution || []} />

          {/* Recent Activity */}
          <div style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#0f172a' }}>Recent Activity</h3>
            {activities.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px 0', fontSize: 14 }}>No recent activity</p>
            ) : (
              <div>
                {activities.slice(0, 8).map((a, i) => {
                  const ac = activityIcon(a.type);
                  return (
                    <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: ac.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 15 }}>
                        {ac.char}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 13, color: '#0f172a', lineHeight: 1.5 }}>{a.message}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94a3b8' }}>
                          {formatDate(a.timestamp, 'MMM dd, yyyy HH:mm')}
                        </p>
                      </div>
                    </div>
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

export default AdminDashboard;
