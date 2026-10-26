'use client';

import { useRouter } from 'next/navigation';
import { RotateCcw, Store } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { whatsappLink } from '@/lib/phone';
import BrandIcon from '@/components/layout/BrandIcon';

/** Shown instead of the product grid when the database can't be reached. */
export default function ShopUnavailable({ whatsapp }: { whatsapp: string }) {
  const { t } = useLanguage();
  const router = useRouter();
  const ts = t.shop;

  return (
    <section className="flex flex-1 items-center bg-brand-tint/60 py-20 sm:py-28">
      <div className="mx-auto max-w-lg px-5 text-center" role="status">
        <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-brand-secondary shadow-level-2">
          <Store className="h-8 w-8" aria-hidden />
        </span>
        <h1 className="font-heading text-2xl font-bold text-brand-ink sm:text-3xl">{ts.unavailableTitle}</h1>
        <p className="mt-3 text-sm leading-6 text-brand-muted sm:text-base">{ts.unavailableText}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => router.refresh()}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-primary px-6 text-sm font-bold text-white hover:bg-brand-primary-hover"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            {ts.tryAgain}
          </button>
          <a
            href={whatsappLink(whatsapp, t.whatsapp.message)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-secondary px-6 text-sm font-bold text-white hover:bg-brand-secondary-hover"
          >
            <BrandIcon name="whatsapp" className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
