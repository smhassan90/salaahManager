/**
 * Prayer Time Service
 * Handles prayer time operations
 */

import apiClient, {ApiResponse} from './apiClient';
import {API_ENDPOINTS} from '../../config/api.config';
import {PrayerTime} from '../../types';

export interface CreatePrayerTimeRequest {
  masjidId: string;
  prayerName: 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha' | 'Jummah';
  prayerTime: string; // HH:MM
  effectiveDate: string; // YYYY-MM-DD
}

export interface BulkUpdatePrayerTimesRequest {
  masjidId: string;
  effectiveDate: string; // YYYY-MM-DD
  prayerTimes: Array<{
    prayerName: 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha' | 'Jummah';
    prayerTime: string; // HH:MM
  }>;
}

export interface UpdatePrayerTimeRequest {
  prayerTime: string; // HH:MM
}

export const prayerTimeService = {
  /**
   * Get today's prayer times (PUBLIC - No auth required)
   */
  async getTodaysPrayerTimes(
    masjidId: string,
  ): Promise<ApiResponse<PrayerTime[]>> {
    const response = await apiClient.get<ApiResponse<PrayerTime[]>>(
      API_ENDPOINTS.PRAYER_TIMES_TODAY(masjidId),
    );
    return response.data;
  },

  /**
   * Get all prayer times for a masjid (with optional date filter)
   */
  async getPrayerTimes(
    masjidId: string,
    params?: {
      effectiveDate?: string; // YYYY-MM-DD
    },
  ): Promise<ApiResponse<PrayerTime[]>> {
    const response = await apiClient.get<ApiResponse<PrayerTime[]>>(
      API_ENDPOINTS.PRAYER_TIMES_BY_MASJID(masjidId),
      {params},
    );
    return response.data;
  },

  /**
   * Create or update a single prayer time
   */
  async createOrUpdatePrayerTime(
    data: CreatePrayerTimeRequest,
  ): Promise<ApiResponse<PrayerTime>> {
    const response = await apiClient.post<ApiResponse<PrayerTime>>(
      API_ENDPOINTS.CREATE_PRAYER_TIME,
      data,
    );
    return response.data;
  },

  /**
   * Bulk update prayer times (Requires can_change_prayer_times permission)
   */
  async bulkUpdatePrayerTimes(
    data: BulkUpdatePrayerTimesRequest,
  ): Promise<ApiResponse<PrayerTime[]>> {
    const response = await apiClient.post<ApiResponse<PrayerTime[]>>(
      API_ENDPOINTS.BULK_UPDATE_PRAYER_TIMES,
      data,
    );
    return response.data;
  },

  /**
   * Update specific prayer time by ID
   */
  async updatePrayerTime(
    prayerTimeId: string,
    data: UpdatePrayerTimeRequest,
  ): Promise<ApiResponse<PrayerTime>> {
    const response = await apiClient.put<ApiResponse<PrayerTime>>(
      API_ENDPOINTS.UPDATE_PRAYER_TIME(prayerTimeId),
      data,
    );
    return response.data;
  },

  /**
   * Delete prayer time (Admin only)
   */
  async deletePrayerTime(prayerTimeId: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(
      API_ENDPOINTS.DELETE_PRAYER_TIME(prayerTimeId),
    );
    return response.data;
  },
};

