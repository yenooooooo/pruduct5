# HabitFlow Application Blueprint

## Overview
HabitFlow is a web-based habit tracking application designed to help users build and maintain positive habits. It features user authentication, habit logging, progress visualization, and different tiers of access (Free, PRO, Admin) managed through Firebase. The application includes a modern and responsive user interface with a Glassmorphism and Minimalism design, dark mode functionality, and integrated background music.

## Detailed Outline

### Core Functionality
- **User Authentication**:
    - Sign in and sign up with email and password using Firebase Authentication.
    - Automatic user session management.
    - Logout functionality.
- **Habit Tracking**:
    - Free users can track one habit per day, selectable from pre-defined themes.
    - PRO users have unlimited habit tracking and access to advanced statistics, including custom habit input.
    - Habit completion is logged in Firebase Firestore, storing the habit name and timestamp.
    - Streak visualization for PRO users.
- **Weekly Report (AI Coach)**:
    - Displays a personalized report with AI-driven insights after 3 consecutive days of habit completion.
    - Analyzes habit patterns and provides tailored advice (e.g., identifying "worst day" for habits).
    - Locked for free users (with a more engaging preview message), unlocked for PRO users.
- **Tier System**:
    - Calculates and displays user tiers (Bronze, Silver, Gold, etc.) based on their consecutive habit streak.
- **Intelligent Reminders (Simulation)**:
    - Simulates scheduling a reminder for the next day at the same time a habit is completed.
- **Dark Mode**:
    - Toggle functionality to switch between light and dark themes.
    - Uses CSS variables for easy theme management.
    - Persists user preference using `localStorage`.
- **Background Music (BGM) Player**:
    - Integrated audio player with play/pause and volume controls.
    - Uses a pre-defined audio source from an external CDN.
- **Admin Panel**:
    - Accessible only to users with `admin` custom claims.
    - Displays a list of all users and their PRO status.
    - Allows administrators to toggle PRO status for any user.
    - Includes a "cheat" button to create 5 days of success data for testing the weekly report feature.
- **Habit Completion Effects**:
    - Provides a visual (button scaling) and textual (status message update) celebration effect upon successful habit completion.

### UI Components
- **Header**: Sticky navigation bar with logo, navigation links, and "Start" button.
- **Hero Section**: A prominent banner with a curved bottom, featuring a catchy headline and a call-to-action button.
- **Problem/Solution, Features, PRO, Flow, Pricing Sections**: Informational sections with a consistent and centered layout.
- **Authentication/App Section**:
    - Redesigned with a more prominent "Get Started" call-to-action.
    - Dynamically switches between a streamlined login/signup form and the main application interface.
    - The app view now features a redesigned habit theme selector, a tier badge, and a restyled logout button.
- **Tier Badge**:
    - Displays the user's current tier and streak count in the main app view.
- **Habit Theme Section**:
    - Restyled with a `tag-container` for better alignment and responsiveness.
- **Admin Panel**:
    - Styled with a `glass-card` design.
- **Footer**: Contains copyright information and support email.

### Firebase Integration
- **Firebase SDK**: Loaded via CDN.
- **Authentication**: `getAuth`, `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `onAuthStateChanged`, `signOut`, `getIdTokenResult`.
- **Firestore**: `getFirestore`, `doc`, `setDoc`, `getDoc`, `collection`, `getDocs`, `updateDoc`.
- **Custom Claims**: Utilizes `getIdTokenResult` to check for `admin` and `pro` claims.

### Styling
- **Glassmorphism & Minimalism**: Overhauled design with a more polished and modern aesthetic. This includes updated color variables, a new CSS Grid layout for the main container, pill-shaped buttons, a curved hero section, and refined glassmorphism effects on cards.
- **Layout & Alignment**: Global centering for sections and content, improved centering for lists, and refined main container/card layouts for better visual balance and responsiveness.
- **Animations & Effects**: Includes fade-in animations, button-press effects, and a subtle background pattern.

### External Libraries/Resources
- **Firebase SDK**: Via CDN.
- **Google Fonts**: Pretendard font family.
- **Audio**: Background music from Pixabay CDN.

## Current Plan
- **완료**: 모든 UI 텍스트 한국어 번역 및 로컬라이제이션 완료.
- **완료**: 디자인 및 레이아웃 최종 점검 및 최적화 완료.
- **완료**: 프로젝트 배포 준비 완료.
