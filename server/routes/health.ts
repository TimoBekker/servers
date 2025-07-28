import { RequestHandler } from "express";
import { HealthResponse } from "@shared/api";

export const handleHealth: RequestHandler = (req, res) => {
  const response: HealthResponse = {
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "Servers 2.0 API"
  };
  res.status(200).json(response);
};