import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen} from '../screens/HomeScreen';
import {NotificationsScreen} from '../screens/NotificationsScreen';
import {EventsScreen} from '../screens/EventsScreen';

export type HomeStackParamList = {
  HomeMain: undefined;
  Notifications: undefined;
  Events: undefined;
};

const Stack = createStackNavigator<HomeStackParamList>();

interface HomeStackNavigatorProps {
  onLogout: () => void;
}

export const HomeStackNavigator: React.FC<HomeStackNavigatorProps> = ({onLogout}) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeMain">
        {() => <HomeScreen onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Events" component={EventsScreen} />
    </Stack.Navigator>
  );
};

