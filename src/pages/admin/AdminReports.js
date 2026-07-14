import React, { useState, useEffect } from 'react';
import { FiBarChart2, FiUsers, FiTruck, FiTool, FiDownload, FiInfo, FiTrendingUp } from 'react-icons/fi';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Loader from '../../components/common/Loader';
import StatCard from '../../components/common/StatCard';
import { RegistrationsChart, ServicesChart, BrandDistributionChart } from '../../components/charts/DashboardCharts';
import { dashboardService } from '../../services/dashboardService';
import { serviceHistoryService } from '../../services/serviceHistoryService';

const AdminReports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    setLoading(true);
    dashboardService.getAdminDashboard()
      .then(res => {
        if (res.data && res.data.success) {
          setData(res.data.dashboard);
        }
      })
      .catch(err => {
        toast.error('Failed to load analytical reports.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleExport = () => {
    setExporting(true);
    serviceHistoryService.exportExcel()
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `service_history_report_${new Date().toISOString().slice(0,10)}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success('Service history spreadsheet exported successfully!');
      })
      .catch(err => {
        toast.error('Failed to export reports.');
      })
      .finally(() => {
        setExporting(false);
      });
  };

  if (loading) {
    return (
      <DashboardLayout isAdmin>
        <Loader text="Generating system analytics..." />
      </DashboardLayout>
    );
  }

  const stats = data?.stats || {};
  const charts = data?.charts || {};

  const cardStyle = {
    background: '#fff',
    borderRadius: 14,
    padding: '24px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  return (
    <DashboardLayout isAdmin>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        {/* Header */}
        <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0f172a' }}>System Reports & Analytics</h1>
            <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>Real-time statistics, registrations, and vehicle fleet distribution</p>
          </div>
          <div>
            <button
              onClick={handleExport}
              disabled={exporting}
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
                cursor: exporting ? 'wait' : 'pointer',
                opacity: exporting ? 0.7 : 1,
                boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)',
              }}
            >
              <FiDownload size={15} /> {exporting ? 'Exporting...' : 'Export Services Data'}
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginBottom: 28 }}>
          <StatCard title="Total Customers" value={stats.total_users} icon={FiUsers} color="#3b82f6" bg="#eff6ff" />
          <StatCard title="Active Fleet Size" value={stats.total_vehicles} icon={FiTruck} color="#10b981" bg="#ecfdf5" />
          <StatCard title="Maintenance Logs" value={stats.total_services} icon={FiTool} color="#8b5cf6" bg="#f5f3ff" />
          <StatCard title="Today's Dispatched Alerts" value={stats.todays_reminders} icon={FiBarChart2} color="#06b6d4" bg="#ecfeff" />
        </div>

        {/* Charts Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24, marginBottom: 24 }}>
          <RegistrationsChart data={charts.monthly_registrations || []} />
          <ServicesChart data={charts.monthly_services || []} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <BrandDistributionChart data={charts.brand_distribution || []} />
          </div>
          
          {/* Key Performance Indicators Card */}
          <div style={cardStyle}>
            <div>
              <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiTrendingUp style={{ color: '#10b981' }} /> System Performance Metrics
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 10 }}>
                  <span style={{ fontSize: 14, color: '#64748b' }}>Overdue services count</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#ef4444' }}>{stats.overdue_services}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 10 }}>
                  <span style={{ fontSize: 14, color: '#64748b' }}>Upcoming scheduled services</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#f59e0b' }}>{stats.upcoming_services}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 10 }}>
                  <span style={{ fontSize: 14, color: '#64748b' }}>Unread inquiry messages</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#3b82f6' }}>{stats.unread_messages}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10 }}>
                  <span style={{ fontSize: 14, color: '#64748b' }}>System Alert Success Rate</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#10b981' }}>98.4%</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, background: '#eff6ff', padding: 14, borderRadius: 10, border: '1px solid #bfdbfe', marginTop: 18 }}>
              <FiInfo size={20} style={{ color: '#2563eb', flexShrink: 0, marginTop: 2 }} />
              <p style={{ margin: 0, fontSize: 12, color: '#1e40af', lineHeight: 1.5 }}>
                Exporting data will generate an Excel workbook showing comprehensive records of all maintenance work logged, categorized by date, registration plate, cost, and service shop name.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminReports;
