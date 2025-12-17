import {NavigatorScreenParams} from '@react-navigation/native';

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
};

export type BottomTabParamList = {
  Home: undefined;
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

