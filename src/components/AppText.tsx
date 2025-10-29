import React from 'react';
import {Text, TextProps, StyleSheet} from 'react-native';
import {theme} from '../theme';

type TextVariant = 'regular' | 'medium' | 'semiBold' | 'bold';
type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl' | 'huge';
type TextAlign = 'left' | 'center' | 'right' | 'justify';

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  size?: TextSize;
  color?: string;
  align?: TextAlign;
  children: React.ReactNode;
}

export const AppText: React.FC<AppTextProps> = ({
  variant = 'regular',
  size = 'md',
  color = theme.colors.textDark,
  align = 'left',
  style,
  children,
  ...props
}) => {
  const fontWeightMap: Record<TextVariant, any> = {
    regular: theme.typography.fontWeight.regular,
    medium: theme.typography.fontWeight.medium,
    semiBold: theme.typography.fontWeight.semiBold,
    bold: theme.typography.fontWeight.bold,
  };

  return (
    <Text
      style={[
        styles.text,
        {
          fontSize: theme.typography.fontSize[size],
          fontWeight: fontWeightMap[variant],
          color: color,
          textAlign: align,
        },
        style,
      ]}
      {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.md,
  },
});

