import { RequestHandler } from "express";
import { Equipment, PaginatedResponse } from "@shared/api";
import { getConnection } from "../database";

// GET /api/equipment - List equipment with pagination and search
export const getEquipment: RequestHandler = async (req, res) => {
  const connection = getConnection();
  
  if (!connection) {
    return res.status(500).json({ error: 'Database connection not available' });
  }

  try {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.per_page as string) || 15;
    const search = req.query.search as string;
    const status = req.query.status as string;
    const type = req.query.type as string;
    const offset = (page - 1) * perPage;

    // Build WHERE conditions
    let whereConditions = [];
    let queryParams: any[] = [];

    if (search) {
      whereConditions.push('(e.name LIKE ? OR e.hostname LIKE ? OR e.vmware_name LIKE ? OR e.description LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status) {
      whereConditions.push('s.name = ?');
      queryParams.push(status);
    }

    if (type) {
      whereConditions.push('t.name = ?');
      queryParams.push(type);
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM r_equipment e
      LEFT JOIN c_state_equipment s ON e.state = s.id
      LEFT JOIN c_type_equipment t ON e.type = t.id
      ${whereClause}
    `;
    
    const [countResult] = await connection.execute(countQuery, queryParams);
    const total = (countResult as any)[0].total;

    // Get equipment data
    const dataQuery = `
      SELECT 
        e.id,
        e.name as equipment_id,
        e.name,
        e.vmware_name,
        e.hostname,
        s.name as status,
        t.name as type,
        e.description,
        p.name as location,
        e.specifications,
        e.vmware_level,
        e.virtual_cpu,
        e.ram,
        e.has_backup,
        e.last_backup_date,
        e.commissioned_date,
        e.decommissioned_date,
        e.kspd_access,
        e.internet_access,
        e.arcsight_connection,
        e.access_remote as remote_access,
        e.internet_forwarding,
        e.listening_ports,
        e.documentation,
        e.related_tickets,
        e.created_at,
        e.updated_at
      FROM r_equipment e
      LEFT JOIN c_state_equipment s ON e.state = s.id
      LEFT JOIN c_type_equipment t ON e.type = t.id
      LEFT JOIN s_placement p ON e.placement = p.id
      ${whereClause}
      ORDER BY e.id DESC
      LIMIT ? OFFSET ?
    `;
    
    const [rows] = await connection.execute(dataQuery, [...queryParams, perPage, offset]);
    const equipment = rows as any[];

    // Transform data to match frontend expectations
    const data = equipment.map(item => ({
      id: item.id,
      equipment_id: item.equipment_id,
      name: item.name,
      vmware_name: item.vmware_name,
      hostname: item.hostname,
      status: item.status || 'неизвестно',
      type: item.type || 'неизвестно',
      parent_equipment: null, // TODO: Add parent equipment lookup
      description: item.description,
      location: item.location,
      specifications: item.specifications,
      vmware_level: item.vmware_level,
      virtual_cpu: item.virtual_cpu,
      ram: item.ram,
      has_backup: Boolean(item.has_backup),
      last_backup_date: item.last_backup_date,
      commissioned_date: item.commissioned_date,
      decommissioned_date: item.decommissioned_date,
      kspd_access: Boolean(item.kspd_access),
      internet_access: Boolean(item.internet_access),
      arcsight_connection: Boolean(item.arcsight_connection),
      remote_access: item.remote_access,
      internet_forwarding: item.internet_forwarding,
      listening_ports: item.listening_ports,
      documentation: item.documentation,
      related_tickets: item.related_tickets,
      created_at: item.created_at,
      updated_at: item.updated_at,
      storage: [], // TODO: Add storage lookup
      ip_addresses: [], // TODO: Add IP addresses lookup
      passwords: [], // TODO: Add passwords lookup
      responsible_persons: [], // TODO: Add responsible persons lookup
      software: [], // TODO: Add software lookup
      information_systems: [] // TODO: Add information systems lookup
    }));

    const lastPage = Math.ceil(total / perPage);
    const from = offset + 1;
    const to = Math.min(offset + perPage, total);

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
  } catch (error) {
    console.error('Error fetching equipment:', error);
    res.status(500).json({ error: 'Failed to fetch equipment' });
  }
};

// GET /api/equipment/:id - Get single equipment
export const getEquipmentById: RequestHandler = async (req, res) => {
  const connection = getConnection();
  
  if (!connection) {
    return res.status(500).json({ error: 'Database connection not available' });
  }

  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        e.*,
        s.name as status,
        t.name as type,
        p.name as location
      FROM r_equipment e
      LEFT JOIN c_state_equipment s ON e.state = s.id
      LEFT JOIN c_type_equipment t ON e.type = t.id
      LEFT JOIN s_placement p ON e.placement = p.id
      WHERE e.name = ?
    `;
    
    const [rows] = await connection.execute(query, [id]);
    const equipment = (rows as any[])[0];

    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    // Transform data to match frontend expectations
    const response = {
      id: equipment.id,
      equipment_id: equipment.name,
      name: equipment.name,
      vmware_name: equipment.vmware_name,
      hostname: equipment.hostname,
      status: equipment.status || 'неизвестно',
      type: equipment.type || 'неизвестно',
      parent_equipment: null,
      description: equipment.description,
      location: equipment.location,
      specifications: equipment.specifications,
      vmware_level: equipment.vmware_level,
      virtual_cpu: equipment.virtual_cpu,
      ram: equipment.ram,
      has_backup: Boolean(equipment.has_backup),
      last_backup_date: equipment.last_backup_date,
      commissioned_date: equipment.commissioned_date,
      decommissioned_date: equipment.decommissioned_date,
      kspd_access: Boolean(equipment.kspd_access),
      internet_access: Boolean(equipment.internet_access),
      arcsight_connection: Boolean(equipment.arcsight_connection),
      remote_access: equipment.access_remote,
      internet_forwarding: equipment.internet_forwarding,
      listening_ports: equipment.listening_ports,
      documentation: equipment.documentation,
      related_tickets: equipment.related_tickets,
      created_at: equipment.created_at,
      updated_at: equipment.updated_at,
      storage: [],
      ip_addresses: [],
      passwords: [],
      responsible_persons: [],
      software: [],
      information_systems: []
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching equipment by ID:', error);
    res.status(500).json({ error: 'Failed to fetch equipment' });
  }
};

// POST /api/equipment - Create new equipment
export const createEquipment: RequestHandler = async (req, res) => {
  const connection = getConnection();
  
  if (!connection) {
    return res.status(500).json({ error: 'Database connection not available' });
  }

  try {
    const data = req.body;
    
    const query = `
      INSERT INTO r_equipment (name, vmware_name, hostname, description, specifications, 
                              vmware_level, virtual_cpu, ram, has_backup, kspd_access, 
                              internet_access, arcsight_connection, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    const [result] = await connection.execute(query, [
      data.name,
      data.vmware_name,
      data.hostname,
      data.description,
      data.specifications,
      data.vmware_level,
      data.virtual_cpu,
      data.ram,
      data.has_backup ? 1 : 0,
      data.kspd_access ? 1 : 0,
      data.internet_access ? 1 : 0,
      data.arcsight_connection ? 1 : 0
    ]);
    
    const insertId = (result as any).insertId;
    
    // Return the created equipment
    const newEquipment = {
      id: insertId,
      equipment_id: data.name,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      storage: [],
      ip_addresses: [],
      passwords: [],
      responsible_persons: [],
      software: [],
      information_systems: []
    };
    
    res.status(201).json(newEquipment);
  } catch (error) {
    console.error('Error creating equipment:', error);
    res.status(500).json({ error: 'Failed to create equipment' });
  }
};

// PUT /api/equipment/:id - Update equipment
export const updateEquipment: RequestHandler = async (req, res) => {
  const connection = getConnection();
  
  if (!connection) {
    return res.status(500).json({ error: 'Database connection not available' });
  }

  try {
    const { id } = req.params;
    const data = req.body;

    const query = `
      UPDATE r_equipment 
      SET name = ?, vmware_name = ?, hostname = ?, description = ?, 
          specifications = ?, vmware_level = ?, virtual_cpu = ?, ram = ?, 
          has_backup = ?, kspd_access = ?, internet_access = ?, 
          arcsight_connection = ?, updated_at = NOW()
      WHERE name = ?
    `;
    
    const [result] = await connection.execute(query, [
      data.name,
      data.vmware_name,
      data.hostname,
      data.description,
      data.specifications,
      data.vmware_level,
      data.virtual_cpu,
      data.ram,
      data.has_backup ? 1 : 0,
      data.kspd_access ? 1 : 0,
      data.internet_access ? 1 : 0,
      data.arcsight_connection ? 1 : 0,
      id
    ]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    // Return updated equipment
    const updatedEquipment = {
      ...data,
      equipment_id: data.name,
      updated_at: new Date().toISOString(),
      storage: [],
      ip_addresses: [],
      passwords: [],
      responsible_persons: [],
      software: [],
      information_systems: []
    };
    
    res.json(updatedEquipment);
  } catch (error) {
    console.error('Error updating equipment:', error);
    res.status(500).json({ error: 'Failed to update equipment' });
  }
};

// DELETE /api/equipment/:id - Delete equipment
export const deleteEquipment: RequestHandler = async (req, res) => {
  const connection = getConnection();
  
  if (!connection) {
    return res.status(500).json({ error: 'Database connection not available' });
  }

  try {
    const { id } = req.params;
    
    const query = 'DELETE FROM r_equipment WHERE name = ?';
    const [result] = await connection.execute(query, [id]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    console.error('Error deleting equipment:', error);
    res.status(500).json({ error: 'Failed to delete equipment' });
  }
};