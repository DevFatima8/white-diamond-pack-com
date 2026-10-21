'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CircleCheck, CircleHelp } from 'lucide-react';
import type { ProductCardData } from '@/lib/catalog-types';
import { INDUSTRIES, industryBySlug } from '@/lib/industries';
import { industryHref, routes } from '@/lib/routes';
import { Eyebrow, SectionTitle } from '@/components/ui/SectionRail';
import ProductCard from '@/components/shop/ProductCard';
import PageHero from './PageHero';
import CtaBand from './CtaBand';
import { pillClass } from './buttons';
import { usePageTexts } from './usePageTexts';

/** /industries/[slug] — needs, our solutions and recommended products for one industry. */
export default function IndustryDetailView({ slug, products, whatsapp }: { slug: string; products: ProductCardData[]; whatsapp: string }) {
  const { p, t } = usePageTexts();
  const ti = p.industries;
  const industry = industryBySlug(slug);
  if (!industry) return null; // the page checks the slug before rendering

  const { key, icon: Icon, image } = industry;
  const detail = ti.detail[key];

  return (
    <>
      <PageHero eyebrow={t.industries[key].title} title={t.industries[key].title} intro={detail.intro} crumbs={[{ label: ti.eyebrow, href: routes.industries }]}>
        <Link href={routes.bulkQuote} className={pillClass('primary')}>{p.common.ctaQuote}</Link>
        <Link href={routes.shop} className={pillClass('ghost-dark')}>{p.common.shopNow}</Link>
      </PageHero>

      <section className="mx-auto grid w-full max-w-site gap-10 px-5 py-16 sm:px-6 lg:grid-cols-12 lg:px-12 lg:py-20">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-brand-tint shadow-level-2 lg:col-span-5 lg:aspect-auto lg:min-h-[420px]">
          <Image src={image} alt="" fill sizes="(min-width: 1024px) 480px, 100vw" className="object-cover" />
          <span className="absolute start-5 top-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-secondary shadow-level-2">
            <Icon className="h-7 w-7" aria-hidden />
          </span>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
          <div className="rounded-3xl bg-brand-tint p-6 sm:p-8">
            <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-brand-navy">
              <CircleHelp className="h-6 w-6 text-brand-secondary" aria-hidden />
              {ti.needsTitle}
            </h2>
            <ul className="mt-5 space-y-3">
              {detail.needs.map((n) => (
                <li key={n} className="flex items-start gap-2.5 text-sm leading-6 text-brand-ink">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-secondary" aria-hidden />
                  {n}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-brand-navy p-6 text-white sm:p-8">
            <h2 className="flex items-center gap-2 font-heading text-xl font-bold">
              <CircleCheck className="h-6 w-6 text-brand-primary" aria-hidden />
              {ti.solutionsTitle}
            </h2>
            <ul className="mt-5 space-y-3">
              {detail.solutions.map((s) => (
                <li key={s} className="flex items-start gap-2.5 text-sm leading-6 text-[#E2E7FF]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" aria-hidden />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-brand-tint/60 py-16">
        <div className="mx-auto max-w-site px-5 sm:px-6 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>{t.industries[key].title}</Eyebrow>
              <SectionTitle>{ti.productsTitle}</SectionTitle>
            </div>
            <Link href={routes.shop} className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-secondary hover:text-brand-secondary-hover">
              {ti.viewAllProducts}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
            </Link>
          </div>
          {products.length ? (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="mt-8 rounded-2xl bg-white p-8 text-center text-sm text-brand-muted">{ti.productsEmpty}</p>
          )}
        </div>
      </section>

      <section className="mx-auto w-full max-w-site px-5 pt-16 sm:px-6 lg:px-12">
        <h2 className="font-heading text-xl font-bold text-brand-ink">{ti.otherIndustries}</h2>
        <ul className="mt-4 flex flex-wrap gap-3">
          {INDUSTRIES.filter((i) => i.slug !== slug).map(({ key: k, slug: s, icon: OtherIcon }) => (
            <li key={k}>
              <Link
                href={industryHref(s)}
                className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-white px-4 py-2 text-sm font-semibold text-brand-navy transition-colors hover:border-brand-secondary hover:text-brand-secondary"
              >
                <OtherIcon className="h-4 w-4" aria-hidden />
                {t.industries[k].title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand whatsapp={whatsapp} />
    </>
  );
}
