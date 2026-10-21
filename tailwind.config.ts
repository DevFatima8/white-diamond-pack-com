import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    // Tailwind only generates classes it finds in these files. The toasts (context/)
    // and the order-status badge styles (lib/orders.ts) live outside app/ and components/.
    './context/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // The White Diamond palette (brief + DESIGN.md). Use these in all new code,
        // e.g. bg-brand-primary hover:bg-brand-primary-hover text-brand-ink.
        // (theme.* and falcon.* below are legacy and get removed in Phase 4.)
        brand: {
          primary: { DEFAULT: '#E63946', hover: '#C92A37' }, // red: CTAs, prices, badges
          secondary: { DEFAULT: '#6366F1', hover: '#4F46E5' }, // indigo: links, icons, active filters
          tint: '#EEF2FF', // alternate backgrounds, chips
          navy: { DEFAULT: '#1E1B4B', dark: '#12102E' }, // header, footer, admin sidebar
          ink: '#0F172A', // main text
          muted: '#64748B', // secondary text
          border: '#E2E8F0',
          surface: '#F8FAFC', // admin content background, image wells
        },
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
        // Elevation levels from DESIGN.md
        'level-1': '0 2px 8px -2px rgba(15, 23, 42, 0.04), 0 1px 4px -1px rgba(15, 23, 42, 0.02)',
        'level-2': '0 12px 24px -6px rgba(30, 27, 75, 0.08), 0 4px 8px -2px rgba(30, 27, 75, 0.04)',
        'level-3': '0 20px 32px -8px rgba(18, 16, 46, 0.16), 0 8px 16px -4px rgba(18, 16, 46, 0.08)',
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
