'use client';

import { useLanguage } from '@/context/LanguageContext';
import { whatsappLink } from '@/lib/phone';
import BrandIcon from './BrandIcon';

/**
 * Floating "Chat on WhatsApp" button: bottom-right in English, bottom-left in Arabic
 * (`end-*` is a logical position that follows the reading direction).
 * Brand colours (navy + red), not WhatsApp green — the brief allows no green.
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
      className="group fixed bottom-5 end-5 z-30 flex items-center gap-3 rounded-full bg-brand-navy-dark p-2 text-white shadow-level-3 ring-1 ring-white/10 transition hover:-translate-y-0.5 sm:pe-5 print:hidden"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-primary transition-colors group-hover:bg-brand-primary-hover">
        <BrandIcon name="whatsapp" className="h-5 w-5" />
      </span>
      <span className="hidden flex-col leading-tight sm:flex">
        <span className="text-sm font-semibold">{t.whatsapp.label}</span>
        <span className="text-[11px] text-[#C7D2FE]/80" dir="ltr">
          +{number}
        </span>
      </span>
    </a>
  );
}
