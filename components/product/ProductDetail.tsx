'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BadgeCheck, Banknote, Check, FileText, Minus, Plus, ShoppingCart, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { fill, translations } from '@/lib/i18n/translations';
import { unitName } from '@/lib/i18n/units';
import { whatsappLink } from '@/lib/phone';
import { categoryHref, routes } from '@/lib/routes';
import { cn, formatPrice } from '@/lib/utils';
import type { ProductCardData } from '@/lib/catalog-types';
import BrandIcon from '@/components/layout/BrandIcon';
import ProductCard from '@/components/shop/ProductCard';
import ProductGallery from './ProductGallery';
import QuoteModal from './QuoteModal';

export interface ProductDetailData {
  id: string;
  slug: string | null;
  sku: string | null;
  name: string;
  nameAr: string | null;
  description: string;
  descriptionAr: string | null;
  images: string[];
  price: number | null;
  salePrice: number | null;
  unit: string;
  packing: string;
  packingAr: string | null;
  capacity: string | null;
  material: string | null;
  color: string | null;
  features: string[];
  featuresAr: string[];
  minOrderQty: number;
  stockQty: number | null;
  inStock: boolean;
  category: { slug: string; nameEn: string; nameAr: string } | null;
}

const TRUST_ICONS = [BadgeCheck, Truck, Banknote];
const LOW_STOCK = 20;

export default function ProductDetail({
  product,
  related,
  delivery,
  whatsapp,
}: {
  product: ProductDetailData;
  related: ProductCardData[];
  delivery: { charge: number; threshold: number };
  whatsapp: string;
}) {
  const { t, isRTL } = useLanguage();
  const tp = t?.product || translations.en.product;
  const { add, openDrawer } = useCart();
  const min = Math.max(1, product.minOrderQty);
  const [qty, setQty] = useState(min);
  const [tab, setTab] = useState<'description' | 'specifications' | 'delivery'>('description');
  const [quoteOpen, setQuoteOpen] = useState(false);

  const name = isRTL && product.nameAr ? product.nameAr : product.name;
  const description = isRTL && product.descriptionAr ? product.descriptionAr : product.description;
  const categoryName = product.category ? (isRTL ? product.category.nameAr : product.category.nameEn) : null;
  // Arabic packing/features when available, otherwise the English text
  const packing = isRTL && product.packingAr ? product.packingAr : product.packing;
  const features = isRTL && product.featuresAr.length ? product.featuresAr : product.features;
  const onSale = product.salePrice != null && product.price != null && product.salePrice < product.price;
  const price = onSale ? product.salePrice : product.price;
  const canBuy = product.inStock && price != null;
  const unitLabel = unitName(product.unit, isRTL ? 'ar' : 'en');

  const waText = fill(tp.whatsappMessage, {
    name: product.name,
    qty,
    unit: product.unit,
    sku: product.sku ? ` (SKU ${product.sku})` : '',
  });

  const specs: [string, string | null][] = [
    [tp.specs.packing, packing],
    [tp.specs.capacity, product.capacity],
    [tp.specs.material, product.material],
    [tp.specs.color, product.color],
    [tp.specs.unit, unitLabel],
    [tp.specs.minOrder, `${min} ${unitLabel}`],
    [tp.specs.sku, product.sku],
    [tp.specs.category, categoryName],
  ];

  return (
    <>
      <div className="mx-auto max-w-site px-5 py-8 sm:px-6 lg:px-12 lg:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-brand-muted">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><Link href={routes.home} className="hover:text-brand-secondary">{t.nav.home}</Link></li>
            <li aria-hidden>/</li>
            <li><Link href={routes.shop} className="hover:text-brand-secondary">{t.shop.breadcrumb}</Link></li>
            {product.category && (
              <>
                <li aria-hidden>/</li>
                <li><Link href={categoryHref(product.category.slug)} className="hover:text-brand-secondary">{categoryName}</Link></li>
              </>
            )}
            <li aria-hidden>/</li>
            <li className="line-clamp-1 font-semibold text-brand-ink" aria-current="page">{name}</li>
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductGallery images={product.images} alt={name} />

          <div>
            {categoryName && (
              <Link href={categoryHref(product.category!.slug)} className="text-xs font-bold uppercase tracking-[0.14em] text-brand-primary hover:underline">
                {categoryName}
              </Link>
            )}
            <h1 className="mt-2 font-heading text-[28px] font-bold leading-9 tracking-tight sm:text-4xl sm:leading-[44px]">{name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              {product.sku && (
                <span className="text-brand-muted">
                  {tp.sku}: <span className="font-mono font-semibold text-brand-ink">{product.sku}</span>
                </span>
              )}
              <span className={cn('inline-flex items-center gap-1.5 font-semibold', product.inStock ? 'text-brand-secondary' : 'text-brand-primary')}>
                <span className={cn('h-2 w-2 rounded-full', product.inStock ? 'bg-brand-secondary' : 'bg-brand-primary')} aria-hidden />
                {!product.inStock
                  ? tp.outOfStock
                  : product.stockQty !== null && product.stockQty <= LOW_STOCK
                    ? fill(tp.lowStock, { n: product.stockQty })
                    : tp.inStock}
              </span>
            </div>

            {/* Price */}
            <div className="mt-6 rounded-2xl border border-brand-border bg-white p-5 shadow-level-1">
              {price != null ? (
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-heading text-4xl font-bold text-brand-primary">{formatPrice(price)}</span>
                  <span className="text-sm text-brand-muted">{fill(tp.perUnit, { unit: unitLabel })}</span>
                  {onSale && (
                    <>
                      <span className="text-base text-brand-muted line-through">{formatPrice(product.price)}</span>
                      <span className="rounded-full bg-[#FFF1F2] px-2.5 py-0.5 text-xs font-bold text-brand-primary">
                        {fill(tp.youSave, { amount: formatPrice(product.price! - product.salePrice!) })}
                      </span>
                    </>
                  )}
                </div>
              ) : (
                <span className="font-heading text-2xl font-bold">{t.common.priceOnRequest}</span>
              )}
              <p className="mt-2 text-sm text-brand-muted">{packing}</p>
            </div>

            <p className="mt-6 text-[15px] leading-7 text-brand-muted">{description}</p>

            {features.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2" aria-label={tp.features}>
                {features.map((f) => (
                  <li key={f} className="inline-flex items-center gap-1.5 rounded-full bg-brand-tint px-3 py-1 text-xs font-semibold text-brand-secondary">
                    <Check className="h-3.5 w-3.5" aria-hidden /> {f}
                  </li>
                ))}
              </ul>
            )}

            {/* Quantity + actions */}
            <div className="mt-7 flex flex-wrap items-end gap-3">
              <div>
                <span className="mb-1.5 block text-[13px] font-semibold">
                  {tp.quantity} <span className="font-normal text-brand-muted">({unitLabel})</span>
                </span>
                <div className="flex h-12 items-center rounded-full border border-brand-border bg-white" role="group" aria-label={tp.quantity}>
                  <button type="button" onClick={() => setQty((q) => Math.max(min, q - 1))} disabled={qty <= min} className="flex h-12 w-12 items-center justify-center rounded-full hover:bg-brand-tint disabled:opacity-30" aria-label={t.cart.decrease}>
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    value={qty}
                    onChange={(e) => {
                      const n = Number(e.target.value.replace(/[^\d]/g, ''));
                      setQty(Number.isFinite(n) && n > 0 ? Math.min(n, 100_000) : min);
                    }}
                    onBlur={() => setQty((q) => Math.max(min, q))}
                    inputMode="numeric"
                    aria-label={tp.quantity}
                    className="w-14 bg-transparent text-center font-semibold tabular-nums focus:outline-none"
                  />
                  <button type="button" onClick={() => setQty((q) => Math.min(100_000, q + 1))} className="flex h-12 w-12 items-center justify-center rounded-full hover:bg-brand-tint" aria-label={t.cart.increase}>
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <button
                type="button"
                disabled={!canBuy}
                onClick={() => {
                  add(product.id, Math.max(min, qty));
                  openDrawer();
                }}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-brand-primary px-6 text-sm font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-brand-primary-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none sm:flex-none"
              >
                <ShoppingCart className="h-5 w-5" aria-hidden />
                {canBuy ? tp.addToCart : tp.outOfStock}
              </button>
            </div>
            {min > 1 && <p className="mt-2 text-xs text-brand-muted">{fill(tp.minOrder, { n: `${min} ${unitLabel}` })}</p>}

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setQuoteOpen(true)}
                className="flex h-12 items-center justify-center gap-2 rounded-full border border-brand-border bg-white text-sm font-semibold text-brand-navy transition hover:border-brand-secondary hover:bg-brand-tint"
              >
                <FileText className="h-4 w-4" aria-hidden /> {tp.bulkQuote}
              </button>
              <a
                href={whatsappLink(whatsapp, waText)}
                target="_blank"
                rel="noreferrer"
                className="flex h-12 items-center justify-center gap-2 rounded-full bg-brand-navy text-sm font-semibold text-white transition hover:bg-[#2E2A72]"
              >
                <BrandIcon name="whatsapp" className="h-4 w-4" /> {tp.whatsappOrder}
              </a>
            </div>

            {/* Trust badges */}
            <ul className="mt-6 grid gap-3 border-t border-brand-border pt-6 sm:grid-cols-3">
              {tp.trust.map((item, i) => {
                const Icon = TRUST_ICONS[i];
                return (
                  <li key={item} className="flex items-center gap-2.5 text-xs font-semibold">
                    <span className="rounded-lg bg-brand-tint p-2 text-brand-secondary">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    {item}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Tabs */}
        <section className="mt-12 rounded-2xl border border-brand-border bg-white shadow-level-1">
          <div className="scrollbar-none flex gap-2 overflow-x-auto border-b border-brand-border p-3" role="tablist" aria-label={name}>
            {(['description', 'specifications', 'delivery'] as const).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                id={`tab-${key}`}
                aria-selected={tab === key}
                aria-controls={`panel-${key}`}
                onClick={() => setTab(key)}
                className={cn(
                  'shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-colors',
                  tab === key ? 'bg-brand-primary text-white' : 'text-brand-muted hover:bg-brand-tint hover:text-brand-navy',
                )}
              >
                {tp.tabs[key]}
              </button>
            ))}
          </div>
          <div className="p-6 sm:p-8" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
            {tab === 'description' && (
              <div className="max-w-3xl space-y-4 text-[15px] leading-7 text-brand-muted">
                <p>{description}</p>
                {features.length > 0 && (
                  <>
                    <h3 className="font-heading text-base font-bold text-brand-ink">{tp.features}</h3>
                    <ul className="space-y-2">
                      {features.map((f) => (
                        <li key={f} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-brand-secondary" aria-hidden /> {f}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
            {tab === 'specifications' && (
              <dl className="grid max-w-3xl overflow-hidden rounded-xl border border-brand-border sm:grid-cols-2">
                {specs
                  .filter(([, v]) => v)
                  .map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4 border-b border-brand-border px-4 py-3 text-sm sm:odd:border-e">
                      <dt className="text-brand-muted">{label}</dt>
                      <dd className="text-end font-semibold">{value}</dd>
                    </div>
                  ))}
              </dl>
            )}
            {tab === 'delivery' && (
              <ul className="max-w-3xl space-y-3 text-[15px] leading-7 text-brand-muted">
                {tp.delivery.map((line, i) => (
                  <li key={i} className="flex gap-3">
                    <Check className="mt-1.5 h-4 w-4 shrink-0 text-brand-secondary" aria-hidden />
                    {fill(line, { charge: formatPrice(delivery.charge), threshold: formatPrice(delivery.threshold) })}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 font-heading text-2xl font-bold">{tp.related}</h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} productId={product.id} productName={name} defaultQuantity={min} />
    </>
  );
}
