import React from 'react';

export interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  trend?: 'up' | 'down' | null;
  trendValue?: string;
  className?: string;
}

export const StatCard = ({ label, value, sub, trend, trendValue, className = '' }: StatCardProps) => (
  <div className={['bg-white rounded-[20px] shadow-soft p-4', className].join(' ')}>
    <span className="text-xs font-semibold text-neutral uppercase tracking-wider">{label}</span>
    <p className="font-mono text-2xl font-semibold tracking-tight text-forest-deep mt-1">
      {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
    </p>
    {sub && <p className="text-xs text-neutral mt-0.5">{sub}</p>}
    {trend && trendValue && (
      <p className={['text-xs font-bold mt-1', trend === 'up' ? 'text-citron' : 'text-error'].join(' ')}>
        {trend === 'up' ? '↑' : '↓'} {trendValue}
      </p>
    )}
  </div>
);
