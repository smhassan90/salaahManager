import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Modal, TouchableOpacity, Platform, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import DateTimePicker from '@react-native-community/datetimepicker';
import {AppText, AppButton, AppCard, AppHeader, AppTextInput} from '../components';
import {theme} from '../theme';
import {useApp} from '../context';
import {HomeStackParamList} from '../navigation/HomeStackNavigator';
import {BottomTabParamList} from '../navigation/types';
import {useTranslation, translatePrayerName} from '../i18n';

interface HomeScreenProps {
  onLogout: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({onLogout}) => {
  const {t} = useTranslation();
  const stackNavigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
  const tabNavigation = stackNavigation.getParent<BottomTabNavigationProp<BottomTabParamList>>();
  const {defaultMasjid, prayerTimes, updatePrayerTime, user, questions, addNotification, addEvent, notifications, events, prayerTimePermissionError} = useApp();
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
  const [editButtonPressed, setEditButtonPressed] = useState<{[key: string]: boolean}>({});
  const [seeAllEventsPressed, setSeeAllEventsPressed] = useState(false);
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
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showEventTimePicker, setShowEventTimePicker] = useState(false);
  const [selectedEventTime, setSelectedEventTime] = useState(new Date());
  const [sendEventAsNotification, setSendEventAsNotification] = useState(false);
  
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
    setShowTimePicker(false);
    
    // Parse current time and set selectedTime for picker
    if (currentTime && currentTime !== '--:--') {
      try {
        const [hours, minutes] = currentTime.split(':');
        const date = new Date();
        date.setHours(parseInt(hours, 10) || 0);
        date.setMinutes(parseInt(minutes, 10) || 0);
        setSelectedTime(date);
      } catch (e) {
        setSelectedTime(new Date());
      }
    } else {
      setSelectedTime(new Date());
    }
    
    setModalVisible(true);
  };

  const handleTimePickerPress = () => {
    setShowTimePicker(true);
  };

  const handleTimeChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    
    if (date) {
      setSelectedTime(date);
      // Format time as HH:MM
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      setNewTime(`${hours}:${minutes}`);
    }
  };

  const handleEditButtonPress = (prayerName: string, pressed: boolean) => {
    setEditButtonPressed(prev => ({...prev, [prayerName]: pressed}));
  };

  const handleSaveTime = async () => {
    if (defaultMasjid) {
      try {
        await updatePrayerTime(defaultMasjid.id, selectedPrayer, newTime);
        
        if (notifyUsers) {
          try {
            // Send notification to all subscribers except the imam who made the change
            // (don't show success alert, we'll show combined message)
            const translatedPrayer = translatePrayerName(selectedPrayer);
            await addNotification({
              masjidId: defaultMasjid.id,
              title: t('home.prayerTimeNotificationTitle', {prayer: translatedPrayer}),
              description: t('home.prayerTimeNotificationDescription', {prayer: translatedPrayer, time: newTime}),
              category: 'Prayer Times',
              excludeCreator: true, // Don't send notification to the imam who updated the time
            }, false); // Don't show success alert
          } catch (notificationError) {
            // Prayer time was updated successfully, but notification failed
            // Don't prevent the modal from closing - just show a warning
            console.error('Notification error:', notificationError);
            Alert.alert(
              t('home.prayerTimeUpdated'),
              t('home.prayerTimeUpdatedMessage'),
              [{text: t('common.ok')}]
            );
          }
        }
        
        setModalVisible(false);
        setNotifyUsers(false); // Reset for next time
        setShowTimePicker(false);
      } catch (error) {
        // Error already handled in updatePrayerTime
        // Error already handled in updatePrayerTime
      }
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
    if (tabNavigation) {
      tabNavigation.navigate('Questions');
    }
  };

  const handleNotificationPress = () => {
    setNotificationCategory('General');
    setNotificationTitle('');
    setNotificationDescription('');
    setNotificationModalVisible(true);
  };

  const handleSendNotification = async () => {
    if (notificationTitle.trim() && notificationDescription.trim() && defaultMasjid) {
      await addNotification({
        masjidId: defaultMasjid.id,
        title: notificationTitle.trim(),
        description: notificationDescription.trim(),
        category: notificationCategory,
      });
      setNotificationModalVisible(false);
    }
  };

  const handleEventPress = () => {
    setEventName('');
    setEventDate('');
    setEventTime('');
    setEventDescription('');
    setSelectedDate(new Date());
    setSelectedEventTime(new Date());
    setShowDatePicker(false);
    setShowEventTimePicker(false);
    setSendEventAsNotification(false);
    setEventModalVisible(true);
  };

  const handleEventTimePickerPress = () => {
    setShowEventTimePicker(true);
  };

  const handleEventTimeChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowEventTimePicker(false);
    }
    
    if (date) {
      setSelectedEventTime(date);
      // Format time as HH:MM
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      setEventTime(`${hours}:${minutes}`);
    }
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

  const handleCreateEvent = async () => {
    if (eventName.trim() && eventDate.trim() && eventTime.trim() && defaultMasjid) {
      try {
        await addEvent({
          masjidId: defaultMasjid.id,
          name: eventName.trim(),
          date: eventDate.trim(),
          time: eventTime.trim(),
          description: eventDescription.trim(),
        });
        
        // Send notification if checkbox is checked
        if (sendEventAsNotification) {
          try {
            const notificationDescription = eventDescription.trim() 
              ? `${eventDescription.trim()}\n\nDate: ${eventDate}\nTime: ${eventTime}`
              : `Event Date: ${eventDate}\nEvent Time: ${eventTime}`;
            
            await addNotification({
              masjidId: defaultMasjid.id,
              title: eventName.trim(),
              description: notificationDescription,
              category: 'Events',
            }, false); // Don't show success alert, event creation already shows one
          } catch (notificationError) {
            // Event was created successfully, but notification failed
            console.error('Notification error:', notificationError);
            Alert.alert(
              t('home.eventCreated'),
              t('home.eventCreatedMessage'),
              [{text: t('common.ok')}]
            );
          }
        }
        
        setEventModalVisible(false);
        setShowEventTimePicker(false);
        setSendEventAsNotification(false);
      } catch (error) {
        // Error already handled in addEvent
        // Error already handled in createEvent
      }
    }
  };

  const pendingQuestions = questions.filter(q => q.status === 'new').length;

  // Format date from YYYY-MM-DD to DD-MM-YYYY
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    try {
      // Check if already in DD-MM-YYYY format
      if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
        return dateStr;
      }
      // Convert from YYYY-MM-DD to DD-MM-YYYY
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const [year, month, day] = parts;
        return `${day}-${month}-${year}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Format time from 24-hour (HH:MM) to 12-hour (HH:MM AM/PM)
  const formatTime = (timeStr: string): string => {
    if (!timeStr) return '';
    try {
      // Check if already in 12-hour format (contains AM/PM)
      if (/AM|PM/i.test(timeStr)) {
        return timeStr;
      }
      // Convert from 24-hour to 12-hour format
      const parts = timeStr.split(':');
      if (parts.length >= 2) {
        const hours = parseInt(parts[0], 10);
        const minutes = parts[1];
        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
        return `${hours12}:${minutes} ${period}`;
      }
      return timeStr;
    } catch {
      return timeStr;
    }
  };

  // Get last 3 events (sorted by date, most recent first)
  const lastThreeEvents = [...events]
    .sort((a, b) => {
      const dateA = a.event_date || a.date || '';
      const dateB = b.event_date || b.date || '';
      return dateB.localeCompare(dateA);
    })
    .slice(0, 3);

  const handleSeeAllEvents = () => {
    if (tabNavigation) {
      tabNavigation.navigate('Home');
      setTimeout(() => {
        stackNavigation.navigate('Events');
      }, 100);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title={defaultMasjid?.name || t('home.noDefaultMasjid')}
        subtitle={t('home.defaultMasjid')}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.welcomeCard, {borderLeftColor: accentColor}]}>
          <AppText variant="semiBold" size="lg" color={theme.colors.primary}>
            {t('home.welcome', {name: user?.name || ''})}
          </AppText>
          <AppText size="sm" color={theme.colors.textLight} style={styles.welcomeText}>
            {t('home.welcomeSubtitle')}
          </AppText>
          <View style={[styles.accentBadge, {backgroundColor: accentColor}]}>
            <AppText size="xs" color={theme.colors.textWhite} variant="semiBold">
              {t('home.imamDashboard')}
            </AppText>
          </View>
        </View>

        <AppText variant="medium" size="sm" style={styles.prayerTimesTitle}>
          {t('home.prayerTimes')}
        </AppText>

        {prayerTimePermissionError && (
          <AppCard padding="medium" shadow="small" style={styles.permissionErrorCard}>
            <AppText 
              size="sm" 
              color={theme.colors.error || theme.colors.warning} 
              variant="semiBold"
              align="center"
              style={styles.permissionErrorText}>
              {t('home.permissionError')}
            </AppText>
            <AppText 
              size="xs" 
              color={theme.colors.textLight} 
              align="center"
              style={styles.permissionErrorSubtext}>
              {t('home.permissionErrorSubtext')}
            </AppText>
          </AppCard>
        )}

        {masjidPrayerTimes.map((prayer) => {
          const prayerName = prayer.name || prayer.prayer_name || '';
          const prayerTime = prayer.time || prayer.prayer_time || '--:--';
          const translatedPrayerName = translatePrayerName(prayerName);
          
          return (
            <View key={prayerName || prayer.id || Math.random()} style={styles.prayerCardWrapper}>
              <View style={[styles.prayerAccent, {backgroundColor: theme.colors.primary}]} />
              <AppCard padding="medium" shadow="small" style={styles.prayerCard}>
                <View style={styles.prayerRow}>
                  <View style={styles.prayerInfo}>
                    <AppText 
                      variant="medium" 
                      size="xs" 
                      color={theme.colors.textLight}
                      style={styles.prayerLabel}>
                      {translatedPrayerName.toUpperCase()}
                    </AppText>
                    <AppText
                      variant="semiBold"
                      size="xl"
                      color={theme.colors.primary}
                      style={styles.prayerTime}>
                      {prayerTime}
                    </AppText>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleEditPress(prayerName, prayerTime)}
                    onPressIn={() => handleEditButtonPress(prayerName, true)}
                    onPressOut={() => handleEditButtonPress(prayerName, false)}
                    activeOpacity={1}
                    style={[
                      styles.editButton,
                      editButtonPressed[prayerName] && styles.editButtonPressed
                    ]}>
                    <AppText 
                      size="xs" 
                      variant="semiBold"
                      color={editButtonPressed[prayerName] ? theme.colors.textWhite : theme.colors.primary}
                      style={styles.editButtonText}>
                      {t('common.edit')}
                    </AppText>
                  </TouchableOpacity>
                </View>
              </AppCard>
            </View>
          );
        })}

        {/* Events Preview Section */}
        <AppText variant="semiBold" size="sm" style={styles.sectionTitle}>
          {t('home.recentEvents')}
        </AppText>

        <AppCard padding="medium" shadow="small" style={styles.eventsContainer}>
          {lastThreeEvents.length > 0 ? (
            <>
                {lastThreeEvents.map((event, index) => {
                  const rawDate = event.event_date || event.date || '';
                  const formattedDate = formatDate(rawDate);
                  const rawTime = event.event_time || event.time || '';
                  const formattedTime = formatTime(rawTime);
                  const isLastItem = index === lastThreeEvents.length - 1;
                  return (
                    <View key={event.id}>
                      <View style={styles.eventItem}>
                        <View style={styles.eventItemContent}>
                          <View style={styles.eventItemHeader}>
                            <AppText variant="semiBold" size="md" style={styles.eventItemName}>
                              {event.name}
                            </AppText>
                          </View>
                          <View style={styles.eventItemMeta}>
                            {formattedDate && (
                              <View style={styles.eventMetaBadge}>
                                <AppText size="xs" color={theme.colors.textDark} variant="medium">
                                  📅 {formattedDate}
                                </AppText>
                              </View>
                            )}
                            {formattedTime && (
                              <View style={styles.eventMetaBadge}>
                                <AppText size="xs" color={theme.colors.textDark} variant="medium">
                                  🕐 {formattedTime}
                                </AppText>
                              </View>
                            )}
                          </View>
                          {event.description && (
                            <AppText size="sm" color={theme.colors.textLight} style={styles.eventItemDescription} numberOfLines={2}>
                              {event.description}
                            </AppText>
                          )}
                        </View>
                      </View>
                      {!isLastItem && <View style={styles.eventDivider} />}
                    </View>
                  );
                })}
              <TouchableOpacity
                onPress={handleSeeAllEvents}
                onPressIn={() => setSeeAllEventsPressed(true)}
                onPressOut={() => setSeeAllEventsPressed(false)}
                activeOpacity={1}
                style={[
                  styles.seeAllButton,
                  seeAllEventsPressed && styles.seeAllButtonPressed
                ]}>
                <AppText variant="medium" size="sm" color={theme.colors.textDark}>
                  {t('home.seeAll')}
                </AppText>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.emptyEventsContainer}>
              <AppText size="lg">📅</AppText>
              <AppText variant="medium" size="sm" style={styles.emptyEventsText}>
                {t('home.noEvents')}
              </AppText>
            </View>
          )}
        </AppCard>

        {/* Quick Actions */}
        <AppText variant="semiBold" size="sm" style={styles.quickActionsTitle}>
          {t('home.quickActions')}
        </AppText>

        <View style={styles.actionsGrid}>
          {/* Row 1: Questions */}
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
                      ❓ {t('home.questions')}
                    </AppText>
                    <View style={styles.inlineBadge}>
                      <AppText size="xs" color={theme.colors.textWhite} variant="semiBold">
                        {pendingQuestions}
                      </AppText>
                    </View>
                  </View>
                ) : (
                  <AppText variant="semiBold" size="md" style={styles.actionTitle}>
                    ❓ {t('home.questions')}
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
                  📅 {t('home.createEvent')}
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
                  🔔 {t('home.sendNotification')}
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
              {t('home.editPrayerTime', {prayer: translatePrayerName(selectedPrayer)})}
            </AppText>

            <View style={styles.timePickerContainer}>
              <AppText size="sm" variant="medium" style={styles.timePickerLabel}>
                {t('home.prayerTime')}
              </AppText>
              <TouchableOpacity
                onPress={handleTimePickerPress}
                style={styles.timePickerButton}>
                <AppText size="md" color={newTime ? theme.colors.textDark : theme.colors.textLight}>
                  {newTime || t('home.selectTime')}
                </AppText>
                <AppText size="lg">🕐</AppText>
              </TouchableOpacity>
            </View>

            {showTimePicker && (
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleTimeChange}
                is24Hour={true}
              />
            )}

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
                {t('home.notifySubscribers')}
              </AppText>
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <AppButton
                title={t('common.cancel')}
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
                  {t('common.save')}
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
              {t('home.confirmLogout')}
            </AppText>

            <AppText size="md" style={styles.logoutMessage}>
              {t('home.logoutMessage')}
            </AppText>

            <View style={styles.modalButtons}>
              <AppButton
                title={t('common.cancel')}
                onPress={() => setLogoutModalVisible(false)}
                variant="outline"
                size="small"
                style={styles.modalButton}
              />
              <AppButton
                title={t('common.logout')}
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
              {t('home.sendNotificationTitle')}
            </AppText>

            {defaultMasjid && (
              <View style={styles.masjidInfoContainer}>
                <AppText size="xs" color={theme.colors.textLight} style={styles.masjidInfoLabel}>
                  {t('home.masjid')}
                </AppText>
                <AppText size="md" variant="semiBold" color={theme.colors.primary}>
                  {defaultMasjid.name}
                </AppText>
              </View>
            )}

            <View style={styles.dropdownContainer}>
              <AppText size="sm" variant="medium" style={styles.dropdownLabel}>
                {t('home.category')}
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
              label={t('home.notificationTitle')}
              placeholder={t('home.notificationTitlePlaceholder')}
              value={notificationTitle}
              onChangeText={setNotificationTitle}
            />

            <AppTextInput
              label={t('home.notificationDescription')}
              placeholder={t('home.notificationDescriptionPlaceholder')}
              value={notificationDescription}
              onChangeText={setNotificationDescription}
              multiline
            />

            <View style={styles.modalButtons}>
              <AppButton
                title={t('common.cancel')}
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
                  {t('common.send')}
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
              {t('home.setEvent')}
            </AppText>

            <AppTextInput
              label={t('home.eventName')}
              placeholder={t('home.eventNamePlaceholder')}
              value={eventName}
              onChangeText={setEventName}
            />

            <View style={styles.datePickerContainer}>
              <AppText size="sm" variant="medium" style={styles.datePickerLabel}>
                {t('home.date')}
              </AppText>
              <TouchableOpacity
                onPress={handleDatePickerPress}
                style={styles.datePickerButton}>
                <AppText size="md" color={eventDate ? theme.colors.textDark : theme.colors.textLight}>
                  {eventDate || t('home.selectDate')}
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

            <View style={styles.timePickerContainer}>
              <AppText size="sm" variant="medium" style={styles.timePickerLabel}>
                {t('home.time')}
              </AppText>
              <TouchableOpacity
                onPress={handleEventTimePickerPress}
                style={styles.timePickerButton}>
                <AppText size="md" color={eventTime ? theme.colors.textDark : theme.colors.textLight}>
                  {eventTime || t('home.selectTime')}
                </AppText>
                <AppText size="lg">🕐</AppText>
              </TouchableOpacity>
            </View>

            {showEventTimePicker && (
              <DateTimePicker
                value={selectedEventTime}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleEventTimeChange}
                is24Hour={true}
              />
            )}

            <AppTextInput
              label={t('home.descriptionOptional')}
              placeholder={t('home.descriptionPlaceholder')}
              value={eventDescription}
              onChangeText={setEventDescription}
              multiline
            />

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setSendEventAsNotification(!sendEventAsNotification)}
              activeOpacity={0.7}>
              <View style={[styles.checkbox, sendEventAsNotification && styles.checkboxChecked]}>
                {sendEventAsNotification && (
                  <AppText size="sm" color={theme.colors.textWhite}>
                    ✓
                  </AppText>
                )}
              </View>
              <AppText size="sm" style={styles.checkboxLabel}>
                {t('home.sendAsNotification')}
              </AppText>
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <AppButton
                title={t('common.cancel')}
                onPress={() => setEventModalVisible(false)}
                variant="outline"
                size="small"
                style={styles.modalButton}
              />
              <AppButton
                title={t('common.create')}
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
    letterSpacing: 1,
    color: theme.colors.textDark,
  },
  eventsContainer: {
    marginBottom: theme.spacing.lg,
  },
  eventItem: {
    paddingVertical: theme.spacing.sm,
  },
  eventDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.xs,
  },
  eventItemContent: {
    flex: 1,
  },
  eventItemHeader: {
    marginBottom: theme.spacing.sm,
  },
  eventItemName: {
    color: theme.colors.textDark,
  },
  eventItemMeta: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  eventMetaBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.xs,
    backgroundColor: theme.colors.backgroundLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  eventItemDescription: {
    marginTop: theme.spacing.xs,
    lineHeight: 18,
  },
  seeAllButton: {
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seeAllButtonPressed: {
    opacity: 0.6,
  },
  emptyEventsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
  },
  emptyEventsText: {
    marginTop: theme.spacing.sm,
    textAlign: 'center',
    color: theme.colors.textLight,
  },
  prayerTimesTitle: {
    marginBottom: theme.spacing.md,
    letterSpacing: 1,
    color: theme.colors.textDark,
  },
  permissionErrorCard: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.backgroundLight,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.error || theme.colors.warning,
  },
  permissionErrorText: {
    marginBottom: theme.spacing.xs,
  },
  permissionErrorSubtext: {
    marginTop: theme.spacing.xs,
    lineHeight: 18,
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
  timePickerContainer: {
    marginBottom: theme.spacing.md,
  },
  timePickerLabel: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.textDark,
  },
  timePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
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
  masjidInfoContainer: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  masjidInfoLabel: {
    marginBottom: theme.spacing.xs,
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

