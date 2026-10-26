'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, LayoutGrid, List, PackageSearch, Search, SlidersHorizontal, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { fill, translations } from '@/lib/i18n/translations';
import { unitName } from '@/lib/i18n/units';
import { whatsappLink } from '@/lib/phone';
import { categoryHref, productHref, routes } from '@/lib/routes';
import { SORTS, shopHref, type ShopParams, type ShopSort } from '@/lib/shop-params';
import { cn, formatPrice } from '@/lib/utils';
import type { CategoryItem } from '@/lib/categories';
import type { ProductCardData } from '@/lib/catalog-types';
import BrandIcon from '@/components/layout/BrandIcon';
import Drawer from '@/components/layout/Drawer';
import ProductCard from './ProductCard';

export interface ShopViewProps {
  basePath: string; // '/shop' or '/category/<slug>'
  fixedCategory?: CategoryItem; // set on /category/<slug>
  params: ShopParams;
  products: ProductCardData[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
  priceBounds: { min: number; max: number };
  categories: CategoryItem[];
  whatsapp: string;
}

export default function ShopView(props: ShopViewProps) {
  const { basePath, fixedCategory, params, products, total, page, pageCount, pageSize, categories, whatsapp } = props;
  const { t, isRTL } = useLanguage();
  const ts = t?.shop || translations.en.shop;
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);

  const href = (changes: Partial<ShopParams> = {}) => shopHref(basePath, params, changes, !!fixedCategory);
  const catName = (c: CategoryItem) => (isRTL ? c.nameAr : c.name);
  const activeCategory = fixedCategory ?? categories.find((c) => c.slug === params.category);

  // Removable "chips" for the active filters
  const chips: { label: string; href: string }[] = [];
  if (params.q) chips.push({ label: `“${params.q}”`, href: href({ q: '' }) });
  if (!fixedCategory && activeCategory) chips.push({ label: catName(activeCategory), href: href({ category: '' }) });
  if (params.min !== null || params.max !== null)
    chips.push({ label: `${params.min !== null ? formatPrice(params.min) : '…'} – ${params.max !== null ? formatPrice(params.max) : '…'}`, href: href({ min: null, max: null }) });
  if (params.inStock) chips.push({ label: ts.inStockOnly, href: href({ inStock: false }) });

  const resetHref = fixedCategory ? basePath : routes.shop;
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const title = fixedCategory ? catName(fixedCategory) : params.q ? fill(ts.searchResultsFor, { q: params.q }) : ts.title;
  const subtitle = fixedCategory ? (isRTL ? fixedCategory.descriptionAr : fixedCategory.description) ?? ts.subtitle : ts.subtitle;

  const filterPanel = (
    <FilterPanel {...props} chipsCount={chips.length} resetHref={resetHref} onNavigate={() => setSheetOpen(false)} />
  );

  return (
    <>
      {/* Banner */}
      <section className="border-b border-brand-border bg-brand-tint text-brand-ink">
        <div className="mx-auto max-w-site px-5 pb-8 pt-8 sm:px-6 lg:px-12 lg:pb-10">
          <nav aria-label="Breadcrumb" className="mb-5 text-xs">
            <ol className="flex flex-wrap items-center gap-1.5 text-brand-muted">
              <li>
                <Link href={routes.home} className="hover:text-brand-secondary">{t.nav.home}</Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                {fixedCategory ? (
                  <Link href={routes.shop} className="hover:text-brand-secondary">{ts.breadcrumb}</Link>
                ) : (
                  <span className="rounded-full bg-brand-secondary px-2.5 py-0.5 font-semibold text-white">{ts.breadcrumb}</span>
                )}
              </li>
              {fixedCategory && (
                <>
                  <li aria-hidden>/</li>
                  <li>
                    <span className="rounded-full bg-brand-secondary px-2.5 py-0.5 font-semibold text-white" aria-current="page">
                      {catName(fixedCategory)}
                    </span>
                  </li>
                </>
              )}
            </ol>
          </nav>
          <span className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" aria-hidden />
            {ts.eyebrow}
          </span>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-[40px] sm:leading-[48px]">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-muted sm:text-base">{subtitle}</p>

          {/* Category pills */}
          <div className="scrollbar-none -mx-5 mt-6 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
            <Link
              href={shopHref(routes.shop, { ...params, category: '' })}
              className={cn(
                'shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors',
                !activeCategory ? 'bg-brand-secondary text-white' : 'bg-white text-brand-ink ring-1 ring-brand-border hover:text-brand-secondary',
              )}
            >
              {ts.allProducts}
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={categoryHref(c.slug)}
                aria-current={activeCategory?.slug === c.slug ? 'page' : undefined}
                className={cn(
                  'shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors',
                  activeCategory?.slug === c.slug ? 'bg-brand-secondary text-white' : 'bg-white text-brand-ink ring-1 ring-brand-border hover:text-brand-secondary',
                )}
              >
                {catName(c)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-surface py-8 lg:py-10">
        <div className="mx-auto grid max-w-site gap-6 px-5 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-12">
          {/* Desktop filter column */}
          <aside className="hidden space-y-5 lg:block" aria-label={ts.filters}>
            <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-level-1">{filterPanel}</div>
            <div className="rounded-2xl border border-brand-border bg-brand-tint p-6 text-brand-ink">
              <p className="font-heading text-base font-bold">{ts.bulkTitle}</p>
              <p className="mt-1 text-xs leading-5 text-brand-muted">{ts.bulkText}</p>
              <a
                href={whatsappLink(whatsapp, t.whatsapp.message)}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex h-10 items-center justify-center gap-2 rounded-full bg-brand-primary text-xs font-bold uppercase tracking-wider hover:bg-brand-primary-hover"
              >
                <BrandIcon name="whatsapp" className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </aside>

          <div className="min-w-0">
            {/* Toolbar */}
            <div className="mb-5 rounded-2xl border border-brand-border bg-white p-4 shadow-level-1 sm:p-5">
              <div className="flex flex-wrap items-center gap-3">
                <form action={basePath} method="GET" role="search" className="relative min-w-[200px] flex-1">
                  {/* keep the other filters when searching */}
                  {!fixedCategory && params.category && <input type="hidden" name="category" value={params.category} />}
                  {params.min !== null && <input type="hidden" name="min" value={params.min} />}
                  {params.max !== null && <input type="hidden" name="max" value={params.max} />}
                  {params.inStock && <input type="hidden" name="stock" value="1" />}
                  {params.sort !== 'newest' && <input type="hidden" name="sort" value={params.sort} />}
                  {params.view !== 'grid' && <input type="hidden" name="view" value={params.view} />}
                  <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" aria-hidden />
                  <input
                    type="search"
                    name="q"
                    defaultValue={params.q}
                    placeholder={ts.searchPlaceholder}
                    aria-label={ts.searchPlaceholder}
                    className="h-10 w-full rounded-full border border-brand-border bg-brand-surface pe-4 ps-10 text-sm focus:border-brand-secondary focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-brand-secondary/15"
                  />
                </form>

                <button
                  type="button"
                  onClick={() => setSheetOpen(true)}
                  className="flex h-10 items-center gap-2 rounded-full border border-brand-border px-4 text-sm font-semibold text-brand-navy lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" aria-hidden />
                  {ts.filters}
                  {chips.length > 0 && <span className="rounded-full bg-brand-secondary px-1.5 text-[11px] text-white">{chips.length}</span>}
                </button>

                <label className="flex items-center gap-2 text-xs text-brand-muted">
                  <span className="hidden sm:inline">{ts.sortLabel}</span>
                  <select
                    value={params.sort}
                    onChange={(e) => router.push(href({ sort: e.target.value as ShopSort }))}
                    className="h-10 cursor-pointer rounded-full border border-brand-border bg-white pe-8 ps-4 text-sm font-semibold text-brand-ink focus:border-brand-secondary focus:outline-none"
                    aria-label={ts.sortLabel}
                  >
                    {SORTS.map((s) => (
                      <option key={s} value={s}>
                        {{ newest: ts.sort.newest, 'price-asc': ts.sort.priceAsc, 'price-desc': ts.sort.priceDesc, name: ts.sort.name }[s]}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="flex rounded-full border border-brand-border p-1" role="group" aria-label={`${ts.gridView} / ${ts.listView}`}>
                  {(['grid', 'list'] as const).map((v) => {
                    const Icon = v === 'grid' ? LayoutGrid : List;
                    return (
                      <Link
                        key={v}
                        href={href({ view: v, page })}
                        aria-label={v === 'grid' ? ts.gridView : ts.listView}
                        aria-pressed={params.view === v}
                        scroll={false}
                        className={cn('rounded-full p-1.5', params.view === v ? 'bg-brand-secondary text-white' : 'text-brand-muted hover:text-brand-navy')}
                      >
                        <Icon className="h-4 w-4" aria-hidden />
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <p className="text-xs text-brand-muted" aria-live="polite">
                  {fill(ts.showing, { from, to, total })}
                </p>
                {chips.map((c) => (
                  <Link
                    key={c.label}
                    href={c.href}
                    className="inline-flex items-center gap-1 rounded-full bg-brand-tint px-2.5 py-1 text-[11px] font-semibold text-brand-secondary hover:bg-[#FCE8E9]"
                  >
                    {c.label}
                    <X className="h-3 w-3" aria-label="Remove filter" />
                  </Link>
                ))}
                {chips.length > 1 && (
                  <Link href={resetHref} className="text-[11px] font-semibold text-brand-primary hover:underline">
                    {ts.clearAll}
                  </Link>
                )}
              </div>
            </div>

            {/* Results */}
            {products.length === 0 ? (
              <div className="flex flex-col items-center rounded-2xl border border-brand-border bg-white px-6 py-16 text-center">
                <div className="mb-4 rounded-full bg-brand-tint p-4 text-brand-secondary">
                  <PackageSearch className="h-7 w-7" aria-hidden />
                </div>
                <p className="font-heading text-lg font-bold">{ts.noResults}</p>
                <p className="mt-1 text-sm text-brand-muted">{ts.noResultsHint}</p>
                <Link href={resetHref} className="mt-6 rounded-full bg-brand-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-primary-hover">
                  {ts.resetFilters}
                </Link>
              </div>
            ) : params.view === 'list' ? (
              <ul className="space-y-4">
                {products.map((p) => (
                  <li key={p.id}>
                    <ProductRow product={p} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pageCount > 1 && (
              <nav className="mt-8 flex items-center justify-center gap-1" aria-label="Pagination">
                {page > 1 && (
                  <Link href={href({ page: page - 1 })} className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border bg-white hover:bg-brand-tint" aria-label={ts.previous}>
                    <ChevronLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
                  </Link>
                )}
                {Array.from({ length: pageCount }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1)
                  .map((p, i, arr) => (
                    <span key={p} className="flex items-center gap-1">
                      {i > 0 && p - arr[i - 1] > 1 && <span className="px-1 text-brand-muted">…</span>}
                      <Link
                        href={href({ page: p })}
                        aria-current={p === page ? 'page' : undefined}
                        className={cn(
                          'flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold',
                          p === page ? 'bg-brand-secondary text-white' : 'border border-brand-border bg-white hover:bg-brand-tint',
                        )}
                      >
                        {p}
                      </Link>
                    </span>
                  ))}
                {page < pageCount && (
                  <Link href={href({ page: page + 1 })} className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border bg-white hover:bg-brand-tint" aria-label={ts.next}>
                    <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
                  </Link>
                )}
              </nav>
            )}

            {/* Bulk CTA */}
            <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-brand-border bg-white p-6 shadow-level-1 sm:flex-row sm:items-center sm:p-8">
              <div>
                <p className="font-heading text-xl font-bold">{ts.bulkTitle}</p>
                <p className="mt-1 max-w-xl text-sm text-brand-muted">{ts.bulkText}</p>
              </div>
              <Link href={routes.bulkQuote} className="shrink-0 rounded-full bg-brand-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-brand-primary-hover">
                {ts.bulkCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile filters: bottom sheet */}
      <Drawer open={sheetOpen} onClose={() => setSheetOpen(false)} side="bottom" title={ts.filters} closeLabel={t.nav.closeMenu}>
        <div className="p-5">{filterPanel}</div>
      </Drawer>
    </>
  );
}

/** Filter controls (desktop column + mobile sheet). Plain links/forms → work without JavaScript. */
function FilterPanel({
  basePath,
  fixedCategory,
  params,
  categories,
  priceBounds,
  chipsCount,
  resetHref,
  onNavigate,
}: ShopViewProps & { chipsCount: number; resetHref: string; onNavigate: () => void }) {
  const { t, isRTL } = useLanguage();
  const ts = t?.shop || translations.en.shop;
  const activeSlug = fixedCategory?.slug ?? params.category;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-wider">
          <SlidersHorizontal className="h-4 w-4 text-brand-secondary" aria-hidden /> {ts.filters}
        </h2>
        {chipsCount > 0 && (
          <Link href={resetHref} onClick={onNavigate} className="text-xs font-semibold text-brand-secondary hover:underline">
            {ts.clearAll}
          </Link>
        )}
      </div>

      <div>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-muted">{ts.categories}</h3>
        <ul className="space-y-0.5">
          <li>
            <Link
              href={shopHref(routes.shop, { ...params, category: '' })}
              onClick={onNavigate}
              className={cn('flex justify-between rounded-lg px-2 py-1.5 text-sm', !activeSlug ? 'bg-brand-tint font-semibold text-brand-secondary' : 'hover:bg-brand-surface')}
            >
              {ts.allProducts}
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                href={categoryHref(c.slug)}
                onClick={onNavigate}
                aria-current={activeSlug === c.slug ? 'page' : undefined}
                className={cn(
                  'flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm',
                  activeSlug === c.slug ? 'bg-brand-tint font-semibold text-brand-secondary' : 'hover:bg-brand-surface',
                )}
              >
                <span>{isRTL ? c.nameAr : c.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Price + stock: one GET form so "Apply" submits both */}
      <form action={basePath} method="GET" onSubmit={onNavigate} className="space-y-6">
        {params.q && <input type="hidden" name="q" value={params.q} />}
        {!fixedCategory && params.category && <input type="hidden" name="category" value={params.category} />}
        {params.sort !== 'newest' && <input type="hidden" name="sort" value={params.sort} />}
        {params.view !== 'grid' && <input type="hidden" name="view" value={params.view} />}
        <fieldset>
          <legend className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-muted">{ts.price}</legend>
          <div className="flex items-center gap-2">
            <input
              name="min"
              inputMode="numeric"
              defaultValue={params.min ?? ''}
              placeholder={`${ts.min} ${priceBounds.min}`}
              aria-label={ts.min}
              className="h-10 w-full rounded-xl border border-brand-border px-3 text-sm focus:border-brand-secondary focus:outline-none"
            />
            <span className="text-brand-muted">–</span>
            <input
              name="max"
              inputMode="numeric"
              defaultValue={params.max ?? ''}
              placeholder={`${ts.max} ${priceBounds.max}`}
              aria-label={ts.max}
              className="h-10 w-full rounded-xl border border-brand-border px-3 text-sm focus:border-brand-secondary focus:outline-none"
            />
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-muted">{ts.availability}</legend>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm">
            <input type="checkbox" name="stock" value="1" defaultChecked={params.inStock} className="h-5 w-5 rounded-md accent-brand-secondary" />
            {ts.inStockOnly}
          </label>
        </fieldset>
        <button type="submit" className="h-10 w-full rounded-full bg-brand-secondary text-sm font-bold text-white hover:bg-brand-secondary-hover">
          {ts.apply}
        </button>
      </form>
    </div>
  );
}

/** List-view row: image, name, packing, price, add to cart. */
function ProductRow({ product }: { product: ProductCardData }) {
  const { add, openDrawer } = useCart();
  const { t, isRTL } = useLanguage();
  const name = isRTL && product.nameAr ? product.nameAr : product.name;
  const onSale = product.salePrice != null && product.price != null && product.salePrice < product.price;
  const price = onSale ? product.salePrice : product.price;
  const href = productHref(product);

  return (
    <article className="flex gap-4 rounded-2xl border border-brand-border bg-white p-4 shadow-level-1 transition hover:shadow-level-2 sm:p-5">
      <Link href={href} className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl bg-brand-surface sm:h-28 sm:w-40" tabIndex={-1} aria-hidden>
        <Image src={product.image || '/images/product-placeholder.png'} alt="" fill sizes="160px" className="object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div className="min-w-0">
          {product.category && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-secondary">
              {isRTL ? product.category.nameAr : product.category.nameEn}
            </span>
          )}
          <h3 className="font-heading text-base font-bold leading-snug">
            <Link href={href} className="hover:text-brand-primary">{name}</Link>
          </h3>
          <p className="text-xs text-brand-muted">{isRTL && product.packingAr ? product.packingAr : product.packing}</p>
        </div>
        <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
          {price != null ? (
            <div className="sm:text-end">
              <span className="font-heading text-lg font-bold text-brand-primary">{formatPrice(price)}</span>
              <span className="ms-1 text-[11px] text-brand-muted">{fill(t.home.featured.per, { unit: unitName(product.unit, isRTL ? 'ar' : 'en') })}</span>
              {onSale && <div className="text-xs text-brand-muted line-through">{formatPrice(product.price)}</div>}
            </div>
          ) : (
            <span className="text-sm font-bold">{t.common.priceOnRequest}</span>
          )}
          <button
            type="button"
            disabled={!product.inStock || price == null}
            onClick={() => {
              add(product.id, product.minOrderQty);
              openDrawer();
            }}
            className="rounded-full bg-brand-primary px-4 py-2 text-xs font-bold text-white hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {product.inStock ? t.product.addToCart : t.product.outOfStock}
          </button>
        </div>
      </div>
    </article>
  );
}
