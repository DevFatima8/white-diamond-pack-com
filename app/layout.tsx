import type { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import { Plus_Jakarta_Sans, Outfit, Cairo } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import HeaderWrapper from '@/components/HeaderWrapper';
import Footer from '@/components/Footer';
import type { Locale } from '@/lib/i18n/translations';

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const fontHeading = Outfit({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['500', '600', '700', '800'],
  display: 'swap',
});

const fontArabic = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-arabic',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'White Diamond — Leader in Food Packaging & Disposables',
  description:
    'White Diamond / Falcon Pack is a premier manufacturer and distributor of disposable food packaging containers and catering supplies across the UAE and global markets.',
  // app/favicon.ico is picked up automatically; the square icon is used for
  // high-resolution tabs and the iPhone home screen. (Never the wide logo — it would be squashed.)
  icons: {
    icon: [{ url: '/favicon.ico', sizes: 'any' }, { url: '/images/logo-icon.png', type: 'image/png', sizes: '512x512' }],
    apple: '/images/logo-icon.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  // Set by proxy.ts on /admin requests. (If a visitor fakes it elsewhere, they only
  // unstyle their own page.) TODO(Phase 4): remove with the legacy CSS.
  const isAdmin = (await headers()).get('x-wd-area') === 'admin';
  const localeCookie = cookieStore.get('locale')?.value;
  const locale: Locale = localeCookie === 'ar' ? 'ar' : 'en';
  const isRTL = locale === 'ar';

  return (
    <html
      lang={locale}
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`${fontSans.variable} ${fontHeading.variable} ${fontArabic.variable} ${
        isRTL ? 'rtl' : ''
      }`}
    >
      <head>
        {/* Legacy template CSS for the public site only — kept out of the admin, where
            Bootstrap's !important utilities (.p-5, .mt-3 …) break Tailwind spacing. */}
        {!isAdmin && (
          <>
            <link href="/css/bootstrap.min.css" rel="stylesheet" type="text/css" id="bootstrap" />
            <link href="/css/plugins.css" rel="stylesheet" type="text/css" />
            <link href="/css/style.css" rel="stylesheet" type="text/css" />
            <link href="/css/colors/scheme-01.css" rel="stylesheet" type="text/css" id="colors" />
          </>
        )}
      </head>
      <body className="min-h-screen bg-background font-sans antialiased flex flex-col">
        <LanguageProvider initialLocale={locale}>
          <CartProvider>
            <ToastProvider>
              <HeaderWrapper />
              <div className="flex-1 w-full flex flex-col">
                {children}
              </div>
              <Footer />
            </ToastProvider>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
