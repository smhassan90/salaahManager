/**
 * FCM Service
 * Handles Firebase Cloud Messaging functionality
 */

import messaging from '@react-native-firebase/messaging';
import {Platform, PermissionsAndroid, Alert} from 'react-native';
import {storage} from '../../utils/storage';

class FCMService {
  private fcmToken: string | null = null;

  /**
   * Request notification permissions
   */
  async requestPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        // For Android 13+ (API 33+)
        if (Platform.Version >= 33) {
          console.log('📱 Android 13+ detected, requesting POST_NOTIFICATIONS permission...');
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.warn('⚠️ Notification permission denied by user');
            return false;
          }
          console.log('✅ Android notification permission granted');
        } else {
          console.log('📱 Android < 13, notification permission not required');
        }
      } else {
        // iOS
        console.log('📱 iOS detected, requesting notification permission...');
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
          console.warn('⚠️ iOS notification permission denied by user');
          return false;
        }
        console.log('✅ iOS notification permission granted');
      }

      return true;
    } catch (error) {
      console.error('❌ Error requesting notification permission:', error);
      return false;
    }
  }

  /**
   * Get FCM token
   */
  async getToken(): Promise<string | null> {
    try {
      const token = await messaging().getToken();
      if (token) {
        this.fcmToken = token;
        await storage.setFCMToken(token);
        console.log('📱 FCM Token obtained:', token);
        console.log('💾 FCM Token stored locally');
        return token;
      } else {
        console.warn('⚠️ FCM token is empty. Check Firebase configuration.');
        return null;
      }
    } catch (error: any) {
      console.error('❌ Error getting FCM token:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        nativeError: error?.nativeError,
      });
      return null;
    }
  }

  /**
   * Delete FCM token
   */
  async deleteToken(): Promise<void> {
    try {
      await messaging().deleteToken();
      this.fcmToken = null;
      await storage.removeFCMToken();
    } catch (error) {
      console.error('Error deleting FCM token:', error);
    }
  }

  /**
   * Check if token is available
   */
  getCurrentToken(): string | null {
    return this.fcmToken;
  }

  /**
   * Get stored FCM token from storage
   */
  async getStoredToken(): Promise<string | null> {
    try {
      const storedToken = await storage.getFCMToken();
      if (storedToken) {
        console.log('📱 Stored FCM token found:', storedToken);
        this.fcmToken = storedToken;
        return storedToken;
      } else {
        console.log('📱 No stored FCM token found');
        return null;
      }
    } catch (error) {
      console.error('❌ Error getting stored FCM token:', error);
      return null;
    }
  }

  /**
   * Manually retry getting FCM token (useful for debugging)
   */
  async retryGetToken(): Promise<string | null> {
    console.log('🔄 Manually retrying FCM token retrieval...');
    return await this.getToken();
  }

  /**
   * Initialize FCM - request permission and get token
   */
  async initialize(): Promise<string | null> {
    try {
      console.log('🔔 Requesting notification permission...');
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        console.warn('⚠️ Notification permission denied. FCM token cannot be obtained.');
        return null;
      }
      console.log('✅ Notification permission granted');

      console.log('🔔 Getting FCM token...');
      const token = await this.getToken();
      if (token) {
        console.log('✅ FCM token retrieved successfully');
      } else {
        console.warn('⚠️ FCM token is null. Check Firebase configuration.');
      }
      return token;
    } catch (error) {
      console.error('❌ Error initializing FCM:', error);
      return null;
    }
  }

  /**
   * Set up foreground message handler
   */
  setupForegroundHandler(onMessage: (message: any) => void) {
    return messaging().onMessage(async remoteMessage => {
      console.log('Foreground message received:', remoteMessage);
      onMessage(remoteMessage);
    });
  }

  /**
   * Set up background message handler
   * Note: This must be called outside of React component lifecycle
   */
  setupBackgroundHandler() {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background message received:', remoteMessage);
    });
  }

  /**
   * Set up notification opened handler (when app is opened from notification)
   */
  setupNotificationOpenedHandler(onNotificationOpened: (message: any) => void) {
    return messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened app:', remoteMessage);
      onNotificationOpened(remoteMessage);
    });
  }

  /**
   * Check if app was opened from a notification
   */
  async getInitialNotification(): Promise<any> {
    try {
      const remoteMessage = await messaging().getInitialNotification();
      if (remoteMessage) {
        console.log('App opened from notification:', remoteMessage);
        return remoteMessage;
      }
      return null;
    } catch (error) {
      console.error('Error getting initial notification:', error);
      return null;
    }
  }

  /**
   * Subscribe to a topic
   */
  async subscribeToTopic(topic: string): Promise<void> {
    try {
      await messaging().subscribeToTopic(topic);
      console.log(`Subscribed to topic: ${topic}`);
    } catch (error) {
      console.error(`Error subscribing to topic ${topic}:`, error);
    }
  }

  /**
   * Unsubscribe from a topic
   */
  async unsubscribeFromTopic(topic: string): Promise<void> {
    try {
      await messaging().unsubscribeFromTopic(topic);
      console.log(`Unsubscribed from topic: ${topic}`);
    } catch (error) {
      console.error(`Error unsubscribing from topic ${topic}:`, error);
    }
  }
}

export const fcmService = new FCMService();

