'use client';

import { useLanguage } from '@/context/LanguageContext';
import { pageTexts } from '@/lib/i18n/pages';

/** Language context + the content-page texts (lib/i18n/pages.ts) for the current language. */
export function usePageTexts() {
  const lang = useLanguage();
  return { ...lang, p: pageTexts[lang.locale] ?? pageTexts.en };
}
