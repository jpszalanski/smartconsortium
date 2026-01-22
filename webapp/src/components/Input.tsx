import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    helperText?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    helperText,
    error,
    className = '',
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">
                    {label}
                </label>
            )}
            <input
                className={`
          w-full bg-slate-900/60 border border-slate-700/50 rounded-xl px-4 py-3
          text-white placeholder-slate-600 transition-all duration-200
          focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 focus:outline-none
          disabled:opacity-50 disabled:bg-slate-900/30
          ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}
          ${className}
        `}
                {...props}
            />
            {(helperText || error) && (
                <p className={`text-[10px] mt-1 ml-1 ${error ? 'text-red-400' : 'text-slate-500'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
};
