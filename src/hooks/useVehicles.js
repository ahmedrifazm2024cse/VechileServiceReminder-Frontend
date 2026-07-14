import { useState, useEffect, useCallback } from 'react';
import { vehicleService } from '../services/vehicleService';
import { toast } from 'react-toastify';

export const useVehicles = (params = {}) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await vehicleService.getAll(params);
      setVehicles(data.vehicles || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const deleteVehicle = async (id) => {
    try {
      await vehicleService.delete(id);
      setVehicles(prev => prev.filter(v => v.id !== id));
      toast.success('Vehicle deleted successfully');
      return true;
    } catch {
      toast.error('Failed to delete vehicle');
      return false;
    }
  };

  return { vehicles, loading, error, refetch: fetchVehicles, deleteVehicle };
};
