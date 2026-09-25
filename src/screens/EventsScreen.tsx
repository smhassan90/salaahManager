import React from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AppText, AppCard, AppHeader, AppIcon} from '../components';
import {theme} from '../theme';
import {useApp} from '../context';
import {Event} from '../types';

export const EventsScreen: React.FC = () => {
  const navigation = useNavigation();
  const {events, defaultMasjid, deleteEvent, eventPermissionError} = useApp();

  const handleDeleteEvent = (event: Event) => {
    Alert.alert(
      'Delete Event',
      `Are you sure you want to delete "${event.name}"? This will delete the event for all users.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteEvent(event.id),
        },
      ],
    );
  };

  const getEventDateString = (item: Event) => {
    if (item.event_type === 'recurring' && item.day_of_week !== undefined) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return `Every ${days[item.day_of_week]}`;
    }
    return item.date || 'No Date';
  };

  const getEventTimeString = (item: Event) => {
    const prayerLabels: Record<string, string> = {
      Fajr: 'Fajar',
      Dhuhr: 'Zohar',
      Asr: 'Asar',
      Maghrib: 'Maghrib',
      Isha: 'Isha',
      Jummah: 'Jumma',
    };
    if (item.time_mode === 'after_prayer' && item.after_prayer) {
      const label = prayerLabels[item.after_prayer] || item.after_prayer;
      const resolved = (item.resolved_event_time || item.time || '').toString().substring(0, 5);
      return resolved && resolved !== '00:00'
        ? `After ${label} · ${resolved}`
        : `After ${label}`;
    }
    return item.time || item.event_time || '--:--';
  };

  const renderItem = ({item}: {item: Event}) => (
    <AppCard padding="medium" shadow="small" style={styles.eventCard}>
      <View style={styles.eventHeader}>
        <View style={styles.dateTimeContainer}>
          <View style={styles.dateBadge}>
            <AppIcon name="calendar-outline" size={14} color={theme.colors.primary} />
            <AppText size="xs" color={theme.colors.primary} variant="semiBold">
              {getEventDateString(item)}
            </AppText>
          </View>
          <View style={styles.timeBadge}>
            <AppIcon name="time-outline" size={14} color={theme.colors.primary} />
            <AppText size="xs" color={theme.colors.primary} variant="semiBold">
              {getEventTimeString(item)}
            </AppText>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteEvent(item)}
          style={styles.deleteButton}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <AppIcon name="trash-outline" size={20} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
      <AppText variant="semiBold" size="md" style={styles.eventName}>
        {item.name}
      </AppText>
      {item.description ? (
        <AppText size="sm" color={theme.colors.textDark} style={styles.eventDescription}>
          {item.description}
        </AppText>
      ) : null}
    </AppCard>
  );

  return (
    <View style={styles.container}>
      <AppHeader
        title="EVENTS"
        subtitle={defaultMasjid?.name}
        leftIcon={<AppIcon name="arrow-back" size={24} color={theme.colors.textWhite} />}
        onLeftPress={() => navigation.goBack()}
      />
      {eventPermissionError && (
        <View style={styles.permissionErrorContainer}>
          <AppCard padding="medium" shadow="small" style={styles.permissionErrorCard}>
            <AppText 
              size="sm" 
              color={theme.colors.error || theme.colors.warning} 
              variant="semiBold"
              align="center"
              style={styles.permissionErrorText}>
              You don't have permission to create events
            </AppText>
            <AppText 
              size="xs" 
              color={theme.colors.textLight} 
              align="center"
              style={styles.permissionErrorSubtext}>
              Please contact your masjid administrator to grant you the "can_create_events" permission.
            </AppText>
          </AppCard>
        </View>
      )}

      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AppIcon name="calendar-outline" size={48} color={theme.colors.border} />
            <AppText variant="medium" size="md" style={styles.emptyText}>
              No events scheduled yet
            </AppText>
            <AppText size="sm" color={theme.colors.textLight} style={styles.emptySubtext}>
              Events you create will appear here
            </AppText>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing.md,
    flexGrow: 1,
  },
  permissionErrorContainer: {
    padding: theme.spacing.md,
    paddingBottom: 0,
  },
  permissionErrorCard: {
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
  eventCard: {
    marginBottom: theme.spacing.md,
  },
  eventHeader: {
    marginBottom: theme.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  deleteButton: {
    padding: theme.spacing.xs,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.backgroundLight,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.backgroundLight,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  eventName: {
    marginBottom: theme.spacing.xs,
  },
  eventDescription: {
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: theme.spacing.xxl * 3,
  },
  emptyText: {
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
});

