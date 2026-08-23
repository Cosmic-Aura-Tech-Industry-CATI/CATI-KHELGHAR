'use client';

import React from 'react';
import { sounds } from '@/lib/sounds';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  playSound?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  playSound = true,
  className = '',
  onClick,
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (playSound && !disabled) {
      sounds.playClick();
    }
    if (onClick) {
      onClick(e);
    }
  };

  const baseStyles =
    'inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-400 select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5'
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 shadow-lg shadow-orange-500/25',
    secondary:
      'bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 shadow-md',
    outline:
      'bg-transparent hover:bg-white/5 text-slate-300 hover:text-white border border-slate-700',
    danger:
      'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25',
    ghost:
      'bg-transparent hover:bg-white/5 text-slate-400 hover:text-white'
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
