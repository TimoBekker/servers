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