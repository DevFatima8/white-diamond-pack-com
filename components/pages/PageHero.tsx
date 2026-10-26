'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { routes } from '@/lib/routes';

/**
 * Light banner at the top of every content page (same look as the shop banner):
 * breadcrumb, eyebrow, title, intro and optional buttons.
 */
export default function PageHero({
  eyebrow,
  title,
  intro,
  crumbs = [],
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  /** Links between "Home" and the current page, e.g. Industries on an industry page. */
  crumbs?: { label: string; href: string }[];
  children?: ReactNode;
}) {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden border-b border-brand-border bg-brand-tint text-brand-ink">
      <div className="pointer-events-none absolute -end-32 -top-32 h-80 w-80 rounded-full bg-brand-secondary/15 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-40 -start-24 h-72 w-72 rounded-full bg-brand-primary/10 blur-3xl" aria-hidden />
      <div className="relative mx-auto max-w-site px-5 pb-12 pt-8 sm:px-6 lg:px-12 lg:pb-16">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs">
          <ol className="flex flex-wrap items-center gap-1.5 text-brand-muted">
            <li>
              <Link href={routes.home} className="hover:text-brand-secondary">{t.nav.home}</Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.href} className="flex items-center gap-1.5">
                <span aria-hidden>/</span>
                <Link href={c.href} className="hover:text-brand-secondary">{c.label}</Link>
              </li>
            ))}
            <li aria-hidden>/</li>
            <li>
              <span aria-current="page" className="rounded-full bg-brand-secondary px-2.5 py-0.5 font-semibold text-white">{eyebrow}</span>
            </li>
          </ol>
        </nav>
        <div className="max-w-3xl">
          <span className="mb-3 inline-block rounded-full bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-[0.14em] text-brand-secondary ring-1 ring-brand-border">
            {eyebrow}
          </span>
          <h1 className="font-heading text-[30px] font-bold leading-[38px] tracking-tight sm:text-[44px] sm:leading-[52px]">{title}</h1>
          {intro && <p className="mt-4 text-base leading-7 text-brand-muted sm:text-lg sm:leading-8">{intro}</p>}
          {children && <div className="mt-7 flex flex-wrap gap-3">{children}</div>}
        </div>
      </div>
    </section>
  );
}
