import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'glow';
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    className = '',
    variant = 'primary',
    fullWidth = false,
    ...props
}) => {
    const baseStyles = "rounded-full font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
    const widthStyles = fullWidth ? "w-full py-4 text-lg" : "px-6 py-2 text-sm";

    const variants = {
        primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/30",
        secondary: "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700",
        glow: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden group btn-glow"
    };

    // Inline style for the glow effect hack if needed, or rely on global css. 
    // We added btn-glow to index.css previously? No, that was in the original HTML.
    // We need to add the glow css to index.css or reimplement it here.
    // Let's rely on standard tailwind for now.

    return (
        <button
            className={`${baseStyles} ${widthStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
