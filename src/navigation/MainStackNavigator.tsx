import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ActivityLogsScreen, AddEventScreen} from '../screens';
import {BottomTabNavigator} from './BottomTabNavigator';
import {MainStackParamList} from './types';

const Stack = createStackNavigator<MainStackParamList>();

interface MainStackNavigatorProps {
  onLogout: () => void;
}

export const MainStackNavigator: React.FC<MainStackNavigatorProps> = ({
  onLogout,
}) => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Main">
        {() => <BottomTabNavigator onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen name="ActivityLogs" component={ActivityLogsScreen} />
      <Stack.Screen name="AddEvent" component={AddEventScreen} />
    </Stack.Navigator>
  );
};
