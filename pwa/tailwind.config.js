/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#0B3322',
          deep: '#06231A',
          900: '#06231A',
          800: '#0B3322',
          700: '#1F5C3F',
          600: '#1F5C3F',
        },
        citron: '#8BFA5A',
        'sous-bois': '#1F5C3F',
        paper: '#F5F8F3',
        alert: '#F5B841',
        error: '#FF6B5B',
        neutral: '#5E7266',
        limeSoft: '#D9FBC8',
        limeLight: '#EEFCE6',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'SF Pro Display', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'Menlo', 'monospace'],
      },
      borderRadius: {
        xs: '8px',
        sm: '14px',
        md: '24px',
        full: '999px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(11,31,22,.06), 0 8px 24px rgba(11,31,22,.08)',
      },
      spacing: {
        4: '4px',
        8: '8px',
        12: '12px',
        16: '16px',
        20: '20px',
        24: '24px',
        32: '32px',
        44: '44px',
        56: '56px',
        64: '64px',
        112: '112px',
      },
    },
  },
  plugins: [],
};

