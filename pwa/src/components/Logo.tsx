import React from 'react';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const sizes = { sm: 24, md: 40, lg: 56 };

export const Logo = ({ size = 'md', showText = true, className = '' }: LogoProps) => {
  const s = sizes[size];
  return (
    <div className={['flex items-center gap-2', className].filter(Boolean).join(' ')}>
      <svg width={s} height={s} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" rx="46" fill="#8BFA5A" />
        <path
          fill="#0B3322"
          d="M64 23 H88.5 V60 C88.5 66 106.6 74 106.6 92 V157 Q106.6 169 94.6 169 H58 Q46 169 46 157 V92 C46 74 64 66 64 60 Z"
        />
        <path
          fill="#8BFA5A"
          stroke="#8BFA5A"
          strokeWidth="7"
          strokeLinejoin="round"
          d="M84 92 H160 L152.6 160 Q151.6 169 142 169 H104 Q94.5 169 95.5 160 Z"
        />
      </svg>
      {showText && (
        <span
          className="font-sans font-extrabold text-[1.25em] tracking-tight text-forest-deep"
          style={{ fontSize: s * 0.5 }}
        >
          Bar<span className="text-citron">Pro</span>
        </span>
      )}
    </div>
  );
};
