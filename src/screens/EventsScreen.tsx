import React from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AppText, AppCard, AppHeader} from '../components';
import {theme} from '../theme';
import {useApp} from '../context';
import {Event} from '../types';

export const EventsScreen: React.FC = () => {
  const navigation = useNavigation();
  const {events, defaultMasjid} = useApp();

  const renderItem = ({item}: {item: Event}) => (
    <AppCard padding="medium" shadow="small" style={styles.eventCard}>
      <View style={styles.eventHeader}>
        <View style={styles.dateTimeContainer}>
          <View style={styles.dateBadge}>
            <AppText size="xs" color={theme.colors.primary} variant="semiBold">
              📅 {item.date}
            </AppText>
          </View>
          <View style={styles.timeBadge}>
            <AppText size="xs" color={theme.colors.primary} variant="semiBold">
              🕐 {item.time}
            </AppText>
          </View>
        </View>
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
        leftIcon="⬅️"
        onLeftPress={() => navigation.goBack()}
      />
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AppText size="xxl">📅</AppText>
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
  eventCard: {
    marginBottom: theme.spacing.md,
  },
  eventHeader: {
    marginBottom: theme.spacing.sm,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  dateBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.backgroundLight,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  timeBadge: {
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

