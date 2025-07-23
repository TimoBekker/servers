// API service for Laravel backend

const API_BASE_URL = process.env.VITE_API_URL || 'http://192.168.126.143:8000/api';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Add authentication headers if needed
    const token = localStorage.getItem('auth_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Dashboard API
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  async getSystemHealth() {
    return this.request('/dashboard/system-health');
  }

  async getRecentEvents() {
    return this.request('/dashboard/recent-events');
  }

  // Equipment API
  async getEquipment(filters?: {
    search?: string;
    status?: string;
    type?: string;
    page?: number;
    per_page?: number;
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const query = params.toString();
    return this.request(`/equipment${query ? `?${query}` : ''}`);
  }

  async getEquipmentById(id: string) {
    return this.request(`/equipment/${id}`);
  }

  async createEquipment(data: any) {
    return this.request('/equipment', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEquipment(id: string, data: any) {
    return this.request(`/equipment/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEquipment(id: string) {
    return this.request(`/equipment/${id}`, {
      method: 'DELETE',
    });
  }

  // Information Systems API
  async getInformationSystems(filters?: any) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const query = params.toString();
    return this.request(`/information-systems${query ? `?${query}` : ''}`);
  }

  async getInformationSystemById(id: string) {
    return this.request(`/information-systems/${id}`);
  }

  // Contracts API
  async getContracts(filters?: any) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const query = params.toString();
    return this.request(`/contracts${query ? `?${query}` : ''}`);
  }

  async getContractById(id: string) {
    return this.request(`/contracts/${id}`);
  }

  // Events API
  async getEvents(filters?: any) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const query = params.toString();
    return this.request(`/events${query ? `?${query}` : ''}`);
  }

  // Software API
  async getSoftware(filters?: any) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const query = params.toString();
    return this.request(`/software${query ? `?${query}` : ''}`);
  }

  // Authentication API (if needed)
  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request('/auth/user');
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Export types for TypeScript
export interface Equipment {
  id: string;
  name: string;
  type: string;
  status: string;
  location: string;
  specs: string;
  responsible: string;
  created_at?: string;
  updated_at?: string;
}

export interface InformationSystem {
  id: string;
  name: string;
  description?: string;
  status: string;
  owner: string;
  created_at?: string;
  updated_at?: string;
}

export interface Contract {
  id: string;
  title: string;
  description?: string;
  status: string;
  start_date: string;
  end_date: string;
  amount?: number;
  supplier?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Event {
  id: number;
  type: string;
  title: string;
  description: string;
  time: string;
  status: string;
  created_at?: string;
}

export interface DashboardStats {
  equipment_count: number;
  information_systems_count: number;
  software_count: number;
  contracts_count: number;
}

export interface SystemHealth {
  category: string;
  total: number;
  online: number;
  offline: number;
  status: string;
}
