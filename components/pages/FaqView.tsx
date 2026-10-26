'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { routes } from '@/lib/routes';
import { whatsappLink } from '@/lib/phone';
import BrandIcon from '@/components/layout/BrandIcon';
import PageHero from './PageHero';
import { pillClass } from './buttons';
import { usePageTexts } from './usePageTexts';

/**
 * /faq — grouped questions. Uses native <details>, so it works with the keyboard,
 * screen readers and even before JavaScript loads.
 */
export default function FaqView({ whatsapp }: { whatsapp: string }) {
  const { p, t } = usePageTexts();
  const f = p.faq;

  return (
    <>
      <PageHero eyebrow={f.eyebrow} title={f.title} intro={f.intro} />

      <div className="mx-auto grid w-full max-w-site gap-10 px-5 py-16 sm:px-6 lg:grid-cols-12 lg:px-12 lg:py-20">
        <nav aria-label={p.common.onThisPage} className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-28 rounded-2xl bg-brand-tint p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-muted">{p.common.onThisPage}</p>
            <ul className="mt-3 space-y-1">
              {f.groups.map((g, i) => (
                <li key={g.title}>
                  <a href={`#faq-${i}`} className="block rounded-lg px-3 py-2 text-sm font-semibold text-brand-navy hover:bg-white">
                    {g.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="space-y-12 lg:col-span-9">
          {f.groups.map((g, i) => (
            <section key={g.title} id={`faq-${i}`} className="scroll-mt-28">
              <h2 className="font-heading text-2xl font-bold text-brand-ink">{g.title}</h2>
              <div className="mt-5 divide-y divide-brand-border overflow-hidden rounded-2xl border border-brand-border bg-white">
                {g.items.map((item) => (
                  <details key={item.q} className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-heading text-[15px] font-bold text-brand-navy transition-colors hover:bg-brand-tint/50 sm:px-6 [&::-webkit-details-marker]:hidden">
                      {item.q}
                      <ChevronDown className="h-5 w-5 shrink-0 text-brand-secondary transition-transform group-open:rotate-180" aria-hidden />
                    </summary>
                    <p className="px-5 pb-5 text-sm leading-7 text-brand-muted sm:px-6">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}

          <div className="rounded-3xl bg-brand-tint p-8 text-brand-ink ring-1 ring-brand-border">
            <h2 className="font-heading text-2xl font-bold">{f.stillTitle}</h2>
            <p className="mt-2 text-sm text-brand-muted">{f.stillText}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={whatsappLink(whatsapp, t.whatsapp.message)} target="_blank" rel="noreferrer" className={pillClass('primary')}>
                <BrandIcon name="whatsapp" className="h-4 w-4" />
                {p.common.ctaWhatsapp}
              </a>
              <Link href={routes.contact} className={pillClass('outline')}>{p.common.ctaContact}</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
