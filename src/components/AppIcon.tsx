import React from 'react';
import {StyleProp, TextStyle} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type IoniconsName = React.ComponentProps<typeof Icon>['name'];

interface AppIconProps {
  name: IoniconsName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

/** Ionicons with explicit font family so glyphs are not overridden by app text styles. */
export const AppIcon: React.FC<AppIconProps> = ({
  name,
  size = 22,
  color = '#000',
  style,
}) => (
  <Icon
    name={name}
    size={size}
    color={color}
    allowFontScaling={false}
    style={[{fontFamily: 'Ionicons'}, style]}
  />
);

export type {IoniconsName};
