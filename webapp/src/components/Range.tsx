import React from 'react';

interface RangeProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    valueDisplay?: React.ReactNode;
    minLabel?: string;
    maxLabel?: string;
}

export const Range: React.FC<RangeProps> = ({
    label,
    valueDisplay,
    minLabel,
    maxLabel,
    className = '',
    ...props
}) => {
    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-2">
                {label && (
                    <label className="text-xs font-medium text-slate-400">
                        {label}
                    </label>
                )}
                {valueDisplay && (
                    <span className="text-sm font-bold text-white">
                        {valueDisplay}
                    </span>
                )}
            </div>

            <input
                type="range"
                className={`
          w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer
          accent-blue-500 hover:accent-blue-400 transition-all
          ${className}
        `}
                {...props}
            />

            {(minLabel || maxLabel) && (
                <div className="flex justify-between mt-1 text-[10px] text-slate-500 font-medium px-1">
                    <span>{minLabel}</span>
                    <span>{maxLabel}</span>
                </div>
            )}
        </div>
    );
};
