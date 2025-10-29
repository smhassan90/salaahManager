import React from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AppText, AppCard, AppHeader} from '../components';
import {theme} from '../theme';
import {useApp} from '../context';
import {Notification} from '../types';

export const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation();
  const {notifications, defaultMasjid} = useApp();

  const renderItem = ({item}: {item: Notification}) => (
    <AppCard padding="medium" shadow="small" style={styles.notificationCard}>
      <View style={styles.notificationHeader}>
        <View style={[styles.categoryBadge, {backgroundColor: getCategoryColor(item.category)}]}>
          <AppText size="xs" color={theme.colors.textWhite} variant="semiBold">
            {item.category.toUpperCase()}
          </AppText>
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

  return (
    <View style={styles.container}>
      <AppHeader
        title="NOTIFICATIONS"
        subtitle={defaultMasjid?.name}
        leftIcon="⬅️"
        onLeftPress={() => navigation.goBack()}
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
              No notifications sent yet
            </AppText>
            <AppText size="sm" color={theme.colors.textLight} style={styles.emptySubtext}>
              Notifications you send will appear here
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
  categoryBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
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

