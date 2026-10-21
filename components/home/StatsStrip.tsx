'use client';

import { useLanguage } from '@/context/LanguageContext';
import CountUp from '@/components/ui/CountUp';

// Dummy figures from the design — replace with the real numbers before launch.
const VALUES = [
  { value: 4, suffix: '' },
  { value: 18, suffix: '' },
  { value: 50, suffix: '+' },
  { value: 1200, suffix: '+' },
];

/** Light tint strip with 4 count-up numbers. */
export default function StatsStrip() {
  const { t } = useLanguage();
  return (
    <section className="bg-brand-tint py-14">
      <ul className="mx-auto grid max-w-site grid-cols-2 gap-4 px-5 sm:gap-6 sm:px-6 lg:grid-cols-4 lg:px-12">
        {t.home.stats.map((s, i) => (
          <li key={s.label} className="flex flex-col items-center rounded-2xl bg-white p-6 text-center shadow-level-1">
            <CountUp value={VALUES[i].value} suffix={VALUES[i].suffix} className="mb-2 font-heading text-[40px] font-bold leading-none text-brand-secondary sm:text-5xl" />
            <span className="font-heading text-base font-bold text-brand-ink">{s.label}</span>
            <span className="mt-1 text-[13px] text-brand-muted">{s.desc}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
