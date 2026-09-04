/**
 * Activity Log Service
 * Loads recent masjid activity (last 7 days)
 */

import apiClient from './apiClient';
import {API_ENDPOINTS} from '../../config/api.config';
import {ActivityLog} from '../../types';

export const formatRelativeTime = (dateString?: string): string => {
  if (!dateString) {
    return '';
  }
  const timestamp = new Date(dateString).getTime();
  if (Number.isNaN(timestamp)) {
    return dateString;
  }
  const diffMs = Date.now() - timestamp;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) {
    return 'Just now';
  }
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  if (days === 1) {
    return 'Yesterday';
  }
  return `${days}d ago`;
};

function extractLogs(payload: unknown): ActivityLog[] {
  if (Array.isArray(payload)) {
    return payload as ActivityLog[];
  }
  if (payload && typeof payload === 'object') {
    const body = payload as {data?: unknown; logs?: unknown};
    if (Array.isArray(body.data)) {
      return body.data as ActivityLog[];
    }
    if (Array.isArray(body.logs)) {
      return body.logs as ActivityLog[];
    }
    if (body.data && typeof body.data === 'object') {
      const nested = body.data as {data?: unknown; logs?: unknown};
      if (Array.isArray(nested.data)) {
        return nested.data as ActivityLog[];
      }
      if (Array.isArray(nested.logs)) {
        return nested.logs as ActivityLog[];
      }
    }
  }
  return [];
}

export const activityLogService = {
  async getMasjidLogs(
    masjidId: string,
    params?: {page?: number; limit?: number},
  ): Promise<ActivityLog[]> {
    const response = await apiClient.get(API_ENDPOINTS.ACTIVITY_LOGS_BY_MASJID(masjidId), {
      params,
    });
    return extractLogs(response.data);
  },
};
