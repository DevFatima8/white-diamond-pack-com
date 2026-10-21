'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Shapes } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { fill } from '@/lib/i18n/translations';
import { categoryHref, routes } from '@/lib/routes';
import type { CategoryItem } from '@/lib/categories';
import Reveal from '@/components/ui/Reveal';
import SectionRail, { Eyebrow, SectionTitle } from '@/components/ui/SectionRail';

/** "Shop by Category" — every active category from the database. */
export default function CategoryGrid({ categories }: { categories: CategoryItem[] }) {
  const { t, isRTL } = useLanguage();
  const tc = t.home.categories;
  if (categories.length === 0) return null;

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-site px-5 sm:px-6 lg:px-12">
        <SectionRail label={tc.label} icon={Shapes}>
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Eyebrow>{tc.eyebrow}</Eyebrow>
              <SectionTitle>{tc.title}</SectionTitle>
            </div>
            <Link href={routes.shop} className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-secondary transition-colors hover:text-brand-primary">
              {tc.viewAll}
              <ArrowRight className="h-[18px] w-[18px] rtl:rotate-180" aria-hidden />
            </Link>
          </div>

          {/* 2 compact columns on phones (as in the mobile design), 2 → 3 on larger screens */}
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {categories.map((c, i) => (
              <Reveal key={c.id} delay={(i % 3) * 0.06} className="h-full">
                <Link
                  href={categoryHref(c.slug)}
                  className="group flex h-full flex-col justify-between rounded-2xl border border-brand-border/70 bg-white p-3 shadow-level-1 sm:p-6 transition duration-300 hover:-translate-y-1 hover:shadow-level-2"
                >
                  <div>
                    <div className="relative mb-3 h-28 overflow-hidden rounded-xl bg-brand-surface sm:mb-5 sm:h-44">
                      <Image
                        src={c.image || '/images/product-placeholder.png'}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 30vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute end-2 top-2 hidden rounded-full bg-brand-navy-dark px-2.5 py-1 text-[11px] font-bold text-white sm:end-3 sm:top-3 sm:block">
                        {fill(t.nav.productsCount, { n: c.count })}
                      </span>
                    </div>
                    <h3 className="font-heading text-sm font-bold leading-5 text-brand-ink transition-colors group-hover:text-brand-primary sm:text-xl sm:leading-7">
                      {isRTL ? c.nameAr : c.name}
                    </h3>
                    {(isRTL ? c.descriptionAr : c.description) && (
                      <p className="mt-2 hidden text-[13px] leading-5 text-brand-muted sm:block">{isRTL ? c.descriptionAr : c.description}</p>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-brand-border pt-3 text-[11px] font-bold text-brand-secondary sm:mt-4 sm:pt-5 sm:text-xs">
                    {fill(tc.explore, { n: c.count })}
                    <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1.5 sm:h-5 sm:w-5 rtl:rotate-180 rtl:group-hover:-translate-x-1.5" aria-hidden />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </SectionRail>
      </div>
    </section>
  );
}
