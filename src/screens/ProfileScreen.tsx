import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Modal, TouchableOpacity, Switch, Alert, Image} from 'react-native';
import {launchImageLibrary, launchCamera, ImagePickerResponse} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import {AppText, AppButton, AppCard, AppHeader, AppTextInput} from '../components';
import {theme} from '../theme';
import {useApp} from '../context';

interface ProfileScreenProps {
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({onLogout}) => {
  const {user} = useApp();
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
  const [prayerTimesNotif, setPrayerTimesNotif] = useState(true);
  const [eventsNotif, setEventsNotif] = useState(true);
  const [donationsNotif, setDonationsNotif] = useState(true);
  const [generalNotif, setGeneralNotif] = useState(true);
  const [questionsNotif, setQuestionsNotif] = useState(true);

  // About Modal
  const [aboutModalVisible, setAboutModalVisible] = useState(false);

  // Profile Image
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imagePickerModalVisible, setImagePickerModalVisible] = useState(false);

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

  const handleConfirmDelete = () => {
    // TODO: Implement account deletion
    console.log('Account deletion requested');
    setDeleteAccountModalVisible(false);
    // For now, just logout
    onLogout();
  };

  const handleChangePasswordPress = () => {
    setChangePasswordModalVisible(true);
  };

  const handleChangePassword = () => {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    // TODO: Implement actual password change API call
    Alert.alert('Success', 'Password changed successfully');
    setChangePasswordModalVisible(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleNotificationSettingsPress = () => {
    setNotificationSettingsModalVisible(true);
  };

  const handleSaveNotificationSettings = () => {
    // TODO: Save notification settings to backend
    Alert.alert('Success', 'Notification settings saved');
    setNotificationSettingsModalVisible(false);
  };

  const handleAboutPress = () => {
    setAboutModalVisible(true);
  };

  const handleImagePickerPress = () => {
    setImagePickerModalVisible(true);
  };

  const handleSelectFromGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 800,
      },
      (response: ImagePickerResponse) => {
        setImagePickerModalVisible(false);
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Failed to pick image');
        } else if (response.assets && response.assets[0]) {
          setProfileImage(response.assets[0].uri || null);
          Alert.alert('Success', 'Profile picture updated successfully');
        }
      }
    );
  };

  const handleTakePhoto = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 800,
        saveToPhotos: false,
      },
      (response: ImagePickerResponse) => {
        setImagePickerModalVisible(false);
        if (response.didCancel) {
          console.log('User cancelled camera');
        } else if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Failed to take photo');
        } else if (response.assets && response.assets[0]) {
          setProfileImage(response.assets[0].uri || null);
          Alert.alert('Success', 'Profile picture updated successfully');
        }
      }
    );
  };

  const handleRemovePhoto = () => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove your profile picture?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setProfileImage(null);
            setImagePickerModalVisible(false);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="PROFILE" />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <AppCard padding="large" shadow="medium" style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              {profileImage ? (
                <Image source={{uri: profileImage}} style={styles.avatarImage} />
              ) : (
                <AppText variant="bold" size="huge" color={theme.colors.textWhite}>
                  {user?.name.charAt(0)}
                </AppText>
              )}
            </View>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={handleImagePickerPress}
              activeOpacity={0.7}>
              <Icon name="camera" size={20} color={theme.colors.textWhite} />
            </TouchableOpacity>
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
          SETTINGS
        </AppText>

        <AppCard padding="medium" shadow="small" style={styles.settingsCard}>
          <AppButton
            title="Change Password"
            onPress={handleChangePasswordPress}
            variant="outline"
            fullWidth
            style={styles.settingButton}
          />
          <AppButton
            title="Notifications Settings"
            onPress={handleNotificationSettingsPress}
            variant="outline"
            fullWidth
            style={styles.settingButton}
          />
          <AppButton
            title="About"
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
            LOGOUT
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
            DELETE ACCOUNT
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
          <View style={styles.modalContent}>
            <AppText variant="semiBold" size="lg" style={styles.modalTitle}>
              Confirm Logout
            </AppText>

            <AppText size="md" style={styles.logoutMessage}>
              Are you sure you want to logout?
            </AppText>

            <View style={styles.modalButtons}>
              <AppButton
                title="CANCEL"
                onPress={() => setLogoutModalVisible(false)}
                variant="outline"
                size="small"
                style={styles.modalButton}
              />
              <AppButton
                title="LOGOUT"
                onPress={handleConfirmLogout}
                variant="primary"
                size="small"
                style={styles.modalButton}
              />
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
          <View style={styles.modalContent}>
            <AppText variant="semiBold" size="lg" style={styles.modalTitle}>
              Delete Account
            </AppText>

            <AppText size="md" style={styles.deleteMessage}>
              Are you sure you want to delete your account? This action cannot be undone.
            </AppText>

            <View style={styles.modalButtons}>
              <AppButton
                title="CANCEL"
                onPress={() => setDeleteAccountModalVisible(false)}
                variant="outline"
                size="small"
                style={styles.modalButton}
              />
            <AppButton
              title="DELETE"
              onPress={handleConfirmDelete}
              variant="primary"
              size="small"
              style={styles.deleteModalButton}
            />
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
          <ScrollView 
            contentContainerStyle={styles.modalScrollContent}
            keyboardShouldPersistTaps="handled">
            <View style={styles.modalContent}>
              <AppText variant="semiBold" size="lg" style={styles.modalTitle}>
                Change Password
              </AppText>

              <AppTextInput
                label="Current Password"
                placeholder="Enter current password..."
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
              />

              <AppTextInput
                label="New Password"
                placeholder="Enter new password..."
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />

              <AppTextInput
                label="Confirm New Password"
                placeholder="Confirm new password..."
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />

              <View style={styles.modalButtons}>
                <AppButton
                  title="CANCEL"
                  onPress={() => {
                    setChangePasswordModalVisible(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  variant="outline"
                  size="small"
                  style={styles.modalButton}
                />
                <AppButton
                  title="SAVE"
                  onPress={handleChangePassword}
                  variant="primary"
                  size="small"
                  style={styles.modalButton}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Notification Settings Modal */}
      <Modal
        visible={notificationSettingsModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setNotificationSettingsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <AppText variant="semiBold" size="lg" style={styles.modalTitle}>
              Notification Settings
            </AppText>

            <View style={styles.notificationItem}>
              <AppText size="md">Prayer Times</AppText>
              <Switch
                value={prayerTimesNotif}
                onValueChange={setPrayerTimesNotif}
                trackColor={{false: theme.colors.grayMedium, true: theme.colors.primary}}
                thumbColor={prayerTimesNotif ? theme.colors.accent : theme.colors.background}
              />
            </View>

            <View style={styles.notificationItem}>
              <AppText size="md">Events</AppText>
              <Switch
                value={eventsNotif}
                onValueChange={setEventsNotif}
                trackColor={{false: theme.colors.grayMedium, true: theme.colors.primary}}
                thumbColor={eventsNotif ? theme.colors.accent : theme.colors.background}
              />
            </View>

            <View style={styles.notificationItem}>
              <AppText size="md">Donations</AppText>
              <Switch
                value={donationsNotif}
                onValueChange={setDonationsNotif}
                trackColor={{false: theme.colors.grayMedium, true: theme.colors.primary}}
                thumbColor={donationsNotif ? theme.colors.accent : theme.colors.background}
              />
            </View>

            <View style={styles.notificationItem}>
              <AppText size="md">General Announcements</AppText>
              <Switch
                value={generalNotif}
                onValueChange={setGeneralNotif}
                trackColor={{false: theme.colors.grayMedium, true: theme.colors.primary}}
                thumbColor={generalNotif ? theme.colors.accent : theme.colors.background}
              />
            </View>

            <View style={styles.notificationItem}>
              <AppText size="md">Questions & Answers</AppText>
              <Switch
                value={questionsNotif}
                onValueChange={setQuestionsNotif}
                trackColor={{false: theme.colors.grayMedium, true: theme.colors.primary}}
                thumbColor={questionsNotif ? theme.colors.accent : theme.colors.background}
              />
            </View>

            <View style={styles.modalButtons}>
              <AppButton
                title="CANCEL"
                onPress={() => setNotificationSettingsModalVisible(false)}
                variant="outline"
                size="small"
                style={styles.modalButton}
              />
              <AppButton
                title="SAVE"
                onPress={handleSaveNotificationSettings}
                variant="primary"
                size="small"
                style={styles.modalButton}
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
          <View style={styles.modalContent}>
            <AppText variant="semiBold" size="lg" style={styles.modalTitle}>
              About SalaahManager
            </AppText>

            <View style={styles.aboutSection}>
              <AppText size="sm" color={theme.colors.grayDark} style={styles.aboutLabel}>
                Version
              </AppText>
              <AppText size="md" variant="medium">
                1.0.0
              </AppText>
            </View>

            <View style={styles.aboutSection}>
              <AppText size="sm" color={theme.colors.grayDark} style={styles.aboutLabel}>
                Developer
              </AppText>
              <AppText size="md" variant="medium">
                Fynals
              </AppText>
            </View>

            <View style={styles.aboutSection}>
              <AppText size="sm" color={theme.colors.grayDark} style={styles.aboutLabel}>
                Description
              </AppText>
              <AppText size="md" style={styles.aboutDescription}>
                SalaahManager is a comprehensive prayer management app designed for Imams to efficiently manage prayer times, events, notifications, and community engagement.
              </AppText>
            </View>

            <View style={styles.aboutSection}>
              <AppText size="sm" color={theme.colors.grayDark} style={styles.aboutLabel}>
                Contact
              </AppText>
              <AppText size="md" variant="medium">
                support@fynals.com
              </AppText>
            </View>

            <AppButton
              title="CLOSE"
              onPress={() => setAboutModalVisible(false)}
              variant="primary"
              size="small"
              style={styles.closeButton}
            />
          </View>
        </View>
      </Modal>

      {/* Image Picker Modal */}
      <Modal
        visible={imagePickerModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setImagePickerModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <AppText variant="semiBold" size="lg" style={styles.modalTitle}>
              Profile Picture
            </AppText>

            <AppButton
              title="📷 Take Photo"
              onPress={handleTakePhoto}
              variant="outline"
              fullWidth
              style={styles.imagePickerButton}
            />

            <AppButton
              title="🖼️ Choose from Gallery"
              onPress={handleSelectFromGallery}
              variant="outline"
              fullWidth
              style={styles.imagePickerButton}
            />

            {profileImage && (
              <AppButton
                title="🗑️ Remove Photo"
                onPress={handleRemovePhoto}
                variant="outline"
                fullWidth
                style={styles.imagePickerButton}
              />
            )}

            <AppButton
              title="CANCEL"
              onPress={() => setImagePickerModalVisible(false)}
              variant="primary"
              size="small"
              style={styles.closeButton}
            />
          </View>
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
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.accent,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.background,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    marginBottom: theme.spacing.md,
  },
  logoutMessage: {
    marginVertical: theme.spacing.md,
    textAlign: 'center',
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
  aboutSection: {
    marginBottom: theme.spacing.lg,
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
  imagePickerButton: {
    marginBottom: theme.spacing.sm,
  },
});

