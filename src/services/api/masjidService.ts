/**
 * Masjid Service
 * Handles masjid management and member operations
 */

import apiClient, {ApiResponse} from './apiClient';
import {API_ENDPOINTS} from '../../config/api.config';
import {Masjid} from '../../types';
import {storage} from '../../utils/storage';

export interface MasjidStatistics {
  totalMembers: number;
  totalImams: number;
  totalAdmins: number;
  totalQuestions: number;
  totalEvents: number;
  totalNotifications: number;
  unansweredQuestions: number;
}

export interface MasjidMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'imam' | 'member';
  is_default?: boolean;
  permissions: {
    can_view_complaints?: boolean;
    can_answer_complaints?: boolean;
    can_view_questions: boolean;
    can_answer_questions: boolean;
    can_change_prayer_times: boolean;
    can_create_events: boolean;
    can_create_notifications: boolean;
  };
}

export interface Imam {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'imam';
  permissions: {
    can_view_questions: boolean;
    can_answer_questions: boolean;
    can_change_prayer_times: boolean;
    can_create_events: boolean;
    can_create_notifications: boolean;
  };
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin';
  permissions: {
    can_view_complaints: boolean;
    can_answer_complaints: boolean;
    can_view_questions: boolean;
    can_answer_questions: boolean;
    can_change_prayer_times: boolean;
    can_create_events: boolean;
    can_create_notifications: boolean;
  };
}


export interface UpdateMasjidRequest {
  name?: string;
  location?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  contact_email?: string;
  contact_phone?: string;
}

export interface AddUserToMasjidRequest {
  userId: string;
  role: 'admin' | 'imam';
  permissions: {
    can_view_complaints?: boolean;
    can_answer_complaints?: boolean;
    can_view_questions?: boolean;
    can_answer_questions?: boolean;
    can_change_prayer_times?: boolean;
    can_create_events?: boolean;
    can_create_notifications?: boolean;
  };
}

export interface UpdateUserRoleRequest {
  role: 'admin' | 'imam';
  permissions: {
    can_view_complaints?: boolean;
    can_answer_complaints?: boolean;
    can_view_questions?: boolean;
    can_answer_questions?: boolean;
    can_change_prayer_times?: boolean;
    can_create_events?: boolean;
    can_create_notifications?: boolean;
  };
}

export interface TransferOwnershipRequest {
  newAdminId: string;
}

export interface CreateMasjidRequest {
  name: string;
  location?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  contact_email: string;
  contact_phone: string;
}

export const masjidService = {
  /**
   * Get all masajids (user's masajids or all for super admin)
   */
  async getMasajids(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ApiResponse<Masjid[]>> {
    const response = await apiClient.get<ApiResponse<Masjid[]>>(
      API_ENDPOINTS.MASAJIDS,
      {params},
    );
    return response.data;
  },

  /**
   * Get masjid by ID
   */
  async getMasjidById(masjidId: string): Promise<ApiResponse<Masjid>> {
    const response = await apiClient.get<ApiResponse<Masjid>>(
      API_ENDPOINTS.MASJID_BY_ID(masjidId),
    );
    return response.data;
  },

  /**
   * Create a new masjid
   */
  async createMasjid(
    data: CreateMasjidRequest,
  ): Promise<ApiResponse<Masjid>> {
    const response = await apiClient.post<ApiResponse<Masjid>>(
      API_ENDPOINTS.MASAJIDS,
      data,
    );
    return response.data;
  },

  /**
   * Get masjid statistics
   */
  async getMasjidStatistics(
    masjidId: string,
  ): Promise<ApiResponse<MasjidStatistics>> {
    const response = await apiClient.get<ApiResponse<MasjidStatistics>>(
      API_ENDPOINTS.MASJID_STATISTICS(masjidId),
    );
    return response.data;
  },

  /**
   * Get masjid members
   */
  async getMasjidMembers(
    masjidId: string,
  ): Promise<ApiResponse<MasjidMember[]>> {
    const response = await apiClient.get<ApiResponse<MasjidMember[]>>(
      API_ENDPOINTS.MASJID_MEMBERS(masjidId),
    );
    return response.data;
  },

  /**
   * Get imams for a masjid
   */
  async getImams(masjidId: string): Promise<ApiResponse<Imam[]>> {
    const response = await apiClient.get<ApiResponse<Imam[]>>(
      API_ENDPOINTS.MASJID_IMAMS(masjidId),
    );
    return response.data;
  },

  /**
   * Get admins for a masjid
   */
  async getAdmins(masjidId: string): Promise<ApiResponse<Admin[]>> {
    const response = await apiClient.get<ApiResponse<Admin[]>>(
      API_ENDPOINTS.MASJID_ADMINS(masjidId),
    );
    return response.data;
  },

  /**
   * Update masjid details (Admin only)
   */
  async updateMasjid(
    masjidId: string,
    data: UpdateMasjidRequest,
  ): Promise<ApiResponse<Masjid>> {
    const response = await apiClient.put<ApiResponse<Masjid>>(
      API_ENDPOINTS.UPDATE_MASJID(masjidId),
      data,
    );
    return response.data;
  },

  /**
   * Delete masjid (soft delete - Admin only)
   */
  async deleteMasjid(masjidId: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(
      API_ENDPOINTS.DELETE_MASJID(masjidId),
    );
    return response.data;
  },

  /**
   * Set default masjid for user
   */
  async setDefaultMasjid(masjidId: string): Promise<ApiResponse<null>> {
    const response = await apiClient.put<ApiResponse<null>>(
      API_ENDPOINTS.SET_DEFAULT_MASJID(masjidId),
    );
    
    // Update local storage
    await storage.setDefaultMasjid(masjidId);
    
    return response.data;
  },

  /**
   * Add user to masjid (Admin only)
   */
  async addUserToMasjid(
    masjidId: string,
    data: AddUserToMasjidRequest,
  ): Promise<ApiResponse<any>> {
    const response = await apiClient.post<ApiResponse<any>>(
      API_ENDPOINTS.ADD_USER_TO_MASJID(masjidId),
      data,
    );
    return response.data;
  },

  /**
   * Remove user from masjid (Admin only)
   */
  async removeUserFromMasjid(
    masjidId: string,
    userId: string,
  ): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(
      API_ENDPOINTS.REMOVE_USER_FROM_MASJID(masjidId, userId),
    );
    return response.data;
  },

  /**
   * Update user role in masjid (Admin only)
   */
  async updateUserRole(
    masjidId: string,
    userId: string,
    data: UpdateUserRoleRequest,
  ): Promise<ApiResponse<any>> {
    const response = await apiClient.put<ApiResponse<any>>(
      API_ENDPOINTS.UPDATE_USER_ROLE(masjidId, userId),
      data,
    );
    return response.data;
  },

  /**
   * Transfer masjid ownership (Admin only)
   */
  async transferOwnership(
    masjidId: string,
    data: TransferOwnershipRequest,
  ): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>(
      API_ENDPOINTS.TRANSFER_OWNERSHIP(masjidId),
      data,
    );
    return response.data;
  },
};

