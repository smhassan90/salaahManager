/**
 * Health Check Service
 * Handles API health check operations
 */

import apiClient, {ApiResponse} from './apiClient';
import {API_ENDPOINTS} from '../../config/api.config';

export interface HealthCheckResponse {
  success: boolean;
  message: string;
  timestamp: string;
  uptime: number;
}

export const healthService = {
  /**
   * Check API health status (PUBLIC - No auth required)
   */
  async checkHealth(): Promise<ApiResponse<HealthCheckResponse>> {
    const response = await apiClient.get<ApiResponse<HealthCheckResponse>>(
      API_ENDPOINTS.HEALTH_CHECK,
    );
    return response.data;
  },
};

