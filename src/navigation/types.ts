import {NavigatorScreenParams} from '@react-navigation/native';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Main: NavigatorScreenParams<BottomTabParamList>;
  MasjidDetail: {masjidId: string};
  SendNotification: {masjidId: string};
  AddEvent: {masjidId: string};
};

export type BottomTabParamList = {
  Home: undefined;
  Questions: undefined;
  MyMasajids: undefined;
  Profile: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

