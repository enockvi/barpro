import React from 'react';

interface MoneyProps {
  value: number;
  suffix?: string;
  className?: string;
  small?: boolean;
}

export type { MoneyProps };
export const Money = ({ value, suffix = ' F', className = '', small = false }: MoneyProps) => (
  <span
    className={['font-mono font-semibold', small ? 'text-sm' : 'text-base', className].filter(Boolean).join(' ')}
  >
    {value.toLocaleString('fr-FR').replace(/\s/g, ' ')}
    <span className="ml-0.5">{suffix}</span>
  </span>
);
