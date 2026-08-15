import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Alert, TouchableOpacity} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/types';
import {AppText, AppButton, AppCard, AppHeader, AppTextInput} from '../components';
import {theme} from '../theme';
import {useApp} from '../context';

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

export const AddEventScreen: React.FC = () => {
  const navigation = useNavigation<AddEventScreenNavigationProp>();
  const route = useRoute<AddEventScreenRouteProp>();
  const {masjidId} = route.params;
  const {addEvent} = useApp();

  const [eventType, setEventType] = useState<'one_time' | 'recurring'>('one_time');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState<number>(5);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!eventName.trim() || !eventTime.trim()) {
      Alert.alert('Error', 'Please fill in Event Name and Time');
      return;
    }

    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(eventTime.trim())) {
      Alert.alert('Error', 'Please enter time in 24-hour HH:MM format');
      return;
    }

    if (eventType === 'one_time' && !eventDate.trim()) {
      Alert.alert('Error', 'Please fill in the Event Date');
      return;
    }

    setLoading(true);
    try {
      await addEvent({
        masjidId,
        name: eventName.trim(),
        description: description.trim(),
        eventType,
        ...(eventType === 'one_time' ? {date: eventDate.trim()} : {dayOfWeek}),
        time: eventTime.trim(),
      });
      
      Alert.alert('Success', 'Event added successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      // Error is handled in context
    } finally {
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
              onPress={() => setEventType('one_time')}
            >
              <AppText 
                variant={eventType === 'one_time' ? 'semiBold' : 'regular'}
                color={eventType === 'one_time' ? theme.colors.textWhite : theme.colors.textDark}
              >
                One Time
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.typeButton, eventType === 'recurring' && styles.typeButtonActive]}
              onPress={() => setEventType('recurring')}
            >
              <AppText 
                variant={eventType === 'recurring' ? 'semiBold' : 'regular'}
                color={eventType === 'recurring' ? theme.colors.textWhite : theme.colors.textDark}
              >
                Recurring
              </AppText>
            </TouchableOpacity>
          </View>

          <AppTextInput
            label="Event Name"
            placeholder="e.g., Eid Prayer or Jumma Bayan"
            value={eventName}
            onChangeText={setEventName}
          />

          {eventType === 'one_time' ? (
            <AppTextInput
              label="Event Date"
              placeholder="YYYY-MM-DD or DD-MM-YYYY"
              value={eventDate}
              onChangeText={setEventDate}
            />
          ) : (
            <View style={styles.daySelectorContainer}>
              <AppText variant="semiBold" style={styles.sectionLabel}>Day of Week</AppText>
              <View style={styles.daysRow}>
                {DAYS_OF_WEEK.map((day) => (
                  <TouchableOpacity
                    key={day.value}
                    style={[
                      styles.dayButton,
                      dayOfWeek === day.value && styles.dayButtonActive
                    ]}
                    onPress={() => setDayOfWeek(day.value)}
                  >
                    <AppText
                      size="sm"
                      variant={dayOfWeek === day.value ? 'semiBold' : 'regular'}
                      color={dayOfWeek === day.value ? theme.colors.textWhite : theme.colors.textDark}
                    >
                      {day.label}
                    </AppText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <AppTextInput
            label="Event Time"
            placeholder="HH:MM"
            value={eventTime}
            onChangeText={setEventTime}
          />

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
    alignItems: 'center',
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
  saveButton: {
    marginTop: theme.spacing.md,
  },
});
