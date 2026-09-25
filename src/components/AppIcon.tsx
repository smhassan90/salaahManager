import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {iconMap, type IconName} from '../assets/icons';

interface AppIconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

/** Renders SVG icons from src/assets/icons (no custom font required on iOS). */
export const AppIcon: React.FC<AppIconProps> = ({
  name,
  size = 22,
  color = '#000',
  style,
}) => {
  const IconComponent = iconMap[name] ?? iconMap['ellipse-outline'];
  return (
    <IconComponent width={size} height={size} color={color} style={style} />
  );
};

export type {IconName};
/** @deprecated Use IconName — kept for existing imports */
export type IoniconsName = IconName;
