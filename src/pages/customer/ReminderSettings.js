import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiBell, FiBellOff, FiCheck } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import { notificationService } from '../../services/notificationService';
import { vehicleService } from '../../services/vehicleService';
import { formatDate, getServiceStatus, REMINDER_DAYS_OPTIONS } from '../../utils/helpers';

const ReminderSettings = () => {
  const [vehicles, setVehicles] = useState([]);
  const [reminders, setReminders] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [vRes, rRes] = await Promise.all([
          vehicleService.getAll(),
          notificationService.getReminders(),
        ]);
        setVehicles(vRes.data.vehicles || []);
        const reminderMap = {};
        (rRes.data.reminders || []).forEach(r => {
          reminderMap[r.vehicle] = r;
        });
        setReminders(reminderMap);
      } catch { toast.error('Failed to load reminder settings'); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const getReminderForVehicle = (vehicleId) => {
    return reminders[vehicleId] || { is_enabled: false, reminder_days: [30, 15, 7, 1] };
  };

  const handleToggle = async (vehicleId) => {
    const current = getReminderForVehicle(vehicleId);
    setSaving(s => ({ ...s, [vehicleId]: true }));
    try {
      const { data } = await notificationService.updateReminder({
        vehicle_id: vehicleId,
        is_enabled: !current.is_enabled,
        reminder_days: current.reminder_days,
      });
      setReminders(r => ({ ...r, [vehicleId]: data.reminder }));
      toast.success(`Reminder ${data.reminder.is_enabled ? 'enabled' : 'disabled'}`);
    } catch { toast.error('Failed to update reminder'); }
    finally { setSaving(s => ({ ...s, [vehicleId]: false })); }
  };

  const handleDayToggle = async (vehicleId, day) => {
    const current = getReminderForVehicle(vehicleId);
    const days = current.reminder_days.includes(day)
      ? current.reminder_days.filter(d => d !== day)
      : [...current.reminder_days, day];
    if (days.length === 0) { toast.error('Select at least one reminder day'); return; }
    setSaving(s => ({ ...s, [vehicleId]: true }));
    try {
      const { data } = await notificationService.updateReminder({
        vehicle_id: vehicleId,
        is_enabled: current.is_enabled,
        reminder_days: days,
      });
      setReminders(r => ({ ...r, [vehicleId]: data.reminder }));
      toast.success('Reminder days updated');
    } catch { toast.error('Failed to update reminder days'); }
    finally { setSaving(s => ({ ...s, [vehicleId]: false })); }
  };

  if (loading) return <DashboardLayout><Loader text="Loading reminder settings..." /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0f172a' }}>Reminder Settings</h1>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>
            Configure email reminders for each vehicle's service schedule.
          </p>
        </div>

        {/* Info Banner */}
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '14px 18px', marginBottom: 24, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <FiBell size={18} color="#3b82f6" style={{ marginTop: 1, flexShrink: 0 }} />
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#1e40af' }}>How Reminders Work</p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#3730a3' }}>
              When enabled, automatic emails are sent to your registered email address on the selected days before your vehicle's service date. Reminders are sent once per interval to avoid duplicates.
            </p>
          </div>
        </div>

        {vehicles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', background: '#fff', borderRadius: 14 }}>
            <FiBell size={52} color="#cbd5e1" style={{ marginBottom: 16 }} />
            <p style={{ color: '#94a3b8' }}>No vehicles found. Add a vehicle to configure reminders.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {vehicles.map(vehicle => {
              const reminder = getReminderForVehicle(vehicle.id);
              const status = getServiceStatus(vehicle.days_until_service);
              const isSaving = saving[vehicle.id];

              return (
                <div key={vehicle.id} style={{
                  background: '#fff', borderRadius: 14, padding: '20px 24px',
                  border: `1px solid ${reminder.is_enabled ? '#bfdbfe' : '#f1f5f9'}`,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: reminder.is_enabled ? 20 : 0 }}>
                    {/* Vehicle Info */}
                    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 10,
                        background: reminder.is_enabled ? '#eff6ff' : '#f8fafc',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {reminder.is_enabled
                          ? <FiBell size={20} color="#3b82f6" />
                          : <FiBellOff size={20} color="#94a3b8" />
                        }
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: 15, color: '#0f172a' }}>{vehicle.name}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>
                          {vehicle.registration_number} • Next service: {formatDate(vehicle.next_service_date)}
                        </p>
                      </div>
                    </div>

                    {/* Toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Badge variant={status.label === 'Overdue' ? 'danger' : status.label === 'Urgent' ? 'warning' : status.label === 'Upcoming' ? 'info' : 'success'}>
                        {status.label}
                      </Badge>
                      <button
                        onClick={() => handleToggle(vehicle.id)}
                        disabled={isSaving}
                        style={{
                          width: 52, height: 28, borderRadius: 14,
                          background: reminder.is_enabled ? '#3b82f6' : '#e2e8f0',
                          border: 'none', cursor: isSaving ? 'wait' : 'pointer',
                          position: 'relative', transition: 'background 0.2s',
                        }}
                      >
                        <span style={{
                          position: 'absolute', top: 3,
                          left: reminder.is_enabled ? 26 : 3,
                          width: 22, height: 22, borderRadius: '50%',
                          background: '#fff', transition: 'left 0.2s',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                        }} />
                      </button>
                      <span style={{ fontSize: 13, fontWeight: 500, color: reminder.is_enabled ? '#3b82f6' : '#94a3b8' }}>
                        {reminder.is_enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>

                  {/* Reminder Days */}
                  {reminder.is_enabled && (
                    <div>
                      <p style={{ margin: '0 0 12px', fontSize: 13, color: '#64748b', fontWeight: 500 }}>
                        Send reminders:
                      </p>
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        {REMINDER_DAYS_OPTIONS.map(opt => {
                          const active = reminder.reminder_days?.includes(opt.value);
                          return (
                            <button
                              key={opt.value}
                              onClick={() => handleDayToggle(vehicle.id, opt.value)}
                              disabled={isSaving}
                              style={{
                                padding: '7px 14px', borderRadius: 8,
                                border: `1.5px solid ${active ? '#3b82f6' : '#e2e8f0'}`,
                                background: active ? '#eff6ff' : '#fff',
                                color: active ? '#1d4ed8' : '#64748b',
                                cursor: isSaving ? 'wait' : 'pointer',
                                fontSize: 13, fontWeight: active ? 600 : 400,
                                display: 'flex', alignItems: 'center', gap: 6,
                                transition: 'all 0.15s',
                              }}
                            >
                              {active && <FiCheck size={13} strokeWidth={3} />}
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ReminderSettings;
