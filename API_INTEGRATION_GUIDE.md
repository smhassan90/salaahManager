# 📱 SalaahManager - API Integration Guide

## ✅ Integration Status

The SalaahManager mobile app has been fully integrated with the backend REST API. All screens now use real API calls instead of mock data.

---

## 🔧 Configuration

### 1. Update API Base URL

Open `src/config/api.config.ts` and update the `BASE_URL` based on your environment:

```typescript
export const API_CONFIG = {
  // For Android Emulator:
  BASE_URL: 'http://10.0.2.2:5001/api/v1',
  
  // For iOS Simulator:
  // BASE_URL: 'http://localhost:5001/api/v1',
  
  // For Physical Device (replace with your computer's IP):
  // BASE_URL: 'http://192.168.x.x:5001/api/v1',
  
  // For Production:
  // BASE_URL: 'https://your-api-domain.com/api/v1',
};
```

### 2. Install Dependencies

All required packages have been installed:
- `axios` - HTTP client
- `@react-native-async-storage/async-storage` - Token storage

---

## 🏗️ Architecture

### Service Layer Structure

```
src/
├── config/
│   └── api.config.ts          # API configuration and endpoints
├── services/
│   └── api/
│       ├── apiClient.ts       # Axios instance with interceptors
│       ├── authService.ts     # Authentication endpoints
│       ├── userService.ts     # User profile endpoints
│       ├── masjidService.ts   # Masjid management endpoints
│       ├── prayerTimeService.ts # Prayer times endpoints
│       ├── questionService.ts # Questions endpoints
│       ├── eventService.ts    # Events endpoints
│       ├── notificationService.ts # Notifications endpoints
│       └── index.ts           # Exports all services
├── utils/
│   └── storage.ts             # AsyncStorage wrapper for tokens
└── context/
    └── AppContext.tsx         # Global state with API integration
```

---

## 🔐 Authentication Flow

### 1. Auto-Login

The app automatically checks for stored tokens on startup:
- Reads `accessToken` and `userData` from AsyncStorage
- If found, sets user as logged in and fetches data
- If not found, shows login screen

### 2. Login Process

```typescript
// User enters credentials → API call → Store tokens → Fetch user data
const login = async (email, password) => {
  const response = await authService.login({email, password});
  // Tokens automatically stored by authService
  // User data stored in AsyncStorage
  await fetchUserMasajids(); // Fetch user's masajids
  return true;
};
```

### 3. Token Refresh

Axios interceptor automatically handles token refresh:
- Detects 401 errors
- Calls refresh token endpoint
- Retries original request with new token
- If refresh fails, logs user out

### 4. Logout

```typescript
const logout = async () => {
  await authService.logout(); // Call API
  await storage.clearAll();   // Clear local data
  // Redirect to login screen
};
```

---

## 📊 Data Flow

### Home Screen Example

```typescript
// On component mount or when default masjid changes:
1. fetchPrayerTimes(masjidId)
   ↓
2. API: GET /prayer-times/masjid/{id}/today
   ↓
3. Update local state
   ↓
4. UI re-renders with new data

// When user updates prayer time:
1. updatePrayerTime(masjidId, prayer, time)
   ↓
2. API: POST /prayer-times/bulk
   ↓
3. Update local state (optimistic update)
   ↓
4. Show success message
```

### Context Pattern

All data fetching is centralized in `AppContext`:
- Screens call context methods
- Context methods call API services
- Context updates state
- Screens automatically re-render

---

## 🔄 API Services Usage

### Authentication

```typescript
import {authService} from '../services/api';

// Login
const response = await authService.login({email, password});

// Logout
await authService.logout();

// Check if authenticated
const isAuth = await authService.isAuthenticated();
```

### User Profile

```typescript
import {userService} from '../services/api';

// Get profile
const response = await userService.getProfile();

// Update profile
await userService.updateProfile({name: 'New Name'});

// Upload profile picture
await userService.uploadProfilePicture(imageUri);

// Get user's masajids
const masajids = await userService.getMyMasajids();
```

### Prayer Times

```typescript
import {prayerTimeService} from '../services/api';

// Get today's prayer times (PUBLIC)
const times = await prayerTimeService.getTodaysPrayerTimes(masjidId);

// Bulk update prayer times (Requires permission)
await prayerTimeService.bulkUpdatePrayerTimes({
  masjidId,
  effectiveDate: '2025-10-29',
  prayerTimes: [
    {prayerName: 'Fajr', prayerTime: '05:30'},
    // ... other prayers
  ],
});
```

### Questions

```typescript
import {questionService} from '../services/api';

// Get questions by masjid
const questions = await questionService.getQuestionsByMasjid(masjidId);

// Reply to question
await questionService.replyToQuestion(questionId, {reply: 'Answer here'});
```

### Events

```typescript
import {eventService} from '../services/api';

// Get upcoming events
const events = await eventService.getUpcomingEvents(masjidId);

// Create event
await eventService.createEvent({
  masjidId,
  name: 'Study Circle',
  eventDate: '2025-11-15',
  eventTime: '19:00',
  description: 'Weekly study circle',
});
```

### Notifications

```typescript
import {notificationService} from '../services/api';

// Get recent notifications
const notifications = await notificationService.getRecentNotifications(masjidId);

// Create notification
await notificationService.createNotification({
  masjidId,
  title: 'Important Announcement',
  description: 'Description here',
  category: 'General',
});
```

---

## 🛡️ Error Handling

### Centralized Error Handling

All API errors are handled consistently:

```typescript
try {
  await apiService.someMethod();
} catch (error) {
  Alert.alert('Error', getErrorMessage(error));
}
```

### Error Types

1. **Network Errors** - No internet connection
2. **401 Unauthorized** - Token expired (auto-refreshed)
3. **403 Forbidden** - No permission
4. **404 Not Found** - Resource doesn't exist
5. **500 Server Error** - Backend issue

---

## 🔒 Permissions System

The app respects backend permissions:

- `can_view_questions`
- `can_answer_questions`
- `can_change_prayer_times`
- `can_create_events`
- `can_create_notifications`

Permissions are checked on the backend. The frontend shows/hides UI elements based on user role.

---

## ⚡ Performance Optimizations

### 1. Token Storage
- Tokens stored in AsyncStorage
- No need to re-authenticate on app restart

### 2. Optimistic Updates
- UI updates immediately
- API call happens in background
- Better user experience

### 3. Data Caching
- Data stored in context
- Reduces unnecessary API calls
- Manual refresh available

---

## 🧪 Testing the Integration

### 1. Test Authentication
```bash
# Start backend server
cd backend
npm run dev

# The backend should be running on http://localhost:5001
```

### 2. Update API URL in `api.config.ts`
- Use appropriate URL for your device/emulator

### 3. Test Login
- Use credentials from backend
- Check if tokens are stored (AsyncStorage)
- Verify data is fetched after login

### 4. Test Features
- Update prayer times
- Reply to questions
- Create events
- Send notifications
- Upload profile picture

---

## 🐛 Troubleshooting

### Connection Refused Error

**Problem**: `Network Error` or `Connection refused`

**Solution**:
- Check API_CONFIG.BASE_URL
- For Android Emulator, use `10.0.2.2` instead of `localhost`
- For physical device, use your computer's IP address
- Ensure backend is running

### Token Expired

**Problem**: User keeps getting logged out

**Solution**:
- Check token expiry in backend
- Verify refresh token logic works
- Clear AsyncStorage and try fresh login

### Image Upload Fails

**Problem**: Profile picture upload fails

**Solution**:
- Check Android permissions in `AndroidManifest.xml`
- Ensure backend accepts `multipart/form-data`
- Check file size limits

### Data Not Updating

**Problem**: UI doesn't show latest data

**Solution**:
- Check if API call is successful (console logs)
- Verify state update in context
- Try manual refresh

---

## 📝 Next Steps

### Backend Integration Checklist

- [ ] Set up MySQL database
- [ ] Deploy backend API
- [ ] Update `API_CONFIG.BASE_URL` to production URL
- [ ] Test all endpoints
- [ ] Set up proper authentication
- [ ] Configure file uploads (profile pictures)
- [ ] Set up email notifications (optional)

### Optional Enhancements

- [ ] Add pull-to-refresh on all screens
- [ ] Add pagination for large lists
- [ ] Implement offline mode
- [ ] Add push notifications
- [ ] Add image caching
- [ ] Add analytics

---

## 📚 API Documentation

Full API documentation is available in the main project documentation file.

Base URL: `http://localhost:5001/api/v1`

All endpoints require JWT Bearer token except:
- `POST /auth/register`
- `POST /auth/login`
- `GET /prayer-times/masjid/:id/today`
- `GET /events/masjid/:id/upcoming`
- `GET /notifications/masjid/:id/recent`
- `POST /questions` (submit question)

### FCM Token Registration Endpoint

**Endpoint:** `POST /api/v1/users/fcm-token`

**Description:** Registers or updates the FCM (Firebase Cloud Messaging) token for push notifications.

**Request:**
- **Method:** POST
- **Headers:** 
  - `Authorization: Bearer <access_token>` (required)
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "fcm_token": "your-fcm-token-here"
  }
  ```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "FCM token registered successfully",
  "data": null
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Unauthorized",
  "data": null
}
```

**Backend Implementation Requirements:**
1. Extract user ID from JWT token (Authorization header)
2. Validate the FCM token format
3. Save/update the FCM token in the user record in the database
4. Associate the token with the authenticated user
5. If token already exists for the user, update it (upsert operation)
6. Return success response

**Database Schema Suggestion:**
- Add `fcm_token` field to users table (VARCHAR/TEXT, nullable)
- Optionally add `fcm_token_updated_at` timestamp field

---

## ✅ Integration Complete!

All screens are now connected to the backend API:
- ✅ LoginScreen - Authentication
- ✅ HomeScreen - Prayer times, events, notifications
- ✅ QuestionsScreen - View and reply to questions
- ✅ ProfileScreen - User profile management
- ✅ MyMasajidsScreen - View and manage masajids
- ✅ Auto-login on app start
- ✅ Token refresh on expiry
- ✅ Centralized error handling

🎉 The app is ready to connect to your backend!



