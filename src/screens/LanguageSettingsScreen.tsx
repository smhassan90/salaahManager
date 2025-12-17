import React from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/types';
import Icon from 'react-native-vector-icons/Ionicons';
import {AppText, AppHeader} from '../components';
import {theme} from '../theme';
import {useApp} from '../context';
import {useTranslation, supportedLanguages} from '../i18n';

type LanguageSettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LanguageSettings'>;

interface LanguageSettingsScreenProps {
  navigation: LanguageSettingsScreenNavigationProp;
}

export const LanguageSettingsScreen: React.FC<LanguageSettingsScreenProps> = ({navigation}) => {
  const {t} = useTranslation();
  const {currentLanguage, changeLanguage} = useApp();

  const handleLanguageChange = async (languageCode: string) => {
    if (languageCode === currentLanguage) {
      return;
    }
    
    try {
      await changeLanguage(languageCode);
      Alert.alert(
        t('common.success') || 'Success',
        t('profile.languageChanged') || 'Language changed successfully',
        [
          {
            text: t('common.ok') || 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(t('common.error') || 'Error', 'Failed to change language');
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader 
        title={t('profile.languageSettings')} 
        showBackButton 
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <AppText variant="bold" size="huge" color={theme.colors.primary}>
              🌐
            </AppText>
          </View>

          <AppText variant="semiBold" size="xl" align="center" style={styles.title}>
            {t('profile.selectLanguage')}
          </AppText>

          <AppText size="md" color={theme.colors.textLight} align="center" style={styles.subtitle}>
            {t('profile.selectLanguageDescription') || 'Choose your preferred language'}
          </AppText>

          <View style={styles.languageListContainer}>
            {supportedLanguages.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageItem,
                  currentLanguage === language.code && styles.languageItemSelected
                ]}
                onPress={() => handleLanguageChange(language.code)}
                activeOpacity={0.7}>
                <View style={styles.languageItemContent}>
                  <AppText 
                    size="md" 
                    variant={currentLanguage === language.code ? 'semiBold' : 'regular'}
                    style={styles.languageName}>
                    {language.nativeName}
                  </AppText>
                  <AppText 
                    size="sm" 
                    color={theme.colors.grayDark}
                    style={styles.languageCode}>
                    {language.name}
                  </AppText>
                </View>
                {currentLanguage === language.code && (
                  <Icon name="checkmark-circle" size={24} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
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
  languageListContainer: {
    marginBottom: theme.spacing.xl,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    minHeight: 60,
    backgroundColor: theme.colors.background,
  },
  languageItemSelected: {
    backgroundColor: theme.colors.primary + '10',
    borderBottomColor: theme.colors.primary + '30',
    borderBottomWidth: 2,
  },
  languageItemContent: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  languageName: {
    marginBottom: theme.spacing.xs / 2,
  },
  languageCode: {
    textTransform: 'capitalize',
  },
});

