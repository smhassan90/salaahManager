import React from 'react';
import {View, TouchableOpacity, StyleSheet, ViewStyle} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {theme} from '../theme';
import {AppText} from './AppText';
import {AppIcon} from './AppIcon';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  leftIcon?: string | React.ReactNode;
  rightIcon?: string | React.ReactNode;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  showBackButton?: boolean;
  showMenuButton?: boolean;
  backgroundColor?: string;
  style?: ViewStyle;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  showBackButton = false,
  showMenuButton = false,
  backgroundColor = theme.colors.primary,
  style,
}) => {
  return (
    <SafeAreaView 
      edges={['top']} 
      style={[styles.safeArea, {backgroundColor}]}>
      <View style={[styles.container, style]}>
        <View style={styles.leftSection}>
          {(showBackButton || leftIcon || onLeftPress) && (
            <TouchableOpacity onPress={onLeftPress} style={styles.iconButton}>
              {typeof leftIcon === 'string' ? (
                <AppText size="lg" color={theme.colors.textWhite}>
                  {leftIcon}
                </AppText>
              ) : leftIcon ? (
                leftIcon
              ) : showBackButton ? (
                <AppIcon name="chevron-back" size={26} color={theme.colors.textWhite} />
              ) : null}
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.centerSection}>
          <AppText
            variant="semiBold"
            size="lg"
            color={theme.colors.textWhite}
            align="center">
            {title}
          </AppText>
          {subtitle && (
            <AppText
              size="sm"
              color={theme.colors.textWhite}
              align="center"
              style={styles.subtitle}>
              {subtitle}
            </AppText>
          )}
        </View>

        <View style={styles.rightSection}>
          {(showMenuButton || rightIcon || onRightPress) && (
            <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
              {typeof rightIcon === 'string' ? (
                <AppText size="lg" color={theme.colors.textWhite}>
                  {rightIcon}
                </AppText>
              ) : rightIcon ? (
                rightIcon
              ) : showMenuButton ? (
                <AppIcon name="menu" size={26} color={theme.colors.textWhite} />
              ) : null}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 60,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 3,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  iconButton: {
    padding: theme.spacing.sm,
  },
  subtitle: {
    marginTop: theme.spacing.xs,
  },
});

