# Architecture & Technical Decisions

## 1. Stack Choices
- **Frontend**: **React 19** chosen for robust component lifecycle and ecosystem.
- **Build Tool**: **Vite** for sub-second HMR and optimized production builds ("modern web" standard).
- **Styling**: **Tailwind CSS v4** (PostCSS) for utility-first styling, enabling rapid UI iteration and easy dark mode implementation.
- **Mobile Runtime**: **Capacitor v7**.
  - *Why not React Native?* The goal was to reuse the existing web logic and UI 100% while gaining native access (Splash, Auth) only where needed.
- **Backend**: **Firebase**.
  - **Hosting**: Deploys the SPA.
  - **Auth**: Handles user sessions.
  - **Analytics**: Tracks usage events.

## 2. iOS Compliance Strategy
To meet the requirement of **iOS 26+** standards:
- **Deployment Target**: Set to `26.0` in `project.pbxproj`.
- **API Usage**:
  - Deprecated methods like `application(_:open:options:)` handling `OpenURLOptionsKey` were removed from `AppDelegate`.
- **Warning Suppression**:
  - Used `GCC_WARN_ABOUT_DEPRECATED_FUNCTIONS = NO` to silence benign warnings from the `Cordova` bridge layer, preserving a "clean build" state without forking the dependency.

## 3. Launch & Assets
- **Icon Generation**: Automated via `@capacitor/assets`.
- **Splash Screen**:
  - Uses native storyboards (`LaunchScreen.storyboard`).
  - **Memory Optimization**: Assets constrained to 2048px max texture size to avoid iOS memory limit terminations during launch.

## 4. Project Structure map
```
smartconsortium/
├── webapp/                 # The React Application
│   ├── src/
│   │   ├── components/     # UI Building Blocks
│   │   ├── pages/          # Route Views
│   │   ├── services/       # Firebase & API Logic
│   │   └── App.tsx         # Main Entry & Routing
│   ├── ios/                # Native iOS Project (Podfile, Xcode Workspace)
│   └── capacitor.config.ts # Bridge Configuration
├── firebase.json           # Hosting Config
└── README.md               # User Guide
```
