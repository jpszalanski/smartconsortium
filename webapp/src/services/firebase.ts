import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent as firebaseLogEvent, setUserId, setUserProperties } from 'firebase/analytics';
import type { Analytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

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
  }
} catch (e) {
  // analytics may fail to initialize in non-browser environments or when disabled
  // keep analytics undefined in that case
  // eslint-disable-next-line no-console
  console.warn('Firebase analytics not initialized:', e);
}

const auth = getAuth(app);

export { app, analytics, auth, firebaseLogEvent, setUserId, setUserProperties };
