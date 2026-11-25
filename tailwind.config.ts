import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

/**
 * White Diamond design tokens (brief + design/stitch/home/DESIGN.md).
 * One palette — `brand` — e.g. bg-brand-primary, hover:bg-brand-primary-hover, text-brand-ink.
 * Radii use Tailwind's defaults, which already match DESIGN.md:
 *   rounded-xl = 12px (cards, inputs) · rounded-2xl = 16px (panels, drawers) · rounded-full = pills.
 *
 * Palette (client choice, from the logo): white + logo red + logo maroon + light rose-white
 * backgrounds — no blue, no green, no purple.
 * Token names (secondary, navy, tint) are kept so components didn't need renaming.
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
        // Tailwind's bluish greys → warm stone greys, so stray slate-/gray- classes match the palette
        slate: colors.stone,
        gray: colors.stone,
        brand: {
          primary: { DEFAULT: '#C1121F', hover: '#9B0F1A' }, // logo red (6.2:1 on white): CTAs, prices, badges
          secondary: { DEFAULT: '#8B1414', hover: '#6E0F0F' }, // logo maroon (9.6:1 on white): links, icons, active filters, buttons
          tint: '#FDF3F3', // very light rose-white: alternate backgrounds, chips
          accent: { DEFAULT: '#FBD5D8', soft: '#FCE8E9' }, // soft red: badges, highlights (use dark text on it)
          navy: { DEFAULT: '#2B1212', dark: '#1A0B0B' }, // deep maroon-black (name kept): strong text, overlays
          ink: '#1A1212', // main text (near-black)
          muted: '#6B5B5B', // secondary text
          border: '#F1DFDF',
          surface: '#FFFAFA', // image wells, admin background
        },
        // Recognisable service / platform colours for contact & social icons only
        icon: {
          whatsapp: { DEFAULT: '#25D366', hover: '#1DA851' },
          email: { DEFAULT: '#EA4335', hover: '#D33426' },
          phone: { DEFAULT: '#2563EB', hover: '#1D4ED8' },
          location: { DEFAULT: '#F4511E', hover: '#E64A19' },
        },
        social: {
          facebook: '#1877F2',
          instagram: '#E4405F',
          linkedin: '#0A66C2',
          youtube: '#FF0000',
          tiktok: '#000000',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'], // Plus Jakarta Sans
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'], // Outfit
        arabic: ['var(--font-arabic)', 'system-ui', 'sans-serif'], // Cairo
      },
      boxShadow: {
        // Elevation levels from DESIGN.md
        'level-1': '0 2px 8px -2px rgba(26, 20, 20, 0.04), 0 1px 4px -1px rgba(26, 20, 20, 0.02)',
        'level-2': '0 12px 24px -6px rgba(28, 25, 23, 0.08), 0 4px 8px -2px rgba(28, 25, 23, 0.04)',
        'level-3': '0 20px 32px -8px rgba(12, 10, 9, 0.16), 0 8px 16px -4px rgba(12, 10, 9, 0.08)',
      },
      backgroundImage: {
        // Brand gradient: logo red → maroon at 135°
        'brand-gradient': 'linear-gradient(135deg, #C1121F 0%, #8B1414 100%)',
      },
      maxWidth: {
        site: '1440px', // DESIGN.md: layout constraint
      },
    },
  },
  plugins: [],
};

export default config;
