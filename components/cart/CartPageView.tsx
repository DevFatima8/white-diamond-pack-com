'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Loader2, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import type { DeliverySettings } from '@/lib/delivery';
import { fill, translations } from '@/lib/i18n/translations';
import { unitName } from '@/lib/i18n/units';
import { productHref, routes } from '@/lib/routes';
import { formatPrice } from '@/lib/utils';
import CartSummary from './CartSummary';

export default function CartPageView({ delivery }: { delivery: DeliverySettings }) {
  const { items, lines, count, subtotal, loadingProducts, setQuantity, remove, clear } = useCart();
  const { t, isRTL } = useLanguage();
  const tc = t?.cart || translations.en.cart;

  return (
    <div className="bg-brand-surface py-10 lg:py-14">
      <div className="mx-auto max-w-site px-5 sm:px-6 lg:px-12">
        <nav aria-label="Breadcrumb" className="mb-4 text-xs text-brand-muted">
          <Link href={routes.home} className="hover:text-brand-secondary">{t.nav.home}</Link>
          <span className="mx-1.5" aria-hidden>/</span>
          <Link href={routes.shop} className="hover:text-brand-secondary">{t.shop.breadcrumb}</Link>
          <span className="mx-1.5" aria-hidden>/</span>
          <span className="font-semibold text-brand-ink">{tc.pageTitle}</span>
        </nav>
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          {tc.pageTitle} {count > 0 && <span className="text-lg font-medium text-brand-muted">({fill(tc.items, { n: count })})</span>}
        </h1>

        {lines.length === 0 ? (
          <div className="mt-8 flex flex-col items-center rounded-2xl border border-brand-border bg-white px-6 py-16 text-center shadow-level-1">
            <div className="mb-4 rounded-full bg-brand-tint p-5 text-brand-secondary">
              <ShoppingBag className="h-8 w-8" aria-hidden />
            </div>
            <p className="font-heading text-xl font-bold">{tc.empty}</p>
            <p className="mt-1 text-sm text-brand-muted">{tc.emptyText}</p>
            <Link href={routes.shop} className="mt-6 rounded-full bg-brand-primary px-7 py-3 text-sm font-bold text-white hover:bg-brand-primary-hover">
              {tc.startShopping}
            </Link>
          </div>
        ) : loadingProducts && items.length === 0 ? (
          <p className="mt-8 flex items-center gap-2 text-sm text-brand-muted">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> {tc.loading}
          </p>
        ) : (
          <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_380px]">
            <div className="overflow-hidden rounded-2xl border border-brand-border bg-white shadow-level-1">
              <div className="hidden grid-cols-[1fr_120px_140px_120px_40px] gap-4 border-b border-brand-border bg-brand-tint/60 px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-brand-muted md:grid">
                <span>{tc.product}</span>
                <span className="text-end">{tc.unitPrice}</span>
                <span className="text-center">{tc.quantity}</span>
                <span className="text-end">{tc.lineTotal}</span>
                <span />
              </div>
              <ul className="divide-y divide-brand-border">
                {items.map((item) => {
                  const p = item.product;
                  const name = isRTL && p.nameAr ? p.nameAr : p.name;
                  const min = Math.max(1, p.minOrderQty);
                  return (
                    <li key={item.productId} className="grid grid-cols-[80px_1fr] gap-4 px-5 py-5 md:grid-cols-[1fr_120px_140px_120px_40px] md:items-center">
                      <div className="flex items-center gap-4 md:col-span-1">
                        <Link href={productHref(p)} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-brand-surface">
                          <Image src={p.image || '/images/product-placeholder.png'} alt="" fill sizes="80px" className="object-cover" />
                        </Link>
                        <div className="hidden min-w-0 md:block">
                          <Link href={productHref(p)} className="line-clamp-2 font-semibold leading-snug hover:text-brand-primary">{name}</Link>
                          {min > 1 && <p className="mt-1 text-xs text-brand-muted">{fill(tc.minOrder, { n: min })}</p>}
                        </div>
                      </div>
                      {/* Mobile: details next to the image */}
                      <div className="min-w-0 md:contents">
                        <Link href={productHref(p)} className="line-clamp-2 font-semibold leading-snug hover:text-brand-primary md:hidden">{name}</Link>
                        <p className="mt-0.5 text-xs text-brand-muted md:mt-0 md:text-end md:text-sm md:text-brand-ink">
                          {item.unitPrice > 0 ? `${formatPrice(item.unitPrice)}` : tc.priceOnRequest}
                          <span className="block text-[11px] text-brand-muted">{fill(tc.per, { unit: unitName(p.unit, isRTL ? 'ar' : 'en') })}</span>
                        </p>
                        <div className="mt-3 flex items-center justify-between gap-3 md:mt-0 md:justify-center">
                          <div className="flex items-center rounded-full border border-brand-border" role="group" aria-label={tc.quantity}>
                            <button type="button" onClick={() => setQuantity(item.productId, item.quantity - 1)} disabled={item.quantity <= min} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-brand-tint disabled:opacity-30" aria-label={tc.decrease}>
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <input
                              value={item.quantity}
                              onChange={(e) => {
                                const n = Number(e.target.value.replace(/[^\d]/g, ''));
                                if (n > 0) setQuantity(item.productId, Math.max(min, n));
                              }}
                              inputMode="numeric"
                              aria-label={`${tc.quantity}: ${name}`}
                              className="w-12 bg-transparent text-center text-sm font-semibold tabular-nums focus:outline-none"
                            />
                            <button type="button" onClick={() => setQuantity(item.productId, item.quantity + 1)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-brand-tint" aria-label={tc.increase}>
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="font-heading font-bold tabular-nums md:hidden">{item.lineTotal > 0 ? formatPrice(item.lineTotal) : '—'}</span>
                        </div>
                        <span className="hidden text-end font-heading font-bold tabular-nums text-brand-primary md:block">{item.lineTotal > 0 ? formatPrice(item.lineTotal) : '—'}</span>
                        <button
                          type="button"
                          onClick={() => remove(item.productId)}
                          className="mt-2 inline-flex items-center gap-1 text-xs text-brand-muted hover:text-brand-primary md:mt-0 md:justify-self-end md:rounded-lg md:p-2 md:hover:bg-[#FFF1F2]"
                          aria-label={fill(tc.remove, { name })}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="flex items-center justify-between gap-3 border-t border-brand-border px-5 py-4">
                <Link href={routes.shop} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy hover:text-brand-secondary">
                  <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden /> {tc.continueShopping}
                </Link>
                <button type="button" onClick={clear} className="text-xs font-semibold text-brand-muted hover:text-brand-primary">
                  {tc.clear}
                </button>
              </div>
            </div>

            <aside className="rounded-2xl border border-brand-border bg-white p-6 shadow-level-1 lg:sticky lg:top-28">
              <h2 className="mb-4 font-heading text-xl font-bold">{t.checkout.summary}</h2>
              <CartSummary subtotal={subtotal} delivery={delivery}>
                <Link
                  href={routes.checkout}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-primary text-sm font-bold uppercase tracking-wider text-white shadow-md hover:bg-brand-primary-hover"
                >
                  {tc.proceed}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
                </Link>
                <p className="text-center text-[11px] text-brand-muted">{t.checkout.secure}</p>
              </CartSummary>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
