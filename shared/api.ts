/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Health check response type
 */
export interface HealthResponse {
  status: string;
  timestamp: string;
  service: string;
}

/**
 * Equipment statistics response type
 */
export interface EquipmentStatistics {
  total: number;
  by_status: Record<string, number>;
  by_type: Record<string, number>;
}

/**
 * Equipment interface for equipment management
 */
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
  name: string;
  size: string;
}

export interface EquipmentIpAddress {
  id: number;
  ip_address: string;
  subnet_mask: string;
  vlan: string;
  dns_name?: string;
}

export interface EquipmentPassword {
  id: number;
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