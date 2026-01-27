import React, { useState } from 'react';

interface SplashScreenProps {
    onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
    const [isFading, setIsFading] = useState(false);

    const handleVideoEnd = () => {
        setIsFading(true);
        // Wait for fade out animation
        setTimeout(() => {
            onComplete();
        }, 500);
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'
                }`}
        >
            <video
                src="/splash.mp4"
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnd}
                className="w-full h-full object-cover"
            />
        </div>
    );
};
