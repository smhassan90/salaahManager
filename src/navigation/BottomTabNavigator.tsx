import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {QuestionsScreen, MyMasajidsScreen, ProfileScreen, NotificationsScreen} from '../screens';
import {HomeStackNavigator} from './HomeStackNavigator';
import {FloatingTabBar} from './FloatingTabBar';
import {theme} from '../theme';
import {useTranslation} from '../i18n';

const Tab = createBottomTabNavigator();

interface BottomTabNavigatorProps {
  onLogout: () => void;
}

export const BottomTabNavigator: React.FC<BottomTabNavigatorProps> = ({onLogout}) => {
  const {t} = useTranslation();

  return (
    <Tab.Navigator
      tabBar={props => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.colors.textWhite,
        tabBarInactiveTintColor: theme.colors.grayDark,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          position: 'absolute',
        },
      }}>
      <Tab.Screen
        name="Home"
        options={{
          tabBarLabel: t('tabs.home'),
          tabBarIcon: ({color, focused}) => (
            <Icon name={focused ? 'home' : 'home-outline'} size={22} color={color} />
          ),
        }}
        listeners={({navigation}) => ({
          tabPress: () => {
            navigation.navigate('Home', {screen: 'HomeMain'});
          },
        })}>
        {() => <HomeStackNavigator onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen
        name="Questions"
        component={QuestionsScreen}
        options={{
          tabBarLabel: t('tabs.questions'),
          tabBarIcon: ({color, focused}) => (
            <Icon
              name={focused ? 'help-circle' : 'help-circle-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MyMasajids"
        component={MyMasajidsScreen}
        options={{
          tabBarLabel: t('tabs.myMasajids'),
          tabBarIcon: ({color, focused}) => (
            <Icon
              name={focused ? 'business' : 'business-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarLabel: t('tabs.notifications'),
          tabBarIcon: ({color, focused}) => (
            <Icon
              name={focused ? 'notifications' : 'notifications-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        options={{
          tabBarLabel: t('tabs.profile'),
          tabBarIcon: ({color, focused}) => (
            <Icon name={focused ? 'person' : 'person-outline'} size={22} color={color} />
          ),
        }}>
        {() => <ProfileScreen onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};
