/**
 * User Service
 * Handles user profile and masjid membership operations
 */

import apiClient, {ApiResponse} from './apiClient';
import {API_ENDPOINTS, API_CONFIG} from '../../config/api.config';
import {storage} from '../../utils/storage';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profile_picture?: string;
  is_super_admin: boolean;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  settings?: UserSettings;
}

export interface UserSettings {
  prayer_times_notifications: boolean;
  events_notifications: boolean;
  donations_notifications: boolean;
  general_notifications: boolean;
  questions_notifications: boolean;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
}

export interface UserMasjid {
  masjidId: string;
  name: string;
  location: string;
  city: string;
  roles: string[];
  isDefault: boolean;
  // Optional fields that may be present
  permissions?: {
    can_view_complaints?: boolean;
    can_answer_complaints?: boolean;
    can_view_questions?: boolean;
    can_answer_questions?: boolean;
    can_change_prayer_times?: boolean;
    can_create_events?: boolean;
    can_create_notifications?: boolean;
  };
}

export const userService = {
  /**
   * Get current user's profile
   */
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    const response = await apiClient.get<ApiResponse<UserProfile>>(
      API_ENDPOINTS.MY_PROFILE,
    );

    // Update stored user data
    await storage.setUserData(response.data.data);

    return response.data;
  },

  /**
   * Update current user's profile
   */
  async updateProfile(
    data: UpdateProfileRequest,
  ): Promise<ApiResponse<UserProfile>> {
    const response = await apiClient.put<ApiResponse<UserProfile>>(
      API_ENDPOINTS.UPDATE_PROFILE,
      data,
    );

    // Update stored user data
    await storage.setUserData(response.data.data);

    return response.data;
  },

  /**
   * Upload profile picture
   */
  async uploadProfilePicture(imageUri: string): Promise<ApiResponse<{profile_picture: string}>> {
    const formData = new FormData();
    
    // Extract filename from URI
    const filename = imageUri.split('/').pop() || 'profile.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('profile_picture', {
      uri: imageUri,
      name: filename,
      type,
    } as any);

    const response = await apiClient.post<
      ApiResponse<{profile_picture: string}>
    >(API_ENDPOINTS.UPLOAD_PROFILE_PICTURE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Update stored user data with new profile picture
    const userData = await storage.getUserData();
    if (userData) {
      userData.profile_picture = response.data.data.profile_picture;
      await storage.setUserData(userData);
    }

    return response.data;
  },

  /**
   * Delete profile picture
   */
  async deleteProfilePicture(): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(
      API_ENDPOINTS.DELETE_PROFILE_PICTURE,
    );

    // Update stored user data
    const userData = await storage.getUserData();
    if (userData) {
      userData.profile_picture = undefined;
      await storage.setUserData(userData);
    }

    return response.data;
  },

  /**
   * Get user's masajids with permissions
   */
  async getMyMasajids(): Promise<ApiResponse<UserMasjid[]>> {
    const response = await apiClient.get<ApiResponse<UserMasjid[]>>(
      API_ENDPOINTS.MY_MASAJIDS,
    );

    // Store default masjid if found
    const defaultMasjid = response.data.data.find(m => m.isDefault);
    if (defaultMasjid) {
      await storage.setDefaultMasjid(defaultMasjid.masjidId);
    }

    return response.data;
  },

  /**
   * Change password
   */
  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>(
      API_ENDPOINTS.CHANGE_PASSWORD,
      data,
    );
    return response.data;
  },

  /**
   * Get user settings
   */
  async getUserSettings(): Promise<ApiResponse<UserSettings>> {
    const response = await apiClient.get<ApiResponse<UserSettings>>(
      API_ENDPOINTS.USER_SETTINGS,
    );
    return response.data;
  },

  /**
   * Update user settings
   */
  async updateUserSettings(
    settings: Partial<UserSettings>,
  ): Promise<ApiResponse<UserSettings>> {
    const response = await apiClient.put<ApiResponse<UserSettings>>(
      API_ENDPOINTS.UPDATE_USER_SETTINGS,
      settings,
    );
    return response.data;
  },

  /**
   * Delete user account
   */
  async deleteAccount(): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(
      API_ENDPOINTS.DELETE_ACCOUNT,
    );
    
    // Clear all local data after account deletion
    await storage.clearAll();
    
    return response.data;
  },

  /**
   * Register FCM token
   * 
   * Sends FCM token to backend endpoint: POST /users/fcm-token
   * Request body: { fcm_token: string }
   * 
   * Note: If your backend expects a different field name, update the requestBody below.
   * Common alternatives: 'token', 'deviceToken', 'fcmToken', 'device_token'
   */
  async registerFCMToken(fcmToken: string): Promise<ApiResponse<null>> {
    const endpoint = API_ENDPOINTS.REGISTER_FCM_TOKEN;
    // Using snake_case to match backend API style (consistent with other endpoints)
    const requestBody = {fcm_token: fcmToken};
    
    const response = await apiClient.post<ApiResponse<null>>(
      endpoint,
      requestBody,
    );
    
    return response.data;
  },
};

