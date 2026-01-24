import React, { type ReactNode } from 'react';
import { BottomMenu } from './BottomMenu';

interface LayoutProps {
    children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col pt-[env(safe-area-inset-top)] pb-[calc(4rem+env(safe-area-inset-bottom))]">
            {/* Top Status Bar Spacer (optional background for status bar) */}
            <div className="fixed top-0 left-0 right-0 h-[env(safe-area-inset-top)] bg-slate-900/90 z-50 backdrop-blur-sm pointer-events-none" />

            {/* Main Content Area */}
            <main className="flex-1 w-full flex flex-col items-center">
                {children}
            </main>

            {/* Bottom Navigation */}
            <BottomMenu />
        </div>
    );
};
