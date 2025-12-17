import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/types';
import {AppText, AppButton, AppHeader, AppTextInput} from '../components';
import {theme} from '../theme';
import {userService} from '../services/api';
import {getErrorMessage} from '../services/api/apiClient';
import {useTranslation} from '../i18n';

type ChangePasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ChangePassword'>;

interface ChangePasswordScreenProps {
  navigation: ChangePasswordScreenNavigationProp;
}

export const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({navigation}) => {
  const {t} = useTranslation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert(t('common.error') || 'Error', t('profile.fillAllFields') || 'Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert(t('common.error') || 'Error', t('profile.passwordsDoNotMatch') || 'New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert(t('common.error') || 'Error', t('profile.passwordMinLength') || 'Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    try {
      await userService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      Alert.alert(
        t('common.success') || 'Success',
        t('profile.passwordChangedSuccess') || 'Password changed successfully',
        [
          {
            text: t('common.ok') || 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert(t('common.error') || 'Error', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader 
        title={t('profile.changePassword')} 
        showBackButton 
        onLeftPress={() => navigation.goBack()}
      />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <AppText variant="bold" size="huge" color={theme.colors.primary}>
                🔒
              </AppText>
            </View>

            <AppText variant="semiBold" size="xl" align="center" style={styles.title}>
              {t('profile.changePassword')}
            </AppText>

            <AppText size="md" color={theme.colors.textLight} align="center" style={styles.subtitle}>
              {t('profile.changePasswordDescription') || 'Enter your current password and choose a new one'}
            </AppText>

            <View style={styles.formContainer}>
              <AppTextInput
                label={t('profile.currentPassword')}
                placeholder={t('profile.enterCurrentPassword')}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                style={styles.input}
              />

              <AppTextInput
                label={t('profile.newPassword')}
                placeholder={t('profile.enterNewPassword')}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                style={styles.input}
              />

              <AppTextInput
                label={t('profile.confirmNewPassword')}
                placeholder={t('profile.confirmNewPasswordPlaceholder')}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.input}
              />
            </View>

            <View style={styles.buttonContainer}>
              <AppButton
                title={t('common.save')}
                onPress={handleChangePassword}
                variant="primary"
                fullWidth
                loading={loading}
                style={styles.saveButton}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.textDark,
  },
  subtitle: {
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },
  formContainer: {
    marginBottom: theme.spacing.xl,
  },
  input: {
    marginBottom: theme.spacing.md,
  },
  buttonContainer: {
    marginTop: theme.spacing.md,
  },
  saveButton: {
    marginBottom: 0,
  },
});

