import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiUpload, FiTruck } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import FormInput from '../../components/common/FormInput';
import { vehicleService } from '../../services/vehicleService';
import { getErrorMessage, FUEL_TYPES } from '../../utils/helpers';

const INITIAL = {
  name: '', brand: '', model: '', registration_number: '',
  fuel_type: 'petrol', year: new Date().getFullYear(), odometer_reading: 0,
  last_service_date: '', service_interval_months: 6, service_interval_km: 5000,
  insurance_expiry: '', pollution_certificate_expiry: '', notes: '', image: '',
};

const Section = ({ title, children }) => (
  <div style={{ background: '#fff', borderRadius: 14, padding: '22px 24px', border: '1px solid #f1f5f9', marginBottom: 20 }}>
    <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 600, color: '#0f172a', paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>{title}</h3>
    {children}
  </div>
);

const AddVehicle = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Vehicle name is required';
    if (!form.brand.trim()) e.brand = 'Brand is required';
    if (!form.model.trim()) e.model = 'Model is required';
    if (!form.registration_number.trim()) e.registration_number = 'Registration number is required';
    if (!form.last_service_date) e.last_service_date = 'Last service date is required';
    const yr = Number(form.year);
    if (!yr || yr < 1900 || yr > new Date().getFullYear() + 1) e.year = 'Enter a valid year';
    if (Number(form.odometer_reading) < 0) e.odometer_reading = 'Cannot be negative';
    if (Number(form.service_interval_months) < 1) e.service_interval_months = 'Minimum 1 month';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (name === 'image') {
      setPreview(value);
    }
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { toast.error('Please fix validation errors'); return; }
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.insurance_expiry) payload.insurance_expiry = null;
      if (!payload.pollution_certificate_expiry) payload.pollution_certificate_expiry = null;
      if (!payload.image) payload.image = null;

      await vehicleService.create(payload);
      toast.success('Vehicle added successfully!');
      navigate('/vehicles');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const inputProps = (name, extra = {}) => ({
    name, value: form[name] || '', onChange: handleChange,
    error: errors[name], ...extra,
  });

  return (
    <DashboardLayout>
      <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: 900 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Link to="/vehicles" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', textDecoration: 'none', fontSize: 14 }}>
            <FiArrowLeft size={16} /> Back
          </Link>
          <span style={{ color: '#e2e8f0' }}>/</span>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0f172a' }}>Add New Vehicle</h1>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Vehicle Image URL */}
          <Section title="Vehicle Image">
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <div style={{
                width: 120, height: 100, borderRadius: 12,
                border: '2px dashed #e2e8f0', overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#f8fafc',
              }}>
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <FiTruck size={36} color="#cbd5e1" />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 260 }}>
                <FormInput
                  label="Vehicle Image URL"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </Section>

          {/* Basic Info */}
          <Section title="Vehicle Information">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 20px' }}>
              <FormInput label="Vehicle Name" required {...inputProps('name')} placeholder="e.g. My Toyota Camry" />
              <FormInput label="Brand" required {...inputProps('brand')} placeholder="e.g. Toyota" />
              <FormInput label="Model" required {...inputProps('model')} placeholder="e.g. Camry" />
              <FormInput label="Registration Number" required {...inputProps('registration_number')} placeholder="e.g. TN-01-AB-1234" hint="Uppercase recommended" />
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#374151' }}>
                  Fuel Type <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select name="fuel_type" value={form.fuel_type} onChange={handleChange} style={{
                  width: '100%', padding: '10px 13px', border: '1px solid #e2e8f0',
                  borderRadius: 10, fontSize: 14, outline: 'none', color: '#0f172a', background: '#fff',
                }}>
                  {FUEL_TYPES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </div>
              <FormInput label="Year" type="number" required {...inputProps('year')} min={1900} max={new Date().getFullYear() + 1} />
              <FormInput label="Odometer Reading (km)" type="number" {...inputProps('odometer_reading')} min={0} />
            </div>
          </Section>

          {/* Service Info */}
          <Section title="Service Schedule">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 20px' }}>
              <FormInput label="Last Service Date" type="date" required {...inputProps('last_service_date')} />
              <FormInput label="Service Interval (Months)" type="number" required {...inputProps('service_interval_months')} min={1} max={120} hint="How often service is needed" />
              <FormInput label="Service Interval (km)" type="number" {...inputProps('service_interval_km')} min={0} />
            </div>
          </Section>

          {/* Documents */}
          <Section title="Documents & Validity">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0 20px' }}>
              <FormInput label="Insurance Expiry Date" type="date" {...inputProps('insurance_expiry')} />
              <FormInput label="PUC Certificate Expiry" type="date" {...inputProps('pollution_certificate_expiry')} />
            </div>
          </Section>

          {/* Notes */}
          <Section title="Additional Notes">
            <div>
              <textarea
                name="notes" value={form.notes} onChange={handleChange}
                placeholder="Any additional notes about this vehicle..."
                rows={4}
                style={{
                  width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0',
                  borderRadius: 10, fontSize: 14, outline: 'none', resize: 'vertical',
                  fontFamily: 'inherit', color: '#0f172a', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          </Section>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" disabled={loading} style={{
              padding: '12px 32px', borderRadius: 10, border: 'none',
              background: loading ? '#93c5fd' : 'linear-gradient(135deg, #1e40af, #3b82f6)',
              color: '#fff', fontWeight: 700, fontSize: 15, cursor: loading ? 'wait' : 'pointer',
            }}>
              {loading ? 'Adding Vehicle...' : 'Add Vehicle'}
            </button>
            <Link to="/vehicles" style={{
              padding: '12px 24px', borderRadius: 10, border: '1px solid #e2e8f0',
              color: '#475569', fontWeight: 500, fontSize: 15, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center',
            }}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddVehicle;
