import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {AppText} from '../components';
import {theme} from '../theme';
import {useApp} from '../context';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({onFinish}) => {
  const {isLoggedIn} = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <AppText variant="bold" size="huge" color={theme.colors.primary}>
        🕌
      </AppText>
      <AppText
        variant="bold"
        size="xxxl"
        color={theme.colors.primary}
        style={styles.title}>
        SalaahManager
      </AppText>
      <AppText size="md" color={theme.colors.textLight}>
        Manage Your Masjid with Ease
      </AppText>
      
      <View style={styles.messageContainer}>
        <AppText size="xs" color={theme.colors.textLight} align="center">
          Loading...
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  title: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  messageContainer: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.md,
  },
  statusText: {
    marginTop: theme.spacing.xs,
  },
});

