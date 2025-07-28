import { RequestHandler } from "express";
import { Equipment, PaginatedResponse } from "@shared/api";

// Mock data for equipment
const mockEquipment: Equipment[] = [
  {
    id: 1,
    equipment_id: "SRV-001",
    name: "SMEV3-GIS-APP-03-T",
    vmware_name: "vm-gis-app-03",
    hostname: "gis-app-03.domain.local",
    status: "в работе",
    type: "Виртуальный сервер",
    parent_equipment: "ESX-HOST-01",
    description: "Сервер приложений ГИС СМЭВ3",
    location: "Стойка A1, позиция 10-12",
    specifications: "CPU: 4 vCPU, RAM: 16GB, Storage: 500GB SSD",
    vmware_level: "ESXi 7.0",
    virtual_cpu: 4,
    ram: "16 GB DDR4",
    has_backup: true,
    last_backup_date: "2024-01-15",
    commissioned_date: "2023-06-01",
    decommissioned_date: null,
    kspd_access: true,
    internet_access: false,
    arcsight_connection: true,
    remote_access: "RDP: 3389, SSH: 22",
    internet_forwarding: null,
    listening_ports: "TCP: 80, 443, 8080",
    documentation: "Документация доступна в SharePoint",
    related_tickets: "INC-2024-001, CHG-2024-005",
    created_at: "2023-06-01T10:00:00Z",
    updated_at: "2024-01-15T14:30:00Z",
    storage: [
      { id: 1, name: "System", size: "100GB SSD" },
      { id: 2, name: "Data", size: "400GB SSD" }
    ],
    ip_addresses: [
      {
        id: 1,
        ip_address: "192.168.1.100",
        subnet_mask: "255.255.255.0",
        vlan: "VLAN-100",
        dns_name: "gis-app-03.domain.local"
      }
    ],
    passwords: [
      {
        id: 1,
        username: "administrator",
        password: "SecurePass123!",
        description: "Администратор системы"
      }
    ],
    responsible_persons: [
      {
        id: 1,
        name: "Кравченко Д.А.",
        organization: "ИТ отдел",
        company: "ООО Компания",
        role: "Системный администратор",
        email: "kravchenko@company.com",
        phone: "+7 (495) 123-45-67"
      }
    ],
    software: [
      {
        id: 1,
        name: "Windows Server",
        version: "2019",
        vendor: "Microsoft",
        description: "Операционная система",
        license_type: "Volume License",
        license_expiry: "2025-12-31"
      }
    ],
    information_systems: [
      {
        id: 1,
        name: "ГИС СМЭВ3",
        description: "Геоинформационная система СМЭВ3",
        status: "активна",
        owner: "ИТ отдел"
      }
    ]
  }
];

// GET /api/equipment - List equipment with pagination and search
export const getEquipment: RequestHandler = (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const perPage = parseInt(req.query.per_page as string) || 15;
  const search = req.query.search as string;
  const status = req.query.status as string;
  const type = req.query.type as string;

  let filteredEquipment = [...mockEquipment];

  // Apply search filter
  if (search) {
    filteredEquipment = filteredEquipment.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.hostname?.toLowerCase().includes(search.toLowerCase()) ||
      item.vmware_name?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Apply status filter
  if (status) {
    filteredEquipment = filteredEquipment.filter(item => item.status === status);
  }

  // Apply type filter
  if (type) {
    filteredEquipment = filteredEquipment.filter(item => item.type === type);
  }

  // Calculate pagination
  const total = filteredEquipment.length;
  const lastPage = Math.ceil(total / perPage);
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  const data = filteredEquipment.slice((page - 1) * perPage, page * perPage);

  const response: PaginatedResponse<Equipment> = {
    data,
    current_page: page,
    last_page: lastPage,
    per_page: perPage,
    total,
    from,
    to
  };

  res.json(response);
};

// GET /api/equipment/:id - Get single equipment
export const getEquipmentById: RequestHandler = (req, res) => {
  const { id } = req.params;
  const equipment = mockEquipment.find(item => item.equipment_id === id);

  if (!equipment) {
    return res.status(404).json({ error: 'Equipment not found' });
  }

  res.json(equipment);
};

// POST /api/equipment - Create new equipment
export const createEquipment: RequestHandler = (req, res) => {
  const newEquipment: Equipment = {
    id: mockEquipment.length + 1,
    ...req.body,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    storage: req.body.storage || [],
    ip_addresses: req.body.ip_addresses || [],
    passwords: req.body.passwords || [],
    responsible_persons: req.body.responsible_persons || [],
    software: req.body.software || [],
    information_systems: req.body.information_systems || []
  };

  mockEquipment.push(newEquipment);
  res.status(201).json(newEquipment);
};

// PUT /api/equipment/:id - Update equipment
export const updateEquipment: RequestHandler = (req, res) => {
  const { id } = req.params;
  const equipmentIndex = mockEquipment.findIndex(item => item.equipment_id === id);

  if (equipmentIndex === -1) {
    return res.status(404).json({ error: 'Equipment not found' });
  }

  mockEquipment[equipmentIndex] = {
    ...mockEquipment[equipmentIndex],
    ...req.body,
    updated_at: new Date().toISOString()
  };

  res.json(mockEquipment[equipmentIndex]);
};

// DELETE /api/equipment/:id - Delete equipment
export const deleteEquipment: RequestHandler = (req, res) => {
  const { id } = req.params;
  const equipmentIndex = mockEquipment.findIndex(item => item.equipment_id === id);

  if (equipmentIndex === -1) {
    return res.status(404).json({ error: 'Equipment not found' });
  }

  mockEquipment.splice(equipmentIndex, 1);
  res.json({ message: 'Equipment deleted successfully' });
};