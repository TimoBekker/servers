import { RequestHandler } from "express";
import { EquipmentStatistics } from "@shared/api";
import { getConnection } from "../database";

export const handleEquipmentStatistics: RequestHandler = async (req, res) => {
  const connection = getConnection();
  
  if (!connection) {
    return res.status(500).json({ error: 'Database connection not available' });
  }

  try {
    // Get total count
    const [totalResult] = await connection.execute('SELECT COUNT(*) as total FROM r_equipment');
    const total = (totalResult as any)[0].total;

    // Get statistics by status
    const [statusResult] = await connection.execute(`
      SELECT status, COUNT(*) as count 
      FROM r_equipment
      GROUP BY status
    `);
    
    const byStatus: Record<string, number> = {};
    (statusResult as any[]).forEach(row => {
      byStatus[row.status || 'неизвестно'] = row.count;
    });

    // Get statistics by type
    const [typeResult] = await connection.execute(`
      SELECT type, COUNT(*) as count 
      FROM r_equipment
      GROUP BY type
    `);
    
    const byType: Record<string, number> = {};
    (typeResult as any[]).forEach(row => {
      byType[row.type || 'неизвестно'] = row.count;
    });

    const response: EquipmentStatistics = {
      total,
      by_status: byStatus,
      by_type: byType
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching equipment statistics:', error);
    
    // Return mock data as fallback
    const response: EquipmentStatistics = {
      total: 0,
      by_status: {},
      by_type: {}
    };
    res.status(200).json(response);
  }
};