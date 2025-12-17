import React, {useCallback} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {AppText, AppCard, AppHeader} from '../components';
import {theme} from '../theme';
import {useApp} from '../context';
import {Notification} from '../types';
import {useTranslation} from '../i18n';

export const NotificationsScreen: React.FC = () => {
  const {t} = useTranslation();
  const {notifications, defaultMasjid, markAllNotificationsAsRead} = useApp();

  // Mark all notifications as read when screen is focused
  useFocusEffect(
    useCallback(() => {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      if (unreadNotifications.length > 0) {
        markAllNotificationsAsRead();
      }
    }, [notifications, markAllNotificationsAsRead])
  );

  const renderItem = ({item}: {item: Notification}) => (
    <AppCard padding="medium" shadow="small" style={styles.notificationCard}>
      <View style={styles.notificationHeader}>
        <View style={styles.headerLeft}>
          <View style={[styles.categoryBadge, {backgroundColor: getCategoryColor(item.category)}]}>
            <AppText size="xs" color={theme.colors.textWhite} variant="semiBold">
              {translateCategory(item.category).toUpperCase()}
            </AppText>
          </View>
          {!item.isRead && (
            <View style={[styles.newBadge, {marginLeft: theme.spacing.xs}]}>
              <AppText size="xs" color={theme.colors.textDark} variant="semiBold">
                {t('notifications.new')}
              </AppText>
            </View>
          )}
        </View>
        <AppText size="xs" color={theme.colors.textLight}>
          {item.date}
        </AppText>
      </View>
      <AppText variant="semiBold" size="md" style={styles.notificationTitle}>
        {item.title}
      </AppText>
      <AppText size="sm" color={theme.colors.textDark} style={styles.notificationDescription}>
        {item.description}
      </AppText>
    </AppCard>
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Prayer Times':
        return theme.colors.primary;
      case 'Donations':
        return theme.colors.accent;
      case 'Events':
        return theme.colors.info;
      case 'General':
      default:
        return theme.colors.grayDark;
    }
  };

  const translateCategory = (category: string): string => {
    const categoryMap: {[key: string]: string} = {
      'Prayer Times': t('notifications.prayerTimes'),
      'Donations': t('notifications.donations'),
      'Events': t('notifications.events'),
      'General': t('notifications.general'),
    };
    return categoryMap[category] || category;
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title={t('notifications.title')}
        subtitle={defaultMasjid?.name}
      />
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AppText size="xxl">📭</AppText>
            <AppText variant="medium" size="md" style={styles.emptyText}>
              {t('notifications.noNotifications')}
            </AppText>
            <AppText size="sm" color={theme.colors.textLight} style={styles.emptySubtext}>
              {t('notifications.noNotificationsSubtext')}
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
  notificationCard: {
    marginBottom: theme.spacing.md,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  newBadge: {
    backgroundColor: '#FFD700', // Yellow color
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FFC107',
    minWidth: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationTitle: {
    marginBottom: theme.spacing.xs,
  },
  notificationDescription: {
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

