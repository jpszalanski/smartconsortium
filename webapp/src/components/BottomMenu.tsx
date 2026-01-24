import React from 'react';
import { NavLink } from 'react-router-dom';

export const BottomMenu: React.FC = () => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-xl border-t border-slate-700/50 pb-[env(safe-area-inset-bottom)]">
            <div className="flex justify-around items-center h-16">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`
                    }
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-[10px] font-medium">Início</span>
                </NavLink>

                <NavLink
                    to="/quita-smart"
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`
                    }
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-[10px] font-medium">Quita Smart</span>
                </NavLink>

                <NavLink
                    to="/invest-smart"
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`
                    }
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-[10px] font-medium">Invest Smart</span>
                </NavLink>
            </div>
        </nav>
    );
};
