# SalaahManager - Imam Prayer Management App

A comprehensive React Native application designed for imams to manage their mosques efficiently. Built with TypeScript, React Navigation, and a custom design system.

## 🌟 Features

### Authentication
- Secure login system for imams
- Demo credentials provided for testing
- Automatic session management

### Prayer Time Management
- View and edit prayer times for all 5 daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha)
- Real-time updates across the app
- Separate prayer times for each masjid

### Multi-Masjid Management
- Manage multiple mosques from a single account
- Set default masjid for quick access
- View masjid details and locations

### Question & Answer System
- View questions from community members
- Track question status (New/Replied)
- Respond to inquiries directly

### Notification System
- Send notifications to masjid members
- Multiple categories (Namaz Timing, Donation, Events)
- Custom title and message support

### Event Management
- Add and manage masjid events
- Include event date, time, and description
- Keep community informed about upcoming activities

### User Profile
- View personal information
- Access settings and preferences
- Quick logout functionality

## 📱 Screenshots

The app includes:
- **Splash Screen**: Beautiful loading screen with branding
- **Login Screen**: Clean authentication interface
- **Home Screen**: Prayer times overview with edit functionality
- **Questions Screen**: Community Q&A management
- **My Masajids Screen**: Masjid list with default selection
- **Masjid Detail Screen**: Comprehensive masjid management
- **Send Notification Screen**: Notification composer
- **Add Event Screen**: Event creation form
- **Profile Screen**: User information and settings

## 🛠️ Technology Stack

### Core Technologies
- **React Native**: 0.82.1
- **React**: 19.1.1
- **TypeScript**: 5.8.3

### Navigation
- **@react-navigation/native**: 6.1.6
- **@react-navigation/bottom-tabs**: 6.5.7
- **@react-navigation/stack**: 6.3.16
- **react-native-gesture-handler**: Latest
- **react-native-screens**: Latest

### UI Components
- **react-native-safe-area-context**: 5.5.2
- **@react-native-picker/picker**: Latest

## 📂 Project Structure

```
salaahManager/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AppText.tsx
│   │   ├── AppButton.tsx
│   │   ├── AppCard.tsx
│   │   ├── AppHeader.tsx
│   │   ├── AppTextInput.tsx
│   │   └── index.ts
│   ├── context/            # State management
│   │   ├── AppContext.tsx
│   │   └── index.ts
│   ├── navigation/         # Navigation setup
│   │   ├── AppNavigator.tsx
│   │   ├── BottomTabNavigator.tsx
│   │   ├── types.ts
│   │   └── index.ts
│   ├── screens/           # App screens
│   │   ├── SplashScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── QuestionsScreen.tsx
│   │   ├── MyMasajidsScreen.tsx
│   │   ├── MasjidDetailScreen.tsx
│   │   ├── SendNotificationScreen.tsx
│   │   ├── AddEventScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── index.ts
│   ├── theme/             # Design system
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   ├── theme.ts
│   │   └── index.ts
│   └── types/             # TypeScript types
│       └── index.ts
├── android/               # Android native code
├── ios/                   # iOS native code
├── App.tsx               # Root component
├── index.js              # Entry point
└── package.json          # Dependencies

```

## 🎨 Design System

### Colors
- **Primary**: #007F5F (Islamic Green)
- **Secondary**: #FFD700 (Gold)
- **Background**: #FFFFFF (White)
- **Text Dark**: #222222
- **Text Light**: #888888

### Typography
- **Font Family**: Poppins (Regular, Medium, SemiBold, Bold)
- **Font Sizes**: xs (12), sm (14), md (16), lg (18), xl (20), xxl (24), xxxl (28), huge (32)

### Spacing
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **xxl**: 40px
- **xxxl**: 48px

### Components
All components follow a consistent design language:
- **AppText**: Customizable text with variant, size, color, and alignment props
- **AppButton**: Flexible button with primary, outline, and secondary variants
- **AppCard**: Elevated card with configurable padding and shadow
- **AppHeader**: Consistent header with navigation and title
- **AppTextInput**: Form input with label, error handling, and focus states

## 🚀 Getting Started

### Prerequisites
- Node.js >= 20
- React Native development environment set up
- Android Studio (for Android) or Xcode (for iOS)

### Installation

1. **Clone the repository**
   ```bash
   cd salaahManager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install iOS dependencies** (macOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

### Running the App

#### Android
```bash
npm run android
```

#### iOS
```bash
npm run ios
```

#### Start Metro Bundler (if needed)
```bash
npm start
```

#### Reset Cache
```bash
npm start -- --reset-cache
```

## 🔐 Demo Credentials

Use these credentials to login to the app:

- **Email**: `imam@salaahmanager.com`
- **Password**: `admin123`

## 📊 Mock Data

The app comes with pre-populated mock data:

### Masajids
1. **Masjid Al-Noor** - 123 Main St (Default)
2. **Central Mosque** - 456 Oak Ave
3. **Community Masjid** - 789 Elm Rd

### Prayer Times
Each masjid has prayer times for all 5 daily prayers

### Questions
Sample questions from community members with different statuses

## 🏗️ Architecture

### State Management
- **Context API** for global state management
- Centralized AppContext managing:
  - Authentication state
  - User information
  - Masajid data
  - Prayer times
  - Questions

### Navigation
- **Stack Navigator** for main app flow
- **Bottom Tab Navigator** for main screens
- Type-safe navigation with TypeScript

### Component Structure
- Reusable, typed components
- Consistent prop interfaces
- Theme-based styling
- Separation of concerns

## 📱 App Flow

1. **Splash Screen** (2 seconds)
   - Check authentication status
   - Navigate to Login or Main app

2. **Login** (if not authenticated)
   - Enter credentials
   - Validate and navigate to Home

3. **Main App** (Bottom Tabs)
   - **Home**: Prayer times and quick actions
   - **Questions**: Community Q&A
   - **My Masajids**: Masjid management
   - **Profile**: User settings

4. **Detail Screens** (Stack Navigation)
   - Masjid Detail
   - Send Notification
   - Add Event

## 🔄 Future Enhancements

Potential features for future versions:
- Backend integration with API
- Push notifications
- Real-time prayer time calculations
- User registration
- Advanced analytics
- Multi-language support
- Dark mode
- Offline support
- Event calendar view
- File attachments for questions

## 🧪 Testing

Run tests:
```bash
npm test
```

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

Built with ❤️ for the Muslim community

---

## 📞 Support

For issues, questions, or contributions, please open an issue on the repository.

## 🙏 Acknowledgments

- React Native community
- React Navigation team
- All contributors and testers

---

**Note**: This is a demonstration app with mock data. For production use, integrate with a proper backend API and database.
