import { analytics, firebaseLogEvent, setUserId as firebaseSetUserId, setUserProperties as firebaseSetUserProperties } from './firebase';

export const trackEvent = (eventName: string, params: any = {}) => {
    try {
        if (analytics) {
            firebaseLogEvent(analytics, eventName, params);
        }
        // Optional: Log to console in dev
        if (import.meta.env.DEV) {
            console.log(`[Analytics] ${eventName}`, params);
        }
    } catch (error) {
        console.warn('[Analytics] Error logging event:', error);
    }
};

export const setUser = (userId: string) => {
    try {
        if (analytics) {
            firebaseSetUserId(analytics, userId);
        }
        if (import.meta.env.DEV) {
            console.log(`[Analytics] Set User ID: ${userId}`);
        }
    } catch (error) {
        console.warn('[Analytics] Error setting user ID:', error);
    }
};

export const setUserProps = (properties: any) => {
    try {
        if (analytics) {
            firebaseSetUserProperties(analytics, properties);
        }
        if (import.meta.env.DEV) {
            console.log(`[Analytics] Set User Properties:`, properties);
        }
    } catch (error) {
        console.warn('[Analytics] Error setting user properties:', error);
    }
};
