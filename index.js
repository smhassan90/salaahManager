/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Import FCM background handler
import messaging from '@react-native-firebase/messaging';

// Register background handler
// This must be called outside of React component lifecycle
messaging().setBackgroundMessageHandler(async remoteMessage => {
  try {
    console.log('📬 Background message received:', remoteMessage);
    // Background messages are automatically displayed by the OS
    // You can add custom handling here if needed (e.g., update local storage, schedule local notifications, etc.)
  } catch (error) {
    console.error('❌ Error handling background message:', error);
  }
});

AppRegistry.registerComponent(appName, () => App);
