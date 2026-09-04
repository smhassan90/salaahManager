import {createNavigationContainerRef} from '@react-navigation/native';
import {MainStackParamList} from './types';

export const navigationRef = createNavigationContainerRef<MainStackParamList>();

export function openActivityLogs() {
  if (navigationRef.isReady()) {
    navigationRef.navigate('ActivityLogs');
  }
}
