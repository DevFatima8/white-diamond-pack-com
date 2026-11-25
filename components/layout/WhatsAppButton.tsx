'use client';

import { useLanguage } from '@/context/LanguageContext';
import { whatsappLink } from '@/lib/phone';
import BrandIcon from './BrandIcon';

/**
 * Floating "Chat on WhatsApp" button: bottom-right in English, bottom-left in Arabic
 * (`end-*` is a logical position that follows the reading direction).
 * WhatsApp brand green on the icon badge so it matches the real app.
 * Shows a compact round button on phones and a labelled pill on larger screens.
 */
export default function WhatsAppButton({ number }: { number: string }) {
  const { t } = useLanguage();
  return (
    <a
      href={whatsappLink(number, t.whatsapp.message)}
      target="_blank"
      rel="noreferrer"
      aria-label={t.whatsapp.label}
      className="group fixed bottom-5 end-5 z-30 flex items-center gap-3 rounded-full bg-white p-2 text-brand-ink shadow-level-3 ring-1 ring-brand-border transition hover:-translate-y-0.5 sm:pe-5 print:hidden"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-icon-whatsapp text-white transition-colors group-hover:bg-icon-whatsapp-hover">
        <BrandIcon name="whatsapp" className="h-5 w-5" />
      </span>
      <span className="hidden flex-col leading-tight sm:flex">
        <span className="text-sm font-semibold">{t.whatsapp.label}</span>
        <span className="text-[11px] text-brand-muted" dir="ltr">
          +{number}
        </span>
      </span>
    </a>
  );
}
