'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { INDUSTRIES } from '@/lib/industries';
import { industryHref } from '@/lib/routes';
import Reveal from '@/components/ui/Reveal';
import PageHero from './PageHero';
import CtaBand from './CtaBand';
import { usePageTexts } from './usePageTexts';

/** /industries — one card per industry, each linking to its detail page. */
export default function IndustriesView({ whatsapp }: { whatsapp: string }) {
  const { p, t } = usePageTexts();
  const ti = p.industries;

  return (
    <>
      <PageHero eyebrow={ti.eyebrow} title={ti.title} intro={ti.intro} />

      <section className="mx-auto w-full max-w-site px-5 py-16 sm:px-6 lg:px-12 lg:py-20">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map(({ key, slug, icon: Icon, image }, i) => (
            <li key={key} className="h-full">
              <Reveal delay={(i % 3) * 0.06} className="h-full">
                <Link
                  href={industryHref(slug)}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-brand-border bg-white transition duration-300 hover:-translate-y-1 hover:shadow-level-2"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-brand-tint">
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute bottom-4 start-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-brand-secondary shadow-level-2">
                      <Icon className="h-6 w-6" aria-hidden />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="font-heading text-xl font-bold text-brand-ink">{t.industries[key].title}</h2>
                    <p className="mt-2 text-sm leading-6 text-brand-muted">{ti.detail[key].intro}</p>
                    <ul className="mt-4 space-y-1.5">
                      {ti.detail[key].solutions.slice(0, 3).map((s) => (
                        <li key={s} className="flex items-start gap-2 text-[13px] text-brand-ink">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-secondary" aria-hidden />
                          {s}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-bold text-brand-primary">
                      {ti.viewSolutions}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" aria-hidden />
                    </span>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand whatsapp={whatsapp} />
    </>
  );
}
