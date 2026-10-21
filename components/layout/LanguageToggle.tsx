'use client';

import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

/** EN | AR pill. The active language is highlighted in indigo. */
export default function LanguageToggle({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const { locale, setLocale } = useLanguage();
  const options = [
    { value: 'en' as const, label: 'EN', name: 'English' },
    { value: 'ar' as const, label: 'AR', name: 'العربية' },
  ];
  return (
    <div
      role="group"
      aria-label="Language"
      className={cn('flex items-center rounded-full p-1 text-[11px] font-bold', tone === 'dark' ? 'bg-white/10' : 'bg-brand-tint')}
    >
      {options.map((o) => {
        const active = locale === o.value;
        return (
          <button
            key={o.value}
            type="button"
            lang={o.value}
            onClick={() => setLocale(o.value)}
            aria-pressed={active}
            aria-label={o.name}
            className={cn(
              'rounded-full px-2.5 py-1 transition-colors',
              active
                ? 'bg-brand-secondary text-white shadow-sm'
                : tone === 'dark'
                  ? 'text-[#C7D2FE] hover:text-white'
                  : 'text-brand-secondary hover:text-brand-navy',
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
