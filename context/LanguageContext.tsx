'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Locale, Translations, translations } from '@/lib/i18n/translations';

interface LanguageContextType {
  locale: Locale;
  isRTL: boolean;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function applyLocaleAttributes(targetLocale: Locale) {
  const isArabic = targetLocale === 'ar';
  const html = document.documentElement;
  html.setAttribute('lang', targetLocale);
  html.setAttribute('dir', isArabic ? 'rtl' : 'ltr');
  html.classList.toggle('rtl', isArabic);
}

export function LanguageProvider({
  children,
  initialLocale = 'en',
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  // Keep <html lang/dir> in sync with the current language.
  // (The server already sets them from the `locale` cookie on first load.)
  useEffect(() => {
    applyLocaleAttributes(locale);
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    if (newLocale !== 'en' && newLocale !== 'ar') return;
    setLocaleState(newLocale);

    if (typeof document !== 'undefined') {
      // 1 year expiration
      const maxAge = 60 * 60 * 24 * 365;
      document.cookie = `locale=${newLocale}; path=/; max-age=${maxAge}; SameSite=Lax`;
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${maxAge}; SameSite=Lax`;
      if (newLocale === 'ar') {
        document.cookie = `googtrans=/en/ar; path=/; max-age=${maxAge}; SameSite=Lax`;
      } else {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }
      try {
        localStorage.setItem('locale', newLocale);
      } catch {
        // Ignore localStorage error if cookies disabled
      }
    }
  };

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'ar' : 'en');
  };

  const isRTL = locale === 'ar';
  const currentTranslations = translations[locale] || translations.en;

  return (
    <LanguageContext.Provider
      value={{
        locale,
        isRTL,
        setLocale,
        toggleLocale,
        t: currentTranslations,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback for components used outside provider during SSR/testing
    return {
      locale: 'en' as Locale,
      isRTL: false,
      setLocale: () => {},
      toggleLocale: () => {},
      t: translations.en,
    };
  }
  return context;
}
