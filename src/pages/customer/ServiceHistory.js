import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiDownload, FiTool, FiUpload } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Loader from '../../components/common/Loader';
import SearchBar from '../../components/common/SearchBar';
import { serviceHistoryService } from '../../services/serviceHistoryService';
import { vehicleService } from '../../services/vehicleService';
import { formatDate, formatCurrency, getErrorMessage, downloadBlob } from '../../utils/helpers';

const EMPTY = { vehicle: '', service_date: '', odometer: '', cost: '', service_center: '', description: '', invoice: null };

const Field = ({ label, children, error, required, htmlFor }) => (
  <div style={{ marginBottom: 16 }}>
    <label htmlFor={htmlFor} style={{ display: 'block', marginBottom: 5, fontSize: 13, fontWeight: 500, color: '#374151' }}>
      {label}{required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}
    </label>
    {children}
    {error && <p style={{ margin: '4px 0 0', fontSize: 12, color: '#ef4444' }}>{error}</p>}
  </div>
);

const ServiceHistory = () => {
  const [searchParams] = useSearchParams();
  const vehicleIdParam = searchParams.get('vehicle_id');

  const [services, setServices] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState(vehicleIdParam || '');
  const [modal, setModal] = useState({ open: false, editing: null });
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [exporting, setExporting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sRes, vRes] = await Promise.all([
        serviceHistoryService.getAll({ vehicle_id: vehicleFilter }),
        vehicleService.getAll(),
      ]);
      setServices(sRes.data.services || []);
      setVehicles(vRes.data.vehicles || []);
    } catch { toast.error('Failed to load service history'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [vehicleFilter]);

  const filtered = services.filter(s =>
    s.vehicle_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.service_center?.toLowerCase().includes(search.toLowerCase()) ||
    s.description?.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setForm({ ...EMPTY, vehicle: vehicleFilter || (vehicles[0]?.id || '') });
    setErrors({});
    setModal({ open: true, editing: null });
  };

  const openEdit = (s) => {
    setForm({ vehicle: s.vehicle, service_date: s.service_date, odometer: s.odometer, cost: s.cost, service_center: s.service_center || '', description: s.description || '', invoice: null });
    setErrors({});
    setModal({ open: true, editing: s.id });
  };

  const validate = () => {
    const e = {};
    if (!form.vehicle) e.vehicle = 'Vehicle is required';
    if (!form.service_date) e.service_date = 'Service date is required';
    if (!form.odometer && form.odometer !== 0) e.odometer = 'Odometer is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (modal.editing) {
        await serviceHistoryService.update(modal.editing, form);
        toast.success('Service record updated');
      } else {
        await serviceHistoryService.create(form);
        toast.success('Service record added');
      }
      setModal({ open: false, editing: null });
      fetchData();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally { fontStyle: setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await serviceHistoryService.delete(deleteId);
      toast.success('Service record deleted');
      setDeleteId(null);
      fetchData();
    } catch { toast.error('Failed to delete'); }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const { data } = await serviceHistoryService.exportExcel({ vehicle_id: vehicleFilter });
      downloadBlob(data, 'service_history.xlsx');
      toast.success('Export downloaded');
    } catch { toast.error('Export failed'); }
    finally { setExporting(false); }
  };

  const inputStyle = (err) => ({
    width: '100%', padding: '9px 13px', border: `1px solid ${err ? '#ef4444' : '#e2e8f0'}`,
    borderRadius: 9, fontSize: 14, outline: 'none', boxSizing: 'border-box',
  });

  return (
    <DashboardLayout>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0f172a' }}>Service History</h1>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>{filtered.length} record{filtered.length !== 1 ? 's' : ''}</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleExport} disabled={exporting} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 9,
              border: '1px solid #e2e8f0', background: '#fff', color: '#475569', cursor: 'pointer', fontWeight: 500, fontSize: 13,
            }}>
              <FiDownload size={15} /> {exporting ? 'Exporting...' : 'Export Excel'}
            </button>
            <button onClick={openAdd} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 9,
              background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
            }}>
              <FiPlus size={16} /> Add Service
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 220px' }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Search services..." />
          </div>
          <select value={vehicleFilter} onChange={e => setVehicleFilter(e.target.value)} style={{
            padding: '9px 14px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', background: '#fff',
          }}>
            <option value="">All Vehicles</option>
            {vehicles.map(v => <option key={v.id} value={v.id}>{v.name} — {v.registration_number}</option>)}
          </select>
        </div>

        {/* Table */}
        {loading ? <Loader text="Loading services..." /> : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 14, border: '1px solid #f1f5f9' }}>
            <FiTool size={52} color="#cbd5e1" style={{ marginBottom: 16 }} />
            <h3 style={{ margin: '0 0 8px', color: '#334155' }}>No Service Records</h3>
            <p style={{ margin: '0 0 16px', color: '#94a3b8' }}>Add your first service record.</p>
            <button onClick={openAdd} style={{ padding: '9px 20px', borderRadius: 9, background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              Add Service Record
            </button>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f1f5f9', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    {['Vehicle', 'Service Date', 'Odometer', 'Cost', 'Service Center', 'Description', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, i) => (
                    <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={{ padding: '13px 16px' }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{s.vehicle_name}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94a3b8' }}>{s.vehicle_registration}</p>
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 13, color: '#0f172a', whiteSpace: 'nowrap' }}>{formatDate(s.service_date)}</td>
                      <td style={{ padding: '13px 16px', fontSize: 13, color: '#0f172a' }}>{s.odometer?.toLocaleString()} km</td>
                      <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 600, color: '#10b981' }}>{formatCurrency(s.cost)}</td>
                      <td style={{ padding: '13px 16px', fontSize: 13, color: '#0f172a' }}>{s.service_center || '—'}</td>
                      <td style={{ padding: '13px 16px', fontSize: 12, color: '#64748b', maxWidth: 180 }}>
                        {s.description ? s.description.substring(0, 60) + (s.description.length > 60 ? '...' : '') : '—'}
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => openEdit(s)} style={{ padding: '5px 10px', borderRadius: 7, background: '#eff6ff', color: '#3b82f6', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <FiEdit2 size={12} /> Edit
                          </button>
                          <button onClick={() => setDeleteId(s.id)} style={{ padding: '5px 10px', borderRadius: 7, background: '#fff5f5', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <FiTrash2 size={12} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, editing: null })}
        title={modal.editing ? 'Edit Service Record' : 'Add Service Record'}
        footer={
          <>
            <button onClick={() => setModal({ open: false, editing: null })} style={{ padding: '9px 20px', borderRadius: 9, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 14, color: '#475569' }}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} style={{ padding: '9px 24px', borderRadius: 9, border: 'none', background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: '#fff', fontWeight: 600, cursor: saving ? 'wait' : 'pointer', fontSize: 14 }}>
              {saving ? 'Saving...' : modal.editing ? 'Save Changes' : 'Add Record'}
            </button>
          </>
        }
      >
        <Field label="Vehicle" required error={errors.vehicle} htmlFor="vehicle-select">
          <select id="vehicle-select" value={form.vehicle} onChange={e => setForm({ ...form, vehicle: e.target.value })} style={inputStyle(errors.vehicle)}>
            <option value="">Select vehicle</option>
            {vehicles.map(v => <option key={v.id} value={v.id}>{v.name} — {v.registration_number}</option>)}
          </select>
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <Field label="Service Date" required error={errors.service_date} htmlFor="service-date-input">
            <input id="service-date-input" type="date" value={form.service_date} onChange={e => setForm({ ...form, service_date: e.target.value })} style={inputStyle(errors.service_date)} />
          </Field>
          <Field label="Odometer (km)" required error={errors.odometer} htmlFor="odometer-input">
            <input id="odometer-input" type="number" min={0} value={form.odometer} onChange={e => setForm({ ...form, odometer: e.target.value })} style={inputStyle(errors.odometer)} />
          </Field>
          <Field label="Cost (₹)" htmlFor="cost-input">
            <input id="cost-input" type="number" min={0} value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} style={inputStyle()} />
          </Field>
          <Field label="Service Center" htmlFor="service-center-input">
            <input id="service-center-input" type="text" value={form.service_center} onChange={e => setForm({ ...form, service_center: e.target.value })} placeholder="Service center name" style={inputStyle()} />
          </Field>
        </div>
        <Field label="Description" htmlFor="description-input">
          <textarea id="description-input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} style={{ ...inputStyle(), resize: 'vertical', fontFamily: 'inherit' }} placeholder="Service notes..." />
        </Field>
        <Field label="Invoice (PDF/Image)" htmlFor="invoice-file-input">
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer', fontSize: 13, color: '#475569' }}>
            <FiUpload size={14} /> {form.invoice ? form.invoice.name : 'Upload Invoice'}
            <input id="invoice-file-input" type="file" accept="image/*,.pdf" onChange={e => setForm({ ...form, invoice: e.target.files[0] || null })} style={{ display: 'none' }} />
          </label>
        </Field>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Service Record"
        message="Are you sure you want to delete this service record?"
        confirmText="Delete"
      />
    </DashboardLayout>
  );
};

export default ServiceHistory;





