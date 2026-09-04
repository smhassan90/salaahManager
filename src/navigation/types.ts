import {NavigatorScreenParams} from '@react-navigation/native';
import {HomeStackParamList} from './HomeStackNavigator';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Main: NavigatorScreenParams<BottomTabParamList>;
  MasjidDetail: {masjidId: string};
  SendNotification: {masjidId: string};
  AddEvent: {masjidId: string};
  ChangePassword: undefined;
  NotificationSettings: undefined;
  LanguageSettings: undefined;
  About: undefined;
  ActivityLogs: undefined;
};

export type MainStackParamList = {
  Main: NavigatorScreenParams<BottomTabParamList> | undefined;
  ActivityLogs: undefined;
  AddEvent: {masjidId: string};
};

export type BottomTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList> | undefined;
  Questions: undefined;
  MyMasajids: undefined;
  Notifications: undefined;
  Profile: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

