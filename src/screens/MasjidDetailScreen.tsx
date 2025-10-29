import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/types';
import {AppText, AppButton, AppCard, AppHeader} from '../components';
import {theme} from '../theme';
import {useApp} from '../context';

type MasjidDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'MasjidDetail'
>;
type MasjidDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'MasjidDetail'
>;

export const MasjidDetailScreen: React.FC = () => {
  const navigation = useNavigation<MasjidDetailScreenNavigationProp>();
  const route = useRoute<MasjidDetailScreenRouteProp>();
  const {masjidId} = route.params;
  const {masajids, prayerTimes, questions} = useApp();

  const masjid = masajids.find(m => m.id === masjidId);
  const masjidPrayerTimes = prayerTimes[masjidId] || [];
  const masjidQuestions = questions.filter(q => q.masjidId === masjidId);
  const newQuestionsCount = masjidQuestions.filter(q => q.status === 'new').length;

  if (!masjid) {
    return (
      <View style={styles.container}>
        <AppHeader
          title="Masjid Not Found"
          showBackButton
          onLeftPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title={masjid.name}
        showBackButton
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Prayer Times Section */}
        <AppCard padding="medium" shadow="small" style={styles.sectionCard}>
          <AppText variant="semiBold" size="lg" style={styles.sectionTitle}>
            📿 Prayer Times
          </AppText>
          {masjidPrayerTimes.map(prayer => (
            <View key={prayer.name} style={styles.prayerRow}>
              <AppText variant="medium" size="md">
                {prayer.name}
              </AppText>
              <AppText variant="semiBold" size="md" color={theme.colors.primary}>
                {prayer.time}
              </AppText>
            </View>
          ))}
        </AppCard>

        {/* Questions Section */}
        <AppCard padding="medium" shadow="small" style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <AppText variant="semiBold" size="lg">
              ❓ Questions
            </AppText>
            {newQuestionsCount > 0 && (
              <View style={styles.badge}>
                <AppText
                  size="xs"
                  color={theme.colors.textWhite}
                  variant="semiBold">
                  {newQuestionsCount}
                </AppText>
              </View>
            )}
          </View>
          <AppButton
            title="View Questions"
            onPress={() => navigation.navigate('Questions')}
            variant="outline"
            fullWidth
            style={styles.sectionButton}
          />
        </AppCard>

        {/* Notifications Section */}
        <AppCard padding="medium" shadow="small" style={styles.sectionCard}>
          <AppText variant="semiBold" size="lg" style={styles.sectionTitle}>
            🔔 Notifications
          </AppText>
          <AppButton
            title="Send Notification"
            onPress={() => navigation.navigate('SendNotification', {masjidId})}
            variant="outline"
            fullWidth
          />
        </AppCard>

        {/* Events Section */}
        <AppCard padding="medium" shadow="small" style={styles.sectionCard}>
          <AppText variant="semiBold" size="lg" style={styles.sectionTitle}>
            📅 Events
          </AppText>
          <AppButton
            title="Add Event"
            onPress={() => navigation.navigate('AddEvent', {masjidId})}
            variant="outline"
            fullWidth
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
  sectionCard: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  badge: {
    backgroundColor: theme.colors.error,
    borderRadius: theme.borderRadius.full,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sectionButton: {
    marginTop: theme.spacing.sm,
  },
});

