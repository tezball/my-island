import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#13ec80',
          dark: '#0eb562',
        },
        background: {
          light: '#f6f8f7',
          dark: '#102219',
        },
        surface: {
          light: '#ffffff',
          dark: '#1a2e24',
        },
        'text-main': {
          light: '#0d1b14',
          dark: '#e8f5ee',
        },
        'text-sec': {
          light: '#4c9a73',
          dark: '#8bc4a6',
        },
        'text-secondary': '#4c9a73',
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Noto Sans', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(19, 236, 128, 0.1)',
        float: '0 8px 24px -4px rgba(0, 0, 0, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.08)',
        card: '0 2px 8px rgba(0, 0, 0, 0.04)',
        glow: '0 0 20px rgba(19, 236, 128, 0.4)',
      },
      animation: {
        'pulse-green': 'pulse-green 2s infinite',
      },
      keyframes: {
        'pulse-green': {
          '0%': { boxShadow: '0 0 0 0 rgba(19, 236, 128, 0.7)' },
          '70%': { boxShadow: '0 0 0 10px rgba(19, 236, 128, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(19, 236, 128, 0)' },
        },
      },
    },
  },
  plugins: [forms],
} satisfies Config
