import React from 'react';
import {View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {QuestionsScreen, MyMasajidsScreen, ProfileScreen} from '../screens';
import {HomeStackNavigator} from './HomeStackNavigator';
import {theme} from '../theme';

const Tab = createBottomTabNavigator();

interface BottomTabNavigatorProps {
  onLogout: () => void;
}

export const BottomTabNavigator: React.FC<BottomTabNavigatorProps> = ({onLogout}) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.grayDark,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          height: 65,
          paddingBottom: 8,
          paddingTop: 4,
          elevation: 8,
          shadowColor: theme.colors.shadow,
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.fontSize.xs,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingTop: 8,
        },
      }}>
      <Tab.Screen
        name="Home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, focused}) => (
            <View>
              {focused && (
                <View
                  style={{
                    position: 'absolute',
                    top: -8,
                    left: 0,
                    right: 0,
                    height: 3,
                    backgroundColor: theme.colors.primary,
                    borderRadius: 2,
                  }}
                />
              )}
              <Icon name={focused ? 'home' : 'home-outline'} size={24} color={color} />
            </View>
          ),
        }}>
        {() => <HomeStackNavigator onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen
        name="Questions"
        component={QuestionsScreen}
        options={{
          tabBarLabel: 'Questions',
          tabBarIcon: ({color, focused}) => (
            <View>
              {focused && (
                <View
                  style={{
                    position: 'absolute',
                    top: -8,
                    left: 0,
                    right: 0,
                    height: 3,
                    backgroundColor: theme.colors.primary,
                    borderRadius: 2,
                  }}
                />
              )}
              <Icon name={focused ? 'help-circle' : 'help-circle-outline'} size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="MyMasajids"
        component={MyMasajidsScreen}
        options={{
          tabBarLabel: 'My Masajids',
          tabBarIcon: ({color, focused}) => (
            <View>
              {focused && (
                <View
                  style={{
                    position: 'absolute',
                    top: -8,
                    left: 0,
                    right: 0,
                    height: 3,
                    backgroundColor: theme.colors.primary,
                    borderRadius: 2,
                  }}
                />
              )}
              <Icon name={focused ? 'business' : 'business-outline'} size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, focused}) => (
            <View>
              {focused && (
                <View
                  style={{
                    position: 'absolute',
                    top: -8,
                    left: 0,
                    right: 0,
                    height: 3,
                    backgroundColor: theme.colors.primary,
                    borderRadius: 2,
                  }}
                />
              )}
              <Icon name={focused ? 'person' : 'person-outline'} size={24} color={color} />
            </View>
          ),
        }}>
        {() => <ProfileScreen onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

