import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { connectToDatabase } from "./database";
import { handleDemo } from "./routes/demo";
import { handleHealth } from "./routes/health";
import { handleEquipmentStatistics } from "./routes/equipment-statistics";
import { 
  getEquipment, 
  getEquipmentById, 
  createEquipment, 
  updateEquipment, 
  deleteEquipment 
} from "./routes/equipment";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Database connection endpoint
  app.post("/api/database/connect", async (req, res) => {
    try {
      const { host, port, database, user, password } = req.body;
      
      const connection = await connectToDatabase({
        host: host || 'localhost',
        port: parseInt(port) || 3306,
        database: database || 'test',
        user: user || 'root',
        password: password || ''
      });
      
      // Create tables if they don't exist
      try {
        const sqlPath = path.join(process.cwd(), 'server', 'sql', 'create_tables.sql');
        if (fs.existsSync(sqlPath)) {
          const createTablesSQL = fs.readFileSync(sqlPath, 'utf8');
          const statements = createTablesSQL.split(';').filter(stmt => stmt.trim());
          
          for (const statement of statements) {
            if (statement.trim()) {
              await connection.execute(statement);
            }
          }
          console.log('✅ Database tables created/verified');
        }
      } catch (tableError) {
        console.warn('⚠️ Could not create tables:', tableError);
      }
      
      res.json({ success: true, message: 'Connected to database successfully' });
    } catch (error) {
      console.error('Database connection error:', error);
      res.status(500).json({ success: false, message: 'Failed to connect to database' });
    }
  });

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);
  app.get("/api/health", handleHealth);
  app.get("/api/equipment-statistics", handleEquipmentStatistics);

  // Equipment CRUD endpoints
  app.get("/api/equipment", getEquipment);
  app.get("/api/equipment/:id", getEquipmentById);
  app.post("/api/equipment", createEquipment);
  app.put("/api/equipment/:id", updateEquipment);
  app.delete("/api/equipment/:id", deleteEquipment);

  return app;
}
