/**
 * Super Admin Service
 * Handles super admin operations for user management
 */

import apiClient, {ApiResponse} from './apiClient';
import {API_ENDPOINTS} from '../../config/api.config';

export interface SuperAdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  is_active: boolean;
  is_super_admin: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at?: string;
  userMasajids?: Array<{
    id: string;
    role: string;
    masjid: {
      id: string;
      name: string;
      city: string;
    };
  }>;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  is_super_admin?: boolean;
}

export const superAdminService = {
  /**
   * Get all users (Super Admin only)
   */
  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ApiResponse<SuperAdminUser[]>> {
    const response = await apiClient.get<ApiResponse<SuperAdminUser[]>>(
      API_ENDPOINTS.SUPER_ADMIN_USERS,
      {params},
    );
    return response.data;
  },

  /**
   * Create user (Super Admin only)
   */
  async createUser(
    data: CreateUserRequest,
  ): Promise<ApiResponse<SuperAdminUser>> {
    const response = await apiClient.post<ApiResponse<SuperAdminUser>>(
      API_ENDPOINTS.SUPER_ADMIN_CREATE_USER,
      data,
    );
    return response.data;
  },

  /**
   * Get user by ID (Super Admin only)
   */
  async getUserById(userId: string): Promise<ApiResponse<SuperAdminUser>> {
    const response = await apiClient.get<ApiResponse<SuperAdminUser>>(
      API_ENDPOINTS.SUPER_ADMIN_USER_BY_ID(userId),
    );
    return response.data;
  },

  /**
   * Delete user (Super Admin only)
   */
  async deleteUser(userId: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(
      API_ENDPOINTS.SUPER_ADMIN_DELETE_USER(userId),
    );
    return response.data;
  },

  /**
   * Promote user to super admin (Super Admin only)
   */
  async promoteToSuperAdmin(
    userId: string,
  ): Promise<ApiResponse<SuperAdminUser>> {
    const response = await apiClient.put<ApiResponse<SuperAdminUser>>(
      API_ENDPOINTS.PROMOTE_TO_SUPER_ADMIN(userId),
    );
    return response.data;
  },

  /**
   * Demote user from super admin (Super Admin only)
   */
  async demoteFromSuperAdmin(
    userId: string,
  ): Promise<ApiResponse<SuperAdminUser>> {
    const response = await apiClient.put<ApiResponse<SuperAdminUser>>(
      API_ENDPOINTS.DEMOTE_FROM_SUPER_ADMIN(userId),
    );
    return response.data;
  },

  /**
   * Get all super admins (Super Admin only)
   */
  async getAllSuperAdmins(): Promise<ApiResponse<SuperAdminUser[]>> {
    const response = await apiClient.get<ApiResponse<SuperAdminUser[]>>(
      API_ENDPOINTS.SUPER_ADMIN_LIST,
    );
    return response.data;
  },

  /**
   * Activate user (Super Admin only)
   */
  async activateUser(userId: string): Promise<ApiResponse<SuperAdminUser>> {
    const response = await apiClient.put<ApiResponse<SuperAdminUser>>(
      API_ENDPOINTS.ACTIVATE_USER(userId),
    );
    return response.data;
  },

  /**
   * Deactivate user (Super Admin only)
   */
  async deactivateUser(userId: string): Promise<ApiResponse<SuperAdminUser>> {
    const response = await apiClient.put<ApiResponse<SuperAdminUser>>(
      API_ENDPOINTS.DEACTIVATE_USER(userId),
    );
    return response.data;
  },
};

