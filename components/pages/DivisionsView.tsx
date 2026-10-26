'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, Users } from 'lucide-react';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import Reveal from '@/components/ui/Reveal';
import PageHero from './PageHero';
import CtaBand from './CtaBand';
import { pillClass } from './buttons';
import { usePageTexts } from './usePageTexts';

// Where each division's button leads
const DIVISION_LINK: Record<string, string> = {
  packaging: routes.shop,
  hygiene: routes.shop,
  oem: routes.customPackaging,
};

/** /business-divisions — Packaging, Hygiene and Custom & Private Label. */
export default function DivisionsView({ whatsapp }: { whatsapp: string }) {
  const { p } = usePageTexts();
  const d = p.divisions;

  return (
    <>
      <PageHero eyebrow={d.eyebrow} title={d.title} intro={d.intro} />

      <div className="mx-auto w-full max-w-site space-y-16 px-5 py-16 sm:px-6 lg:space-y-24 lg:px-12 lg:py-24">
        {d.items.map((item, i) => (
          <section key={item.key} id={item.key} className="grid scroll-mt-28 items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <Reveal className={cn(i % 2 === 1 && 'lg:order-2')}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-brand-tint shadow-level-2">
                <Image src={item.image} alt={item.title} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
                <span className="absolute start-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-secondary shadow-level-1">
                  {item.tag}
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-brand-secondary">{item.tag}</span>
              <h2 className="mt-1 font-heading text-[28px] font-bold leading-9 tracking-tight text-brand-ink sm:text-4xl sm:leading-[44px]">{item.title}</h2>
              <p className="mt-4 text-base leading-7 text-brand-muted">{item.desc}</p>

              <h3 className="mt-6 text-sm font-bold uppercase tracking-wider text-brand-navy">{d.whatWeMake}</h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {item.makes.map((m) => (
                  <li key={m} className="flex items-start gap-2 text-sm text-brand-ink">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-secondary" aria-hidden />
                    {m}
                  </li>
                ))}
              </ul>

              <p className="mt-6 flex items-start gap-3 rounded-2xl bg-brand-tint p-5 text-sm leading-6 text-brand-ink sm:p-6">
                <Users className="mt-0.5 h-5 w-5 shrink-0 text-brand-secondary" aria-hidden />
                <span>
                  <span className="font-bold">{d.whoFor}: </span>
                  {item.audience}
                </span>
              </p>

              <Link href={DIVISION_LINK[item.key] ?? routes.shop} className={pillClass(item.key === 'oem' ? 'primary' : 'secondary', 'mt-6')}>
                {item.key === 'oem' ? p.common.ctaQuote : p.common.shopNow}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
              </Link>
            </Reveal>
          </section>
        ))}
      </div>

      <CtaBand whatsapp={whatsapp} />
    </>
  );
}
