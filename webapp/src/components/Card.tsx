import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'panel' | 'interactive';
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    variant = 'panel',
    ...props
}) => {
    const baseStyles = "backdrop-blur-xl border transition-all duration-300";

    const variants = {
        panel: "bg-slate-900/70 border-white/10",
        interactive: "bg-slate-800/40 border-white/5 hover:bg-slate-800/60 hover:border-white/20 hover:-translate-y-1 hover:shadow-2xl cursor-pointer group relative overflow-hidden"
    };

    return (
        <div
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {variant === 'interactive' && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            )}
            {children}
        </div>
    );
};
