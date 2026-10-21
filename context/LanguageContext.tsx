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

export function LanguageProvider({
  children,
  initialLocale = 'en',
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check cookie or localStorage on client mount
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(new RegExp('(?:^|; )locale=([^;]+)'));
      const saved = match ? (match[1] as Locale) : (localStorage.getItem('locale') as Locale | null);
      if (saved && (saved === 'en' || saved === 'ar') && saved !== locale) {
        setLocaleState(saved);
        applyLocaleAttributes(saved);
        return;
      }
    }
    applyLocaleAttributes(locale);
  }, []);

  const applyLocaleAttributes = (targetLocale: Locale) => {
    if (typeof document !== 'undefined') {
      const isArabic = targetLocale === 'ar';
      document.documentElement.setAttribute('lang', targetLocale);
      document.documentElement.setAttribute('dir', isArabic ? 'rtl' : 'ltr');
      if (isArabic) {
        document.documentElement.classList.add('rtl');
      } else {
        document.documentElement.classList.remove('rtl');
      }
    }
  };

  const setLocale = (newLocale: Locale) => {
    if (newLocale !== 'en' && newLocale !== 'ar') return;
    setLocaleState(newLocale);
    applyLocaleAttributes(newLocale);

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
      } catch (e) {
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
