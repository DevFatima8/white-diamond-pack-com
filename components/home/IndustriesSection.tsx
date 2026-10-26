'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { INDUSTRIES } from '@/lib/industries';
import { industryHref } from '@/lib/routes';
import Reveal from '@/components/ui/Reveal';
import { Eyebrow, SectionTitle } from '@/components/ui/SectionRail';

/** "Serving every corner of Pakistan's food industry" — 6 industry cards. */
export default function IndustriesSection() {
  const { t } = useLanguage();
  const ti = t.home.industries;

  return (
    <section className="bg-white py-16">
      <div className="mx-auto flex max-w-site flex-col gap-10 px-5 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>{ti.eyebrow}</Eyebrow>
          <SectionTitle>{ti.title}</SectionTitle>
          <p className="mt-2 text-[15px] leading-6 text-brand-muted">{ti.text}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map(({ key, slug, icon: Icon }, i) => (
            <Reveal key={key} delay={(i % 3) * 0.06} className="h-full">
              <Link
                href={industryHref(slug)}
                className="group flex h-full items-start gap-4 rounded-2xl bg-brand-tint/60 p-6 transition duration-300 hover:bg-white hover:shadow-level-2"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FCE8E9] text-[#5C0E0E] transition-colors group-hover:bg-brand-secondary group-hover:text-white">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <span>
                  <span className="mb-1 block font-heading text-xl font-bold text-brand-ink">{t.industries[key].title}</span>
                  <span className="block text-[13px] leading-5 text-brand-muted">{t.industries[key].desc}</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
