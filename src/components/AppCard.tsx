import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {theme} from '../theme';

type CardPadding = 'none' | 'small' | 'medium' | 'large';
type CardShadow = 'none' | 'small' | 'medium' | 'large';

interface AppCardProps {
  children: React.ReactNode;
  padding?: CardPadding;
  shadow?: CardShadow;
  style?: ViewStyle;
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  padding = 'medium',
  shadow = 'small',
  style,
}) => {
  const getPaddingStyle = (): ViewStyle => {
    const paddingMap: Record<CardPadding, number> = {
      none: 0,
      small: theme.spacing.sm,
      medium: theme.spacing.md,
      large: theme.spacing.lg,
    };
    return {padding: paddingMap[padding]};
  };

  const getShadowStyle = (): ViewStyle => {
    const shadowMap: Record<CardShadow, ViewStyle> = {
      none: {},
      small: theme.shadow.small,
      medium: theme.shadow.medium,
      large: theme.shadow.large,
    };
    return shadowMap[shadow];
  };

  return (
    <View
      style={[
        styles.card,
        getPaddingStyle(),
        getShadowStyle(),
        style,
      ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});

