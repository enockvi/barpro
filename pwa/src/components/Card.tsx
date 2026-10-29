import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md';
}

export const Card = ({ children, className = '', padding = 'md' }: CardProps) => {
  const pad = { none: '', sm: 'p-3', md: 'p-4' }[padding];
  return (
    <div
      className={[
        'bg-white rounded-[22px] shadow-soft overflow-hidden',
        pad,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
};
