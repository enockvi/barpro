import React from 'react';

export interface Segment {
  key: string;
  label: string;
}

export interface SegmentedControlProps {
  segments: Segment[];
  active: string;
  onChange: (key: string) => void;
  className?: string;
}

export const SegmentedControl = ({ segments, active, onChange, className = '' }: SegmentedControlProps) => (
  <div className={['inline-flex bg-white rounded-full p-1 shadow-soft', className].join(' ')}>
    {segments.map((seg) => (
      <button
        key={seg.key}
        onClick={() => onChange(seg.key)}
        className={[
          'px-4 py-1.5 rounded-full text-sm font-semibold transition-colors',
          active === seg.key
            ? 'bg-forest text-citron'
            : 'text-neutral hover:text-forest',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {seg.label}
      </button>
    ))}
  </div>
);
