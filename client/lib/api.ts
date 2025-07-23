const API_BASE_URL = 'http://localhost:8000/api';

// Types based on Laravel API responses
export interface Equipment {
  id: number;
  equipment_id: string;
  name: string;
  vmware_name?: string;
  hostname?: string;
  status: 'в работе' | 'выключено / не в работе' | 'выведено из эксплуатации' | 'удалено';
  type: 'Сервер' | 'Виртуальный сервер' | 'Сетевое оборудование' | 'Электропитание' | 'Система хранения';
  parent_equipment?: string;
  description?: string;
  location?: string;
  specifications?: string;
  vmware_level?: string;
  virtual_cpu?: number;
  ram?: string;
  has_backup: boolean;
  last_backup_date?: string;
  commissioned_date?: string;
  decommissioned_date?: string;
  kspd_access: boolean;
  internet_access: boolean;
  arcsight_connection: boolean;
  remote_access?: string;
  internet_forwarding?: string;
  listening_ports?: string;
  documentation?: string;
  related_tickets?: string;
  created_at: string;
  updated_at: string;
  storage: EquipmentStorage[];
  ip_addresses: EquipmentIpAddress[];
  passwords: EquipmentPassword[];
  responsible_persons: ResponsiblePerson[];
  software: Software[];
  information_systems: InformationSystem[];
}

export interface EquipmentStorage {
  id: number;
  equipment_id: number;
  name: string;
  size: string;
}

export interface EquipmentIpAddress {
  id: number;
  equipment_id: number;
  ip_address: string;
  subnet_mask: string;
  vlan: string;
  dns_name?: string;
}

export interface EquipmentPassword {
  id: number;
  equipment_id: number;
  username: string;
  password: string;
  description?: string;
}

export interface ResponsiblePerson {
  id: number;
  name: string;
  organization: string;
  company: string;
  role: string;
  email: string;
  phone: string;
}

export interface Software {
  id: number;
  name: string;
  version?: string;
  vendor?: string;
  description?: string;
  license_type?: string;
  license_expiry?: string;
}

export interface InformationSystem {
  id: number;
  name: string;
  description?: string;
  status: 'активна' | 'неактивна' | 'в разработке' | 'выведена из эксплуатации';
  owner?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface EquipmentStatistics {
  total: number;
  by_status: Record<string, number>;
  by_type: Record<string, number>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Equipment API methods
  async getEquipment(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    status?: string;
    type?: string;
  }): Promise<PaginatedResponse<Equipment>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.per_page) searchParams.append('per_page', params.per_page.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.type) searchParams.append('type', params.type);

    const query = searchParams.toString();
    return this.request<PaginatedResponse<Equipment>>(
      `/equipment${query ? `?${query}` : ''}`
    );
  }

  async getEquipmentById(equipmentId: string): Promise<Equipment> {
    return this.request<Equipment>(`/equipment/${equipmentId}`);
  }

  async createEquipment(data: Partial<Equipment>): Promise<Equipment> {
    return this.request<Equipment>('/equipment', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEquipment(equipmentId: string, data: Partial<Equipment>): Promise<Equipment> {
    return this.request<Equipment>(`/equipment/${equipmentId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEquipment(equipmentId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/equipment/${equipmentId}`, {
      method: 'DELETE',
    });
  }

  async getEquipmentStatistics(): Promise<EquipmentStatistics> {
    return this.request<EquipmentStatistics>('/equipment-statistics');
  }

  // Software API methods
  async getSoftware(params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }): Promise<PaginatedResponse<Software>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.per_page) searchParams.append('per_page', params.per_page.toString());
    if (params?.search) searchParams.append('search', params.search);

    const query = searchParams.toString();
    return this.request<PaginatedResponse<Software>>(
      `/software${query ? `?${query}` : ''}`
    );
  }

  async getSoftwareById(id: number): Promise<Software> {
    return this.request<Software>(`/software/${id}`);
  }

  // Information Systems API methods
  async getInformationSystems(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    status?: string;
  }): Promise<PaginatedResponse<InformationSystem>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.per_page) searchParams.append('per_page', params.per_page.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status) searchParams.append('status', params.status);

    const query = searchParams.toString();
    return this.request<PaginatedResponse<InformationSystem>>(
      `/information-systems${query ? `?${query}` : ''}`
    );
  }

  async getInformationSystemById(id: number): Promise<InformationSystem> {
    return this.request<InformationSystem>(`/information-systems/${id}`);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; service: string }> {
    return this.request<{ status: string; timestamp: string; service: string }>('/health');
  }
}

export const apiClient = new ApiClient();