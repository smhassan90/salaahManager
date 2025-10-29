import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/types';
import {AppText, AppButton, AppCard, AppHeader, AppTextInput} from '../components';
import {theme} from '../theme';

type AddEventScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddEvent'
>;
type AddEventScreenRouteProp = RouteProp<RootStackParamList, 'AddEvent'>;

export const AddEventScreen: React.FC = () => {
  const navigation = useNavigation<AddEventScreenNavigationProp>();
  const route = useRoute<AddEventScreenRouteProp>();
  const {masjidId} = route.params;

  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    if (!eventName.trim() || !eventDate.trim() || !eventTime.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Event added successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="Add Event"
        showBackButton
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <AppCard padding="medium" shadow="small" style={styles.formCard}>
          <AppTextInput
            label="Event Name"
            placeholder="e.g., Eid Prayer"
            value={eventName}
            onChangeText={setEventName}
          />

          <AppTextInput
            label="Event Date"
            placeholder="DD/MM/YYYY"
            value={eventDate}
            onChangeText={setEventDate}
          />

          <AppTextInput
            label="Event Time"
            placeholder="HH:MM"
            value={eventTime}
            onChangeText={setEventTime}
          />

          <AppTextInput
            label="Description"
            placeholder="Enter event description"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <AppButton
            title="Add Event"
            onPress={handleSave}
            variant="primary"
            fullWidth
            loading={loading}
            style={styles.saveButton}
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
  formCard: {
    marginBottom: theme.spacing.md,
  },
  saveButton: {
    marginTop: theme.spacing.md,
  },
});

