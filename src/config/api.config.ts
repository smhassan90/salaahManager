/**
 * API Configuration
 * Base URL and API version for the SalaahManager API
 */

export const API_CONFIG = {
  BASE_URL: 'https://alasrbackend.vercel.app/api/v1',
  // For Android emulator, use: 'http://10.0.2.2:5001/api/v1'
  // For iOS simulator, use: 'http://localhost:5001/api/v1'
  // For physical device, use your computer's IP: 'http://192.168.x.x:5001/api/v1'
  
  TIMEOUT: 30000, // 30 seconds
  
  // Token storage keys
  ACCESS_TOKEN_KEY: '@salaahmanager:access_token',
  REFRESH_TOKEN_KEY: '@salaahmanager:refresh_token',
  USER_DATA_KEY: '@salaahmanager:user_data',
  DEFAULT_MASJID_KEY: '@salaahmanager:default_masjid',
};

export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
  
  // User & Profile
  MY_PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
  UPLOAD_PROFILE_PICTURE: '/users/profile/picture',
  DELETE_PROFILE_PICTURE: '/users/profile/picture',
  CHANGE_PASSWORD: '/users/change-password',
  USER_SETTINGS: '/users/settings',
  UPDATE_USER_SETTINGS: '/users/settings',
  MY_MASAJIDS: '/users/masajids',
  DELETE_ACCOUNT: '/users/account',
  REGISTER_FCM_TOKEN: '/users/fcm-token',
  
  // Masjid
  MASAJIDS: '/masajids',
  MASJID_BY_ID: (id: string) => `/masajids/${id}`,
  UPDATE_MASJID: (id: string) => `/masajids/${id}`,
  DELETE_MASJID: (id: string) => `/masajids/${id}`,
  SET_DEFAULT_MASJID: (id: string) => `/masajids/${id}/set-default`,
  MASJID_STATISTICS: (id: string) => `/masajids/${id}/statistics`,
  MASJID_MEMBERS: (id: string) => `/masajids/${id}/members`,
  MASJID_IMAMS: (id: string) => `/masajids/${id}/imams`,
  MASJID_ADMINS: (id: string) => `/masajids/${id}/admins`,
  
  // Masjid User Management
  ADD_USER_TO_MASJID: (id: string) => `/masajids/${id}/users`,
  REMOVE_USER_FROM_MASJID: (masjidId: string, userId: string) => `/masajids/${masjidId}/users/${userId}`,
  UPDATE_USER_ROLE: (masjidId: string, userId: string) => `/masajids/${masjidId}/users/${userId}/role`,
  TRANSFER_OWNERSHIP: (id: string) => `/masajids/${id}/transfer-ownership`,
  
  // Prayer Times
  PRAYER_TIMES_TODAY: (masjidId: string) => `/prayer-times/masjid/${masjidId}/today`,
  PRAYER_TIMES_BY_MASJID: (masjidId: string) => `/prayer-times/masjid/${masjidId}`,
  CREATE_PRAYER_TIME: '/prayer-times',
  BULK_UPDATE_PRAYER_TIMES: '/prayer-times/bulk',
  UPDATE_PRAYER_TIME: (id: string) => `/prayer-times/${id}`,
  DELETE_PRAYER_TIME: (id: string) => `/prayer-times/${id}`,
  
  // Questions
  SUBMIT_QUESTION: '/questions',
  ALL_QUESTIONS: '/questions',
  QUESTIONS_BY_MASJID: (masjidId: string) => `/questions/masjid/${masjidId}`,
  QUESTION_BY_ID: (id: string) => `/questions/${id}`,
  REPLY_TO_QUESTION: (questionId: string) => `/questions/${questionId}/reply`,
  UPDATE_QUESTION_STATUS: (questionId: string) => `/questions/${questionId}/status`,
  QUESTION_STATISTICS: (masjidId: string) => `/questions/masjid/${masjidId}/statistics`,
  DELETE_QUESTION: (id: string) => `/questions/${id}`,
  
  // Events
  CREATE_EVENT: '/events',
  EVENTS_BY_MASJID: (masjidId: string) => `/events/masjid/${masjidId}`,
  UPCOMING_EVENTS: (masjidId: string) => `/events/masjid/${masjidId}/upcoming`,
  PAST_EVENTS: (masjidId: string) => `/events/masjid/${masjidId}/past`,
  EVENT_BY_ID: (id: string) => `/events/${id}`,
  UPDATE_EVENT: (eventId: string) => `/events/${eventId}`,
  DELETE_EVENT: (eventId: string) => `/events/${eventId}`,
  
  // Notifications
  CREATE_NOTIFICATION: '/notifications',
  NOTIFICATIONS_BY_MASJID: (masjidId: string) => `/notifications/masjid/${masjidId}`,
  RECENT_NOTIFICATIONS: (masjidId: string) => `/notifications/masjid/${masjidId}/recent`,
  NOTIFICATION_BY_ID: (id: string) => `/notifications/${id}`,
  UPDATE_NOTIFICATION: (notificationId: string) => `/notifications/${notificationId}`,
  DELETE_NOTIFICATION: (notificationId: string) => `/notifications/${notificationId}`,
  
  // Super Admin
  SUPER_ADMIN_USERS: '/super-admin/users',
  SUPER_ADMIN_CREATE_USER: '/super-admin/users',
  SUPER_ADMIN_USER_BY_ID: (userId: string) => `/super-admin/users/${userId}`,
  SUPER_ADMIN_DELETE_USER: (userId: string) => `/super-admin/users/${userId}`,
  PROMOTE_TO_SUPER_ADMIN: (userId: string) => `/super-admin/users/${userId}/promote`,
  DEMOTE_FROM_SUPER_ADMIN: (userId: string) => `/super-admin/users/${userId}/demote`,
  SUPER_ADMIN_LIST: '/super-admin/list',
  ACTIVATE_USER: (userId: string) => `/super-admin/users/${userId}/activate`,
  DEACTIVATE_USER: (userId: string) => `/super-admin/users/${userId}/deactivate`,
  
  // Health Check
  HEALTH_CHECK: '/health',
};

