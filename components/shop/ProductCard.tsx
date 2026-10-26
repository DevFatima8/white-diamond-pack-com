'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { fill } from '@/lib/i18n/translations';
import { unitName } from '@/lib/i18n/units';
import { productHref } from '@/lib/routes';
import { cn, formatPrice } from '@/lib/utils';
import type { ProductCardData } from '@/lib/catalog-types';

const PLACEHOLDER = '/images/product-placeholder.png';

/** Product card (DESIGN.md "Product & Spec Cards"), used on the homepage and the shop. */
export default function ProductCard({ product, className }: { product: ProductCardData; className?: string }) {
  const { add, openDrawer } = useCart();
  const { t, isRTL } = useLanguage();
  const tf = t.home.featured;

  const name = isRTL && product.nameAr ? product.nameAr : product.name;
  const categoryName = product.category ? (isRTL ? product.category.nameAr : product.category.nameEn) : null;
  const onSale = product.salePrice != null && product.price != null && product.salePrice < product.price;
  const price = onSale ? product.salePrice : product.price;
  const href = productHref(product);

  const addToCart = () => {
    add(product.id, product.minOrderQty); // start at the minimum order quantity
    openDrawer();
  };

  return (
    <article
      className={cn(
        'group flex flex-col justify-between rounded-2xl border border-brand-border/70 bg-white p-3.5 shadow-level-1 sm:p-5 transition duration-300 hover:-translate-y-1.5 hover:shadow-level-2',
        className,
      )}
    >
      <div>
        <Link href={href} className="relative mb-3 block aspect-[4/3] sm:mb-4 overflow-hidden rounded-xl bg-brand-surface" tabIndex={-1} aria-hidden>
          <Image
            src={product.image || PLACEHOLDER}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {(onSale || categoryName) && (
            <span
              className={cn(
                'absolute start-2 top-2 z-10 max-w-[85%] truncate rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider sm:start-3 sm:top-3 sm:px-2.5 sm:text-[11px]',
                onSale ? 'bg-brand-primary text-white' : 'bg-brand-accent text-brand-navy',
              )}
            >
              {onSale ? tf.onSale : categoryName}
            </span>
          )}
          {!product.inStock && (
            <span className="absolute inset-x-0 bottom-0 bg-brand-ink/75 py-1.5 text-center text-xs font-semibold text-white">
              {tf.outOfStock}
            </span>
          )}
        </Link>

        <h3 className="font-heading text-sm font-bold leading-snug text-brand-ink sm:text-[17px] transition-colors group-hover:text-brand-primary">
          <Link href={href} className="line-clamp-2">
            {name}
          </Link>
        </h3>
        <div className="mt-2 flex items-center justify-between gap-3 rounded-lg bg-brand-surface px-2 py-1.5 text-[11px] text-brand-muted sm:mt-3 sm:px-3 sm:py-2 sm:text-[13px]">
          <span className="hidden sm:inline">{tf.packing}</span>
          <span className="truncate font-semibold text-brand-ink">{isRTL && product.packingAr ? product.packingAr : product.packing}</span>
        </div>
      </div>

      <div className="mt-2 flex items-end justify-between gap-2 pt-2 sm:mt-3 sm:gap-3 sm:pt-4">
        <div className="min-w-0">
          <span className="block text-[11px] text-brand-muted">{tf.directPrice}</span>
          {price != null ? (
            <div className="flex flex-wrap items-baseline gap-x-1.5">
              <span className="font-heading text-base font-bold text-brand-primary sm:text-xl">{formatPrice(price)}</span>
              <span className="text-[11px] text-brand-muted">{fill(tf.per, { unit: unitName(product.unit, isRTL ? 'ar' : 'en') })}</span>
              {onSale && <span className="w-full text-xs text-brand-muted line-through">{formatPrice(product.price)}</span>}
            </div>
          ) : (
            <span className="font-heading text-base font-bold text-brand-ink">{t.common.priceOnRequest}</span>
          )}
        </div>
        <button
          type="button"
          onClick={addToCart}
          disabled={!product.inStock || price == null}
          aria-label={fill(tf.addToCart, { name })}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white shadow-md sm:h-11 sm:w-11 transition hover:bg-brand-primary-hover active:scale-90 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
        </button>
      </div>
    </article>
  );
}
