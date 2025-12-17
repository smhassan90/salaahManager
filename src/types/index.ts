export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  is_active?: boolean;
  is_super_admin?: boolean;
  email_verified?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Masjid {
  id: string;
  name: string;
  location: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  contact_email?: string;
  contact_phone?: string;
  is_active?: boolean;
  isDefault?: boolean;
  created_at?: string;
  updated_at?: string;
  creator?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface PrayerTime {
  id?: string;
  masjid_id?: string;
  prayer_name: string;
  prayer_time: string;
  effective_date?: string;
  created_at?: string;
  updated_at?: string;
  updater?: {
    id: string;
    name: string;
    email: string;
  };
  // Legacy field names for backward compatibility
  name?: string;
  time?: string;
}

export interface Question {
  id: string;
  masjid_id: string;
  user_name: string;
  user_email?: string;
  title: string;
  question: string;
  status: 'new' | 'replied' | 'archived';
  reply?: string;
  replied_at?: string;
  created_at: string;
  updated_at?: string;
  replier?: {
    id: string;
    name: string;
    email: string;
  };
  masjid?: {
    id: string;
    name: string;
    city: string;
    state?: string;
  };
  // Legacy field names for backward compatibility
  masjidId?: string;
  userName?: string;
  date?: string;
}

export interface Notification {
  id: string;
  masjid_id: string;
  title: string;
  description: string;
  category: 'Prayer Times' | 'Donations' | 'Events' | 'General';
  created_at: string;
  updated_at?: string;
  isRead?: boolean; // Track if notification has been read
  creator?: {
    id: string;
    name: string;
    email: string;
  };
  masjid?: {
    id: string;
    name: string;
  };
  // Legacy field names for backward compatibility
  masjidId?: string;
  date?: string;
}

export interface Event {
  id: string;
  masjid_id: string;
  name: string;
  description: string;
  event_date: string; // YYYY-MM-DD
  event_time: string; // HH:MM
  location?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  creator?: {
    id: string;
    name: string;
    email: string;
  };
  masjid?: {
    id: string;
    name: string;
    location?: string;
  };
  // Legacy field names for backward compatibility
  masjidId?: string;
  date?: string;
  time?: string;
}

