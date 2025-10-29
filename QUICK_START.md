# SalaahManager - Quick Start Guide

## 🚀 Run the App

```bash
# Start Metro bundler
npm start

# In a new terminal, run Android
npm run android

# Or run iOS (macOS only)
npm run ios
```

## 🔐 Login Credentials

```
Email: imam@salaahmanager.com
Password: admin123
```

## 📱 Main Features

### 1. Home Screen
- View all prayer times for default masjid
- Edit prayer times by clicking "Edit" button
- Navigate to Questions screen
- Send notifications to community

### 2. Questions Screen
- View all questions from community
- See question status (New/Replied)
- Reply to new questions

### 3. My Masajids Screen
- View all managed masajids
- Set default masjid by clicking star icon
- Click "Manage" to see masjid details

### 4. Masjid Detail Screen
- View prayer times
- Check questions count
- Send notifications specific to masjid
- Add events

### 5. Profile Screen
- View user information
- Access settings
- Logout

## 🎨 Theme Colors

- Primary: `#007F5F` (Islamic Green)
- Secondary: `#FFD700` (Gold)
- Background: `#FFFFFF`
- Text: `#222222`

## 📂 Key Files

- `App.tsx` - Root component with providers
- `src/context/AppContext.tsx` - Global state management
- `src/navigation/AppNavigator.tsx` - Main navigation
- `src/theme/theme.ts` - Complete design system

## 🛠️ Common Commands

```bash
# Install dependencies
npm install

# Clear cache and restart
npm start -- --reset-cache

# Clean Android build
cd android && ./gradlew clean && cd ..

# Run tests
npm test

# Check linting
npm run lint
```

## 📱 App Navigation Flow

```
Splash Screen (2s)
    ↓
Login Screen (if not logged in)
    ↓
Main App (Bottom Tabs)
    ├── Home
    ├── Questions
    ├── My Masajids
    └── Profile
        ↓
Detail Screens (Stack)
    ├── Masjid Detail
    ├── Send Notification
    └── Add Event
```

## 🐛 Troubleshooting

### Metro bundler issues
```bash
npm start -- --reset-cache
```

### Android build errors
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Missing dependencies
```bash
npm install
cd ios && pod install && cd ..  # macOS only
```

### Port 8081 in use
```bash
# Kill the process using port 8081
# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 8081).OwningProcess | Stop-Process

# Then restart
npm start
```

## 📊 Mock Data

### Masajids
1. Masjid Al-Noor (Default)
2. Central Mosque
3. Community Masjid

### Prayer Times
- Fajr: 05:30
- Dhuhr: 12:45
- Asr: 15:30
- Maghrib: 18:00
- Isha: 19:30

### Sample Questions
- "What time is Jummah?"
- "Is there parking available?"
- "Do you have Quran classes?"

## 🔄 App State

The app uses Context API for state management:

```typescript
{
  isLoggedIn: boolean,
  user: User | null,
  defaultMasjid: Masjid | null,
  masajids: Masjid[],
  prayerTimes: {[masjidId: string]: PrayerTime[]},
  questions: Question[]
}
```

## 📱 Screens Overview

| Screen | Route | Description |
|--------|-------|-------------|
| Splash | `/splash` | Loading screen with auto-navigation |
| Login | `/login` | Authentication screen |
| Home | `/main/home` | Prayer times and quick actions |
| Questions | `/main/questions` | Q&A management |
| My Masajids | `/main/mymasajids` | Masjid list |
| Profile | `/main/profile` | User settings |
| Masjid Detail | `/masjid/:id` | Masjid management |
| Send Notification | `/notification/:id` | Notification composer |
| Add Event | `/event/:id` | Event creation |

## ✅ Testing Checklist

- [ ] Login with demo credentials
- [ ] View prayer times on Home screen
- [ ] Edit a prayer time
- [ ] Navigate to Questions screen
- [ ] Switch between tabs
- [ ] Open masjid detail from My Masajids
- [ ] Change default masjid (star icon)
- [ ] Send a test notification
- [ ] Add a test event
- [ ] View profile
- [ ] Logout

## 🎯 Key Features to Test

1. **Authentication Flow**
   - Login with correct credentials
   - Error message for wrong credentials
   - Logout functionality

2. **Prayer Time Management**
   - View times on home screen
   - Edit modal opens correctly
   - Time updates persist

3. **Masjid Management**
   - View all masajids
   - Set default masjid
   - Navigate to masjid detail

4. **Navigation**
   - Bottom tabs work correctly
   - Back buttons function properly
   - Deep linking to detail screens

## 💡 Tips

- All styling uses the theme system (`src/theme/`)
- All components are in `src/components/`
- Navigation types are in `src/navigation/types.ts`
- Mock data is in `src/context/AppContext.tsx`

## 📞 Need Help?

Check the main README.md for detailed documentation.

