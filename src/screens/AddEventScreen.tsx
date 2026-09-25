import React, {useEffect, useMemo, useState} from 'react';
import {View, StyleSheet, ScrollView, Alert, TouchableOpacity, Platform} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import {RootStackParamList} from '../navigation/types';
import {AppText, AppButton, AppCard, AppHeader, AppTextInput} from '../components';
import {theme} from '../theme';
import {useApp} from '../context';
import {getErrorMessage} from '../services/api/apiClient';

type AddEventScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddEvent'
>;
type AddEventScreenRouteProp = RouteProp<RootStackParamList, 'AddEvent'>;

const DAYS_OF_WEEK = [
  {label: 'Sun', value: 0},
  {label: 'Mon', value: 1},
  {label: 'Tue', value: 2},
  {label: 'Wed', value: 3},
  {label: 'Thu', value: 4},
  {label: 'Fri', value: 5},
  {label: 'Sat', value: 6},
];

const AFTER_PRAYERS = [
  {label: 'Fajar', value: 'Fajr'},
  {label: 'Zohar', value: 'Dhuhr'},
  {label: 'Asar', value: 'Asr'},
  {label: 'Maghrib', value: 'Maghrib'},
  {label: 'Isha', value: 'Isha'},
  {label: 'Jumma', value: 'Jummah'},
] as const;

const FRIDAY = 5;

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatTime = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const AddEventScreen: React.FC = () => {
  const navigation = useNavigation<AddEventScreenNavigationProp>();
  const route = useRoute<AddEventScreenRouteProp>();
  const {masjidId} = route.params;
  const {addEvent} = useApp();

  const [eventType, setEventType] = useState<'one_time' | 'recurring'>('one_time');
  const [timeMode, setTimeMode] = useState<'fixed' | 'after_prayer'>('fixed');
  const [eventName, setEventName] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [eventDate, setEventDate] = useState(formatDate(new Date()));
  const [eventTime, setEventTime] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>([5]);
  const [afterPrayer, setAfterPrayer] = useState<(typeof AFTER_PRAYERS)[number]['value']>('Isha');
  const [description, setDescription] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const fridayOnly = selectedDays.length === 1 && selectedDays[0] === FRIDAY;
  const availableAfterPrayers = useMemo(
    () => AFTER_PRAYERS.filter(prayer => prayer.value !== 'Jummah' || fridayOnly),
    [fridayOnly],
  );

  useEffect(() => {
    if (!fridayOnly && afterPrayer === 'Jummah') {
      setAfterPrayer('Isha');
    }
  }, [fridayOnly, afterPrayer]);

  const toggleDay = (day: number) => {
    setSelectedDays(prev => {
      if (prev.includes(day)) {
        if (prev.length === 1) {
          return prev;
        }
        return prev.filter(d => d !== day).sort((a, b) => a - b);
      }
      return [...prev, day].sort((a, b) => a - b);
    });
  };

  const handleDateChange = (_event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
      setEventDate(formatDate(date));
    }
  };

  const handleTimeChange = (_event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (date) {
      setSelectedTime(date);
      setEventTime(formatTime(date));
    }
  };

  const handleSave = async () => {
    if (!eventName.trim() || eventName.trim().length < 3) {
      Alert.alert('Error', 'Event name must be at least 3 characters');
      return;
    }

    const useAfterPrayer = eventType === 'recurring' && timeMode === 'after_prayer';

    if (!useAfterPrayer) {
      if (!eventTime.trim()) {
        Alert.alert('Error', 'Please select Event Time');
        return;
      }
      if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(eventTime.trim())) {
        Alert.alert('Error', 'Please enter time in 24-hour HH:MM format');
        return;
      }
    }

    if (eventType === 'one_time' && !eventDate.trim()) {
      Alert.alert('Error', 'Please select the Event Date');
      return;
    }

    if (eventType === 'recurring' && selectedDays.length === 0) {
      Alert.alert('Error', 'Please select at least one day');
      return;
    }

    setLoading(true);
    try {
      await addEvent({
        masjidId,
        name: eventName.trim(),
        description: description.trim(),
        eventType,
        ...(eventType === 'one_time'
          ? {date: eventDate.trim()}
          : {daysOfWeek: selectedDays}),
        timeMode: useAfterPrayer ? 'after_prayer' : 'fixed',
        ...(useAfterPrayer
          ? {afterPrayer, minutesAfter: 0, time: '00:00'}
          : {time: eventTime.trim()}),
      });

      Alert.alert('Success', 'Event added successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', getErrorMessage(error));
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="Add Event"
        showBackButton
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <AppCard padding="medium" shadow="small" style={styles.formCard}>
          <AppText variant="semiBold" style={styles.sectionLabel}>Event Type</AppText>
          <View style={styles.eventTypeContainer}>
            <TouchableOpacity
              style={[styles.typeButton, eventType === 'one_time' && styles.typeButtonActive]}
              onPress={() => setEventType('one_time')}>
              <AppText
                variant={eventType === 'one_time' ? 'semiBold' : 'regular'}
                color={eventType === 'one_time' ? theme.colors.textWhite : theme.colors.textDark}>
                One Time
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, eventType === 'recurring' && styles.typeButtonActive]}
              onPress={() => setEventType('recurring')}>
              <AppText
                variant={eventType === 'recurring' ? 'semiBold' : 'regular'}
                color={eventType === 'recurring' ? theme.colors.textWhite : theme.colors.textDark}>
                Weekly
              </AppText>
            </TouchableOpacity>
          </View>

          <AppTextInput
            label="Event Name"
            placeholder="e.g., Jumma Bayan or Dars-e-Hadees"
            value={eventName}
            onChangeText={setEventName}
          />

          {eventType === 'one_time' ? (
            <View style={styles.pickerField}>
              <AppText variant="semiBold" style={styles.sectionLabel}>Event Date</AppText>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowDatePicker(true)}>
                <AppText>{eventDate || 'Select date'}</AppText>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                />
              )}
            </View>
          ) : (
            <View style={styles.daySelectorContainer}>
              <AppText variant="semiBold" style={styles.sectionLabel}>Repeats every</AppText>
              <AppText size="xs" color={theme.colors.textLight} style={styles.hintText}>
                Select one or more days
              </AppText>
              <View style={styles.daysRow}>
                {DAYS_OF_WEEK.map(day => {
                  const active = selectedDays.includes(day.value);
                  return (
                    <TouchableOpacity
                      key={day.value}
                      style={[styles.dayButton, active && styles.dayButtonActive]}
                      onPress={() => toggleDay(day.value)}>
                      <AppText
                        size="sm"
                        variant={active ? 'semiBold' : 'regular'}
                        color={active ? theme.colors.textWhite : theme.colors.textDark}>
                        {day.label}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {eventType === 'recurring' && (
            <View style={styles.pickerField}>
              <AppText variant="semiBold" style={styles.sectionLabel}>When does it start?</AppText>
              <View style={styles.eventTypeContainer}>
                <TouchableOpacity
                  style={[styles.typeButton, timeMode === 'fixed' && styles.typeButtonActive]}
                  onPress={() => setTimeMode('fixed')}>
                  <AppText
                    size="sm"
                    variant={timeMode === 'fixed' ? 'semiBold' : 'regular'}
                    color={timeMode === 'fixed' ? theme.colors.textWhite : theme.colors.textDark}
                    align="center">
                    Fixed time
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.typeButton, timeMode === 'after_prayer' && styles.typeButtonActive]}
                  onPress={() => setTimeMode('after_prayer')}>
                  <AppText
                    size="sm"
                    variant={timeMode === 'after_prayer' ? 'semiBold' : 'regular'}
                    color={timeMode === 'after_prayer' ? theme.colors.textWhite : theme.colors.textDark}
                    align="center">
                    After namaz
                  </AppText>
                </TouchableOpacity>
              </View>
              <AppText size="xs" color={theme.colors.textLight} style={styles.hintText}>
                {timeMode === 'fixed'
                  ? 'Example: Mon & Wed at 1:00 PM'
                  : fridayOnly
                    ? 'Example: after Jumma or after Maghrib'
                    : 'Example: after Maghrib or after Isha'}
              </AppText>
            </View>
          )}

          {eventType === 'recurring' && timeMode === 'after_prayer' ? (
            <View style={styles.pickerField}>
              <AppText variant="semiBold" style={styles.sectionLabel}>After which prayer?</AppText>
              <View style={styles.prayerGrid}>
                {availableAfterPrayers.map(prayer => {
                  const active = afterPrayer === prayer.value;
                  return (
                    <TouchableOpacity
                      key={prayer.value}
                      style={[styles.prayerButton, active && styles.typeButtonActive]}
                      onPress={() => setAfterPrayer(prayer.value)}>
                      <AppText
                        size="sm"
                        variant={active ? 'semiBold' : 'regular'}
                        color={active ? theme.colors.textWhite : theme.colors.textDark}
                        align="center">
                        After {prayer.label}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ) : (
            <View style={styles.pickerField}>
              <AppText variant="semiBold" style={styles.sectionLabel}>Event Time</AppText>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowTimePicker(true)}>
                <AppText>{eventTime || 'Select time'}</AppText>
              </TouchableOpacity>
              {showTimePicker && (
                <DateTimePicker
                  value={selectedTime}
                  mode="time"
                  is24Hour
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleTimeChange}
                />
              )}
            </View>
          )}

          <AppTextInput
            label="Description"
            placeholder="Enter event description"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <AppButton
            title="Add Event"
            onPress={handleSave}
            variant="primary"
            fullWidth
            loading={loading}
            style={styles.saveButton}
          />
        </AppCard>
      </ScrollView>
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
  formCard: {
    marginBottom: theme.spacing.md,
  },
  sectionLabel: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.textDark,
  },
  eventTypeContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  typeButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.backgroundLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  typeButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  daySelectorContainer: {
    marginBottom: theme.spacing.md,
  },
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  dayButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.backgroundLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minWidth: 40,
    alignItems: 'center',
  },
  dayButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  prayerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  prayerButton: {
    width: '31%',
    flexGrow: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.backgroundLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pickerField: {
    marginBottom: theme.spacing.md,
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.backgroundLight,
  },
  hintText: {
    marginTop: theme.spacing.xs,
    lineHeight: 18,
  },
  saveButton: {
    marginTop: theme.spacing.md,
  },
});
