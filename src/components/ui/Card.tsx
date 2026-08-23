import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hover = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-slate-900/80 border border-slate-800 rounded-3xl p-5 backdrop-blur-xl shadow-xl shadow-slate-950/40 ${
        hover
          ? 'transition-all duration-200 hover:-translate-y-1 hover:border-slate-700 hover:shadow-2xl'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
