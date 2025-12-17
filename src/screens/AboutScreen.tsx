import React from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/types';
import {AppText, AppHeader, AppButton, AppCard} from '../components';
import {theme} from '../theme';
import {useTranslation} from '../i18n';

type AboutScreenNavigationProp = StackNavigationProp<RootStackParamList, 'About'>;

interface AboutScreenProps {
  navigation: AboutScreenNavigationProp;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({navigation}) => {
  const {t} = useTranslation();

  const handlePrivacyPolicyPress = async () => {
    const url = 'https://alasrbackend.vercel.app/alasr/privacy-policy';
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(url);
      }
    } catch (error: any) {
      try {
        await Linking.openURL(url);
      } catch (openError) {
        Alert.alert(
          t('about.errorOpeningPrivacy'),
          t('about.errorOpeningPrivacyMessage') || 'Please check your internet connection and try again.'
        );
      }
    }
  };

  const handleTermsOfServicePress = async () => {
    const url = 'https://alasrbackend.vercel.app/alasr/terms-of-service';
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(url);
      }
    } catch (error: any) {
      try {
        await Linking.openURL(url);
      } catch (openError) {
        Alert.alert(
          t('about.errorOpeningTerms'),
          t('about.errorOpeningTermsMessage') || 'Please check your internet connection and try again.'
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader 
        title={t('common.about')} 
        showBackButton 
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <AppText variant="bold" size="huge" color={theme.colors.primary}>
              🕌
            </AppText>
          </View>

          <AppText variant="semiBold" size="xl" align="center" style={styles.title}>
            {t('about.title')}
          </AppText>

          <AppCard padding="large" shadow="medium" style={styles.infoCard}>
            <View style={styles.infoSection}>
              <AppText size="sm" color={theme.colors.grayDark} style={styles.infoLabel}>
                {t('about.version')}
              </AppText>
              <AppText size="md" variant="medium">
                1.0.0
              </AppText>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoSection}>
              <AppText size="sm" color={theme.colors.grayDark} style={styles.infoLabel}>
                {t('about.developer')}
              </AppText>
              <AppText size="md" variant="medium">
                AlAsr Team
              </AppText>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoSection}>
              <AppText size="sm" color={theme.colors.grayDark} style={styles.infoLabel}>
                {t('about.description')}
              </AppText>
              <AppText size="md" style={styles.description}>
                {t('about.descriptionText')}
              </AppText>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoSection}>
              <AppText size="sm" color={theme.colors.grayDark} style={styles.infoLabel}>
                {t('about.support')}
              </AppText>
              <AppText size="md" variant="medium">
                dev.fynals@gmail.com
              </AppText>
            </View>
          </AppCard>

          <View style={styles.buttonContainer}>
            <AppButton
              title={t('about.privacyPolicy')}
              onPress={handlePrivacyPolicyPress}
              variant="outline"
              fullWidth
              style={styles.policyButton}
            />
            <AppButton
              title={t('about.termsOfService')}
              onPress={handleTermsOfServicePress}
              variant="outline"
              fullWidth
              style={styles.policyButton}
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
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    marginBottom: theme.spacing.xl,
    color: theme.colors.textDark,
  },
  infoCard: {
    marginBottom: theme.spacing.xl,
  },
  infoSection: {
    marginBottom: theme.spacing.md,
  },
  infoLabel: {
    marginBottom: theme.spacing.xs,
  },
  description: {
    lineHeight: 22,
    marginTop: theme.spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  buttonContainer: {
    marginTop: theme.spacing.md,
  },
  policyButton: {
    marginBottom: theme.spacing.sm,
  },
});

