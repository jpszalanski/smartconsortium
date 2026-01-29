import { Capacitor } from '@capacitor/core';
import { FirebaseAnalytics } from '@capacitor-firebase/analytics';
import { analytics, firebaseLogEvent, setUserId as firebaseSetUserId, setUserProperties as firebaseSetUserProperties } from './firebase';

const isNative = Capacitor.isNativePlatform();

export const trackEvent = async (eventName: string, params: any = {}) => {
    try {
        if (isNative) {
            await FirebaseAnalytics.logEvent({
                name: eventName,
                params: params,
            });
        } else if (analytics) {
            firebaseLogEvent(analytics, eventName, params);
        }

        if (import.meta.env.DEV) {
            console.log(`[Analytics] ${eventName}`, params, isNative ? '(Native)' : '(Web)');
        }
    } catch (error) {
        console.warn('[Analytics] Error logging event:', error);
    }
};

export const setUser = async (userId: string) => {
    try {
        if (isNative) {
            await FirebaseAnalytics.setUserId({ userId });
        } else if (analytics) {
            firebaseSetUserId(analytics, userId);
        }
    } catch (error) {
        console.warn('[Analytics] Error setting user ID:', error);
    }
};

export const setUserProps = async (properties: any) => {
    try {
        if (isNative) {
            // Native plugin expects simple key-value pairs, often strings
            // We iterate to set them individually or as a map if supported
            // The plugin supports setUserProperty({ key, value })
            // We'll loop through properties
            for (const [key, value] of Object.entries(properties)) {
                await FirebaseAnalytics.setUserProperty({
                    key,
                    value: String(value), // Ensure string for safety
                });
            }
        } else if (analytics) {
            firebaseSetUserProperties(analytics, properties);
        }
    } catch (error) {
        console.warn('[Analytics] Error setting user properties:', error);
    }
};

export const setScreen = async (screenName: string, screenClassOverride?: string) => {
    try {
        if (isNative) {
            await FirebaseAnalytics.logEvent({
                name: 'screen_view',
                params: {
                    screen_name: screenName,
                    screen_class: screenClassOverride || 'ReactRoute'
                }
            });
        } else if (analytics) {
            firebaseLogEvent(analytics, 'screen_view', {
                firebase_screen: screenName,
                firebase_screen_class: screenClassOverride || 'ReactRoute'
            });
        }
    } catch (error) {
        console.warn('[Analytics] Error setting screen:', error);
    }
};
