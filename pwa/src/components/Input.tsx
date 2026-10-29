import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  mono?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, mono, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2)}`;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-semibold text-forest mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            'w-full h-12 rounded-xl border-0 bg-white shadow-soft px-4 text-base outline-none',
            'focus:ring-2 focus:ring-sous-bois/40 focus:shadow-[inset_0_0_0_2px_#1F5C3F,0_0_0_4px_rgba(139,250,90,.35)]',
            mono && 'font-mono tracking-[.3em] text-center text-xl',
            error && 'border-error ring-1 ring-error',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
        {hint && !error && <p className="mt-1 text-xs text-neutral">{hint}</p>}
        {error && <p className="mt-1 text-xs text-error">{error}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';
