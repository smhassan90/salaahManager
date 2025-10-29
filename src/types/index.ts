export interface User {
  name: string;
  email: string;
}

export interface Masjid {
  id: string;
  name: string;
  location: string;
  isDefault: boolean;
}

export interface PrayerTime {
  name: string;
  time: string;
}

export interface Question {
  id: string;
  masjidId: string;
  userName: string;
  title: string;
  question: string;
  date: string;
  status: 'new' | 'replied';
  reply?: string;
}

export interface Notification {
  id: string;
  masjidId: string;
  title: string;
  description: string;
  category: string;
  date: string;
}

export interface Event {
  id: string;
  masjidId: string;
  name: string;
  date: string;
  time: string;
  description: string;
}

