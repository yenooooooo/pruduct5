# HabitFlow Application Blueprint

## Overview
HabitFlow is a web-based habit tracking application designed to help users build and maintain positive habits. It features user authentication, habit logging, progress visualization, and different tiers of access (Free, PRO, Admin) managed through Firebase. The application includes a modern and responsive user interface, dark mode functionality, and integrated background music.

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
- **Tier System**:
    - Calculates and displays user tiers (Bronze, Silver, Gold, etc.) based on their consecutive habit streak.
- **Intelligent Reminders (Simulation)**:
    - Simulates scheduling a reminder for the next day at the same time a habit is completed.
- **Tier System**:
    - Calculates and displays user tiers (Bronze, Silver, Gold, etc.) based on their consecutive habit streak.
- **Intelligent Reminders (Simulation)**:
    - Simulates scheduling a reminder for the next day at the same time a habit is completed.

### UI Components
- **Header**: Sticky navigation bar with logo, navigation links (Features, PRO, Pricing), "Start" button, and Dark Mode toggle.
- **Hero Section**: Prominent banner with a catchy headline and call to action.
- **Problem/Solution Section**: Highlights common habit-building problems and how HabitFlow addresses them.
- **Features Section**: Showcases key features like "One Habit a Day", "Streak Tracking", and "Auto Save", with added icons for better visual representation.
- **PRO Section**: Details the benefits of the PRO subscription, now with enhanced styling using an accent color.
- **Flow Section**: Step-by-step guide on how to use the application.
- **Pricing Section**: Displays pricing tiers for Free and PRO plans.
- **Authentication/App Section**:
    - Redesigned with a more prominent "Get Started" call-to-action.
    - Dynamically switches between a streamlined login/signup form and the main application interface.
    - The app view now features a redesigned habit theme selector with a new tag container, and a restyled, less intrusive logout button.
    - Includes a celebration effect upon habit completion.
- **Tier Badge**:
    - Displays the user's current tier and streak count in the main app view.
- **Habit Theme Section**:
    - Restyled with a new `tag-container` for better alignment and responsiveness.
    - Button labels have been shortened for a cleaner look.
- **Admin Panel**:
    - Displays a list of all users and their PRO status.
    - Allows administrators to toggle PRO status for any user.
    - Includes a "cheat" button to create 5 days of success data for testing.
- **Footer**: Contains copyright information and support email.

### Firebase Integration
- **Firebase SDK**: Loaded via CDN (`firebase-app.js`, `firebase-auth.js`, `firebase-firestore.js`).
- **Authentication**: `getAuth`, `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `onAuthStateChanged`, `signOut`, `getIdTokenResult`.
- **Firestore**: `getFirestore`, `doc`, `setDoc`, `getDoc`, `collection`, `getDocs`, `updateDoc`.
- **Custom Claims**: Utilizes `getIdTokenResult` to check `admin` and `pro` claims for role-based access and UI adjustments.

### Styling
- **Inline CSS**: All styling is currently embedded within the `index.html` `<style>` tags.
- **CSS Variables**: Used extensively for theme management (light/dark mode).
- **Responsive Design**: Basic media queries for mobile adjustments (e.g., header navigation, main container layout).
- **Modern Design Principles**: Clean layout, clear typography (Pretendard font), use of shadows and gradients for visual depth.
- **AI Coach Report Styles**: Dedicated CSS for the AI Coach card, badges, text, and failure highlights.
- **Theme Tag Styles**: CSS for the habit theme selection buttons, including active state.
- **Glassmorphism & Minimalism**: Overhauled design with a more polished and modern aesthetic. This includes updated color variables, a new CSS Grid layout for the main container, pill-shaped buttons, a curved hero section, and refined glassmorphism effects on cards.
- **Layout & Alignment**: Global centering for sections and content, improved centering for lists, and refined main container/card layouts for better visual balance and responsiveness.
- **Animations & Effects**: Added fade-in animations for a more dynamic page load, and a subtle background pattern for visual depth.

### External Libraries/Resources
- **Firebase SDK**: Via CDN.
- **Google Fonts**: Pretendard font family.
- **Audio**: Background music from Pixabay CDN.

## Current Plan

The initial setup of the Firebase Studio environment is complete. The `.idx/mcp.json` configuration is correctly in place. The `index.html` file now contains the full HabitFlow application, resolving previous discrepancies.

For now, the application structure and core features are outlined above based on the provided `index.html`. The next step will be to finalize the styling updates and push changes to reflect the improved UI/UX.
