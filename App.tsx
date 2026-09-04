/**
 * AlAsr Manager Masajid Prayer Timings - Imam Prayer Management App
 * 
 * @format
 */

import React, {useState, useEffect} from 'react';
import {StatusBar, Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';
import {AppProvider, useApp} from './src/context';
import {SplashScreen, LoginScreen} from './src/screens';
import {MainStackNavigator} from './src/navigation/MainStackNavigator';
import {navigationRef} from './src/navigation/navigationRef';
import './src/i18n/config'; // Initialize i18n

type Screen = 'splash' | 'login' | 'home';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const {isLoggedIn, isLoading, logout, fetchNotifications, defaultMasjid} = useApp();

  // Set up FCM notification handlers
  useEffect(() => {
    if (!isLoggedIn) return;

    let isMounted = true;
    let initialNotificationChecked = false;
    const processedMessageIds = new Set<string>(); // Track processed messages to prevent duplicates

    // Handle foreground messages
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('📬 Foreground notification received:', remoteMessage);
      
      if (!isMounted) return;
      
      // Deduplication: Check if we've already processed this message
      const messageId = remoteMessage.messageId || `${remoteMessage.notification?.title}-${Date.now()}`;
      if (processedMessageIds.has(messageId)) {
        console.log('⚠️ Duplicate foreground message detected, skipping:', messageId);
        return;
      }
      processedMessageIds.add(messageId);
      
      // Clean up old message IDs (keep only last 100)
      if (processedMessageIds.size > 100) {
        const idsArray = Array.from(processedMessageIds);
        idsArray.slice(0, idsArray.length - 100).forEach(id => processedMessageIds.delete(id));
      }
      
      // Show alert for foreground notifications
      if (remoteMessage.notification) {
        Alert.alert(
          remoteMessage.notification.title || 'Notification',
          remoteMessage.notification.body || '',
        );
      }

      // Refresh notifications if default masjid is available
      if (defaultMasjid && isMounted) {
        try {
          await fetchNotifications(defaultMasjid.id);
        } catch (error) {
          console.error('Error fetching notifications after foreground message:', error);
        }
      }
    });

    // Handle notification opened when app is in background
    const unsubscribeOpened = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('📬 Notification opened app from background:', remoteMessage);
      if (!isMounted) return;
      
      // Deduplication: Check if we've already processed this message
      const messageId = remoteMessage.messageId || `${remoteMessage.notification?.title}-${Date.now()}`;
      if (processedMessageIds.has(messageId)) {
        console.log('⚠️ Duplicate background message detected, skipping:', messageId);
        return;
      }
      processedMessageIds.add(messageId);
      
      // Refresh notifications
      if (defaultMasjid) {
        fetchNotifications(defaultMasjid.id).catch(error => {
          console.error('Error fetching notifications after opening from background:', error);
        });
      }
    });

    // Check if app was opened from a notification (only check once)
    if (!initialNotificationChecked) {
      initialNotificationChecked = true;
      messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          if (remoteMessage && isMounted) {
            console.log('📬 App opened from notification:', remoteMessage);
            // Refresh notifications
            if (defaultMasjid) {
              fetchNotifications(defaultMasjid.id).catch(error => {
                console.error('Error fetching notifications after initial notification:', error);
              });
            }
          }
        })
        .catch(error => {
          console.error('Error checking initial notification:', error);
        });
    }

    return () => {
      isMounted = false;
      unsubscribeForeground();
      unsubscribeOpened();
    };
  }, [isLoggedIn, defaultMasjid, fetchNotifications]);

  const handleSplashFinish = () => {
    if (isLoggedIn) {
      setCurrentScreen('home');
    } else {
      setCurrentScreen('login');
    }
  };

  const handleLoginSuccess = () => {
    setCurrentScreen('home');
  };

  const handleLogout = async () => {
    await logout();
    setCurrentScreen('login');
  };

  // Show splash screen while checking auth status
  if (isLoading || currentScreen === 'splash') {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (!isLoggedIn || currentScreen === 'login') {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Home screen with bottom tabs
  return (
    <NavigationContainer ref={navigationRef}>
      <MainStackNavigator onLogout={handleLogout} />
    </NavigationContainer>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar 
          barStyle="light-content" 
          backgroundColor="transparent" 
          translucent={true}
        />
        <AppContent />
      </AppProvider>
    </SafeAreaProvider>
  );
}

export default App;
