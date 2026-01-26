import React, { useState } from 'react';
import { SignInWithApple } from '@capacitor-community/apple-sign-in';
import type { SignInWithAppleResponse, SignInWithAppleOptions } from '@capacitor-community/apple-sign-in';
import { OAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAppleSignIn = async () => {
        setError(null);
        setLoading(true);

        try {
            if (!Capacitor.isNativePlatform()) {
                throw new Error("Apple Sign In is only available on iOS devices.");
            }

            const rawNonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

            const options: SignInWithAppleOptions = {
                clientId: 'com.your.app.bundle.id', // Ideally from config
                redirectURI: 'https://simuladorconsortium.firebaseapp.com/__/auth/handler', // From Firebase Console
                scopes: 'name email',
                state: '12345',
                nonce: rawNonce,
            };

            const result: SignInWithAppleResponse = await SignInWithApple.authorize(options);

            const provider = new OAuthProvider('apple.com');
            const credential = provider.credential({
                idToken: result.response.identityToken,
                rawNonce: rawNonce,
            });

            await signInWithCredential(auth, credential);
            navigate('/'); // redirect to home on success
        } catch (err: any) {
            console.error("Apple Sign In Error:", err);
            setError(err.message || "Failed to sign in with Apple.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-card p-8 rounded-2xl w-full max-w-md flex flex-col items-center space-y-6">
                <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                <p className="text-slate-400 text-center mb-6">Sign in to access your dashboard</p>

                {error && (
                    <div className="bg-red-500/20 text-red-200 p-3 rounded-lg text-sm w-full text-center border border-red-500/30">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleAppleSignIn}
                    disabled={loading}
                    className="w-full bg-white text-black font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    <svg viewBox="0 0 384 512" width="20" aria-label="apple logo">
                        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 46.9 126.7 89.8 126.7 30.8 0 52.8-51.7 82.2-51.7s52.8 51.7 82.2 51.7c47.5 0 79.7-90.1 79.7-90.1s-64.9-25.1-64.9-122.6zM187.3 97c27.8-32.8 29.5-66.5 4*-97 32.8 2.9 66.5 24.3 66.5 56.6 0 33.2-27.8 70.3-70.5 40.4z" />
                    </svg>
                    {loading ? 'Signing in...' : 'Sign in with Apple'}
                </button>

                <div className="mt-8 text-xs text-slate-500 text-center">
                    By signing in, you agree to our Terms of Service and Privacy Policy.
                </div>
            </div>
        </div>
    );
};
