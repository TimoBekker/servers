import express from "express";
import cors from "cors";
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
