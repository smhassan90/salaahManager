/**
 * Secure Storage Utility
 * Manages AsyncStorage operations for tokens and user data
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_CONFIG} from '../config/api.config';

export const storage = {
  // Token Management
  async setAccessToken(token: string): Promise<void> {
    await AsyncStorage.setItem(API_CONFIG.ACCESS_TOKEN_KEY, token);
  },

  async getAccessToken(): Promise<string | null> {
    return await AsyncStorage.getItem(API_CONFIG.ACCESS_TOKEN_KEY);
  },

  async setRefreshToken(token: string): Promise<void> {
    await AsyncStorage.setItem(API_CONFIG.REFRESH_TOKEN_KEY, token);
  },

  async getRefreshToken(): Promise<string | null> {
    return await AsyncStorage.getItem(API_CONFIG.REFRESH_TOKEN_KEY);
  },

  async clearTokens(): Promise<void> {
    await AsyncStorage.multiRemove([
      API_CONFIG.ACCESS_TOKEN_KEY,
      API_CONFIG.REFRESH_TOKEN_KEY,
    ]);
  },

  // User Data Management
  async setUserData(userData: any): Promise<void> {
    await AsyncStorage.setItem(
      API_CONFIG.USER_DATA_KEY,
      JSON.stringify(userData),
    );
  },

  async getUserData(): Promise<any | null> {
    const data = await AsyncStorage.getItem(API_CONFIG.USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  },

  async clearUserData(): Promise<void> {
    await AsyncStorage.removeItem(API_CONFIG.USER_DATA_KEY);
  },

  // Default Masjid Management
  async setDefaultMasjid(masjidId: string): Promise<void> {
    await AsyncStorage.setItem(API_CONFIG.DEFAULT_MASJID_KEY, masjidId);
  },

  async getDefaultMasjid(): Promise<string | null> {
    return await AsyncStorage.getItem(API_CONFIG.DEFAULT_MASJID_KEY);
  },

  async clearDefaultMasjid(): Promise<void> {
    await AsyncStorage.removeItem(API_CONFIG.DEFAULT_MASJID_KEY);
  },

  // Read Notifications Management
  async setReadNotifications(readIds: string[]): Promise<void> {
    await AsyncStorage.setItem(
      '@salaahmanager:read_notifications',
      JSON.stringify(readIds),
    );
  },

  async getReadNotifications(): Promise<string[]> {
    const data = await AsyncStorage.getItem('@salaahmanager:read_notifications');
    return data ? JSON.parse(data) : [];
  },

  async markNotificationAsRead(notificationId: string): Promise<void> {
    const readIds = await this.getReadNotifications();
    if (!readIds.includes(notificationId)) {
      readIds.push(notificationId);
      await this.setReadNotifications(readIds);
    }
  },

  async clearReadNotifications(): Promise<void> {
    await AsyncStorage.removeItem('@salaahmanager:read_notifications');
  },

  // FCM Token Management
  async setFCMToken(token: string): Promise<void> {
    await AsyncStorage.setItem('@salaahmanager:fcm_token', token);
  },

  async getFCMToken(): Promise<string | null> {
    return await AsyncStorage.getItem('@salaahmanager:fcm_token');
  },

  async removeFCMToken(): Promise<void> {
    await AsyncStorage.removeItem('@salaahmanager:fcm_token');
  },

  // Language Preference Management
  async setLanguage(languageCode: string): Promise<void> {
    await AsyncStorage.setItem('@salaahmanager:language', languageCode);
  },

  async getLanguage(): Promise<string | null> {
    return await AsyncStorage.getItem('@salaahmanager:language');
  },

  async clearLanguage(): Promise<void> {
    await AsyncStorage.removeItem('@salaahmanager:language');
  },

  // Clear All Data (on logout)
  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove([
      API_CONFIG.ACCESS_TOKEN_KEY,
      API_CONFIG.REFRESH_TOKEN_KEY,
      API_CONFIG.USER_DATA_KEY,
      API_CONFIG.DEFAULT_MASJID_KEY,
      '@salaahmanager:read_notifications',
      '@salaahmanager:fcm_token',
      // Note: Language preference is kept on logout
    ]);
  },
};

