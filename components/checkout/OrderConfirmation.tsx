'use client';

import Link from 'next/link';
import { ArrowRight, CalendarDays, Check, CreditCard, Hash, MapPin, Phone, Truck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { fill } from '@/lib/i18n/translations';
import { formatPkMobile, whatsappLink } from '@/lib/phone';
import { routes } from '@/lib/routes';
import { formatPrice } from '@/lib/utils';
import BrandIcon from '@/components/layout/BrandIcon';

export interface ConfirmationData {
  orderNumber: string;
  createdAt: string; // already formatted (PKT)
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: 'COD' | 'BANK_TRANSFER';
  customerName: string;
  phone: string;
  city: string;
  address: string;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  items: { id: string; productName: string; unitPrice: number; quantity: number; lineTotal: number }[];
}

export default function OrderConfirmation({ order, bankDetails, whatsapp }: { order: ConfirmationData; bankDetails: string; whatsapp: string }) {
  const { t } = useLanguage();
  const to = t.order;
  const total = formatPrice(order.total);
  const waText = fill(to.whatsappMessage, { number: order.orderNumber, total });

  return (
    <div className="bg-brand-surface py-10 lg:py-14">
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        {/* Hero card */}
        <section className="relative overflow-hidden rounded-3xl border border-brand-border bg-white px-6 py-10 text-center shadow-level-2 sm:px-12">
          <div className="pointer-events-none absolute -end-16 -top-16 h-48 w-48 rounded-full bg-brand-tint" aria-hidden />
          <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-tint">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-secondary text-white shadow-level-2">
              <Check className="h-8 w-8" strokeWidth={3} aria-hidden />
            </span>
          </div>
          <span className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-brand-navy px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" aria-hidden /> {to.badge}
          </span>
          <h1 className="relative mx-auto mt-4 max-w-2xl font-heading text-3xl font-bold leading-tight tracking-tight sm:text-[40px] sm:leading-[48px]">
            {/* Split the translated sentence around {number} so the number can be coloured */}
            {to.title.split('{number}')[0]}
            <span className="text-brand-primary">#{order.orderNumber}</span>
            {to.title.split('{number}')[1]}
          </h1>
          <p className="relative mx-auto mt-3 max-w-xl text-brand-muted">
            {to.subtitle.split('{phone}')[0]}
            <span className="font-semibold text-brand-ink" dir="ltr">{formatPkMobile(order.phone)}</span>
            {to.subtitle.split('{phone}')[1]}
          </p>
          <p className="relative mx-auto mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-tint px-4 py-2 text-xs text-brand-navy">
            <Phone className="h-3.5 w-3.5 text-brand-secondary" aria-hidden /> {to.callNote}
          </p>
          <div className="relative mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href={routes.shop} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-primary px-7 text-sm font-bold text-white shadow-md hover:bg-brand-primary-hover">
              {to.continueShopping} <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
            </Link>
            <a
              href={whatsappLink(whatsapp, waText)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-navy-dark px-7 text-sm font-bold text-white hover:bg-brand-navy"
            >
              <BrandIcon name="whatsapp" className="h-4 w-4" /> {to.whatsapp}
            </a>
          </div>
        </section>

        {order.paymentMethod === 'BANK_TRANSFER' && bankDetails && (
          <section className="mt-6 rounded-2xl bg-brand-navy p-6 text-white">
            <h2 className="font-heading text-lg font-bold">{fill(to.bankTitle, { total })}</h2>
            <p className="mt-2 whitespace-pre-line text-sm text-[#DAE2FD]" dir="ltr">{bankDetails}</p>
            <p className="mt-3 text-xs text-[#C7D2FE]/80">{to.bankNote}</p>
          </section>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
          <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-level-1">
            <h2 className="mb-4 font-heading text-lg font-bold">{to.details}</h2>
            <dl className="space-y-3 text-sm">
              <Row icon={Hash} label={to.number} value={`#${order.orderNumber}`} />
              <Row icon={CalendarDays} label={to.date} value={order.createdAt} />
              <Row icon={Truck} label={to.status} value={to.statuses[order.status]} />
              <Row icon={CreditCard} label={to.payment} value={order.paymentMethod === 'COD' ? t.checkout.cod : t.checkout.bank} />
            </dl>
            <div className="mt-5 rounded-xl bg-brand-surface p-4 text-sm">
              <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-secondary">
                <MapPin className="h-3.5 w-3.5" aria-hidden /> {to.deliverTo}
              </p>
              <p className="font-semibold">{order.customerName}</p>
              <p className="whitespace-pre-line text-brand-muted">{order.address}</p>
              <p className="font-semibold">{order.city}</p>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-brand-border bg-white shadow-level-1">
            <h2 className="border-b border-brand-border px-6 py-4 font-heading text-lg font-bold">{to.items}</h2>
            <ul className="divide-y divide-brand-border">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-4 px-6 py-4 text-sm">
                  <span className="min-w-0">
                    <span className="block font-semibold">{item.productName}</span>
                    <span className="text-xs text-brand-muted">
                      {item.quantity} × {formatPrice(item.unitPrice)}
                    </span>
                  </span>
                  <span className="font-semibold tabular-nums">{formatPrice(item.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <dl className="space-y-2 border-t border-brand-border bg-brand-surface/60 px-6 py-4 text-sm tabular-nums">
              <div className="flex justify-between">
                <dt className="text-brand-muted">{t.cart.subtotal}</dt>
                <dd>{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-brand-muted">{t.cart.delivery}</dt>
                <dd>{order.deliveryCharge === 0 ? t.cart.free : formatPrice(order.deliveryCharge)}</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-brand-border pt-2">
                <dt className="font-heading text-base font-bold">{t.cart.total}</dt>
                <dd className="font-heading text-2xl font-bold text-brand-primary">{total}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: typeof Hash; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="flex items-center gap-2 text-brand-muted">
        <Icon className="h-4 w-4 text-brand-secondary" aria-hidden /> {label}
      </dt>
      <dd className="text-end font-semibold">{value}</dd>
    </div>
  );
}

/** Shown when the order link is wrong (same message for "doesn't exist" and "bad token"). */
export function OrderNotFound() {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-lg px-5 py-24 text-center">
      <h1 className="font-heading text-2xl font-bold">{t.order.notFound}</h1>
      <p className="mt-2 text-sm text-brand-muted">{t.order.notFoundText}</p>
      <Link href={routes.shop} className="mt-6 inline-flex rounded-full bg-brand-primary px-6 py-3 text-sm font-bold text-white hover:bg-brand-primary-hover">
        {t.order.continueShopping}
      </Link>
    </div>
  );
}
