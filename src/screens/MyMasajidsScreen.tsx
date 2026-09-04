import React, {useState} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {AppText, AppCard, AppHeader} from '../components';
import {theme} from '../theme';
import {useApp} from '../context';
import {Masjid} from '../types';
import {useTranslation} from '../i18n';

const looksLikeCoordinates = (value?: string) =>
  !!value && /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(value.trim());

const masjidPlaceLabel = (masjid: Masjid): string => {
  const parts = [masjid.address, masjid.area]
    .map(part => (part || '').trim())
    .filter(Boolean);
  if (parts.length) {
    return parts.join(' · ');
  }
  if (masjid.location && !looksLikeCoordinates(masjid.location)) {
    return masjid.location.trim();
  }
  return [masjid.city, masjid.state].filter(Boolean).join(', ');
};

export const MyMasajidsScreen: React.FC = () => {
  const {t} = useTranslation();
  const {masajids, setDefaultMasjid} = useApp();
  const [savingDefault, setSavingDefault] = useState(false);

  const handleSwitchMasjid = async (masjid: Masjid) => {
    if (savingDefault || masjid.isDefault) {
      return;
    }
    setSavingDefault(true);
    try {
      await setDefaultMasjid(masjid.id);
    } catch (error) {
      // Error already handled in setDefaultMasjid
    } finally {
      setSavingDefault(false);
    }
  };

  const renderMasjid = ({item}: {item: Masjid}) => {
    const placeLabel = masjidPlaceLabel(item);
    return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={savingDefault || item.isDefault}
      onPress={() => handleSwitchMasjid(item)}>
      <AppCard
        padding="medium"
        shadow="small"
        style={[styles.masjidCard, item.isDefault && styles.masjidCardActive]}>
        <View style={styles.masjidHeader}>
          <View style={styles.masjidInfo}>
            <AppText variant="semiBold" size="lg">
              {item.name}
            </AppText>
            {!!placeLabel && (
              <AppText size="sm" color={theme.colors.textDark} style={styles.location}>
                📍 {placeLabel}
              </AppText>
            )}
          </View>
          <View style={[styles.radio, item.isDefault && styles.radioActive]}>
            {item.isDefault ? <View style={styles.radioDot} /> : null}
          </View>
        </View>

        {item.isDefault ? (
          <View style={styles.defaultBadge}>
            <AppText
              size="xs"
              color={theme.colors.textWhite}
              variant="semiBold"
              style={styles.defaultBadgeText}>
              {t('masajids.currentlyActive')}
            </AppText>
          </View>
        ) : (
          <View style={styles.switchButton}>
            <AppText
              size="xs"
              variant="semiBold"
              color={theme.colors.primary}
              style={styles.switchButtonText}>
              {t('masajids.switchToThis')}
            </AppText>
          </View>
        )}
      </AppCard>
    </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title={t('masajids.title')} />

      <FlatList
        data={masajids}
        renderItem={renderMasjid}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        extraData={masajids.map(m => `${m.id}:${m.isDefault}`).join('|')}
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
    paddingBottom: 110,
  },
  masjidCard: {
    marginBottom: theme.spacing.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  masjidCardActive: {
    borderColor: theme.colors.primary,
  },
  masjidHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  masjidInfo: {
    flex: 1,
    paddingRight: theme.spacing.sm,
  },
  location: {
    marginTop: theme.spacing.xs,
    lineHeight: 20,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioActive: {
    borderColor: theme.colors.primary,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  switchButton: {
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  switchButtonText: {
    letterSpacing: 0.6,
  },
  defaultBadge: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  defaultBadgeText: {
    letterSpacing: 0.8,
  },
});
