import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen font-sans text-slate-200 bg-[#0f172a] bg-[radial-gradient(circle_at_50%_0%,#1e293b_0%,#0f172a_100%)] bg-fixed selection:bg-blue-500 selection:text-white">
            <main className="w-full min-h-screen flex flex-col items-center p-4 md:p-6 lg:p-8">
                {children}

                <footer className="mt-12 text-slate-600 text-[10px] text-center max-w-2xl">
                    <p>© {new Date().getFullYear()} Smart Consortium. Todos os direitos reservados.</p>
                </footer>
            </main>
        </div>
    );
};
