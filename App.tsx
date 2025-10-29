/**
 * SalaahManager - Imam Prayer Management App
 * 
 * @format
 */

import React, {useState} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppProvider, useApp} from './src/context';
import {SplashScreen, LoginScreen} from './src/screens';
import {BottomTabNavigator} from './src/navigation/BottomTabNavigator';

type Screen = 'splash' | 'login' | 'home';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const {isLoggedIn, logout} = useApp();

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

  const handleLogout = () => {
    logout();
    setCurrentScreen('login');
  };

  if (currentScreen === 'splash') {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (currentScreen === 'login') {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Home screen with bottom tabs
  return (
    <NavigationContainer>
      <BottomTabNavigator onLogout={handleLogout} />
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
