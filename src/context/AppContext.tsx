import React, {createContext, useContext, useState, ReactNode} from 'react';
import {User, Masjid, PrayerTime, Question, Notification, Event} from '../types';

interface AppContextType {
  isLoggedIn: boolean;
  user: User | null;
  defaultMasjid: Masjid | null;
  masajids: Masjid[];
  prayerTimes: {[key: string]: PrayerTime[]};
  questions: Question[];
  notifications: Notification[];
  events: Event[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  setDefaultMasjid: (masjidId: string) => void;
  updatePrayerTime: (masjidId: string, prayer: string, time: string) => void;
  replyToQuestion: (questionId: string, reply: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'date'>) => void;
  addEvent: (event: Omit<Event, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const HARDCODED_CREDENTIALS = {
  email: 'imam@salaahmanager.com',
  password: 'admin123',
};

const MOCK_USER: User = {
  name: 'Imam Muhammad',
  email: 'imam@salaahmanager.com',
};

const MOCK_MASAJIDS: Masjid[] = [
  {id: '1', name: 'Masjid Al-Noor', location: 'Block 4, Clifton, Main Khayaban-e-Shahbaz, Near Teen Talwar, Karachi, Sindh, Pakistan', isDefault: true},
  {id: '2', name: 'Central Mosque', location: 'Block 13-D, Gulshan-e-Iqbal, Near Maskan Chowrangi, University Road, Karachi, Sindh, Pakistan', isDefault: false},
  {id: '3', name: 'Community Masjid', location: 'Block 7, Bahadurabad, Near KDA Chowrangi, Shahrah-e-Faisal, Karachi, Sindh, Pakistan', isDefault: false},
];

const MOCK_PRAYER_TIMES: {[key: string]: PrayerTime[]} = {
  '1': [
    {name: 'Fajr', time: '05:30'},
    {name: 'Dhuhr', time: '12:45'},
    {name: 'Asr', time: '15:30'},
    {name: 'Maghrib', time: '18:00'},
    {name: 'Isha', time: '19:30'},
  ],
  '2': [
    {name: 'Fajr', time: '05:35'},
    {name: 'Dhuhr', time: '12:50'},
    {name: 'Asr', time: '15:35'},
    {name: 'Maghrib', time: '18:05'},
    {name: 'Isha', time: '19:35'},
  ],
  '3': [
    {name: 'Fajr', time: '05:25'},
    {name: 'Dhuhr', time: '12:40'},
    {name: 'Asr', time: '15:25'},
    {name: 'Maghrib', time: '17:55'},
    {name: 'Isha', time: '19:25'},
  ],
};

const MOCK_QUESTIONS: Question[] = [
  {
    id: '1',
    masjidId: '1',
    userName: 'Ahmed Ali',
    title: 'Jummah Prayer Timing',
    question: 'What time is Jummah prayer this Friday? I need to plan my schedule accordingly.',
    date: '2025-10-27',
    status: 'new',
  },
  {
    id: '2',
    masjidId: '1',
    userName: 'Fatima Khan',
    title: 'Parking Availability',
    question: 'Is there parking available? I usually come by car with my family.',
    date: '2025-10-26',
    status: 'replied',
    reply: 'Yes, we have parking available behind the masjid.',
  },
  {
    id: '3',
    masjidId: '2',
    userName: 'Hassan Ahmed',
    title: 'Quran Classes for Children',
    question: 'Do you have Quran classes for children? My kids are 7 and 9 years old.',
    date: '2025-10-25',
    status: 'new',
  },
];

export const AppProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [masajids, setMasajids] = useState<Masjid[]>(MOCK_MASAJIDS);
  const [prayerTimes, setPrayerTimes] = useState(MOCK_PRAYER_TIMES);
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  const defaultMasjid = masajids.find(m => m.isDefault) || null;

  const login = (email: string, password: string): boolean => {
    if (
      email === HARDCODED_CREDENTIALS.email &&
      password === HARDCODED_CREDENTIALS.password
    ) {
      setIsLoggedIn(true);
      setUser(MOCK_USER);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const setDefaultMasjid = (masjidId: string) => {
    setMasajids(prev =>
      prev.map(m => ({
        ...m,
        isDefault: m.id === masjidId,
      })),
    );
  };

  const updatePrayerTime = (
    masjidId: string,
    prayer: string,
    time: string,
  ) => {
    setPrayerTimes(prev => ({
      ...prev,
      [masjidId]: prev[masjidId].map(p =>
        p.name === prayer ? {...p, time} : p,
      ),
    }));
  };

  const replyToQuestion = (questionId: string, reply: string) => {
    setQuestions(prev =>
      prev.map(q =>
        q.id === questionId
          ? {...q, status: 'replied' as const, reply}
          : q,
      ),
    );
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'date'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
    };
    setEvents(prev => [newEvent, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        user,
        defaultMasjid,
        masajids,
        prayerTimes,
        questions,
        notifications,
        events,
        login,
        logout,
        setDefaultMasjid,
        updatePrayerTime,
        replyToQuestion,
        addNotification,
        addEvent,
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

