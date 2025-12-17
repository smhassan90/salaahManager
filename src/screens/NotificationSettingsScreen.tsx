import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, Switch, Alert} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/types';
import {AppText, AppButton, AppHeader, AppCard} from '../components';
import {theme} from '../theme';
import {useTranslation} from '../i18n';

type NotificationSettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NotificationSettings'>;

interface NotificationSettingsScreenProps {
  navigation: NotificationSettingsScreenNavigationProp;
}

export const NotificationSettingsScreen: React.FC<NotificationSettingsScreenProps> = ({navigation}) => {
  const {t} = useTranslation();
  const [questionsNotif, setQuestionsNotif] = useState(true);
  const [generalNotif, setGeneralNotif] = useState(true);
  const [loading, setLoading] = useState(false);

  // Load saved settings on mount
  useEffect(() => {
    // TODO: Load from AsyncStorage or API if needed
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Save to API or AsyncStorage
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      Alert.alert(
        t('common.success') || 'Success',
        t('profile.settingsSaved') || 'Settings saved successfully',
        [
          {
            text: t('common.ok') || 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(t('common.error') || 'Error', t('profile.saveFailed') || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader 
        title={t('notifications.titleSettings') || t('notifications.title')} 
        showBackButton 
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <AppText variant="bold" size="huge" color={theme.colors.primary}>
              🔔
            </AppText>
          </View>

          <AppText variant="semiBold" size="xl" align="center" style={styles.title}>
            {t('notifications.titleSettings') || t('notifications.title')}
          </AppText>

          <AppText size="md" color={theme.colors.textLight} align="center" style={styles.subtitle}>
            {t('notifications.settingsDescription') || 'Manage your notification preferences'}
          </AppText>

          <AppCard padding="large" shadow="medium" style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <AppText variant="medium" size="md" style={styles.settingLabel}>
                  {t('notifications.questions')}
                </AppText>
                <AppText size="sm" color={theme.colors.textLight} style={styles.settingDescription}>
                  {t('notifications.questionsDescription')}
                </AppText>
              </View>
              <Switch
                value={questionsNotif}
                onValueChange={setQuestionsNotif}
                trackColor={{false: theme.colors.grayMedium, true: theme.colors.primary}}
                thumbColor={questionsNotif ? theme.colors.accent : theme.colors.background}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <AppText variant="medium" size="md" style={styles.settingLabel}>
                  {t('notifications.generalNotifications')}
                </AppText>
                <AppText size="sm" color={theme.colors.textLight} style={styles.settingDescription}>
                  {t('notifications.generalDescription')}
                </AppText>
              </View>
              <Switch
                value={generalNotif}
                onValueChange={setGeneralNotif}
                trackColor={{false: theme.colors.grayMedium, true: theme.colors.primary}}
                thumbColor={generalNotif ? theme.colors.accent : theme.colors.background}
              />
            </View>
          </AppCard>

          <View style={styles.buttonContainer}>
            <AppButton
              title={t('common.save')}
              onPress={handleSave}
              variant="primary"
              fullWidth
              loading={loading}
              style={styles.saveButton}
            />
          </View>
        </View>
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
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.textDark,
  },
  subtitle: {
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },
  settingsCard: {
    marginBottom: theme.spacing.xl,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.lg,
  },
  settingContent: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  settingLabel: {
    marginBottom: theme.spacing.xs,
    color: theme.colors.textDark,
  },
  settingDescription: {
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
  },
  buttonContainer: {
    marginTop: theme.spacing.md,
  },
  saveButton: {
    marginBottom: 0,
  },
});

