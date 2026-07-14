import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';
import ServicesPage from './pages/public/ServicesPage';
import ContactPage from './pages/public/ContactPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import ResetPasswordPage from './pages/public/ResetPasswordPage';

// Customer Pages
import CustomerDashboard from './pages/customer/Dashboard';
import ProfilePage from './pages/customer/ProfilePage';
import MyVehicles from './pages/customer/MyVehicles';
import AddVehicle from './pages/customer/AddVehicle';
import EditVehicle from './pages/customer/EditVehicle';
import VehicleDetails from './pages/customer/VehicleDetails';
import ServiceHistoryPage from './pages/customer/ServiceHistory';
import ReminderSettings from './pages/customer/ReminderSettings';
import NotificationsPage from './pages/customer/NotificationsPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminVehicles from './pages/admin/AdminVehicles';
import AdminServices from './pages/admin/AdminServices';
import AdminReminderLogs from './pages/admin/AdminReminderLogs';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';
import AdminContacts from './pages/admin/AdminContacts';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Customer Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/vehicles" element={<ProtectedRoute><MyVehicles /></ProtectedRoute>} />
            <Route path="/vehicles/add" element={<ProtectedRoute><AddVehicle /></ProtectedRoute>} />
            <Route path="/vehicles/edit/:id" element={<ProtectedRoute><EditVehicle /></ProtectedRoute>} />
            <Route path="/vehicles/:id" element={<ProtectedRoute><VehicleDetails /></ProtectedRoute>} />
            <Route path="/service-history" element={<ProtectedRoute><ServiceHistoryPage /></ProtectedRoute>} />
            <Route path="/reminder-settings" element={<ProtectedRoute><ReminderSettings /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

            {/* Admin Protected Routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/vehicles" element={<AdminRoute><AdminVehicles /></AdminRoute>} />
            <Route path="/admin/services" element={<AdminRoute><AdminServices /></AdminRoute>} />
            <Route path="/admin/reminder-logs" element={<AdminRoute><AdminReminderLogs /></AdminRoute>} />
            <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
            <Route path="/admin/contacts" element={<AdminRoute><AdminContacts /></AdminRoute>} />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>

        <ToastContainer
          position="top-right"
          autoClose={3500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
