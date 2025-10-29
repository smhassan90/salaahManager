import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/types';
import {AppText, AppButton, AppCard, AppHeader, AppTextInput} from '../components';
import {theme} from '../theme';
import {Picker} from '@react-native-picker/picker';

type SendNotificationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SendNotification'
>;
type SendNotificationScreenRouteProp = RouteProp<
  RootStackParamList,
  'SendNotification'
>;

export const SendNotificationScreen: React.FC = () => {
  const navigation = useNavigation<SendNotificationScreenNavigationProp>();
  const route = useRoute<SendNotificationScreenRouteProp>();
  const {masjidId} = route.params;

  const [category, setCategory] = useState('Namaz Timing');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Notification sent successfully!', [
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
        title="Send Notification"
        showBackButton
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <AppCard padding="medium" shadow="small" style={styles.formCard}>
          {/* Category Dropdown */}
          <View style={styles.inputContainer}>
            <AppText
              variant="medium"
              size="sm"
              color={theme.colors.textDark}
              style={styles.label}>
              Category
            </AppText>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={category}
                onValueChange={setCategory}
                style={styles.picker}>
                <Picker.Item label="Namaz Timing" value="Namaz Timing" />
                <Picker.Item label="Donation" value="Donation" />
                <Picker.Item label="Events" value="Events" />
              </Picker>
            </View>
          </View>

          <AppTextInput
            label="Notification Title"
            placeholder="Enter title"
            value={title}
            onChangeText={text => {
              if (text.length <= 50) {
                setTitle(text);
              }
            }}
          />
          <AppText
            size="xs"
            color={theme.colors.textLight}
            style={styles.charCount}>
            {title.length}/50 characters
          </AppText>

          <AppTextInput
            label="Notification Body"
            placeholder="Enter message"
            value={body}
            onChangeText={setBody}
            multiline
          />

          <AppButton
            title="Send Notification"
            onPress={handleSend}
            variant="primary"
            fullWidth
            loading={loading}
            style={styles.sendButton}
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
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  label: {
    marginBottom: theme.spacing.sm,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  charCount: {
    marginTop: -theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  sendButton: {
    marginTop: theme.spacing.md,
  },
});

