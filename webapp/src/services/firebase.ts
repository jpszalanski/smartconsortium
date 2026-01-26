import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent as firebaseLogEvent, setUserId, setUserProperties } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: {{secrets.FIREBASE_API_KEY}} ,
    authDomain: "simuladorconsortium.firebaseapp.com",
    projectId: "simuladorconsortium",
    storageBucket: "simuladorconsortium.firebasestorage.app",
    messagingSenderId: "229356390233",
    appId: "1:229356390233:web:26645ae1eabebf143b6e48",
    measurementId: "G-W1HJ2E3B9Y"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics, firebaseLogEvent, setUserId, setUserProperties };
