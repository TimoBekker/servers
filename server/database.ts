import mysql from 'mysql2/promise';

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

let connection: mysql.Connection | null = null;

export async function connectToDatabase(config: DatabaseConfig): Promise<mysql.Connection> {
  try {
    if (connection) {
      await connection.end();
    }

    connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      charset: 'utf8mb4'
    });

    console.log('✅ Connected to MariaDB database');
    return connection;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

export function getConnection(): mysql.Connection | null {
  return connection;
}

export async function testConnection(): Promise<boolean> {
  try {
    if (!connection) {
      return false;
    }
    
    await connection.ping();
    return true;
  } catch (error) {
    console.error('Database ping failed:', error);
    return false;
  }
}

export async function closeConnection(): Promise<void> {
  if (connection) {
    await connection.end();
    connection = null;
    console.log('Database connection closed');
  }
}