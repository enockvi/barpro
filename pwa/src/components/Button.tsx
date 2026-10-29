import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'dark' | 'ghost' | 'danger' | 'whatsapp';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth, className = '', children, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-semibold transition-transform active:scale-[.98] focus:outline-none focus:ring-2 focus:ring-citron/35 disabled:opacity-40 disabled:cursor-not-allowed';
    const sizes = {
      sm: 'h-9 px-4 text-sm rounded-full',
      md: 'h-12 px-6 text-base rounded-full',
      lg: 'h-14 px-8 text-lg rounded-full',
    };
    const variants = {
      primary: 'bg-citron text-forest-deep hover:bg-lime-300',
      dark: 'bg-forest text-white hover:bg-sous-bois',
      ghost: 'bg-transparent text-forest border-2 border-forest rounded-full',
      danger: 'bg-error/10 text-error border-2 border-error rounded-full',
      whatsapp: 'bg-[#25D366] text-white hover:bg-[#1fb855]',
    };
    return (
      <button
        ref={ref}
        className={[base, sizes[size], variants[variant], fullWidth ? 'w-full' : '', className].filter(Boolean).join(' ')}
        {...props}
      >
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';
