import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiTruck, FiFilter } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import SearchBar from '../../components/common/SearchBar';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import Pagination from '../../components/common/Pagination';
import { useVehicles } from '../../hooks/useVehicles';
import { useDebounce } from '../../hooks/useDebounce';
import { formatDate, getServiceStatus, FUEL_TYPES } from '../../utils/helpers';

const PAGE_SIZE = 9;

const MyVehicles = () => {
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const debouncedSearch = useDebounce(search, 400);

  const { vehicles, loading, deleteVehicle } = useVehicles({
    search: debouncedSearch,
    brand: brandFilter,
    status: statusFilter,
  });

  const paginated = vehicles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(vehicles.length / PAGE_SIZE);

  const handleDelete = async () => {
    if (!deleteId) return;
    const ok = await deleteVehicle(deleteId);
    if (ok) setDeleteId(null);
  };

  return (
    <DashboardLayout>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0f172a' }}>My Vehicles</h1>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>{vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}</p>
          </div>
          <Link to="/vehicles/add" style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '10px 20px', borderRadius: 10,
            background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
            color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none',
          }}>
            <FiPlus size={17} /> Add Vehicle
          </Link>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 220px' }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Search vehicles..." />
          </div>
          <select value={brandFilter} onChange={e => setBrandFilter(e.target.value)} style={{
            padding: '9px 14px', border: '1px solid #e2e8f0', borderRadius: 10,
            fontSize: 14, outline: 'none', color: '#475569', background: '#fff', minWidth: 140,
          }}>
            <option value="">All Brands</option>
            {['Toyota', 'Honda', 'Maruti', 'Hyundai', 'Ford', 'BMW', 'Mercedes', 'Tata', 'Mahindra', 'Other']
              .map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{
            padding: '9px 14px', border: '1px solid #e2e8f0', borderRadius: 10,
            fontSize: 14, outline: 'none', color: '#475569', background: '#fff', minWidth: 150,
          }}>
            <option value="">All Status</option>
            <option value="upcoming">Upcoming (30 days)</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        {/* Vehicle Grid */}
        {loading ? (
          <Loader text="Loading vehicles..." />
        ) : paginated.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', background: '#fff', borderRadius: 14, border: '1px solid #f1f5f9' }}>
            <FiTruck size={52} color="#cbd5e1" style={{ marginBottom: 16 }} />
            <h3 style={{ margin: '0 0 8px', color: '#334155' }}>No Vehicles Found</h3>
            <p style={{ margin: '0 0 20px', color: '#94a3b8', fontSize: 14 }}>
              {search || brandFilter || statusFilter ? 'Try adjusting your filters.' : 'Add your first vehicle to get started.'}
            </p>
            <Link to="/vehicles/add" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 20px', borderRadius: 8,
              background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
              color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none',
            }}>
              <FiPlus size={15} /> Add Vehicle
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {paginated.map(vehicle => {
              const status = getServiceStatus(vehicle.days_until_service);
              return (
                <div key={vehicle.id} style={{
                  background: '#fff', borderRadius: 14, overflow: 'hidden',
                  border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}
                >
                  {/* Vehicle Image / Placeholder */}
                  <div style={{
                    height: 140, background: 'linear-gradient(135deg, #1e3a8a, #1e40af)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    {vehicle.image_url ? (
                      <img src={vehicle.image_url} alt={vehicle.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <FiTruck size={52} color="rgba(255,255,255,0.3)" />
                    )}
                    <span style={{
                      position: 'absolute', top: 12, right: 12,
                      padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                      background: status.bg, color: status.color,
                    }}>
                      {status.label}
                    </span>
                  </div>

                  <div style={{ padding: '16px 18px' }}>
                    <div style={{ marginBottom: 10 }}>
                      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{vehicle.name}</h3>
                      <p style={{ margin: '3px 0 0', fontSize: 12, color: '#64748b' }}>
                        {vehicle.brand} {vehicle.model} • {vehicle.year}
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', marginBottom: 10 }}>
                      <div>
                        <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>Reg. No.</p>
                        <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{vehicle.registration_number}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>Next Service</p>
                        <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 600, color: status.color }}>{formatDate(vehicle.next_service_date)}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/vehicles/${vehicle.id}`} style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: 5, padding: '7px', borderRadius: 8,
                        background: '#eff6ff', color: '#3b82f6',
                        fontWeight: 600, fontSize: 13, textDecoration: 'none',
                      }}>
                        <FiEye size={14} /> View
                      </Link>
                      <Link to={`/vehicles/edit/${vehicle.id}`} style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: 5, padding: '7px', borderRadius: 8,
                        background: '#f0fdf4', color: '#16a34a',
                        fontWeight: 600, fontSize: 13, textDecoration: 'none',
                      }}>
                        <FiEdit2 size={14} /> Edit
                      </Link>
                      <button onClick={() => setDeleteId(vehicle.id)} style={{
                        width: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '7px', borderRadius: 8,
                        background: '#fff5f5', color: '#ef4444',
                        border: 'none', cursor: 'pointer',
                      }}>
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Vehicle"
        message="Are you sure you want to delete this vehicle? All associated service history and reminders will also be deleted. This action cannot be undone."
        confirmText="Delete Vehicle"
        variant="danger"
      />
    </DashboardLayout>
  );
};

export default MyVehicles;
