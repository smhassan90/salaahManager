import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity} from 'react-native';
import {AppText, AppButton, AppTextInput, AppHeader} from '../components';
import {theme} from '../theme';
import {useApp} from '../context';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({onLoginSuccess}) => {
  const {login} = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginButtonPressed, setLoginButtonPressed] = useState(false);

  const handleLogin = () => {
    setError('');
    setLoading(true);

    setTimeout(() => {
      const success = login(email, password);
      setLoading(false);

      if (success) {
        onLoginSuccess();
      } else {
        setError('Invalid email or password. Please try again.');
      }
    }, 500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <AppHeader title="Login" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <AppText variant="bold" size="huge" color={theme.colors.primary}>
            🕌
          </AppText>
          <AppText
            variant="bold"
            size="xxl"
            color={theme.colors.primary}
            style={styles.title}>
            SalaahManager
          </AppText>
          <AppText
            size="sm"
            color={theme.colors.textLight}
            style={styles.subtitle}>
            Imam Portal
          </AppText>
        </View>

        <View style={styles.formContainer}>
          <AppTextInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <AppTextInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {error && (
            <AppText
              size="sm"
              color={theme.colors.error}
              style={styles.errorText}>
              {error}
            </AppText>
          )}

          <TouchableOpacity
            onPress={handleLogin}
            onPressIn={() => setLoginButtonPressed(true)}
            onPressOut={() => setLoginButtonPressed(false)}
            activeOpacity={1}
            disabled={loading || !email.trim() || !password.trim()}
            style={[
              styles.loginButton,
              loginButtonPressed && styles.loginButtonPressed,
              (loading || !email.trim() || !password.trim()) && styles.loginButtonDisabled
            ]}>
            <AppText variant="semiBold" size="md" color={theme.colors.textWhite}>
              {loading ? 'Logging in...' : 'Login'}
            </AppText>
          </TouchableOpacity>

          <View style={styles.credentialsContainer}>
            <AppText
              size="xs"
              color={theme.colors.textLight}
              align="center"
              style={styles.credentialsText}>
              Demo Credentials:
            </AppText>
            <AppText size="xs" color={theme.colors.textLight} align="center">
              Email: imam@salaahmanager.com
            </AppText>
            <AppText size="xs" color={theme.colors.textLight} align="center">
              Password: admin123
            </AppText>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
  title: {
    marginTop: theme.spacing.md,
  },
  subtitle: {
    marginTop: theme.spacing.sm,
  },
  formContainer: {
    marginTop: theme.spacing.lg,
  },
  errorText: {
    marginBottom: theme.spacing.md,
  },
  loginButton: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    borderWidth: 2,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  loginButtonPressed: {
    backgroundColor: '#006B50',
    borderColor: theme.colors.accent,
    borderWidth: 2,
    shadowColor: theme.colors.accent,
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 6,
  },
  loginButtonDisabled: {
    backgroundColor: theme.colors.grayMedium,
    borderColor: theme.colors.grayMedium,
    opacity: 0.5,
  },
  credentialsContainer: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.md,
  },
  credentialsText: {
    marginBottom: theme.spacing.xs,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
});

