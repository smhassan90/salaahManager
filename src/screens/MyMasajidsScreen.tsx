import React, {useState} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity, Alert} from 'react-native';
import {AppText, AppCard, AppHeader} from '../components';
import {theme} from '../theme';
import {useApp} from '../context';
import {Masjid} from '../types';

export const MyMasajidsScreen: React.FC = () => {
  const {masajids, setDefaultMasjid} = useApp();
  const [viewDetailsPressed, setViewDetailsPressed] = useState<{[key: string]: boolean}>({});
  const [defaultButtonPressed, setDefaultButtonPressed] = useState<{[key: string]: boolean}>({});

  const handleViewDetails = (masjid: Masjid) => {
    Alert.alert(
      masjid.name,
      `Location: ${masjid.location}\n\nContact: +92 123 4567890\nEmail: info@${masjid.name.toLowerCase().replace(/\s+/g, '')}.com`,
      [{text: 'OK'}]
    );
  };

  const handleSetDefault = (masjidId: string) => {
    setDefaultMasjid(masjidId);
  };

  const renderMasjid = ({item}: {item: Masjid}) => (
    <AppCard padding="medium" shadow="small" style={styles.masjidCard}>
      <View style={styles.masjidHeader}>
        <View style={styles.masjidInfo}>
          <AppText variant="semiBold" size="lg">
            {item.name}
          </AppText>
          <AppText size="sm" color={theme.colors.textDark} style={styles.location}>
            📍 {item.location}
          </AppText>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          onPress={() => handleViewDetails(item)}
          onPressIn={() => setViewDetailsPressed({...viewDetailsPressed, [item.id]: true})}
          onPressOut={() => setViewDetailsPressed({...viewDetailsPressed, [item.id]: false})}
          activeOpacity={1}
          style={[
            styles.viewDetailsButton,
            viewDetailsPressed[item.id] && styles.viewDetailsButtonPressed
          ]}>
          <AppText 
            size="xs" 
            variant="semiBold"
            color={viewDetailsPressed[item.id] ? theme.colors.textWhite : theme.colors.primary}
            style={styles.viewDetailsText}>
            VIEW DETAILS
          </AppText>
        </TouchableOpacity>

        {!item.isDefault && (
          <TouchableOpacity
            onPress={() => handleSetDefault(item.id)}
            onPressIn={() => setDefaultButtonPressed({...defaultButtonPressed, [item.id]: true})}
            onPressOut={() => setDefaultButtonPressed({...defaultButtonPressed, [item.id]: false})}
            activeOpacity={1}
            style={[
              styles.defaultButton,
              defaultButtonPressed[item.id] && styles.defaultButtonPressed
            ]}>
            <AppText 
              size="xs" 
              variant="semiBold"
              color={defaultButtonPressed[item.id] ? theme.colors.textWhite : theme.colors.accent}
              style={styles.defaultButtonText}>
              SET DEFAULT
            </AppText>
          </TouchableOpacity>
        )}

        {item.isDefault && (
          <View style={styles.defaultBadge}>
            <AppText
              size="xs"
              color={theme.colors.textWhite}
              variant="semiBold"
              style={styles.defaultBadgeText}>
              DEFAULT
            </AppText>
          </View>
        )}
      </View>
    </AppCard>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="MY MASAJIDS" />

      <FlatList
        data={masajids}
        renderItem={renderMasjid}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
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
  },
  masjidCard: {
    marginBottom: theme.spacing.md,
  },
  masjidHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  masjidInfo: {
    flex: 1,
  },
  location: {
    marginTop: theme.spacing.xs,
    lineHeight: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  viewDetailsButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.background,
    flex: 1,
    marginRight: theme.spacing.sm,
    alignItems: 'center',
  },
  viewDetailsButtonPressed: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  viewDetailsText: {
    letterSpacing: 0.8,
  },
  defaultButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1.5,
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
  },
  defaultButtonPressed: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  defaultButtonText: {
    letterSpacing: 0.8,
  },
  defaultBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  defaultBadgeText: {
    letterSpacing: 0.8,
  },
});

