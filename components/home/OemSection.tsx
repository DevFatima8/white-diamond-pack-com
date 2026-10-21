'use client';

import Link from 'next/link';
import { Globe, Leaf, PenTool, Printer, Ruler } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { routes } from '@/lib/routes';
import Reveal from '@/components/ui/Reveal';

const ICONS = [Printer, Ruler, Leaf, Globe];

/** "Custom OEM & Private Label" — 4 numbered cards + call to action. */
export default function OemSection() {
  const { t } = useLanguage();
  const to = t.home.oem;

  return (
    <section className="bg-brand-navy-dark py-20 text-white">
      <div className="mx-auto flex max-w-site flex-col gap-12 px-5 sm:px-6 lg:px-12">
        <div className="max-w-4xl">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-[#818CF8]">{to.eyebrow}</span>
          <h2 className="font-heading text-[28px] font-bold leading-9 tracking-tight sm:text-[40px] sm:leading-[48px]">{to.title}</h2>
          <p className="mt-3 text-base leading-7 text-[#DAE2FD]/80 sm:text-lg sm:leading-8">{to.text}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {to.cards.map((card, i) => {
            const Icon = ICONS[i];
            return (
              <Reveal key={card.title} delay={i * 0.06} className="h-full">
                <div className="flex h-full flex-col justify-between rounded-2xl bg-white/5 p-6 transition-colors hover:bg-white/10">
                  <div>
                    <span className="mb-4 block font-heading text-4xl font-bold text-[#818CF8]">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="mb-2 font-heading text-xl font-bold">{card.title}</h3>
                    <p className="text-[13px] leading-5 text-[#DAE2FD]/80">{card.desc}</p>
                  </div>
                  <Icon className="mt-6 h-6 w-6 text-[#818CF8]" aria-hidden />
                </div>
              </Reveal>
            );
          })}
        </div>

        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-brand-navy p-6 shadow-xl sm:flex-row sm:p-8">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-primary">
              <PenTool className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <h3 className="font-heading text-xl font-bold">{to.ctaTitle}</h3>
              <p className="text-[13px] text-[#DAE2FD]/80">{to.ctaText}</p>
            </div>
          </div>
          <Link
            href={routes.customPackaging}
            className="shrink-0 rounded-full bg-brand-primary px-8 py-3.5 text-center text-sm font-bold uppercase tracking-wider shadow-md transition hover:bg-brand-primary-hover active:scale-95"
          >
            {to.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
