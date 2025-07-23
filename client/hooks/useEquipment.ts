import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, Equipment, PaginatedResponse, EquipmentStatistics } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

// Query keys
export const equipmentKeys = {
  all: ['equipment'] as const,
  lists: () => [...equipmentKeys.all, 'list'] as const,
  list: (params: any) => [...equipmentKeys.lists(), params] as const,
  details: () => [...equipmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...equipmentKeys.details(), id] as const,
  statistics: () => [...equipmentKeys.all, 'statistics'] as const,
};

// Get equipment list with pagination and filters
export function useEquipment(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  type?: string;
}) {
  return useQuery({
    queryKey: equipmentKeys.list(params),
    queryFn: () => apiClient.getEquipment(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get single equipment by ID
export function useEquipmentDetail(equipmentId: string) {
  return useQuery({
    queryKey: equipmentKeys.detail(equipmentId),
    queryFn: () => apiClient.getEquipmentById(equipmentId),
    enabled: !!equipmentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get equipment statistics
export function useEquipmentStatistics() {
  return useQuery({
    queryKey: equipmentKeys.statistics(),
    queryFn: () => apiClient.getEquipmentStatistics(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Create equipment mutation
export function useCreateEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Equipment>) => apiClient.createEquipment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: equipmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: equipmentKeys.statistics() });
      toast({
        title: 'Успешно',
        description: 'Оборудование создано',
      });
    },
    onError: (error) => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать оборудование',
        variant: 'destructive',
      });
      console.error('Create equipment error:', error);
    },
  });
}

// Update equipment mutation
export function useUpdateEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ equipmentId, data }: { equipmentId: string; data: Partial<Equipment> }) =>
      apiClient.updateEquipment(equipmentId, data),
    onSuccess: (_, { equipmentId }) => {
      queryClient.invalidateQueries({ queryKey: equipmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: equipmentKeys.detail(equipmentId) });
      queryClient.invalidateQueries({ queryKey: equipmentKeys.statistics() });
      toast({
        title: 'Успешно',
        description: 'Оборудование обновлено',
      });
    },
    onError: (error) => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить оборудование',
        variant: 'destructive',
      });
      console.error('Update equipment error:', error);
    },
  });
}

// Delete equipment mutation
export function useDeleteEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (equipmentId: string) => apiClient.deleteEquipment(equipmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: equipmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: equipmentKeys.statistics() });
      toast({
        title: 'Успешно',
        description: 'Оборудование удалено',
      });
    },
    onError: (error) => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить оборудование',
        variant: 'destructive',
      });
      console.error('Delete equipment error:', error);
    },
  });
}