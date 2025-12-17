/**
 * Notification Service
 * Handles notification management
 */

import apiClient, {ApiResponse} from './apiClient';
import {API_ENDPOINTS} from '../../config/api.config';
import {Notification} from '../../types';

export interface CreateNotificationRequest {
  masjidId: string;
  title: string;
  description?: string;
  category?: string;
  excludeCreator?: boolean; // If true, the user who created the notification won't receive it
}

export interface UpdateNotificationRequest {
  title?: string;
  description?: string;
  category?: string;
}

export const notificationService = {
  /**
   * Get recent notifications
   */
  async getRecentNotifications(
    masjidId: string,
  ): Promise<ApiResponse<Notification[]>> {
    const response = await apiClient.get<ApiResponse<Notification[]>>(
      API_ENDPOINTS.RECENT_NOTIFICATIONS(masjidId),
    );
    return response.data;
  },

  /**
   * Get notification by ID
   */
  async getNotificationById(
    notificationId: string,
  ): Promise<ApiResponse<Notification>> {
    const response = await apiClient.get<ApiResponse<Notification>>(
      API_ENDPOINTS.NOTIFICATION_BY_ID(notificationId),
    );
    return response.data;
  },

  /**
   * Get all notifications by masjid
   */
  async getNotificationsByMasjid(
    masjidId: string,
    params?: {
      page?: number;
      limit?: number;
      category?: string;
    },
  ): Promise<ApiResponse<Notification[]>> {
    const response = await apiClient.get<ApiResponse<Notification[]>>(
      API_ENDPOINTS.NOTIFICATIONS_BY_MASJID(masjidId),
      {params},
    );
    return response.data;
  },

  /**
   * Create notification (Requires can_create_notifications permission)
   */
  async createNotification(
    data: CreateNotificationRequest,
  ): Promise<ApiResponse<Notification>> {
    const response = await apiClient.post<ApiResponse<Notification>>(
      API_ENDPOINTS.CREATE_NOTIFICATION,
      data,
    );
    return response.data;
  },

  /**
   * Update notification (Requires can_create_notifications permission)
   */
  async updateNotification(
    notificationId: string,
    data: UpdateNotificationRequest,
  ): Promise<ApiResponse<Notification>> {
    const response = await apiClient.put<ApiResponse<Notification>>(
      API_ENDPOINTS.UPDATE_NOTIFICATION(notificationId),
      data,
    );
    return response.data;
  },

  /**
   * Delete notification (Requires can_create_notifications permission)
   */
  async deleteNotification(
    notificationId: string,
  ): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.DELETE_NOTIFICATION(notificationId),
    );
    return response.data;
  },
};

