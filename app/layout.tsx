import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import type { Locale } from '@/lib/i18n/translations';

export const metadata: Metadata = {
  // Base for absolute URLs in social previews / canonical links. Set NEXT_PUBLIC_SITE_URL in production.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'),
  title: {
    default: 'White Diamond — Food Packaging & Disposables in Pakistan',
    template: '%s · White Diamond',
  },
  description:
    'White Diamond, Faisalabad: aluminium foil, foil and plastic food containers, cling film, baking paper, paper bags and eco-friendly disposables at factory prices, delivered across Pakistan.',
  // Search terms customers in Pakistan use (also used in page titles/descriptions).
  keywords: [
    'food packaging Pakistan', 'aluminium foil Pakistan', 'aluminium foil manufacturer Faisalabad', 'aluminium foil roll',
    'foil containers', 'foil container with lid', 'disposable food containers', 'takeaway containers', 'plastic containers',
    'sauce cups', 'cling film', 'food wrap', 'baking paper', 'parchment paper', 'butter paper', 'paper bags', 'kraft paper bags',
    'thermal paper rolls', 'garbage bags', 'bagasse containers', 'eco-friendly packaging', 'bamboo skewers',
    'wholesale food packaging', 'catering supplies Pakistan', 'restaurant packaging', 'packaging supplier Lahore', 'packaging supplier Karachi',
    'White Diamond packaging', 'White Diamond foil',
  ],
  applicationName: 'White Diamond',
  manifest: '/manifest.webmanifest',
  // app/favicon.ico is picked up automatically; the square icon is used for
  // high-resolution tabs and the iPhone home screen. (Never the wide logo — it would be squashed.)
  icons: {
    icon: [{ url: '/favicon.ico', sizes: 'any' }, { url: '/images/logo-icon.png', type: 'image/png', sizes: '512x512' }],
    apple: '/images/logo-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    alternateLocale: ['ar_AE'],
    siteName: 'White Diamond',
    title: 'White Diamond — Food Packaging & Disposables in Pakistan',
    description:
      'Aluminium foil, food containers, cling film, baking paper and eco-friendly packaging at factory prices.',
    images: [
      {
        url: '/images/home/hero-studio-showcase.jpg',
        width: 1400,
        height: 764,
        alt: 'White Diamond Food Packaging',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'White Diamond — Food Packaging & Disposables',
    description:
      'Aluminium foil, food containers, cling film, baking paper and eco-friendly packaging at factory prices.',
    images: ['/images/home/hero-studio-showcase.jpg'],
  },
};

/**
 * Root layout: fonts, language direction and the providers every page needs.
 * The public header/footer live in app/(site)/layout.tsx; the admin has its own shell.
 */
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const localeCookie = (await cookies()).get('locale')?.value;
  const locale: Locale = localeCookie === 'ar' ? 'ar' : 'en';
  const isRTL = locale === 'ar';

  return (
    <html
      lang={locale}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <body className="flex min-h-screen flex-col bg-white font-sans text-brand-ink antialiased">
        <LanguageProvider initialLocale={locale}>
          <CartProvider>
            <ToastProvider>{children}</ToastProvider>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
