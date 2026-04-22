import React from 'react'

export const PrimaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = '', disabled, ...props }) => (
    <button
        className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 font-medium bg-linear-to-br from-indigo-500 to-indigo-600 hover:opacity-90 active:scale-95 transition-all ${disabled ? 'opacity-70 pointer-events-none cursor-not-allowed' : ''} ${className}`}
        disabled={disabled}
        {...props}
    >
        {children}
    </button>
);

export const GhostButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => (
    <button className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-medium border border-white/10 bg-white/3 hover:bg-white/6 backdrop-blur-sm active:scale-95 transition ${className}`} {...props} >
        {children}
    </button>
);