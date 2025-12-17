import React, {useRef} from 'react';
import {NavigationContainer, NavigationContainerRef} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from './types';
import {
  SplashScreen,
  LoginScreen,
  MasjidDetailScreen,
  SendNotificationScreen,
  AddEventScreen,
  ChangePasswordScreen,
  NotificationSettingsScreen,
  LanguageSettingsScreen,
  AboutScreen,
} from '../screens';
import {BottomTabNavigator} from './BottomTabNavigator';

const Stack = createStackNavigator<RootStackParamList>();

// Create a navigation ref that can be accessed globally
export const navigationRef = React.createRef<NavigationContainerRef<RootStackParamList>>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={BottomTabNavigator} />
        <Stack.Screen name="MasjidDetail" component={MasjidDetailScreen} />
        <Stack.Screen
          name="SendNotification"
          component={SendNotificationScreen}
        />
        <Stack.Screen name="AddEvent" component={AddEventScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
        <Stack.Screen name="LanguageSettings" component={LanguageSettingsScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

