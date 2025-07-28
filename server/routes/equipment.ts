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
      whereConditions.push('e.status = ?');
      queryParams.push(status);
    }

    if (type) {
      whereConditions.push('e.type = ?');
      queryParams.push(type);
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM r_equipment e ${whereClause}`;
    
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
        e.status,
        e.type,
        e.parent_equipment,
        e.description,
        e.location,
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
        e.remote_access,
        e.internet_forwarding,
        e.listening_ports,
        e.documentation,
        e.related_tickets,
        e.created_at,
        e.updated_at
      FROM r_equipment e
      ${whereClause}
      ORDER BY e.id DESC
      LIMIT ? OFFSET ?
    `;
    
    const [rows] = await connection.execute(dataQuery, [...queryParams, perPage, offset]);
    const equipment = rows as any[];

    // Get related data for each equipment
    const data = await Promise.all(equipment.map(async (item) => {
      // Get storage
      const [storageRows] = await connection.execute(
        'SELECT id, name, size FROM equipment_storage WHERE equipment_id = ?',
        [item.id]
      );

      // Get IP addresses
      const [ipRows] = await connection.execute(
        'SELECT id, ip_address, subnet_mask, vlan, dns_name FROM equipment_ip_addresses WHERE equipment_id = ?',
        [item.id]
      );

      // Get passwords
      const [passwordRows] = await connection.execute(
        'SELECT id, username, password, description FROM equipment_passwords WHERE equipment_id = ?',
        [item.id]
      );

      // Get responsible persons
      const [responsibleRows] = await connection.execute(
        'SELECT id, name, organization, company, role, email, phone FROM equipment_responsible_persons WHERE equipment_id = ?',
        [item.id]
      );

      return {
        id: item.id,
        equipment_id: item.equipment_id,
        name: item.name,
        vmware_name: item.vmware_name,
        hostname: item.hostname,
        status: item.status || 'в работе',
        type: item.type || 'Сервер',
        parent_equipment: item.parent_equipment,
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
        storage: storageRows as any[],
        ip_addresses: ipRows as any[],
        passwords: passwordRows as any[],
        responsible_persons: responsibleRows as any[],
        software: [], // TODO: Add software lookup if needed
        information_systems: [] // TODO: Add information systems lookup if needed
      };
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
        e.*
      FROM r_equipment e
      WHERE e.name = ? OR e.id = ?
    `;
    
    const [rows] = await connection.execute(query, [id, id]);
    const equipment = (rows as any[])[0];

    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    // Get related data
    const [storageRows] = await connection.execute(
      'SELECT id, name, size FROM equipment_storage WHERE equipment_id = ?',
      [equipment.id]
    );

    const [ipRows] = await connection.execute(
      'SELECT id, ip_address, subnet_mask, vlan, dns_name FROM equipment_ip_addresses WHERE equipment_id = ?',
      [equipment.id]
    );

    const [passwordRows] = await connection.execute(
      'SELECT id, username, password, description FROM equipment_passwords WHERE equipment_id = ?',
      [equipment.id]
    );

    const [responsibleRows] = await connection.execute(
      'SELECT id, name, organization, company, role, email, phone FROM equipment_responsible_persons WHERE equipment_id = ?',
      [equipment.id]
    );

    const response = {
      id: equipment.id,
      equipment_id: equipment.name,
      name: equipment.name,
      vmware_name: equipment.vmware_name,
      hostname: equipment.hostname,
      status: equipment.status || 'в работе',
      type: equipment.type || 'Сервер',
      parent_equipment: equipment.parent_equipment,
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
      remote_access: equipment.remote_access,
      internet_forwarding: equipment.internet_forwarding,
      listening_ports: equipment.listening_ports,
      documentation: equipment.documentation,
      related_tickets: equipment.related_tickets,
      created_at: equipment.created_at,
      updated_at: equipment.updated_at,
      storage: storageRows as any[],
      ip_addresses: ipRows as any[],
      passwords: passwordRows as any[],
      responsible_persons: responsibleRows as any[],
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
    
    // Start transaction
    await connection.beginTransaction();

    try {
      // Insert main equipment record
      const query = `
        INSERT INTO r_equipment (
          name, vmware_name, hostname, status, type, parent_equipment,
          description, location, specifications, vmware_level, virtual_cpu, 
          ram, has_backup, last_backup_date, commissioned_date, decommissioned_date,
          kspd_access, internet_access, arcsight_connection, remote_access,
          internet_forwarding, listening_ports, documentation, related_tickets,
          created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      
      const [result] = await connection.execute(query, [
        data.equipment_id || data.name,
        data.vmware_name,
        data.hostname,
        data.status || 'в работе',
        data.type || 'Сервер',
        data.parent_equipment,
        data.description,
        data.location,
        data.specifications,
        data.vmware_level,
        data.virtual_cpu,
        data.ram,
        data.has_backup ? 1 : 0,
        data.last_backup_date,
        data.commissioned_date,
        data.decommissioned_date,
        data.kspd_access ? 1 : 0,
        data.internet_access ? 1 : 0,
        data.arcsight_connection ? 1 : 0,
        data.remote_access,
        data.internet_forwarding,
        data.listening_ports,
        data.documentation,
        data.related_tickets
      ]);
      
      const insertId = (result as any).insertId;

      // Insert storage records
      if (data.storage && data.storage.length > 0) {
        for (const storage of data.storage) {
          if (storage.name && storage.size) {
            await connection.execute(
              'INSERT INTO equipment_storage (equipment_id, name, size) VALUES (?, ?, ?)',
              [insertId, storage.name, storage.size]
            );
          }
        }
      }

      // Insert IP address records
      if (data.ip_addresses && data.ip_addresses.length > 0) {
        for (const ip of data.ip_addresses) {
          if (ip.ip_address) {
            await connection.execute(
              'INSERT INTO equipment_ip_addresses (equipment_id, ip_address, subnet_mask, vlan, dns_name) VALUES (?, ?, ?, ?, ?)',
              [insertId, ip.ip_address, ip.subnet_mask, ip.vlan, ip.dns_name]
            );
          }
        }
      }

      // Insert password records
      if (data.passwords && data.passwords.length > 0) {
        for (const password of data.passwords) {
          if (password.username && password.password) {
            await connection.execute(
              'INSERT INTO equipment_passwords (equipment_id, username, password, description) VALUES (?, ?, ?, ?)',
              [insertId, password.username, password.password, password.description]
            );
          }
        }
      }

      // Commit transaction
      await connection.commit();
      
      // Return the created equipment
      const newEquipment = {
        id: insertId,
        equipment_id: data.equipment_id || data.name,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        storage: data.storage || [],
        ip_addresses: data.ip_addresses || [],
        passwords: data.passwords || [],
        responsible_persons: [],
        software: [],
        information_systems: []
      };
      
      res.status(201).json(newEquipment);
    } catch (error) {
      await connection.rollback();
      throw error;
    }
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

    // Start transaction
    await connection.beginTransaction();

    try {
      // Update main equipment record
      const query = `
        UPDATE r_equipment 
        SET name = ?, vmware_name = ?, hostname = ?, status = ?, type = ?,
            parent_equipment = ?, description = ?, location = ?, specifications = ?, 
            vmware_level = ?, virtual_cpu = ?, ram = ?, has_backup = ?,
            last_backup_date = ?, commissioned_date = ?, decommissioned_date = ?,
            kspd_access = ?, internet_access = ?, arcsight_connection = ?,
            remote_access = ?, internet_forwarding = ?, listening_ports = ?,
            documentation = ?, related_tickets = ?, updated_at = NOW()
        WHERE name = ? OR id = ?
      `;
      
      const [result] = await connection.execute(query, [
        data.equipment_id || data.name,
        data.vmware_name,
        data.hostname,
        data.status,
        data.type,
        data.parent_equipment,
        data.description,
        data.location,
        data.specifications,
        data.vmware_level,
        data.virtual_cpu,
        data.ram,
        data.has_backup ? 1 : 0,
        data.last_backup_date,
        data.commissioned_date,
        data.decommissioned_date,
        data.kspd_access ? 1 : 0,
        data.internet_access ? 1 : 0,
        data.arcsight_connection ? 1 : 0,
        data.remote_access,
        data.internet_forwarding,
        data.listening_ports,
        data.documentation,
        data.related_tickets,
        id,
        id
      ]);

      if ((result as any).affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({ error: 'Equipment not found' });
      }

      // Get equipment ID for related data updates
      const [equipmentRows] = await connection.execute(
        'SELECT id FROM r_equipment WHERE name = ? OR id = ?',
        [id, id]
      );
      const equipmentId = (equipmentRows as any[])[0]?.id;

      if (equipmentId) {
        // Delete and recreate storage records
        await connection.execute('DELETE FROM equipment_storage WHERE equipment_id = ?', [equipmentId]);
        if (data.storage && data.storage.length > 0) {
          for (const storage of data.storage) {
            if (storage.name && storage.size) {
              await connection.execute(
                'INSERT INTO equipment_storage (equipment_id, name, size) VALUES (?, ?, ?)',
                [equipmentId, storage.name, storage.size]
              );
            }
          }
        }

        // Delete and recreate IP address records
        await connection.execute('DELETE FROM equipment_ip_addresses WHERE equipment_id = ?', [equipmentId]);
        if (data.ip_addresses && data.ip_addresses.length > 0) {
          for (const ip of data.ip_addresses) {
            if (ip.ip_address) {
              await connection.execute(
                'INSERT INTO equipment_ip_addresses (equipment_id, ip_address, subnet_mask, vlan, dns_name) VALUES (?, ?, ?, ?, ?)',
                [equipmentId, ip.ip_address, ip.subnet_mask, ip.vlan, ip.dns_name]
              );
            }
          }
        }

        // Delete and recreate password records
        await connection.execute('DELETE FROM equipment_passwords WHERE equipment_id = ?', [equipmentId]);
        if (data.passwords && data.passwords.length > 0) {
          for (const password of data.passwords) {
            if (password.username && password.password) {
              await connection.execute(
                'INSERT INTO equipment_passwords (equipment_id, username, password, description) VALUES (?, ?, ?, ?)',
                [equipmentId, password.username, password.password, password.description]
              );
            }
          }
        }
      }

      // Commit transaction
      await connection.commit();

      // Return updated equipment
      const updatedEquipment = {
        ...data,
        equipment_id: data.equipment_id || data.name,
        updated_at: new Date().toISOString(),
        storage: data.storage || [],
        ip_addresses: data.ip_addresses || [],
        passwords: data.passwords || [],
        responsible_persons: [],
        software: [],
        information_systems: []
      };
      
      res.json(updatedEquipment);
    } catch (error) {
      await connection.rollback();
      throw error;
    }
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
    
    // Start transaction
    await connection.beginTransaction();

    try {
      // Get equipment ID
      const [equipmentRows] = await connection.execute(
        'SELECT id FROM r_equipment WHERE name = ? OR id = ?',
        [id, id]
      );
      const equipmentId = (equipmentRows as any[])[0]?.id;

      if (equipmentId) {
        // Delete related records first
        await connection.execute('DELETE FROM equipment_storage WHERE equipment_id = ?', [equipmentId]);
        await connection.execute('DELETE FROM equipment_ip_addresses WHERE equipment_id = ?', [equipmentId]);
        await connection.execute('DELETE FROM equipment_passwords WHERE equipment_id = ?', [equipmentId]);
        await connection.execute('DELETE FROM equipment_responsible_persons WHERE equipment_id = ?', [equipmentId]);
      }

      // Delete main equipment record
      const [result] = await connection.execute(
        'DELETE FROM r_equipment WHERE name = ? OR id = ?',
        [id, id]
      );

      if ((result as any).affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({ error: 'Equipment not found' });
      }

      // Commit transaction
      await connection.commit();

      res.json({ message: 'Equipment deleted successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error deleting equipment:', error);
    res.status(500).json({ error: 'Failed to delete equipment' });
  }
};