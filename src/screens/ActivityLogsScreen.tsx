import React, {useCallback, useState} from 'react';
import {View, StyleSheet, FlatList, RefreshControl} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {AppText, AppCard, AppHeader} from '../components';
import {theme} from '../theme';
import {useApp} from '../context';
import {ActivityLog} from '../types';
import {activityLogService, formatRelativeTime} from '../services/api/activityLogService';
import {useTranslation} from '../i18n';

const actionIcon = (action: string) => {
  if (action === 'prayer_time_updated') {
    return 'time-outline';
  }
  if (action === 'event_created') {
    return 'calendar-outline';
  }
  if (action === 'question_answered') {
    return 'chatbubble-ellipses-outline';
  }
  return 'ellipse-outline';
};

export const ActivityLogsScreen: React.FC = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {defaultMasjid} = useApp();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadLogs = useCallback(async () => {
    if (!defaultMasjid?.id) {
      setLogs([]);
      return;
    }
    try {
      const logs = await activityLogService.getMasjidLogs(defaultMasjid.id, {
        page: 1,
        limit: 50,
      });
      setLogs(logs);
    } catch (error) {
      console.error('Failed to load activity logs:', error);
    }
  }, [defaultMasjid?.id]);

  useFocusEffect(
    useCallback(() => {
      loadLogs();
    }, [loadLogs]),
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadLogs();
    setRefreshing(false);
  };

  const renderItem = ({item}: {item: ActivityLog}) => (
    <AppCard padding="medium" shadow="small" style={styles.logCard}>
      <View style={styles.logHeader}>
        <View style={styles.iconBadge}>
          <Icon name={actionIcon(item.action)} size={18} color={theme.colors.primary} />
        </View>
        <View style={styles.logBody}>
          <AppText variant="semiBold" size="md" style={styles.logMessage}>
            {item.message}
          </AppText>
          <AppText size="xs" color={theme.colors.textLight} style={styles.logTime}>
            {formatRelativeTime(item.created_at)}
            {item.user?.name ? ` • ${item.user.name}` : ''}
          </AppText>
        </View>
      </View>
    </AppCard>
  );

  return (
    <View style={styles.container}>
      <AppHeader
        title={t('logs.title')}
        subtitle={defaultMasjid?.name}
        leftIcon={<Icon name="arrow-back" size={24} color={theme.colors.textWhite} />}
        onLeftPress={() => navigation.goBack()}
      />
      <FlatList
        data={logs}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id || `log-${index}`}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AppText size="xxl">📝</AppText>
            <AppText variant="medium" size="md" style={styles.emptyText}>
              {t('logs.empty')}
            </AppText>
            <AppText size="sm" color={theme.colors.textLight} style={styles.emptySubtext}>
              {t('logs.emptySubtext')}
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
  logCard: {
    marginBottom: theme.spacing.md,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  logBody: {
    flex: 1,
  },
  logMessage: {
    marginBottom: theme.spacing.xs,
  },
  logTime: {
    marginTop: 2,
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
