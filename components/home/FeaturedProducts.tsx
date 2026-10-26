'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import type { ProductCardData } from '@/lib/catalog-types';
import ProductCard from '@/components/shop/ProductCard';
import { Eyebrow, SectionTitle } from '@/components/ui/SectionRail';

/** "Featured & Best Selling" — products marked Featured in the admin, with category filter pills. */
export default function FeaturedProducts({ products }: { products: ProductCardData[] }) {
  const { t, isRTL } = useLanguage();
  const tf = t.home.featured;
  const [filter, setFilter] = useState<string>('all');

  // Pills = the categories that actually have featured products
  const pills = useMemo(() => {
    const seen = new Map<string, string>();
    for (const p of products) if (p.category && !seen.has(p.category.slug)) seen.set(p.category.slug, isRTL ? p.category.nameAr : p.category.nameEn);
    return [...seen.entries()];
  }, [products, isRTL]);

  const shown = filter === 'all' ? products : products.filter((p) => p.category?.slug === filter);

  return (
    <section className="bg-white py-16">
      <div className="mx-auto flex max-w-site flex-col gap-10 px-5 sm:px-6 lg:px-12">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <Eyebrow>{tf.eyebrow}</Eyebrow>
            <SectionTitle>{tf.title}</SectionTitle>
          </div>
          {pills.length > 1 && (
            <div className="scrollbar-none -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0" role="group" aria-label={tf.title}>
              {[['all', tf.all] as const, ...pills].map(([slug, label]) => (
                <button
                  key={slug}
                  type="button"
                  onClick={() => setFilter(slug)}
                  aria-pressed={filter === slug}
                  className={cn(
                    'shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors',
                    filter === slug ? 'bg-brand-secondary font-bold text-white shadow-sm' : 'bg-brand-tint text-brand-secondary hover:bg-[#FCE8E9]',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {products.length === 0 ? (
          <p className="rounded-2xl bg-brand-surface p-8 text-center text-sm text-brand-muted">{tf.empty}</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {/* 2 compact columns on phones (as in the mobile design) */}
            {shown.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <div className="flex justify-center">
          <Link
            href={routes.shop}
            className="inline-flex items-center gap-2 rounded-full border border-brand-border px-6 py-3 text-sm font-semibold text-brand-navy transition-colors hover:border-brand-secondary hover:bg-brand-tint"
          >
            {tf.viewAll}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
