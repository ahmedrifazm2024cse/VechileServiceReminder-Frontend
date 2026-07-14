import React from 'react';
import Sidebar from './Sidebar';
import { useTheme } from '../../context/ThemeContext';

const DashboardLayout = ({ children, isAdmin = false }) => {
  const { isDark } = useTheme();
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: isDark ? '#0f172a' : '#f8fafc' }}>
      <Sidebar isAdmin={isAdmin} />
      <main style={{ flex: 1, overflowX: 'hidden', minWidth: 0 }}>
        <div style={{ padding: '28px 32px', maxWidth: 1400 }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
