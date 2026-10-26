'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Loader2, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { fill } from '@/lib/i18n/translations';
import { unitName } from '@/lib/i18n/units';
import { productHref, routes } from '@/lib/routes';
import { formatPrice } from '@/lib/utils';
import Drawer from './Drawer';

/** Slide-in cart. Prices shown here are always fresh from the server. */
export default function CartDrawer() {
  const { items, lines, count, subtotal, loadingProducts, setQuantity, remove, drawerOpen, closeDrawer } = useCart();
  const { t, isRTL } = useLanguage();
  const tc = t.cart;

  return (
    <Drawer
      open={drawerOpen}
      onClose={closeDrawer}
      side="end"
      label={tc.title}
      closeLabel={t.nav.closeMenu}
      title={
        <span className="flex items-baseline gap-2">
          {tc.title}
          {count > 0 && <span className="text-sm font-medium text-brand-muted">({fill(tc.items, { n: count })})</span>}
        </span>
      }
      footer={
        items.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between font-heading text-lg font-bold">
              <span>{tc.subtotal}</span>
              <span className="tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-brand-muted">{tc.deliveryNote}</p>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href={routes.cart}
                onClick={closeDrawer}
                className="flex h-11 items-center justify-center rounded-full border border-brand-border text-sm font-semibold text-brand-navy hover:border-brand-secondary hover:bg-brand-tint"
              >
                {tc.viewCart}
              </Link>
              <Link
                href={routes.checkout}
                onClick={closeDrawer}
                className="flex h-11 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-white hover:bg-brand-primary-hover"
              >
                {tc.checkout}
              </Link>
            </div>
          </div>
        ) : undefined
      }
    >
      {lines.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center px-8 text-center">
          <div className="mb-4 rounded-full bg-brand-tint p-4 text-brand-secondary">
            <ShoppingBag className="h-7 w-7" aria-hidden />
          </div>
          <p className="font-heading text-lg font-bold">{tc.empty}</p>
          <p className="mt-1 text-sm text-brand-muted">{tc.emptyText}</p>
          <Link
            href={routes.shop}
            onClick={closeDrawer}
            className="mt-6 inline-flex h-11 items-center rounded-full bg-brand-primary px-6 text-sm font-bold text-white hover:bg-brand-primary-hover"
          >
            {tc.startShopping}
          </Link>
        </div>
      ) : loadingProducts && items.length === 0 ? (
        <div className="flex items-center justify-center gap-2 p-10 text-sm text-brand-muted">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> {tc.loading}
        </div>
      ) : (
        <ul className="divide-y divide-brand-border">
          {items.map((item) => {
            const p = item.product;
            const name = isRTL && p.nameAr ? p.nameAr : p.name;
            const min = Math.max(1, p.minOrderQty);
            return (
              <li key={item.productId} className="flex gap-4 px-5 py-4">
                <Link href={productHref(p)} onClick={closeDrawer} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-brand-surface">
                  <Image src={p.image || '/images/product-placeholder.png'} alt="" fill sizes="80px" className="object-cover" />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={productHref(p)} onClick={closeDrawer} className="line-clamp-2 text-sm font-semibold leading-snug hover:text-brand-primary">
                      {name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(item.productId)}
                      className="-me-1 rounded-lg p-1 text-brand-muted hover:bg-[#FDECEC] hover:text-brand-primary"
                      aria-label={fill(tc.remove, { name })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-0.5 text-xs text-brand-muted">
                    {item.unitPrice > 0 ? `${formatPrice(item.unitPrice)} ${fill(tc.per, { unit: unitName(p.unit, isRTL ? 'ar' : 'en') })}` : tc.priceOnRequest}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-brand-border" role="group" aria-label={tc.quantity}>
                      <button
                        type="button"
                        onClick={() => setQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= min}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-brand-navy hover:bg-brand-tint disabled:opacity-30"
                        aria-label={tc.decrease}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(item.productId, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-brand-navy hover:bg-brand-tint"
                        aria-label={tc.increase}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="text-sm font-bold tabular-nums">{item.lineTotal > 0 ? formatPrice(item.lineTotal) : '—'}</span>
                  </div>
                  {min > 1 && <p className="mt-1 text-[11px] text-brand-muted">{fill(tc.minOrder, { n: min })}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Drawer>
  );
}
