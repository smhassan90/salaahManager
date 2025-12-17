import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {Alert} from 'react-native';
import {User, Masjid, PrayerTime, Question, Notification, Event} from '../types';
import {
  authService,
  userService,
  masjidService,
  prayerTimeService,
  questionService,
  eventService,
  notificationService,
  getErrorMessage,
} from '../services/api';
import {storage} from '../utils/storage';
import {fcmService} from '../services/fcm/fcmService';
import {i18n, supportedLanguages} from '../i18n';

interface AppContextType {
  // Auth State
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;
  
  // Data State
  defaultMasjid: Masjid | null;
  masajids: Masjid[];
  prayerTimes: {[key: string]: PrayerTime[]};
  prayerTimePermissionError: boolean; // Track if there's a permission error updating prayer times
  questions: Question[];
  questionsPermissionError: boolean; // Track if there's a permission error fetching questions
  notifications: Notification[];
  events: Event[];
  eventPermissionError: boolean; // Track if there's a permission error creating events
  
  // Language State
  currentLanguage: string;
  
  // Auth Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  
  // Data Actions
  fetchUserMasajids: () => Promise<void>;
  setDefaultMasjid: (masjidId: string) => Promise<void>;
  fetchPrayerTimes: (masjidId: string) => Promise<void>;
  updatePrayerTime: (masjidId: string, prayer: string, time: string) => Promise<void>;
  fetchQuestions: (masjidId: string) => Promise<void>;
  replyToQuestion: (questionId: string, reply: string) => Promise<void>;
  fetchNotifications: (masjidId: string) => Promise<void>;
  addNotification: (notification: {masjidId: string; title: string; description?: string; category?: string; excludeCreator?: boolean}, showSuccessAlert?: boolean) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  fetchEvents: (masjidId: string) => Promise<void>;
  addEvent: (event: {masjidId: string; name: string; description?: string; date: string; time: string; location?: string}) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  
  // Language Actions
  changeLanguage: (languageCode: string) => Promise<void>;
  
  // FCM Debug Helpers
  checkFCMToken: () => Promise<void>;
  retryFCMToken: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{children: ReactNode}> = ({children}) => {
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Data State
  const [masajids, setMasajids] = useState<Masjid[]>([]);
  const [prayerTimes, setPrayerTimes] = useState<{[key: string]: PrayerTime[]}>({});
  const [prayerTimePermissionError, setPrayerTimePermissionError] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionsPermissionError, setQuestionsPermissionError] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventPermissionError, setEventPermissionError] = useState<boolean>(false);
  
  // Language State
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');

  const defaultMasjid = masajids.find(m => m.isDefault) || null;

  // Load language preference on mount
  const loadLanguagePreference = async () => {
    try {
      const savedLanguage = await storage.getLanguage();
      if (savedLanguage && supportedLanguages.find(lang => lang.code === savedLanguage)) {
        i18n.changeLanguage(savedLanguage);
        setCurrentLanguage(savedLanguage);
      }
    } catch (error) {
      // Error loading language preference - use default
    }
  };

  // Auto-login: Check for stored token on app start
  useEffect(() => {
    checkAuthStatus();
    loadLanguagePreference();
  }, []);

  // Initialize FCM when user logs in
  useEffect(() => {
    if (isLoggedIn && user) {
      initializeFCM();
    } else if (!isLoggedIn) {
      // Delete FCM token on logout
      fcmService.deleteToken();
    }
  }, [isLoggedIn, user]);

  // Refetch prayer times when defaultMasjid changes
  useEffect(() => {
    if (defaultMasjid && isLoggedIn) {
      fetchPrayerTimes(defaultMasjid.id);
    }
  }, [defaultMasjid?.id, isLoggedIn]);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const token = await storage.getAccessToken();
      const storedUser = await storage.getUserData();
      
      if (token && storedUser) {
        setIsLoggedIn(true);
        setUser(storedUser);
        
        // Fetch user's masajids
        await fetchUserMasajids();
      }
    } catch (error) {
      // Auth check error - user will need to login
    } finally {
      setIsLoading(false);
    }
  };

  // ============ AUTH ACTIONS ============
  
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login({email, password});
      setIsLoggedIn(true);
      setUser(response.data.user);
      
      // Fetch user's masajids
      await fetchUserMasajids();
      
      return true;
    } catch (error) {
      Alert.alert('Login Failed', getErrorMessage(error));
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Delete FCM token before logout
      await fcmService.deleteToken();
      
      await authService.logout();
      setIsLoggedIn(false);
      setUser(null);
      setMasajids([]);
      setPrayerTimes({});
      setPrayerTimePermissionError(false);
      setQuestions([]);
      setQuestionsPermissionError(false);
      setNotifications([]);
      setEvents([]);
      setEventPermissionError(false);
    } catch (error) {
      // Logout error - continue with local logout
    }
  };

  // Initialize FCM and register token
  const initializeFCM = async (): Promise<void> => {
    try {
      const token = await fcmService.initialize();
      if (token) {
        // Register token with backend
        try {
          await userService.registerFCMToken(token);
        } catch (error: any) {
          // Silently handle FCM registration errors - token is stored locally
          // Will retry on next app launch or when user logs in
        }
      }
    } catch (error) {
      // FCM initialization failed - non-critical, app can continue
    }
  };

  // Check stored FCM token
  const checkFCMToken = async (): Promise<void> => {
    // Production: Removed debug logging
  };

  // Manually retry FCM token retrieval
  const retryFCMToken = async (): Promise<void> => {
    if (!isLoggedIn) {
      return;
    }
    await initializeFCM();
  };

  // ============ MASJID ACTIONS ============
  
  const fetchUserMasajids = async (): Promise<void> => {
    try {
      const response = await userService.getMyMasajids();
      
      // Map masajids
      let userMasajids: Masjid[] = response.data.map(um => ({
        id: um.masjidId,
        name: um.name,
        location: um.location,
        city: um.city,
        isDefault: um.isDefault,
      }));
      
      // If no default masjid is set, set the first one as default
      const hasDefault = userMasajids.some(m => m.isDefault);
      if (!hasDefault && userMasajids.length > 0) {
        // Set first masjid as default
        const firstMasjidId = userMasajids[0].id;
        
        try {
          // Update on backend
          await masjidService.setDefaultMasjid(firstMasjidId);
          
          // Update local state
          userMasajids = userMasajids.map(m => ({
            ...m,
            isDefault: m.id === firstMasjidId,
          }));
        } catch (error) {
          Alert.alert('Error', getErrorMessage(error));
          // Continue anyway - update local state
          userMasajids = userMasajids.map(m => ({
            ...m,
            isDefault: m.id === firstMasjidId,
          }));
        }
      }
      
      setMasajids(userMasajids);
      
      // Fetch data for default masjid
      const defaultMasjidData = userMasajids.find(m => m.isDefault);
      if (defaultMasjidData) {
        await Promise.all([
          fetchPrayerTimes(defaultMasjidData.id),
          fetchQuestions(defaultMasjidData.id),
          fetchNotifications(defaultMasjidData.id),
          fetchEvents(defaultMasjidData.id),
        ]);
      }
    } catch (error) {
      Alert.alert('Error', getErrorMessage(error));
      Alert.alert('Error', 'Failed to fetch masajids');
    }
  };

  const setDefaultMasjid = async (masjidId: string): Promise<void> => {
    try {
      // Update local state immediately for better UX
      setMasajids(prev =>
        prev.map(m => ({
          ...m,
          isDefault: m.id === masjidId,
        })),
      );
      
      // Update on backend
      await masjidService.setDefaultMasjid(masjidId);
      
      // Fetch data for new default masjid
      await Promise.all([
        fetchPrayerTimes(masjidId),
        fetchQuestions(masjidId),
        fetchNotifications(masjidId),
        fetchEvents(masjidId),
      ]);
      
      Alert.alert('Success', 'Default masjid updated successfully');
    } catch (error) {
      // Revert local state on error
      setMasajids(prev => {
        const defaultMasjid = prev.find(m => m.isDefault);
        if (defaultMasjid) {
          return prev.map(m => ({
            ...m,
            isDefault: m.id === defaultMasjid.id,
          }));
        }
        return prev;
      });
      Alert.alert('Error', getErrorMessage(error));
    }
  };

  // ============ PRAYER TIME ACTIONS ============
  
  const fetchPrayerTimes = async (masjidId: string): Promise<void> => {
    try {
      const response = await prayerTimeService.getTodaysPrayerTimes(masjidId);
      
      // Map API response to app format
      const times: PrayerTime[] = response.data.map(pt => {
        // Handle both API formats: prayer_name/prayer_time or name/time
        const prayerName = pt.prayer_name || pt.name || '';
        const prayerTime = pt.prayer_time || pt.time || '';
        const timeStr = prayerTime.length >= 5 ? prayerTime.substring(0, 5) : prayerTime;
        
        return {
          id: pt.id,
          masjid_id: pt.masjid_id || masjidId,
          prayer_name: prayerName,
          prayer_time: timeStr,
          effective_date: pt.effective_date,
          name: prayerName, // Legacy format
          time: timeStr, // Legacy format
        } as PrayerTime;
      });
      
      // Ensure all required prayers are present, including Jummah
      const requiredPrayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Jummah'];
      const existingPrayerNames = times.map(t => (t.prayer_name || t.name || '').toLowerCase());
      
      // Add missing prayers with default time
      requiredPrayers.forEach(prayerName => {
        const exists = existingPrayerNames.includes(prayerName.toLowerCase()) || 
                       existingPrayerNames.includes('jumma') && prayerName === 'Jummah'; // Handle both spellings
        if (!exists && prayerName === 'Jummah') {
          // Check if 'Jumma' exists (single 'm') and replace it with 'Jummah'
          const jummaIndex = existingPrayerNames.indexOf('jumma');
          if (jummaIndex !== -1) {
            times[jummaIndex].prayer_name = 'Jummah';
            times[jummaIndex].name = 'Jummah';
          } else {
            times.push({
              prayer_name: prayerName,
              prayer_time: '--:--',
              masjid_id: masjidId,
              name: prayerName, // Legacy format
              time: '--:--', // Legacy format
            } as PrayerTime);
          }
        } else if (!exists) {
          times.push({
            prayer_name: prayerName,
            prayer_time: '--:--',
            masjid_id: masjidId,
            name: prayerName, // Legacy format
            time: '--:--', // Legacy format
          } as PrayerTime);
        }
      });
      
      // Sort prayers in the correct order
      const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Jummah'];
      times.sort((a, b) => {
        const nameA = (a.prayer_name || a.name || '').toLowerCase();
        const nameB = (b.prayer_name || b.name || '').toLowerCase();
        const indexA = prayerOrder.findIndex(p => p.toLowerCase() === nameA);
        const indexB = prayerOrder.findIndex(p => p.toLowerCase() === nameB);
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
      });
      
      setPrayerTimes(prev => ({...prev, [masjidId]: times}));
    } catch (error) {
      Alert.alert('Error', getErrorMessage(error));
      // Set empty prayer times on error so UI still renders
      const defaultPrayers: PrayerTime[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Jummah'].map(name => ({
        prayer_name: name,
        prayer_time: '--:--',
        name, // Legacy format
        time: '--:--', // Legacy format
      } as PrayerTime));
      setPrayerTimes(prev => ({...prev, [masjidId]: defaultPrayers}));
    }
  };

  const updatePrayerTime = async (
    masjidId: string,
    prayer: string,
    time: string,
  ): Promise<void> => {
    try {
      // Reset permission error state
      setPrayerTimePermissionError(false);
      
      // Validate time format (HH:MM)
      const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(time)) {
        Alert.alert('Invalid Time', 'Please enter time in HH:MM format (e.g., 05:30)');
        return;
      }

      // Get current prayer times for this masjid
      const currentTimes = prayerTimes[masjidId] || [];
      
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      // Get the prayer name in the correct format (capitalize first letter)
      const prayerName = (() => {
        const found = currentTimes.find(pt => 
          (pt.name === prayer) || (pt.prayer_name === prayer) ||
          (pt.name?.toLowerCase() === prayer.toLowerCase()) || 
          (pt.prayer_name?.toLowerCase() === prayer.toLowerCase())
        );
        return (found?.prayer_name || found?.name || prayer) as 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha' | 'Jummah';
      })();

      // Validate prayer name - normalize to proper case and handle Jumma/Jummah variations
      const validPrayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Jummah'];
      let normalizedPrayerName = validPrayers.find(p => 
        p.toLowerCase() === prayerName.toLowerCase()
      );
      
      // Handle Jumma (single 'm') -> Jummah (double 'm') conversion
      if (!normalizedPrayerName && (prayerName.toLowerCase() === 'jumma')) {
        normalizedPrayerName = 'Jummah';
      }
      
      if (!normalizedPrayerName) {
        Alert.alert('Invalid Prayer', `Invalid prayer name: ${prayerName}. Must be one of: ${validPrayers.join(', ')}`);
        return;
      }

      // Use single prayer time update endpoint (simpler and more reliable)
      await prayerTimeService.createOrUpdatePrayerTime({
        masjidId,
        prayerName: normalizedPrayerName as 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha' | 'Jummah',
        prayerTime: time,
        effectiveDate: today,
      });
      
      // Update local state
      setPrayerTimes(prev => ({
        ...prev,
        [masjidId]: prev[masjidId].map(p => {
          const isMatch = 
            (p.name === prayer) || (p.prayer_name === prayer) ||
            (p.name?.toLowerCase() === prayer.toLowerCase()) || 
            (p.prayer_name?.toLowerCase() === prayer.toLowerCase());
          return isMatch ? {
            ...p,
            prayer_name: normalizedPrayerName,
            prayer_time: time,
            name: normalizedPrayerName, // Legacy format
            time, // Legacy format
          } : p;
        }),
      }));
      
      // Success - no dialog box needed, UI will update automatically
    } catch (error: any) {
      // Check if it's a permission error (403 or permission-related message)
      const status = error?.response?.status;
      const errorMessage = error?.response?.data?.message || error?.message || '';
      const isPermissionError = 
        status === 403 || 
        errorMessage.toLowerCase().includes('permission') ||
        errorMessage.toLowerCase().includes('not authorized') ||
        errorMessage.toLowerCase().includes('forbidden') ||
        errorMessage.toLowerCase().includes('can_change_prayer_times');
      
      if (isPermissionError) {
        // Permission errors are expected - set state to show message on screen
        setPrayerTimePermissionError(true);
        // Message will remain on screen until user successfully updates a prayer time or logs out
      } else {
        // For other errors, show error alert
        Alert.alert('Error', getErrorMessage(error));
      }
    }
  };

  // ============ QUESTION ACTIONS ============
  
  const fetchQuestions = async (masjidId: string): Promise<void> => {
    try {
      // Reset permission error state
      setQuestionsPermissionError(false);
      
      const response = await questionService.getQuestionsByMasjid(masjidId);
      const qs: Question[] = response.data.map(q => ({
        id: q.id,
        masjid_id: q.masjid_id,
        user_name: q.user_name,
        title: q.title,
        question: q.question,
        created_at: q.created_at,
        status: q.status,
        reply: q.reply,
        // Legacy format
        masjidId: q.masjid_id,
        userName: q.user_name,
        date: q.created_at.split('T')[0],
      }));
      setQuestions(qs);
    } catch (error: any) {
      // Check if it's a permission error (403 or permission-related message)
      const status = error?.response?.status;
      const errorMessage = error?.response?.data?.message || error?.message || '';
      const isPermissionError = 
        status === 403 || 
        errorMessage.toLowerCase().includes('permission') ||
        errorMessage.toLowerCase().includes('not authorized') ||
        errorMessage.toLowerCase().includes('forbidden');
      
      if (isPermissionError) {
        // Permission errors are expected - set state to show message on screen
        setQuestionsPermissionError(true);
        setQuestions([]); // Clear questions on permission error
      } else {
        // For other errors, show error alert
        setQuestionsPermissionError(false);
        Alert.alert('Error', getErrorMessage(error));
      }
    }
  };

  const replyToQuestion = async (questionId: string, reply: string): Promise<void> => {
    try {
      // Find the question to get its masjid_id
      const question = questions.find(q => q.id === questionId);
      if (!question) {
        Alert.alert('Error', 'Question not found');
        return;
      }

      // Ensure reply is trimmed and not empty
      const trimmedReply = reply.trim();
      if (!trimmedReply) {
        Alert.alert('Error', 'Reply cannot be empty');
        return;
      }

      const response = await questionService.replyToQuestion(questionId, {reply: trimmedReply});
      
      // Update local state
      setQuestions(prev =>
        prev.map(q =>
          q.id === questionId
            ? {...q, status: 'replied' as const, reply}
            : q,
        ),
      );
      
      // Success - no dialog box needed, UI will update automatically
    } catch (error: any) {
      // Extract detailed error message
      let errorMessage = getErrorMessage(error);
      
      // For 400 errors, show more details from the backend
      if (error?.response?.status === 400) {
        const errorData = error?.response?.data;
        
        // Try to extract the most helpful error message
        if (errorData?.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          const validationErrors = errorData.errors
            .map((e: any) => {
              if (typeof e === 'string') return e;
              return `${e.field || e.path || 'Field'}: ${e.message || e.msg || e}`;
            })
            .join('\n');
          errorMessage = `Validation Errors:\n${validationErrors}`;
        } else if (errorData?.message) {
          errorMessage = `Validation Failed: ${errorData.message}`;
        } else if (errorData?.error) {
          errorMessage = `Validation Failed: ${errorData.error}`;
        } else if (typeof errorData === 'string') {
          errorMessage = `Validation Failed: ${errorData}`;
        } else {
          // Show full error data for debugging
          const fullErrorData = JSON.stringify(errorData, null, 2);
          errorMessage = `Validation Failed\n\nFull Error Response:\n${fullErrorData}\n\nPlease check console for more details.`;
        }
      }
      
      // If it's a permission error, provide more context
      if (error?.response?.status === 403 || errorMessage.toLowerCase().includes('permission')) {
        errorMessage = `Permission denied: ${errorMessage}\n\nPlease ensure you have the "can_answer_questions" permission for this masjid.`;
      }
      
      Alert.alert('Error', errorMessage);
    }
  };

  // ============ NOTIFICATION ACTIONS ============
  
  const fetchNotifications = async (masjidId: string): Promise<void> => {
    try {
      const response = await notificationService.getRecentNotifications(masjidId);
      const readIds = await storage.getReadNotifications();
      
      // Helper function to format date as dd-mm-yyyy
      const formatDate = (dateString: string): string => {
        try {
          const date = new Date(dateString);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          return `${day}-${month}-${year}`;
        } catch {
          // Fallback: try to parse YYYY-MM-DD format
          const parts = dateString.split('T')[0].split('-');
          if (parts.length === 3) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
          }
          return dateString;
        }
      };
      
      const notifs: Notification[] = response.data.map(n => {
        const createdAt = n.created_at || new Date().toISOString();
        return {
          id: n.id,
          masjid_id: n.masjid_id || masjidId,
          title: n.title,
          description: n.description || '',
          category: (n.category || 'General') as 'Prayer Times' | 'Donations' | 'Events' | 'General',
          created_at: createdAt,
          isRead: readIds.includes(n.id), // Mark as read if in storage
          // Legacy format
          masjidId: n.masjid_id || masjidId,
          date: formatDate(createdAt),
        };
      });
      setNotifications(notifs);
    } catch (error) {
      Alert.alert('Error', getErrorMessage(error));
      setNotifications([]);
    }
  };

  const addNotification = async (notification: {
    masjidId: string;
    title: string;
    description?: string;
    category?: string;
    excludeCreator?: boolean; // If true, the creator won't receive the notification
  }, showSuccessAlert: boolean = true): Promise<void> => {
    try {
      const response = await notificationService.createNotification({
        ...notification,
        excludeCreator: notification.excludeCreator ?? false,
      });
      
      // Helper function to format date as dd-mm-yyyy
      const formatDate = (dateString: string): string => {
        try {
          const date = new Date(dateString);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          return `${day}-${month}-${year}`;
        } catch {
          // Fallback: try to parse YYYY-MM-DD format
          const parts = dateString.split('T')[0].split('-');
          if (parts.length === 3) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
          }
          return dateString;
        }
      };
      
      const newNotif: Notification = {
        id: response.data.id,
        masjid_id: response.data.masjid_id || notification.masjidId,
        title: response.data.title,
        description: response.data.description || '',
        category: (response.data.category || 'General') as 'Prayer Times' | 'Donations' | 'Events' | 'General',
        created_at: response.data.created_at,
        isRead: false, // New notifications are unread
        // Legacy format
        masjidId: response.data.masjid_id || notification.masjidId,
        date: formatDate(response.data.created_at),
      };
      
      setNotifications(prev => [newNotif, ...prev]);
      
      if (showSuccessAlert) {
        Alert.alert('Success', 'Notification sent successfully');
      }
    } catch (error) {
      Alert.alert('Error', getErrorMessage(error));
      // Re-throw error so caller can handle it
      throw error;
    }
  };

  const markNotificationAsRead = async (notificationId: string): Promise<void> => {
    try {
      await storage.markNotificationAsRead(notificationId);
      
      // Update local state
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? {...n, isRead: true} : n)),
      );
    } catch (error) {
      // Error marking notification as read - non-critical
    }
  };

  const markAllNotificationsAsRead = async (): Promise<void> => {
    try {
      const allIds = notifications.map(n => n.id);
      await storage.setReadNotifications(allIds);
      
      // Update local state
      setNotifications(prev => prev.map(n => ({...n, isRead: true})));
    } catch (error) {
      // Error marking all notifications as read - non-critical
    }
  };

  // ============ EVENT ACTIONS ============
  
  const fetchEvents = async (masjidId: string): Promise<void> => {
    try {
      const response = await eventService.getUpcomingEvents(masjidId);
      const evs: Event[] = response.data.map(e => ({
        id: e.id,
        masjid_id: e.masjid_id || masjidId,
        name: e.name,
        description: e.description || '',
        event_date: e.event_date,
        event_time: e.event_time || '',
        location: e.location,
        // Legacy format
        masjidId: e.masjid_id || masjidId,
        date: e.event_date,
        time: e.event_time ? e.event_time.substring(0, 5) : '', // HH:MM:SS -> HH:MM
      }));
      setEvents(evs);
    } catch (error) {
      Alert.alert('Error', getErrorMessage(error));
      setEvents([]);
    }
  };

  const addEvent = async (event: {
    masjidId: string;
    name: string;
    description?: string;
    date: string;
    time: string;
    location?: string;
  }): Promise<void> => {
    try {
      // Reset permission error state
      setEventPermissionError(false);
      
      // Convert date from DD-MM-YYYY to YYYY-MM-DD format
      const convertDateFormat = (dateStr: string): string => {
        try {
          // Check if already in YYYY-MM-DD format
          if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            return dateStr;
          }
          // Convert from DD-MM-YYYY to YYYY-MM-DD
          const parts = dateStr.split('-');
          if (parts.length === 3) {
            const [day, month, year] = parts;
            return `${year}-${month}-${day}`;
          }
          return dateStr;
        } catch {
          return dateStr;
        }
      };
      
      const response = await eventService.createEvent({
        masjidId: event.masjidId,
        name: event.name,
        description: event.description,
        eventDate: convertDateFormat(event.date),
        eventTime: event.time,
        location: event.location,
      });
      
      const newEvent: Event = {
        id: response.data.id,
        masjid_id: response.data.masjid_id || event.masjidId,
        name: response.data.name,
        description: response.data.description || '',
        event_date: response.data.event_date,
        event_time: response.data.event_time,
        location: response.data.location,
        // Legacy format
        masjidId: response.data.masjid_id || event.masjidId,
        date: response.data.event_date,
        time: response.data.event_time.substring(0, 5),
      };
      
      setEvents(prev => [newEvent, ...prev]);
      // Success - no dialog box needed, UI will update automatically
    } catch (error: any) {
      // Check if it's a permission error (403 or permission-related message)
      const status = error?.response?.status;
      const errorMessage = error?.response?.data?.message || error?.message || '';
      const isPermissionError = 
        status === 403 || 
        errorMessage.toLowerCase().includes('permission') ||
        errorMessage.toLowerCase().includes('not authorized') ||
        errorMessage.toLowerCase().includes('forbidden') ||
        errorMessage.toLowerCase().includes('can_create_events');
      
      if (isPermissionError) {
        // Permission errors are expected - set state to show message on screen
        setEventPermissionError(true);
        // Message will remain on screen until user successfully creates an event or logs out
      } else {
        // For other errors, show error alert
        Alert.alert('Error', getErrorMessage(error));
      }
    }
  };

  const deleteEvent = async (eventId: string): Promise<void> => {
    try {
      await eventService.deleteEvent(eventId);
      
      // Update local state - remove deleted event
      setEvents(prev => prev.filter(e => e.id !== eventId));
      
      Alert.alert('Success', 'Event deleted successfully');
    } catch (error) {
      Alert.alert('Error', getErrorMessage(error));
    }
  };

  // ============ LANGUAGE ACTIONS ============
  
  const changeLanguage = async (languageCode: string): Promise<void> => {
    try {
      // Validate language code
      if (!supportedLanguages.find(lang => lang.code === languageCode)) {
        Alert.alert('Error', 'Invalid language code');
        return;
      }
      
      // Change i18n language
      await i18n.changeLanguage(languageCode);
      
      // Save to storage
      await storage.setLanguage(languageCode);
      
      // Update state
      setCurrentLanguage(languageCode);
    } catch (error) {
      Alert.alert('Error', getErrorMessage(error));
      Alert.alert('Error', 'Failed to change language');
    }
  };

  return (
    <AppContext.Provider
      value={{
        // Auth State
        isLoggedIn,
        user,
        isLoading,
        
        // Data State
        defaultMasjid,
        masajids,
        prayerTimes,
        prayerTimePermissionError,
        questions,
        questionsPermissionError,
        notifications,
        events,
        eventPermissionError,
        
        // Language State
        currentLanguage,
        
        // Auth Actions
        login,
        logout,
        
        // Data Actions
        fetchUserMasajids,
        setDefaultMasjid,
        fetchPrayerTimes,
        updatePrayerTime,
        fetchQuestions,
        replyToQuestion,
        fetchNotifications,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        fetchEvents,
        addEvent,
        deleteEvent,
        
        // Language Actions
        changeLanguage,
        
        // FCM Debug Helpers (exposed for debugging)
        checkFCMToken,
        retryFCMToken,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

