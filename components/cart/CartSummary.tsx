'use client';

import type { ReactNode } from 'react';
import { Truck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { deliveryFor, type DeliverySettings } from '@/lib/delivery';
import { fill, translations } from '@/lib/i18n/translations';
import { formatPrice } from '@/lib/utils';

/** Subtotal / delivery / total box with the free-delivery progress bar (cart + checkout). */
export default function CartSummary({ subtotal, delivery, children }: { subtotal: number; delivery: DeliverySettings; children?: ReactNode }) {
  const { t } = useLanguage();
  const tc = t?.cart || translations.en.cart;
  const charge = deliveryFor(subtotal, delivery.charge, delivery.threshold);
  const missing = delivery.threshold > 0 ? Math.max(0, delivery.threshold - subtotal) : 0;
  const progress = delivery.threshold > 0 ? Math.min(100, (subtotal / delivery.threshold) * 100) : 0;

  return (
    <div className="space-y-4">
      {delivery.threshold > 0 && delivery.charge > 0 && (
        <div className="rounded-xl bg-brand-tint p-4">
          <p className="flex items-center gap-2 text-xs font-semibold text-brand-navy">
            <Truck className="h-4 w-4 text-brand-secondary" aria-hidden />
            {missing > 0 ? fill(tc.freeDeliveryProgress, { amount: formatPrice(missing) }) : tc.freeDeliveryReached}
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
            <div className="h-full rounded-full bg-brand-secondary transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
      <dl className="space-y-2 text-sm tabular-nums">
        <div className="flex justify-between">
          <dt className="text-brand-muted">{tc.subtotal}</dt>
          <dd className="font-semibold">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-brand-muted">{tc.delivery}</dt>
          <dd className="font-semibold">{charge === 0 ? tc.free : formatPrice(charge)}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-brand-border pt-3">
          <dt className="font-heading text-base font-bold">{tc.total}</dt>
          <dd className="font-heading text-2xl font-bold text-brand-primary">{formatPrice(subtotal + charge)}</dd>
        </div>
      </dl>
      {children}
    </div>
  );
}
