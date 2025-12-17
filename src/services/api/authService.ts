/**
 * Authentication Service
 * Handles user registration, login, logout, and token management
 */

import apiClient, {ApiResponse} from './apiClient';
import {API_ENDPOINTS} from '../../config/api.config';
import {storage} from '../../utils/storage';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    profile_picture?: string;
    is_super_admin: boolean;
    is_active: boolean;
    email_verified: boolean;
    created_at: string;
  };
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.REGISTER,
      data,
    );

    // Save tokens and user data (trim tokens to avoid whitespace issues)
    const {accessToken, refreshToken, user} = response.data.data;
    await storage.setAccessToken(accessToken.trim());
    await storage.setRefreshToken(refreshToken.trim());
    await storage.setUserData(user);

    return response.data;
  },

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.LOGIN,
      data,
    );

    // Save tokens and user data (trim tokens to avoid whitespace issues)
    const {accessToken, refreshToken, user} = response.data.data;
    await storage.setAccessToken(accessToken.trim());
    await storage.setRefreshToken(refreshToken.trim());
    await storage.setUserData(user);

    return response.data;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint (optional - tokens are long-lived)
      await apiClient.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      // Continue with local logout even if API call fails
      console.error('Logout API error:', error);
    } finally {
      // Clear all local data
      await storage.clearAll();
    }
  },

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<{accessToken: string; refreshToken: string}> {
    const refreshToken = await storage.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<
      ApiResponse<{accessToken: string; refreshToken: string}>
    >(API_ENDPOINTS.REFRESH_TOKEN, {
      refreshToken,
    });

    const {accessToken, refreshToken: newRefreshToken} = response.data.data;
    await storage.setAccessToken(accessToken);
    await storage.setRefreshToken(newRefreshToken);

    return {accessToken, refreshToken: newRefreshToken};
  },

  /**
   * Check if user is authenticated (has valid token)
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await storage.getAccessToken();
    return !!token;
  },

  /**
   * Get stored user data
   */
  async getStoredUser(): Promise<AuthResponse['user'] | null> {
    return await storage.getUserData();
  },

  /**
   * Forgot password - Request password reset
   */
  async forgotPassword(email: string): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>(
      API_ENDPOINTS.FORGOT_PASSWORD,
      {email},
    );
    return response.data;
  },

  /**
   * Reset password with token
   */
  async resetPassword(data: {
    token: string;
    password: string;
    confirmPassword: string;
  }): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>(
      API_ENDPOINTS.RESET_PASSWORD,
      data,
    );
    return response.data;
  },

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>(
      API_ENDPOINTS.VERIFY_EMAIL,
      {token},
    );
    return response.data;
  },
};

