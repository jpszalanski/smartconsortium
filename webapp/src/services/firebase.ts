import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent as firebaseLogEvent, setUserId, setUserProperties } from 'firebase/analytics';
import type { Analytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// For Vite apps, environment variables must be prefixed with VITE_ and are available on import.meta.env
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY as string | undefined;

if (!apiKey) {
  throw new Error('VITE_FIREBASE_API_KEY is not defined. Add it to your .env file (and do not commit it).');
}

const firebaseConfig = {
  apiKey,
  authDomain: "simuladorconsortium.firebaseapp.com",
  projectId: "simuladorconsortium",
  storageBucket: "simuladorconsortium.firebasestorage.app",
  messagingSenderId: "229356390233",
  appId: "1:229356390233:web:26645ae1eabebf143b6e48",
  measurementId: "G-W1HJ2E3B9Y"
};

const app = initializeApp(firebaseConfig);

let analytics: Analytics | undefined;
try {
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);

    // Enhanced User Properties
    import('@capacitor/core').then(({ Capacitor }) => {
      const platform = Capacitor.getPlatform(); // 'ios', 'android', 'web'
      const isNative = Capacitor.isNativePlatform();

      setUserProperties(analytics!, {
        platform_type: isNative ? `${platform}_native` : 'web_browser',
        platform_os: platform,
        device_type: isNative ? 'mobile' : (window.innerWidth > 768 ? 'desktop' : 'mobile'),
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        system_language: navigator.language,
        app_version: '1.0.0' // Align with package.json
      });
    }).catch(err => console.error('Failed to set analytics properties:', err));
  }
} catch (e) {
  // analytics may fail to initialize in non-browser environments or when disabled
  // keep analytics undefined in that case
  // eslint-disable-next-line no-console
  console.warn('Firebase analytics not initialized:', e);
}

const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db, firebaseLogEvent, setUserId, setUserProperties };
