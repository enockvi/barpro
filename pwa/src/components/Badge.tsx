import React from 'react';
import { Check, AlertCircle, AlertTriangle, X } from 'lucide-react';

export type BadgeVariant = 'in-stock' | 'new' | 'low-stock' | 'out-of-stock';

export interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  count?: number;
}

const config: Record<BadgeVariant, { bg: string; text: string; icon: React.ReactNode }> = {
  'in-stock': {
    bg: 'bg-limeSoft text-forest-deep',
    text: 'En stock',
    icon: <Check size={12} strokeWidth={2.2} />,
  },
  new: {
    bg: 'bg-limeSoft text-forest-deep',
    text: 'Nouveau',
    icon: <Check size={12} strokeWidth={2.2} />,
  },
  'low-stock': {
    bg: 'bg-alert/20 text-amber-700',
    text: 'Stock bas',
    icon: <AlertTriangle size={12} strokeWidth={2.2} />,
  },
  'out-of-stock': {
    bg: 'bg-error/10 text-error',
    text: 'Rupture',
    icon: <X size={12} strokeWidth={2.2} />,
  },
};

export const Badge = ({ variant, children, count }: BadgeProps) => {
  const c = config[variant];
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-full',
        c.bg,
      ].join(' ')}
    >
      {c.icon}
      {children || c.text}
      {count != null && <span className="font-mono">{count}</span>}
    </span>
  );
};
