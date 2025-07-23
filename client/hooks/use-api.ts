import { useEffect, useState } from 'react';
import { apiService } from '@/lib/api';

// Generic hook for API requests
export function useApiData<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}

// Specific hooks for different endpoints

export function useDashboardStats() {
  return useApiData(() => apiService.getDashboardStats());
}

export function useSystemHealth() {
  return useApiData(() => apiService.getSystemHealth());
}

export function useRecentEvents() {
  return useApiData(() => apiService.getRecentEvents());
}

export function useEquipment(filters?: {
  search?: string;
  status?: string;
  type?: string;
  page?: number;
  per_page?: number;
}) {
  return useApiData(
    () => apiService.getEquipment(filters),
    [filters]
  );
}

export function useEquipmentById(id: string) {
  return useApiData(
    () => apiService.getEquipmentById(id),
    [id]
  );
}

export function useInformationSystems(filters?: any) {
  return useApiData(
    () => apiService.getInformationSystems(filters),
    [filters]
  );
}

export function useContracts(filters?: any) {
  return useApiData(
    () => apiService.getContracts(filters),
    [filters]
  );
}

export function useEvents(filters?: any) {
  return useApiData(
    () => apiService.getEvents(filters),
    [filters]
  );
}

export function useSoftware(filters?: any) {
  return useApiData(
    () => apiService.getSoftware(filters),
    [filters]
  );
}
