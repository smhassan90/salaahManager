import React, {useState, useCallback} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity, Modal, RefreshControl} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {AppText, AppButton, AppCard, AppHeader, AppTextInput} from '../components';
import {theme} from '../theme';
import {useApp} from '../context';
import {Question} from '../types';
import {useTranslation} from '../i18n';

type FilterTab = 'all' | 'pending' | 'answered';

export const QuestionsScreen: React.FC = () => {
  const {t} = useTranslation();
  const {questions, defaultMasjid, replyToQuestion, questionsPermissionError, fetchQuestions} = useApp();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sendReplyButtonPressed, setSendReplyButtonPressed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filter questions based on active tab
  const filteredQuestions = questions.filter(question => {
    if (activeTab === 'pending') {
      return question.status === 'new';
    }
    if (activeTab === 'answered') {
      return question.status === 'replied';
    }
    return true; // 'all' tab shows everything
  });

  // Count for badge display
  const pendingCount = questions.filter(q => q.status === 'new').length;
  const answeredCount = questions.filter(q => q.status === 'replied').length;

  const handleReplyPress = (question: Question) => {
    setSelectedQuestion(question);
    setReplyText('');
    setReplyModalVisible(true);
  };

  const handleSendReply = async () => {
    if (selectedQuestion && replyText.trim()) {
      await replyToQuestion(selectedQuestion.id, replyText.trim());
      setReplyModalVisible(false);
      setSelectedQuestion(null);
      setReplyText('');
    }
  };

  const handleRefresh = async () => {
    if (!defaultMasjid?.id) {
      return;
    }
    
    setRefreshing(true);
    try {
      await fetchQuestions(defaultMasjid.id);
    } catch (error) {
      // Error refreshing questions - already handled by AppContext
    } finally {
      setRefreshing(false);
    }
  };

  // Refresh questions when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (defaultMasjid?.id) {
        fetchQuestions(defaultMasjid.id);
      }
    }, [defaultMasjid?.id, fetchQuestions])
  );

  const renderQuestion = ({item}: {item: Question}) => (
    <AppCard padding="medium" shadow="small" style={styles.questionCard}>
      <View style={styles.questionHeader}>
        <View style={styles.questionHeaderLeft}>
          <AppText variant="semiBold" size="md">
            {item.title}
          </AppText>
          <View
            style={[
              styles.statusBadge,
              item.status === 'new'
                ? styles.statusNew
                : styles.statusReplied,
            ]}>
            <AppText
              size="xs"
              color={theme.colors.textWhite}
              variant="semiBold">
              {item.status === 'new' ? t('questions.new') : t('questions.replied')}
            </AppText>
          </View>
        </View>
        {item.status === 'new' && (
          <AppButton
            title={t('questions.reply')}
            onPress={() => handleReplyPress(item)}
            variant="outline"
            size="small"
            style={styles.replyButton}
          />
        )}
      </View>
      <AppText size="sm" style={styles.questionText}>
        {item.question}
      </AppText>
      <View style={styles.questionFooter}>
        <AppText size="xs" color={theme.colors.textLight}>
          {t('common.by')} {item.userName}
        </AppText>
        <AppText size="xs" color={theme.colors.textLight}>
          {item.date}
        </AppText>
      </View>
      {item.reply && (
        <View style={styles.replyContainer}>
          <AppText
            size="xs"
            color={theme.colors.primary}
            variant="semiBold">
            {t('questions.yourReply')}:
          </AppText>
          <AppText size="sm" color={theme.colors.textDark}>
            {item.reply}
          </AppText>
        </View>
      )}
    </AppCard>
  );

  return (
    <View style={styles.container}>
      <AppHeader
        title={t('questions.title')}
        subtitle={defaultMasjid?.name}
      />

      {/* Tab Filters */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.tabActive]}
          onPress={() => setActiveTab('all')}
          activeOpacity={0.7}>
          <AppText
            variant={activeTab === 'all' ? 'semiBold' : 'regular'}
            size="sm"
            color={activeTab === 'all' ? theme.colors.primary : theme.colors.textDark}>
            {t('questions.all')}
          </AppText>
          <View style={[styles.badge, activeTab === 'all' && styles.badgeActive]}>
            <AppText
              size="xs"
              color={activeTab === 'all' ? theme.colors.textWhite : theme.colors.textDark}
              variant="semiBold">
              {questions.length}
            </AppText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.tabActive]}
          onPress={() => setActiveTab('pending')}
          activeOpacity={0.7}>
          <AppText
            variant={activeTab === 'pending' ? 'semiBold' : 'regular'}
            size="sm"
            color={activeTab === 'pending' ? theme.colors.primary : theme.colors.textDark}>
            {t('questions.pending')}
          </AppText>
          <View style={[styles.badge, activeTab === 'pending' && styles.badgeActive]}>
            <AppText
              size="xs"
              color={activeTab === 'pending' ? theme.colors.textWhite : theme.colors.textDark}
              variant="semiBold">
              {pendingCount}
            </AppText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'answered' && styles.tabActive]}
          onPress={() => setActiveTab('answered')}
          activeOpacity={0.7}>
          <AppText
            variant={activeTab === 'answered' ? 'semiBold' : 'regular'}
            size="sm"
            color={activeTab === 'answered' ? theme.colors.primary : theme.colors.textDark}>
            {t('questions.answered')}
          </AppText>
          <View style={[styles.badge, activeTab === 'answered' && styles.badgeActive]}>
            <AppText
              size="xs"
              color={activeTab === 'answered' ? theme.colors.textWhite : theme.colors.textDark}
              variant="semiBold">
              {answeredCount}
            </AppText>
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredQuestions}
        renderItem={renderQuestion}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {questionsPermissionError ? (
              <View style={styles.permissionErrorContainer}>
                <AppText 
                  size="md" 
                  color={theme.colors.error || theme.colors.warning} 
                  align="center"
                  variant="semiBold"
                  style={styles.permissionErrorText}>
                  {t('questions.permissionError')}
                </AppText>
                <AppText 
                  size="sm" 
                  color={theme.colors.textLight} 
                  align="center"
                  style={styles.permissionErrorSubtext}>
                  {t('questions.permissionErrorSubtext')}
                </AppText>
              </View>
            ) : (
              <AppText size="md" color={theme.colors.textLight} align="center">
                {activeTab === 'pending' && t('questions.noPendingQuestions')}
                {activeTab === 'answered' && t('questions.noAnsweredQuestions')}
                {activeTab === 'all' && t('questions.noQuestions')}
              </AppText>
            )}
          </View>
        }
      />

      {/* Reply Modal */}
      <Modal
        visible={replyModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setReplyModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <AppText variant="semiBold" size="lg" style={styles.modalTitle}>
              {t('questions.replyToQuestion')}
            </AppText>

            {selectedQuestion && (
              <View style={styles.questionPreview}>
                <AppText variant="semiBold" size="sm" style={styles.previewTitle}>
                  {selectedQuestion.title}
                </AppText>
                <AppText size="xs" color={theme.colors.textLight}>
                  {t('common.by')} {selectedQuestion.userName}
                </AppText>
                <AppText size="sm" style={styles.questionPreviewText}>
                  {selectedQuestion.question}
                </AppText>
              </View>
            )}

            <AppTextInput
              label={t('questions.yourReply')}
              placeholder={t('questions.yourReplyPlaceholder')}
              value={replyText}
              onChangeText={setReplyText}
              multiline
            />

            <View style={styles.modalButtons}>
              <AppButton
                title={t('common.cancel')}
                onPress={() => setReplyModalVisible(false)}
                variant="outline"
                size="small"
                style={styles.modalButton}
              />
              <TouchableOpacity
                onPress={handleSendReply}
                onPressIn={() => setSendReplyButtonPressed(true)}
                onPressOut={() => setSendReplyButtonPressed(false)}
                activeOpacity={1}
                disabled={!replyText.trim()}
                style={[
                  styles.sendReplyButton,
                  sendReplyButtonPressed && styles.sendReplyButtonPressed,
                  !replyText.trim() && styles.sendReplyButtonDisabled
                ]}>
                <AppText variant="semiBold" size="sm" color={theme.colors.textWhite}>
                  {t('questions.sendReply')}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingHorizontal: theme.spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.transparent,
    gap: theme.spacing.xs,
  },
  tabActive: {
    borderBottomColor: theme.colors.primary,
  },
  badge: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeActive: {
    backgroundColor: theme.colors.primary,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  questionCard: {
    marginBottom: theme.spacing.md,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  questionHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
    marginRight: theme.spacing.sm,
  },
  questionText: {
    marginBottom: theme.spacing.md,
    color: theme.colors.textDark,
  },
  questionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  statusNew: {
    backgroundColor: theme.colors.warning,
  },
  statusReplied: {
    backgroundColor: theme.colors.success,
  },
  replyButton: {
    alignSelf: 'flex-start',
  },
  replyContainer: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.sm,
  },
  emptyContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  permissionErrorContainer: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  permissionErrorText: {
    marginBottom: theme.spacing.sm,
  },
  permissionErrorSubtext: {
    marginTop: theme.spacing.xs,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    marginBottom: theme.spacing.md,
  },
  questionPreview: {
    backgroundColor: theme.colors.backgroundLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.md,
  },
  previewTitle: {
    marginBottom: theme.spacing.xs,
  },
  questionPreviewText: {
    marginTop: theme.spacing.sm,
    color: theme.colors.textDark,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  sendReplyButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    borderWidth: 2,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  sendReplyButtonPressed: {
    backgroundColor: '#006B50',
    borderColor: theme.colors.accent,
    borderWidth: 2,
    shadowColor: theme.colors.accent,
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 6,
  },
  sendReplyButtonDisabled: {
    backgroundColor: theme.colors.grayMedium,
    borderColor: theme.colors.grayMedium,
    opacity: 0.5,
  },
});

