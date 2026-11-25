'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { routes } from '@/lib/routes';
import { whatsappLink } from '@/lib/phone';
import BrandIcon from '@/components/layout/BrandIcon';
import { usePageTexts } from './usePageTexts';

/** Brand-gradient call-to-action at the bottom of content pages. */
export default function CtaBand({ whatsapp, title, text }: { whatsapp: string; title?: string; text?: string }) {
  const { p, t } = usePageTexts();
  const c = p.common;

  return (
    <section className="mx-auto w-full max-w-site px-5 py-16 sm:px-6 lg:px-12">
      <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#C1121F_0%,#8B1414_100%)] px-6 py-10 text-white shadow-level-3 sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:py-12">
        <div className="pointer-events-none absolute -end-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" aria-hidden />
        <div className="relative max-w-2xl">
          <h2 className="font-heading text-2xl font-bold leading-8 sm:text-[32px] sm:leading-10">{title ?? c.ctaTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-white/85 sm:text-base">{text ?? c.ctaText}</p>
        </div>
        <div className="relative mt-6 flex flex-wrap gap-3 lg:mt-0 lg:shrink-0">
          <Link href={routes.bulkQuote} className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-brand-navy transition-colors hover:bg-brand-tint">
            {c.ctaQuote}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
          </Link>
          <a
            href={whatsappLink(whatsapp, t.whatsapp.message)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-icon-whatsapp px-6 text-sm font-bold text-white transition-colors hover:bg-icon-whatsapp-hover"
          >
            <BrandIcon name="whatsapp" className="h-4 w-4" />
            {c.ctaWhatsapp}
          </a>
        </div>
      </div>
    </section>
  );
}
