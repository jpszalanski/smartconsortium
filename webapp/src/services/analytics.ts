import { analytics, firebaseLogEvent } from './firebase';

export const trackEvent = (eventName: string, params: any = {}) => {
    try {
        firebaseLogEvent(analytics, eventName, params);
        // Optional: Log to console in dev
        if (import.meta.env.DEV) {
            console.log(`[Analytics] ${eventName}`, params);
        }
    } catch (error) {
        console.warn('[Analytics] Error logging event:', error);
    }
};
