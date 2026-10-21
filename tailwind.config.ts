import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        theme: {
          red: '#E63946',
          'red-hover': '#C92A37',
          'red-light': '#FEE2E2',
          purple: '#6366F1',
          'purple-hover': '#4F46E5',
          'purple-light': '#EEF2FF',
          navy: '#1E1B4B',
          'navy-dark': '#12102E',
          lavender: '#EEF2FF',
          gray: '#64748B',
          white: '#FFFFFF',
        },
        falcon: {
          green: '#E63946',
          'green-dark': '#C92A37',
          'green-light': '#F87171',
          parrot: '#6366F1',
          'parrot-hover': '#4F46E5',
          black: '#1E1B4B',
          dark: '#12102E',
          footer: '#12102E',
          sage: '#EEF2FF',
          'sage-light': '#F8FAFC',
          gray: '#64748B',
          light: '#ffffff',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
          hover: 'var(--primary-hover)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
          hover: 'var(--accent-hover)',
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        border: 'var(--border)',
        ring: 'var(--ring)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(30, 27, 75, 0.08)',
        glow: '0 0 25px rgba(99, 102, 241, 0.35)',
        'falcon-green': '0 8px 30px rgba(230, 57, 70, 0.25)',
        'theme-red': '0 8px 30px rgba(230, 57, 70, 0.25)',
        'theme-purple': '0 8px 30px rgba(99, 102, 241, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
