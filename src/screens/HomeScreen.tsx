import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Modal, TouchableOpacity, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import {AppText, AppButton, AppCard, AppHeader, AppTextInput} from '../components';
import {theme} from '../theme';
import {useApp} from '../context';
import {HomeStackParamList} from '../navigation/HomeStackNavigator';

interface HomeScreenProps {
  onLogout: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({onLogout}) => {
  const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
  const {defaultMasjid, prayerTimes, updatePrayerTime, user, questions, addNotification, addEvent, notifications, events} = useApp();
  const [modalVisible, setModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [selectedPrayer, setSelectedPrayer] = useState('');
  const [newTime, setNewTime] = useState('');
  const [notifyUsers, setNotifyUsers] = useState(false);
  const [notificationCategory, setNotificationCategory] = useState('General');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationDescription, setNotificationDescription] = useState('');
  const [questionsPressed, setQuestionsPressed] = useState(false);
  const [notificationPressed, setNotificationPressed] = useState(false);
  const [eventPressed, setEventPressed] = useState(false);
  const [viewNotificationsPressed, setViewNotificationsPressed] = useState(false);
  const [viewEventsPressed, setViewEventsPressed] = useState(false);
  const [editButtonPressed, setEditButtonPressed] = useState<{[key: string]: boolean}>({});
  const [logoutButtonPressed, setLogoutButtonPressed] = useState(false);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [saveButtonPressed, setSaveButtonPressed] = useState(false);
  const [sendNotificationButtonPressed, setSendNotificationButtonPressed] = useState(false);
  
  // Use accent color from theme
  const accentColor = theme.colors.accent;

  const masjidPrayerTimes =
    defaultMasjid && prayerTimes[defaultMasjid.id]
      ? prayerTimes[defaultMasjid.id]
      : [];

  const handleEditPress = (prayerName: string, currentTime: string) => {
    setSelectedPrayer(prayerName);
    setNewTime(currentTime);
    setNotifyUsers(false); // Reset checkbox
    setModalVisible(true);
  };

  const handleEditButtonPress = (prayerName: string, pressed: boolean) => {
    setEditButtonPressed(prev => ({...prev, [prayerName]: pressed}));
  };

  const handleSaveTime = () => {
    if (defaultMasjid) {
      updatePrayerTime(defaultMasjid.id, selectedPrayer, newTime);
      
      if (notifyUsers) {
        // TODO: Future implementation - Send notification to all subscribers
        console.log(`Notification will be sent for ${selectedPrayer} time change to ${newTime}`);
      }
      
      setModalVisible(false);
      setNotifyUsers(false); // Reset for next time
    }
  };

  const handleLogoutPress = () => {
    setLogoutModalVisible(true);
  };

  const handleConfirmLogout = () => {
    setLogoutModalVisible(false);
    onLogout();
  };

  const handleQuestionsPress = () => {
    navigation.navigate('Questions' as never);
  };

  const handleNotificationPress = () => {
    setNotificationCategory('General');
    setNotificationTitle('');
    setNotificationDescription('');
    setNotificationModalVisible(true);
  };

  const handleSendNotification = () => {
    if (notificationTitle.trim() && notificationDescription.trim() && defaultMasjid) {
      addNotification({
        masjidId: defaultMasjid.id,
        title: notificationTitle.trim(),
        description: notificationDescription.trim(),
        category: notificationCategory,
      });
      console.log(`Notification sent successfully!`);
      setNotificationModalVisible(false);
    }
  };

  const handleEventPress = () => {
    setEventName('');
    setEventDate('');
    setEventTime('');
    setEventDescription('');
    setSelectedDate(new Date());
    setShowDatePicker(false);
    setEventModalVisible(true);
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (date) {
      setSelectedDate(date);
      // Format date as DD-MM-YYYY
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      setEventDate(`${day}-${month}-${year}`);
    }
  };

  const handleDatePickerPress = () => {
    setShowDatePicker(true);
  };

  const handleCreateEvent = () => {
    if (eventName.trim() && eventDate.trim() && eventTime.trim() && defaultMasjid) {
      addEvent({
        masjidId: defaultMasjid.id,
        name: eventName.trim(),
        date: eventDate.trim(),
        time: eventTime.trim(),
        description: eventDescription.trim(),
      });
      console.log(`Event created successfully!`);
      setEventModalVisible(false);
    }
  };

  const pendingQuestions = questions.filter(q => q.status === 'new').length;

  return (
    <View style={styles.container}>
      <AppHeader
        title={defaultMasjid?.name || 'No Default Masjid'}
        subtitle="Default Masjid"
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.welcomeCard, {borderLeftColor: accentColor}]}>
          <AppText variant="semiBold" size="lg" color={theme.colors.primary}>
            Welcome, {user?.name}! 👋
          </AppText>
          <AppText size="sm" color={theme.colors.textLight} style={styles.welcomeText}>
            Manage your masjid prayer times and activities
          </AppText>
          <View style={[styles.accentBadge, {backgroundColor: accentColor}]}>
            <AppText size="xs" color={theme.colors.textWhite} variant="semiBold">
              IMAM DASHBOARD
            </AppText>
          </View>
        </View>

        <AppText variant="medium" size="sm" style={styles.prayerTimesTitle}>
          PRAYER TIMES
        </AppText>

        {masjidPrayerTimes.map((prayer) => (
          <View key={prayer.name} style={styles.prayerCardWrapper}>
            <View style={[styles.prayerAccent, {backgroundColor: theme.colors.primary}]} />
            <AppCard padding="medium" shadow="small" style={styles.prayerCard}>
              <View style={styles.prayerRow}>
                <View style={styles.prayerInfo}>
                  <AppText 
                    variant="medium" 
                    size="xs" 
                    color={theme.colors.textLight}
                    style={styles.prayerLabel}>
                    {prayer.name.toUpperCase()}
                  </AppText>
                  <AppText
                    variant="semiBold"
                    size="xl"
                    color={theme.colors.primary}
                    style={styles.prayerTime}>
                    {prayer.time}
                  </AppText>
                </View>
                <TouchableOpacity
                  onPress={() => handleEditPress(prayer.name, prayer.time)}
                  onPressIn={() => handleEditButtonPress(prayer.name, true)}
                  onPressOut={() => handleEditButtonPress(prayer.name, false)}
                  activeOpacity={1}
                  style={[
                    styles.editButton,
                    editButtonPressed[prayer.name] && styles.editButtonPressed
                  ]}>
                  <AppText 
                    size="xs" 
                    variant="semiBold"
                    color={editButtonPressed[prayer.name] ? theme.colors.textWhite : theme.colors.primary}
                    style={styles.editButtonText}>
                    EDIT
                  </AppText>
                </TouchableOpacity>
              </View>
            </AppCard>
          </View>
        ))}

        {/* Quick Actions */}
        <AppText variant="semiBold" size="sm" style={styles.quickActionsTitle}>
          QUICK ACTIONS
        </AppText>

        <View style={styles.actionsGrid}>
          {/* Row 1: View Notifications and View Events */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('Notifications')}
            onPressIn={() => setViewNotificationsPressed(true)}
            onPressOut={() => setViewNotificationsPressed(false)}
            activeOpacity={1}
            style={styles.gridItem}>
            <View style={[
              styles.actionCard,
              styles.secondaryActionCard,
              viewNotificationsPressed && styles.secondaryActionCardPressed
            ]}>
              <AppCard padding="medium" shadow="none">
                <AppText variant="semiBold" size="md" style={styles.actionTitle}>
                  📬 View
                </AppText>
                <AppText size="xs" color={theme.colors.textLight} style={styles.actionSubtitle}>
                  Notifications
                </AppText>
                {notifications.length > 0 && (
                  <View style={styles.badge}>
                    <AppText size="xs" color={theme.colors.textWhite} variant="semiBold">
                      {notifications.length}
                    </AppText>
                  </View>
                )}
              </AppCard>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => navigation.navigate('Events')}
            onPressIn={() => setViewEventsPressed(true)}
            onPressOut={() => setViewEventsPressed(false)}
            activeOpacity={1}
            style={styles.gridItem}>
            <View style={[
              styles.actionCard,
              styles.secondaryActionCard,
              viewEventsPressed && styles.secondaryActionCardPressed
            ]}>
              <AppCard padding="medium" shadow="none">
                <AppText variant="semiBold" size="md" style={styles.actionTitle}>
                  📋 View
                </AppText>
                <AppText size="xs" color={theme.colors.textLight} style={styles.actionSubtitle}>
                  Events
                </AppText>
                {events.length > 0 && (
                  <View style={styles.badge}>
                    <AppText size="xs" color={theme.colors.textWhite} variant="semiBold">
                      {events.length}
                    </AppText>
                  </View>
                )}
              </AppCard>
            </View>
          </TouchableOpacity>

          {/* Row 2: Questions */}
          <TouchableOpacity 
            onPress={handleQuestionsPress} 
            onPressIn={() => setQuestionsPressed(true)}
            onPressOut={() => setQuestionsPressed(false)}
            activeOpacity={1}
            style={styles.fullWidthItem}>
            <View style={[
              styles.actionCard,
              styles.secondaryActionCard,
              questionsPressed && styles.secondaryActionCardPressed
            ]}>
              <AppCard padding="medium" shadow="none">
                {pendingQuestions > 0 ? (
                  <View style={styles.fullWidthContent}>
                    <AppText variant="semiBold" size="md" style={styles.actionTitleCenter}>
                      ❓ Questions
                    </AppText>
                    <View style={styles.inlineBadge}>
                      <AppText size="xs" color={theme.colors.textWhite} variant="semiBold">
                        {pendingQuestions}
                      </AppText>
                    </View>
                  </View>
                ) : (
                  <AppText variant="semiBold" size="md" style={styles.actionTitle}>
                    ❓ Questions
                  </AppText>
                )}
              </AppCard>
            </View>
          </TouchableOpacity>

          {/* Row 3: Create Event */}
          <TouchableOpacity 
            onPress={handleEventPress}
            onPressIn={() => setEventPressed(true)}
            onPressOut={() => setEventPressed(false)}
            activeOpacity={1}
            style={styles.fullWidthItem}>
            <View style={[
              styles.actionCard,
              styles.primaryActionCard,
              eventPressed && styles.primaryActionCardPressed
            ]}>
              <View style={styles.primaryActionContent}>
                <AppText variant="semiBold" size="md" color={theme.colors.textWhite}>
                  📅 Create Event
                </AppText>
              </View>
            </View>
          </TouchableOpacity>

          {/* Row 4: Send Notification */}
          <TouchableOpacity 
            onPress={handleNotificationPress}
            onPressIn={() => setNotificationPressed(true)}
            onPressOut={() => setNotificationPressed(false)}
            activeOpacity={1}
            style={styles.fullWidthItem}>
            <View style={[
              styles.actionCard,
              styles.primaryActionCard,
              notificationPressed && styles.primaryActionCardPressed
            ]}>
              <View style={styles.primaryActionContent}>
                <AppText variant="semiBold" size="md" color={theme.colors.textWhite}>
                  🔔 Send Notification
                </AppText>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Prayer Time Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <AppText variant="semiBold" size="lg" style={styles.modalTitle}>
              Edit {selectedPrayer} Time
            </AppText>

            <AppTextInput
              label="Prayer Time"
              placeholder="HH:MM"
              value={newTime}
              onChangeText={setNewTime}
            />

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setNotifyUsers(!notifyUsers)}
              activeOpacity={0.7}>
              <View style={[styles.checkbox, notifyUsers && styles.checkboxChecked]}>
                {notifyUsers && (
                  <AppText size="sm" color={theme.colors.textWhite}>
                    ✓
                  </AppText>
                )}
              </View>
              <AppText size="sm" style={styles.checkboxLabel}>
                Notify all subscribers through notifications
              </AppText>
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <AppButton
                title="CANCEL"
                onPress={() => setModalVisible(false)}
                variant="outline"
                size="small"
                style={styles.modalButton}
              />
              <TouchableOpacity
                onPress={handleSaveTime}
                onPressIn={() => setSaveButtonPressed(true)}
                onPressOut={() => setSaveButtonPressed(false)}
                activeOpacity={1}
                disabled={!newTime.trim()}
                style={[
                  styles.saveButton,
                  saveButtonPressed && styles.saveButtonPressed,
                  !newTime.trim() && styles.saveButtonDisabled
                ]}>
                <AppText variant="semiBold" size="sm" color={theme.colors.textWhite}>
                  SAVE
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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

      {/* Send Notification Modal */}
      <Modal
        visible={notificationModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setNotificationModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <AppText variant="semiBold" size="lg" style={styles.modalTitle}>
              Send Notification
            </AppText>

            <View style={styles.dropdownContainer}>
              <AppText size="sm" variant="medium" style={styles.dropdownLabel}>
                Category
              </AppText>
              <View style={styles.categoryButtons}>
                {['General', 'Prayer Times', 'Donations', 'Events'].map(category => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => setNotificationCategory(category)}
                    activeOpacity={0.7}
                    style={[
                      styles.categoryButton,
                      notificationCategory === category && styles.categoryButtonActive,
                    ]}>
                    <AppText
                      size="sm"
                      color={
                        notificationCategory === category
                          ? theme.colors.textWhite
                          : theme.colors.textDark
                      }>
                      {category}
                    </AppText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <AppTextInput
              label="Notification Title"
              placeholder="Enter notification title..."
              value={notificationTitle}
              onChangeText={setNotificationTitle}
            />

            <AppTextInput
              label="Notification Description"
              placeholder="Enter notification description..."
              value={notificationDescription}
              onChangeText={setNotificationDescription}
              multiline
            />

            <View style={styles.modalButtons}>
              <AppButton
                title="CANCEL"
                onPress={() => setNotificationModalVisible(false)}
                variant="outline"
                size="small"
                style={styles.modalButton}
              />
              <TouchableOpacity
                onPress={handleSendNotification}
                onPressIn={() => setSendNotificationButtonPressed(true)}
                onPressOut={() => setSendNotificationButtonPressed(false)}
                activeOpacity={1}
                disabled={!notificationTitle.trim() || !notificationDescription.trim()}
                style={[
                  styles.sendNotificationButton,
                  sendNotificationButtonPressed && styles.sendNotificationButtonPressed,
                  (!notificationTitle.trim() || !notificationDescription.trim()) && styles.sendNotificationButtonDisabled
                ]}>
                <AppText variant="semiBold" size="sm" color={theme.colors.textWhite}>
                  SEND
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Set Event Modal */}
      <Modal
        visible={eventModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEventModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <AppText variant="semiBold" size="lg" style={styles.modalTitle}>
              Set Event
            </AppText>

            <AppTextInput
              label="Event Name"
              placeholder="Enter event name..."
              value={eventName}
              onChangeText={setEventName}
            />

            <View style={styles.datePickerContainer}>
              <AppText size="sm" variant="medium" style={styles.datePickerLabel}>
                Date
              </AppText>
              <TouchableOpacity
                onPress={handleDatePickerPress}
                style={styles.datePickerButton}>
                <AppText size="md" color={eventDate ? theme.colors.textDark : theme.colors.textLight}>
                  {eventDate || 'Select date (DD-MM-YYYY)'}
                </AppText>
                <AppText size="lg">📅</AppText>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}

            <AppTextInput
              label="Time"
              placeholder="HH:MM"
              value={eventTime}
              onChangeText={setEventTime}
            />

            <AppTextInput
              label="Description (Optional)"
              placeholder="Enter event description..."
              value={eventDescription}
              onChangeText={setEventDescription}
              multiline
            />

            <View style={styles.modalButtons}>
              <AppButton
                title="CANCEL"
                onPress={() => setEventModalVisible(false)}
                variant="outline"
                size="small"
                style={styles.modalButton}
              />
              <AppButton
                title="CREATE"
                onPress={handleCreateEvent}
                variant="primary"
                size="small"
                style={styles.modalButton}
                disabled={!eventName.trim() || !eventDate.trim() || !eventTime.trim()}
              />
            </View>
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
  welcomeCard: {
    backgroundColor: theme.colors.backgroundLight,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderLeftWidth: 4,
    position: 'relative',
  },
  welcomeText: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  accentBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.sm,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  prayerTimesTitle: {
    marginBottom: theme.spacing.md,
    letterSpacing: 1,
    color: theme.colors.textDark,
  },
  quickActionsTitle: {
    marginBottom: theme.spacing.sm,
    letterSpacing: 1,
    color: theme.colors.textDark,
  },
  prayerCardWrapper: {
    marginBottom: theme.spacing.md,
    position: 'relative',
  },
  prayerAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: theme.borderRadius.md,
    borderBottomLeftRadius: theme.borderRadius.md,
    zIndex: 1,
  },
  prayerCard: {
    marginBottom: 0,
  },
  prayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prayerInfo: {
    flex: 1,
  },
  prayerLabel: {
    marginBottom: theme.spacing.xs / 2,
    letterSpacing: 0.5,
  },
  prayerTime: {
    marginTop: 0,
  },
  editButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.background,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonPressed: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  editButtonText: {
    letterSpacing: 0.8,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  gridItem: {
    width: '48%',
  },
  fullWidthItem: {
    width: '100%',
  },
  fullWidthContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionCard: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    position: 'relative',
  },
  secondaryActionCard: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  secondaryActionCardPressed: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  primaryActionCard: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    borderWidth: 2,
    shadowColor: theme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  primaryActionCardPressed: {
    backgroundColor: '#006B50',
    borderColor: theme.colors.accent,
    borderWidth: 2,
    shadowColor: theme.colors.accent,
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 6,
  },
  primaryActionContent: {
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    textAlign: 'center',
  },
  actionTitleCenter: {
    textAlign: 'center',
    flex: 1,
  },
  primaryActionTitle: {
    textAlign: 'center',
    color: theme.colors.textWhite,
  },
  actionSubtitle: {
    textAlign: 'center',
    marginTop: 2,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: theme.colors.error,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    zIndex: 10,
  },
  inlineBadge: {
    backgroundColor: theme.colors.error,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  datePickerContainer: {
    marginBottom: theme.spacing.md,
  },
  datePickerLabel: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.textDark,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  saveButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    borderWidth: 2,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.sm,
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
  saveButtonPressed: {
    backgroundColor: '#006B50',
    borderColor: theme.colors.accent,
    borderWidth: 2,
    shadowColor: theme.colors.accent,
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 6,
  },
  saveButtonDisabled: {
    backgroundColor: theme.colors.grayMedium,
    borderColor: theme.colors.grayMedium,
    opacity: 0.5,
  },
  sendNotificationButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    borderWidth: 2,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.sm,
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
  sendNotificationButtonPressed: {
    backgroundColor: '#006B50',
    borderColor: theme.colors.accent,
    borderWidth: 2,
    shadowColor: theme.colors.accent,
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 6,
  },
  sendNotificationButtonDisabled: {
    backgroundColor: theme.colors.grayMedium,
    borderColor: theme.colors.grayMedium,
    opacity: 0.5,
  },
  logoutButton: {
    marginTop: theme.spacing.lg,
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
  logoutMessage: {
    marginVertical: theme.spacing.md,
    textAlign: 'center',
  },
  dropdownContainer: {
    marginBottom: theme.spacing.md,
  },
  dropdownLabel: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.textDark,
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  categoryButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  categoryButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
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
    marginBottom: theme.spacing.lg,
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.xs,
    marginRight: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkboxLabel: {
    flex: 1,
    color: theme.colors.textDark,
  },
});

