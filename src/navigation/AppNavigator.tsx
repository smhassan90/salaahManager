import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from './types';
import {
  SplashScreen,
  LoginScreen,
  MasjidDetailScreen,
  SendNotificationScreen,
  AddEventScreen,
} from '../screens';
import {BottomTabNavigator} from './BottomTabNavigator';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

