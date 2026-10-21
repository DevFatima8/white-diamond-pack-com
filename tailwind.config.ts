import type { Config } from 'tailwindcss';

/**
 * White Diamond design tokens (brief + design/stitch/home/DESIGN.md).
 * One palette — `brand` — e.g. bg-brand-primary, hover:bg-brand-primary-hover, text-brand-ink.
 * Radii use Tailwind's defaults, which already match DESIGN.md:
 *   rounded-xl = 12px (cards, inputs) · rounded-2xl = 16px (panels, drawers) · rounded-full = pills.
 */
const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    // Tailwind only generates classes it finds in these files. The toasts (context/)
    // and the order-status badge styles (lib/orders.ts) live outside app/ and components/.
    './context/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: { DEFAULT: '#E63946', hover: '#C92A37' }, // red: CTAs, prices, badges
          secondary: { DEFAULT: '#6366F1', hover: '#4F46E5' }, // indigo: links, icons, active filters
          tint: '#EEF2FF', // alternate backgrounds, chips
          navy: { DEFAULT: '#1E1B4B', dark: '#12102E' }, // header, footer, dark sections
          ink: '#0F172A', // main text
          muted: '#64748B', // secondary text
          border: '#E2E8F0',
          surface: '#F8FAFC', // image wells, admin background
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'], // Plus Jakarta Sans
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'], // Outfit
        arabic: ['var(--font-arabic)', 'system-ui', 'sans-serif'], // Cairo
      },
      boxShadow: {
        // Elevation levels from DESIGN.md
        'level-1': '0 2px 8px -2px rgba(15, 23, 42, 0.04), 0 1px 4px -1px rgba(15, 23, 42, 0.02)',
        'level-2': '0 12px 24px -6px rgba(30, 27, 75, 0.08), 0 4px 8px -2px rgba(30, 27, 75, 0.04)',
        'level-3': '0 20px 32px -8px rgba(18, 16, 46, 0.16), 0 8px 16px -4px rgba(18, 16, 46, 0.08)',
      },
      backgroundImage: {
        // The only gradient allowed by the brand rules: red → indigo at 135°
        'brand-gradient': 'linear-gradient(135deg, #E63946 0%, #6366F1 100%)',
      },
      maxWidth: {
        site: '1440px', // DESIGN.md: layout constraint
      },
    },
  },
  plugins: [],
};

export default config;
