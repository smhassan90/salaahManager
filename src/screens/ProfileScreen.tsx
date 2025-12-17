import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Modal, TouchableOpacity, Alert, Linking, Switch, KeyboardAvoidingView, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {AppText, AppButton, AppCard, AppHeader, AppTextInput} from '../components';
import {theme} from '../theme';
import {useApp} from '../context';
import {userService} from '../services/api';
import {getErrorMessage} from '../services/api/apiClient';
import {useTranslation, supportedLanguages} from '../i18n';

interface ProfileScreenProps {
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({onLogout}) => {
  const {user, currentLanguage, changeLanguage} = useApp();
  const {t} = useTranslation();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false);
  const [logoutButtonPressed, setLogoutButtonPressed] = useState(false);
  const [deleteButtonPressed, setDeleteButtonPressed] = useState(false);

  // Change Password Modal
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification Settings Modal
  const [notificationSettingsModalVisible, setNotificationSettingsModalVisible] = useState(false);
  const [generalNotif, setGeneralNotif] = useState(true);
  const [questionsNotif, setQuestionsNotif] = useState(true);

  // Language Settings Modal
  const [languageSettingsModalVisible, setLanguageSettingsModalVisible] = useState(false);

  // About Modal
  const [aboutModalVisible, setAboutModalVisible] = useState(false);

  const handleLogoutPress = () => {
    setLogoutModalVisible(true);
  };

  const handleConfirmLogout = () => {
    setLogoutModalVisible(false);
    onLogout();
  };

  const handleDeleteAccountPress = () => {
    setDeleteAccountModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await userService.deleteAccount();
      setDeleteAccountModalVisible(false);
      Alert.alert('Success', 'Account deleted successfully');
      onLogout();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete account. Please try again.');
    }
  };

  const handleChangePasswordPress = () => {
    setChangePasswordModalVisible(true);
  };

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
    try {
      await userService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      Alert.alert(t('common.success') || 'Success', t('profile.passwordChangedSuccess') || 'Password changed successfully');
      setChangePasswordModalVisible(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert(t('common.error') || 'Error', getErrorMessage(error));
    }
  };

  const handleNotificationSettingsPress = () => {
    setNotificationSettingsModalVisible(true);
  };

  const handleSaveNotificationSettings = async () => {
    try {
      await userService.updateUserSettings({
        general_notifications: generalNotif,
        questions_notifications: questionsNotif,
      });
      Alert.alert(t('common.success') || 'Success', t('profile.settingsSaved') || 'Notification settings saved');
      setNotificationSettingsModalVisible(false);
    } catch (error) {
      Alert.alert(t('common.error') || 'Error', getErrorMessage(error));
    }
  };

  const handleLanguageSettingsPress = () => {
    setLanguageSettingsModalVisible(true);
  };

  const handleLanguageChange = async (languageCode: string) => {
    if (languageCode === currentLanguage) {
      setLanguageSettingsModalVisible(false);
      return;
    }
    try {
      await changeLanguage(languageCode);
      setLanguageSettingsModalVisible(false);
      Alert.alert(t('common.success') || 'Success', t('profile.languageChanged') || 'Language changed successfully');
    } catch (error) {
      Alert.alert(t('common.error') || 'Error', 'Failed to change language');
    }
  };

  const handleAboutPress = () => {
    setAboutModalVisible(true);
  };

  const handlePrivacyPolicyPress = async () => {
    const url = 'https://alasrbackend.vercel.app/alasrmanager/privacy-policy';
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        // Try opening anyway, canOpenURL might return false for HTTPS on some devices
        await Linking.openURL(url);
      }
    } catch (error: any) {
      // If canOpenURL fails, try opening directly
      try {
        await Linking.openURL(url);
      } catch (openError) {
        Alert.alert(
          t('about.errorOpeningPrivacy'),
          t('about.errorOpeningPrivacyMessage') || 'Please check your internet connection and try again.'
        );
      }
    }
  };

  const handleTermsOfServicePress = async () => {
    const url = 'https://alasrbackend.vercel.app/alasr/terms-of-service';
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        // Try opening anyway, canOpenURL might return false for HTTPS on some devices
        await Linking.openURL(url);
      }
    } catch (error: any) {
      // If canOpenURL fails, try opening directly
      try {
        await Linking.openURL(url);
      } catch (openError) {
        Alert.alert(
          t('about.errorOpeningTerms'),
          t('about.errorOpeningTermsMessage') || 'Please check your internet connection and try again.'
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title={t('profile.title')} />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <AppCard padding="large" shadow="medium" style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <AppText variant="bold" size="huge" color={theme.colors.textWhite}>
                {user?.name.charAt(0)}
              </AppText>
            </View>
          </View>
          <AppText
            variant="bold"
            size="xl"
            align="center"
            style={styles.userName}>
            {user?.name}
          </AppText>
          <AppText
            size="md"
            color={theme.colors.grayDark}
            align="center">
            {user?.email}
          </AppText>
        </AppCard>

        <AppText variant="semiBold" size="sm" style={styles.sectionTitle}>
          {t('common.settings')}
        </AppText>

        <AppCard padding="medium" shadow="small" style={styles.settingsCard}>
          <AppButton
            title={t('profile.changePassword')}
            onPress={handleChangePasswordPress}
            variant="outline"
            fullWidth
            style={styles.settingButton}
          />
          <AppButton
            title={t('profile.notificationSettings')}
            onPress={handleNotificationSettingsPress}
            variant="outline"
            fullWidth
            style={styles.settingButton}
          />
          <AppButton
            title={t('profile.languageSettings')}
            onPress={handleLanguageSettingsPress}
            variant="outline"
            fullWidth
            style={styles.settingButton}
          />
          <AppButton
            title={t('common.about')}
            onPress={handleAboutPress}
            variant="outline"
            fullWidth
          />
        </AppCard>

        <TouchableOpacity
          onPress={handleLogoutPress}
          onPressIn={() => setLogoutButtonPressed(true)}
          onPressOut={() => setLogoutButtonPressed(false)}
          activeOpacity={1}
          style={[
            styles.logoutButton,
            logoutButtonPressed && styles.logoutButtonPressed
          ]}>
          <AppText 
            size="md" 
            variant="semiBold"
            color={theme.colors.error}
            style={styles.logoutButtonText}>
            {t('common.logout')}
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDeleteAccountPress}
          onPressIn={() => setDeleteButtonPressed(true)}
          onPressOut={() => setDeleteButtonPressed(false)}
          activeOpacity={1}
          style={[
            styles.deleteButton,
            deleteButtonPressed && styles.deleteButtonPressed
          ]}>
          <AppText 
            size="md" 
            variant="semiBold"
            color={theme.colors.error}
            style={styles.deleteButtonText}>
            {t('profile.deleteAccount')}
          </AppText>
        </TouchableOpacity>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.logoutModalContent}>
            <View style={styles.logoutIconContainer}>
              <Icon name="log-out-outline" size={48} color={theme.colors.error} />
            </View>
            
            <AppText variant="semiBold" size="xl" style={styles.logoutModalTitle} align="center">
              {t('profile.confirmLogout')}
            </AppText>

            <AppText size="md" color={theme.colors.textLight} style={styles.logoutModalMessage} align="center">
              {t('profile.logoutMessage')}
            </AppText>

            <View style={styles.logoutModalButtons}>
              <AppButton
                title={t('common.cancel')}
                onPress={() => setLogoutModalVisible(false)}
                variant="outline"
                fullWidth
                style={styles.logoutModalCancelButton}
              />
              <TouchableOpacity
                onPress={handleConfirmLogout}
                style={[styles.logoutModalConfirmButton, {backgroundColor: theme.colors.error}]}
                activeOpacity={0.8}>
                <AppText variant="semiBold" size="md" color={theme.colors.textWhite} align="center">
                  {t('common.logout')}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Account Confirmation Modal */}
      <Modal
        visible={deleteAccountModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteAccountModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModalContent}>
            <View style={styles.deleteIconContainer}>
              <Icon name="warning-outline" size={48} color={theme.colors.error} />
            </View>
            
            <AppText variant="semiBold" size="xl" style={styles.deleteModalTitle} align="center">
              {t('profile.deleteAccountTitle')}
            </AppText>

            <AppText size="md" color={theme.colors.textLight} style={styles.deleteModalMessage} align="center">
              {t('profile.deleteAccountMessage')}
            </AppText>

            <View style={styles.deleteModalButtons}>
              <AppButton
                title={t('common.cancel')}
                onPress={() => setDeleteAccountModalVisible(false)}
                variant="outline"
                fullWidth
                style={styles.deleteModalCancelButton}
              />
              <TouchableOpacity
                onPress={handleConfirmDelete}
                style={[styles.deleteModalConfirmButton, {backgroundColor: theme.colors.error}]}
                activeOpacity={0.8}>
                <AppText variant="semiBold" size="md" color={theme.colors.textWhite} align="center">
                  {t('common.delete')}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        visible={changePasswordModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setChangePasswordModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.changePasswordModalContainer}>
            <ScrollView 
              contentContainerStyle={styles.changePasswordModalScrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              <View style={styles.changePasswordModalContent}>
                <View style={styles.changePasswordIconContainer}>
                  <Icon name="lock-closed-outline" size={48} color={theme.colors.primary} />
                </View>
                
                <AppText variant="semiBold" size="xl" style={styles.changePasswordModalTitle} align="center">
                  {t('profile.changePassword')}
                </AppText>

                <View style={styles.changePasswordFormContainer}>
                  <AppTextInput
                    label={t('profile.currentPassword')}
                    placeholder={t('profile.enterCurrentPassword')}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry
                    style={styles.changePasswordInput}
                  />

                  <AppTextInput
                    label={t('profile.newPassword')}
                    placeholder={t('profile.enterNewPassword')}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    style={styles.changePasswordInput}
                  />

                  <AppTextInput
                    label={t('profile.confirmNewPassword')}
                    placeholder={t('profile.confirmNewPasswordPlaceholder')}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    style={styles.changePasswordInput}
                  />
                </View>

                <View style={styles.changePasswordModalButtons}>
                  <AppButton
                    title={t('common.cancel')}
                    onPress={() => {
                      setChangePasswordModalVisible(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                    variant="outline"
                    fullWidth
                    style={styles.changePasswordModalCancelButton}
                  />
                  <AppButton
                    title={t('common.save')}
                    onPress={handleChangePassword}
                    variant="primary"
                    fullWidth
                    style={styles.changePasswordModalSaveButton}
                  />
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Notification Settings Modal */}
      <Modal
        visible={notificationSettingsModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setNotificationSettingsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.notificationModalContent}>
            <View style={styles.notificationIconContainer}>
              <Icon name="notifications-outline" size={48} color={theme.colors.primary} />
            </View>
            
            <AppText variant="semiBold" size="xl" style={styles.notificationModalTitle} align="center">
              {t('notifications.titleSettings') || t('notifications.title')}
            </AppText>

            <View style={styles.notificationSettingsContainer}>
              <View style={styles.notificationSettingItem}>
                <View style={styles.notificationSettingContent}>
                  <AppText variant="medium" size="md" style={styles.notificationSettingLabel}>
                    {t('notifications.questions')}
                  </AppText>
                  <AppText size="sm" color={theme.colors.textLight} style={styles.notificationSettingDescription}>
                    {t('notifications.questionsDescription')}
                  </AppText>
                </View>
                <Switch
                  value={questionsNotif}
                  onValueChange={setQuestionsNotif}
                  trackColor={{false: theme.colors.grayMedium, true: theme.colors.primary}}
                  thumbColor={questionsNotif ? theme.colors.accent : theme.colors.background}
                />
              </View>

              <View style={styles.notificationSettingDivider} />

              <View style={styles.notificationSettingItem}>
                <View style={styles.notificationSettingContent}>
                  <AppText variant="medium" size="md" style={styles.notificationSettingLabel}>
                    {t('notifications.generalNotifications')}
                  </AppText>
                  <AppText size="sm" color={theme.colors.textLight} style={styles.notificationSettingDescription}>
                    {t('notifications.generalDescription')}
                  </AppText>
                </View>
                <Switch
                  value={generalNotif}
                  onValueChange={setGeneralNotif}
                  trackColor={{false: theme.colors.grayMedium, true: theme.colors.primary}}
                  thumbColor={generalNotif ? theme.colors.accent : theme.colors.background}
                />
              </View>
            </View>

            <View style={styles.notificationModalButtons}>
              <AppButton
                title={t('common.cancel')}
                onPress={() => setNotificationSettingsModalVisible(false)}
                variant="outline"
                fullWidth
                style={styles.notificationModalCancelButton}
              />
              <AppButton
                title={t('common.save')}
                onPress={handleSaveNotificationSettings}
                variant="primary"
                fullWidth
                style={styles.notificationModalSaveButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Language Settings Modal */}
      <Modal
        visible={languageSettingsModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLanguageSettingsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.languageModalContent}>
            <AppText variant="semiBold" size="xl" style={styles.languageModalTitle} align="center">
              {t('profile.selectLanguage')}
            </AppText>

            <View style={styles.languageListWrapper}>
              <ScrollView 
                style={styles.languageListScrollView}
                contentContainerStyle={styles.languageListContainer}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}>
                {supportedLanguages.map((language) => (
                  <TouchableOpacity
                    key={language.code}
                    style={[
                      styles.languageItem,
                      currentLanguage === language.code && styles.languageItemSelected
                    ]}
                    onPress={() => handleLanguageChange(language.code)}
                    activeOpacity={0.7}>
                    <View style={styles.languageItemContent}>
                      <AppText 
                        size="md" 
                        variant={currentLanguage === language.code ? 'semiBold' : 'regular'}
                        style={styles.languageName}>
                        {language.nativeName}
                      </AppText>
                      <AppText 
                        size="sm" 
                        color={theme.colors.grayDark}
                        style={styles.languageCode}>
                        {language.name}
                      </AppText>
                    </View>
                    {currentLanguage === language.code && (
                      <Icon name="checkmark-circle" size={24} color={theme.colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.languageModalButtons}>
              <AppButton
                title={t('common.cancel')}
                onPress={() => setLanguageSettingsModalVisible(false)}
                variant="outline"
                fullWidth
                style={styles.languageModalCancelButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* About Modal */}
      <Modal
        visible={aboutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAboutModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <ScrollView 
            style={styles.modalContent}
            contentContainerStyle={styles.modalContentContainer}
            showsVerticalScrollIndicator={false}>
            <AppText variant="semiBold" size="lg" style={styles.modalTitle}>
              {t('about.title')}
            </AppText>

            <View style={styles.aboutSection}>
              <AppText size="sm" color={theme.colors.grayDark} style={styles.aboutLabel}>
                {t('about.version')}
              </AppText>
              <AppText size="md" variant="medium">
                1.0.0
              </AppText>
            </View>

            <View style={styles.aboutSection}>
              <AppText size="sm" color={theme.colors.grayDark} style={styles.aboutLabel}>
                {t('about.developer')}
              </AppText>
              <AppText size="md" variant="medium">
                AlAsr Team
              </AppText>
            </View>

            <View style={styles.aboutSection}>
              <AppText size="sm" color={theme.colors.grayDark} style={styles.aboutLabel}>
                {t('about.description')}
              </AppText>
              <AppText size="md" style={styles.aboutDescription}>
                {t('about.descriptionText')}
              </AppText>
            </View>

            <View style={styles.aboutSection}>
              <AppText size="sm" color={theme.colors.grayDark} style={styles.aboutLabel}>
                {t('about.support')}
              </AppText>
              <AppText size="md" variant="medium">
                dev.fynals@gmail.com
              </AppText>
            </View>

            <View style={styles.aboutSection}>
              <AppButton
                title={t('about.privacyPolicy')}
                onPress={handlePrivacyPolicyPress}
                variant="outline"
                fullWidth
                style={styles.aboutButton}
              />
              <AppButton
                title={t('about.termsOfService')}
                onPress={handleTermsOfServicePress}
                variant="outline"
                fullWidth
                style={styles.aboutButton}
              />
            </View>

            <AppButton
              title={t('common.close')}
              onPress={() => setAboutModalVisible(false)}
              variant="primary"
              fullWidth
              style={styles.closeButton}
            />
          </ScrollView>
        </View>
      </Modal>

    </View>
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
    padding: theme.spacing.md,
  },
  profileCard: {
    marginBottom: theme.spacing.lg,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  userName: {
    marginBottom: theme.spacing.xs,
  },
  sectionTitle: {
    marginBottom: theme.spacing.sm,
    letterSpacing: 1,
    color: theme.colors.textDark,
  },
  settingsCard: {
    marginBottom: theme.spacing.lg,
  },
  settingButton: {
    marginBottom: theme.spacing.sm,
  },
  logoutButton: {
    marginTop: theme.spacing.md,
    borderWidth: 1.5,
    borderColor: theme.colors.error,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonPressed: {
    borderColor: theme.colors.error,
    borderWidth: 2,
    backgroundColor: 'rgba(220, 53, 69, 0.05)',
  },
  logoutButtonText: {
    letterSpacing: 1,
  },
  deleteButton: {
    marginTop: theme.spacing.sm,
    borderWidth: 1.5,
    borderColor: theme.colors.error,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonPressed: {
    borderColor: theme.colors.error,
    borderWidth: 2,
    backgroundColor: 'rgba(220, 53, 69, 0.05)',
  },
  deleteButtonText: {
    letterSpacing: 1,
  },
  deleteMessage: {
    marginVertical: theme.spacing.md,
    textAlign: 'center',
    color: theme.colors.error,
  },
  deleteModalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  deleteIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  deleteModalTitle: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.textDark,
  },
  deleteModalMessage: {
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
    paddingHorizontal: theme.spacing.sm,
  },
  deleteModalButtons: {
    width: '100%',
  },
  deleteModalCancelButton: {
    marginBottom: theme.spacing.sm,
  },
  deleteModalConfirmButton: {
    marginBottom: 0,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    width: '85%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalContentContainer: {
    padding: theme.spacing.xl,
    flexGrow: 1,
  },
  modalTitle: {
    marginBottom: theme.spacing.md,
  },
  logoutMessage: {
    marginVertical: theme.spacing.md,
    textAlign: 'center',
  },
  logoutModalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoutIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  logoutModalTitle: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.textDark,
  },
  logoutModalMessage: {
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
    paddingHorizontal: theme.spacing.sm,
  },
  logoutModalButtons: {
    width: '100%',
  },
  logoutModalCancelButton: {
    marginBottom: theme.spacing.sm,
  },
  logoutModalConfirmButton: {
    marginBottom: 0,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  deleteModalButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
    backgroundColor: theme.colors.error,
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  notificationModalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  notificationIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 107, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  notificationModalTitle: {
    marginBottom: theme.spacing.lg,
    color: theme.colors.textDark,
  },
  notificationSettingsContainer: {
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  notificationSettingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.lg,
  },
  notificationSettingContent: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  notificationSettingLabel: {
    marginBottom: theme.spacing.xs,
    color: theme.colors.textDark,
  },
  notificationSettingDescription: {
    lineHeight: 18,
  },
  notificationSettingDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
  },
  notificationModalButtons: {
    width: '100%',
  },
  notificationModalCancelButton: {
    marginBottom: theme.spacing.sm,
  },
  notificationModalSaveButton: {
    marginBottom: 0,
  },
  aboutSection: {
    marginBottom: theme.spacing.lg,
  },
  aboutButton: {
    marginBottom: theme.spacing.sm,
  },
  aboutLabel: {
    marginBottom: theme.spacing.xs,
  },
  aboutDescription: {
    lineHeight: 22,
  },
  closeButton: {
    marginTop: theme.spacing.md,
  },
  languageModalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    width: '85%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  languageModalTitle: {
    marginBottom: theme.spacing.lg,
    color: theme.colors.textDark,
  },
  languageListWrapper: {
    height: 280,
    marginBottom: theme.spacing.md,
  },
  languageListScrollView: {
    flex: 1,
  },
  languageListContainer: {
    paddingVertical: theme.spacing.sm,
    flexGrow: 1,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    minHeight: 60,
  },
  languageItemSelected: {
    backgroundColor: theme.colors.primary + '10',
    borderBottomColor: theme.colors.primary + '30',
    borderBottomWidth: 2,
  },
  languageItemContent: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  languageName: {
    marginBottom: theme.spacing.xs / 2,
  },
  languageCode: {
    textTransform: 'capitalize',
  },
  languageModalButtons: {
    width: '100%',
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  languageModalCancelButton: {
    marginBottom: 0,
  },
  changePasswordModalContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  changePasswordModalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
    minHeight: '100%',
  },
  changePasswordModalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  changePasswordIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 107, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  changePasswordModalTitle: {
    marginBottom: theme.spacing.lg,
    color: theme.colors.textDark,
  },
  changePasswordFormContainer: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  changePasswordInput: {
    marginBottom: theme.spacing.md,
  },
  changePasswordModalButtons: {
    width: '100%',
  },
  changePasswordModalCancelButton: {
    marginBottom: theme.spacing.sm,
  },
  changePasswordModalSaveButton: {
    marginBottom: 0,
  },
});

