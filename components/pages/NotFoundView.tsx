'use client';

import Link from 'next/link';
import { Home, Mail, ShoppingBag } from 'lucide-react';
import { routes } from '@/lib/routes';
import { pillClass } from './buttons';
import { usePageTexts } from './usePageTexts';

/** Branded 404 content (used by app/not-found.tsx and app/(site)/not-found.tsx). */
export default function NotFoundView() {
  const { p } = usePageTexts();
  const n = p.notFound;

  return (
    <section className="relative flex flex-1 items-center overflow-hidden bg-brand-tint/60 py-20 sm:py-28">
      <div className="pointer-events-none absolute -end-24 -top-24 h-80 w-80 rounded-full bg-brand-secondary/15 blur-3xl" aria-hidden />
      <div className="relative mx-auto max-w-2xl px-5 text-center">
        <p className="bg-[linear-gradient(135deg,#E63946_0%,#6366F1_100%)] bg-clip-text font-heading text-[96px] font-bold leading-none tracking-tighter text-transparent sm:text-[140px]">
          {n.code}
        </p>
        <h1 className="mt-4 font-heading text-[28px] font-bold leading-9 text-brand-ink sm:text-4xl">{n.title}</h1>
        <p className="mx-auto mt-3 max-w-md text-base leading-7 text-brand-muted">{n.text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={routes.home} className={pillClass('primary')}>
            <Home className="h-4 w-4" aria-hidden />
            {n.home}
          </Link>
          <Link href={routes.shop} className={pillClass('secondary')}>
            <ShoppingBag className="h-4 w-4" aria-hidden />
            {n.shop}
          </Link>
          <Link href={routes.contact} className={pillClass('outline')}>
            <Mail className="h-4 w-4" aria-hidden />
            {n.contact}
          </Link>
        </div>
      </div>
    </section>
  );
}
