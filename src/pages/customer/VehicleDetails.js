import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FiArrowLeft, FiEdit2, FiTrash2, FiTruck, FiCalendar,
  FiShield, FiTool, FiPlus, FiClock, FiBell
} from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { vehicleService } from '../../services/vehicleService';
import { serviceHistoryService } from '../../services/serviceHistoryService';
import { notificationService } from '../../services/notificationService';
import { formatDate, getServiceStatus, getFuelTypeLabel, formatCurrency } from '../../utils/helpers';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [services, setServices] = useState([]);
  const [reminder, setReminder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);

  useEffect(() => {
    Promise.all([
      vehicleService.getById(id),
      serviceHistoryService.getAll({ vehicle_id: id }),
      notificationService.getReminders(id),
    ]).then(([vRes, sRes, rRes]) => {
      setVehicle(vRes.data.vehicle);
      setServices(sRes.data.services || []);
      setReminder(rRes.data.reminder || null);
    }).catch(() => toast.error('Failed to load vehicle details'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    try {
      await vehicleService.delete(id);
      toast.success('Vehicle deleted');
      navigate('/vehicles');
    } catch {
      toast.error('Failed to delete vehicle');
    }
  };

  if (loading) return <DashboardLayout><Loader text="Loading vehicle details..." /></DashboardLayout>;
  if (!vehicle) return <DashboardLayout><p>Vehicle not found</p></DashboardLayout>;

  const status = getServiceStatus(vehicle.days_until_service);

  const InfoRow = ({ label, value, highlight }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
      <span style={{ fontSize: 13, color: '#64748b' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: highlight || '#0f172a' }}>{value || '—'}</span>
    </div>
  );

  return (
    <DashboardLayout>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Link to="/vehicles" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', textDecoration: 'none', fontSize: 14 }}>
            <FiArrowLeft size={16} /> My Vehicles
          </Link>
          <span style={{ color: '#e2e8f0' }}>/</span>
          <span style={{ fontSize: 14, color: '#0f172a', fontWeight: 500 }}>{vehicle.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
          {/* Left: Vehicle Card */}
          <div>
            {/* Image */}
            <div style={{
              borderRadius: 14, overflow: 'hidden', marginBottom: 20,
              background: 'linear-gradient(135deg, #1e3a8a, #1e40af)',
              height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              {vehicle.image_url ? (
                <img src={vehicle.image_url} alt={vehicle.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <FiTruck size={72} color="rgba(255,255,255,0.2)" />
              )}
              <div style={{ position: 'absolute', bottom: 16, left: 16 }}>
                <p style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: 18 }}>{vehicle.name}</p>
                <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{vehicle.registration_number}</p>
              </div>
              <span style={{
                position: 'absolute', top: 16, right: 16,
                padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                background: status.bg, color: status.color,
              }}>
                {status.label}
              </span>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <Link to={`/vehicles/edit/${id}`} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 6, padding: '10px', borderRadius: 10,
                background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none',
              }}>
                <FiEdit2 size={15} /> Edit Vehicle
              </Link>
              <button onClick={() => setDeleteDialog(true)} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 6, padding: '10px', borderRadius: 10,
                background: '#fff5f5', color: '#ef4444', border: '1px solid #fee2e2',
                fontWeight: 600, fontSize: 14, cursor: 'pointer',
              }}>
                <FiTrash2 size={15} /> Delete
              </button>
            </div>

            {/* Service Status Card */}
            <div style={{
              background: status.bg, borderRadius: 14, padding: '18px 20px',
              border: `1px solid ${status.color}30`, marginBottom: 20,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FiClock size={22} color={status.color} />
                <div>
                  <p style={{ margin: 0, fontSize: 13, color: status.color, fontWeight: 600 }}>
                    {vehicle.days_until_service < 0
                      ? `${Math.abs(vehicle.days_until_service)} days overdue`
                      : vehicle.days_until_service === 0
                      ? 'Service due today!'
                      : `${vehicle.days_until_service} days until service`}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>
                    Next service: {formatDate(vehicle.next_service_date)}
                  </p>
                </div>
              </div>
            </div>

            {/* Reminder Status */}
            {reminder && (
              <div style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', border: '1px solid #f1f5f9', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FiBell size={18} color={reminder.is_enabled ? '#10b981' : '#94a3b8'} />
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#0f172a' }}>Reminders</span>
                  </div>
                  <Badge variant={reminder.is_enabled ? 'success' : 'gray'}>
                    {reminder.is_enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                {reminder.is_enabled && reminder.reminder_days?.length > 0 && (
                  <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {reminder.reminder_days.sort((a, b) => b - a).map(d => (
                      <span key={d} style={{ padding: '2px 10px', borderRadius: 20, background: '#eff6ff', color: '#3b82f6', fontSize: 12, fontWeight: 600 }}>
                        {d}d before
                      </span>
                    ))}
                  </div>
                )}
                <Link to="/reminder-settings" style={{ display: 'block', marginTop: 10, fontSize: 13, color: '#3b82f6', textDecoration: 'none' }}>
                  Manage reminder settings →
                </Link>
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div>
            {/* Vehicle Info */}
            <div style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', border: '1px solid #f1f5f9', marginBottom: 20 }}>
              <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiTruck size={16} color="#3b82f6" /> Vehicle Details
              </h3>
              <div style={{ paddingTop: 12 }}>
                <InfoRow label="Brand" value={vehicle.brand} />
                <InfoRow label="Model" value={vehicle.model} />
                <InfoRow label="Year" value={vehicle.year} />
                <InfoRow label="Fuel Type" value={getFuelTypeLabel(vehicle.fuel_type)} />
                <InfoRow label="Odometer" value={`${vehicle.odometer_reading?.toLocaleString()} km`} />
                <InfoRow label="Last Service" value={formatDate(vehicle.last_service_date)} />
                <InfoRow label="Service Every" value={`${vehicle.service_interval_months} months / ${vehicle.service_interval_km?.toLocaleString()} km`} />
                {vehicle.notes && (
                  <div style={{ padding: '10px 0' }}>
                    <p style={{ margin: '0 0 4px', fontSize: 13, color: '#64748b' }}>Notes</p>
                    <p style={{ margin: 0, fontSize: 13, color: '#0f172a' }}>{vehicle.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Documents */}
            <div style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', border: '1px solid #f1f5f9', marginBottom: 20 }}>
              <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiShield size={16} color="#8b5cf6" /> Documents
              </h3>
              <div style={{ paddingTop: 12 }}>
                <InfoRow
                  label="Insurance Expiry"
                  value={vehicle.insurance_expiry ? formatDate(vehicle.insurance_expiry) : 'Not set'}
                  highlight={vehicle.insurance_expiry && new Date(vehicle.insurance_expiry) < new Date() ? '#ef4444' : null}
                />
                <InfoRow
                  label="PUC Certificate"
                  value={vehicle.pollution_certificate_expiry ? formatDate(vehicle.pollution_certificate_expiry) : 'Not set'}
                  highlight={vehicle.pollution_certificate_expiry && new Date(vehicle.pollution_certificate_expiry) < new Date() ? '#ef4444' : null}
                />
              </div>
            </div>

            {/* Service History */}
            <div style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FiTool size={16} color="#10b981" /> Service History
                </h3>
                <Link to={`/service-history?vehicle_id=${id}`} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', borderRadius: 8,
                  background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                  color: '#fff', fontWeight: 600, fontSize: 12, textDecoration: 'none',
                }}>
                  <FiPlus size={13} /> Add Service
                </Link>
              </div>
              {services.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 14, padding: '20px 0' }}>
                  No service records yet.
                </p>
              ) : (
                services.slice(0, 5).map((s, i) => (
                  <div key={s.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                    padding: '10px 0', borderBottom: i < services.length - 1 ? '1px solid #f1f5f9' : 'none',
                  }}>
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{formatDate(s.service_date)}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>{s.service_center || 'Service Center'}</p>
                      {s.description && <p style={{ margin: '2px 0 0', fontSize: 12, color: '#94a3b8' }}>{s.description}</p>}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#10b981' }}>{formatCurrency(s.cost)}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94a3b8' }}>{s.odometer?.toLocaleString()} km</p>
                    </div>
                  </div>
                ))
              )}
              {services.length > 5 && (
                <Link to={`/service-history?vehicle_id=${id}`} style={{ display: 'block', textAlign: 'center', marginTop: 12, color: '#3b82f6', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>
                  View all {services.length} records →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Vehicle"
        message={`Are you sure you want to delete "${vehicle.name}"? This will also delete all service records and reminders. This cannot be undone.`}
        confirmText="Delete Vehicle"
        variant="danger"
      />
    </DashboardLayout>
  );
};

export default VehicleDetails;
