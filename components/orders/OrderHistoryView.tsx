'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ArrowRight, ClipboardList, Loader2, Trash2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { formatDateTime } from '@/lib/dates';
import { fill, translations } from '@/lib/i18n/translations';
import { ORDER_STATUS_META } from '@/lib/orders';
import type { OrderStatus } from '@prisma/client';
import { orderHistoryStore } from '@/lib/order-history-store';
import { orderHref, routes } from '@/lib/routes';
import { cn, formatPrice } from '@/lib/utils';

interface OrderRow {
  orderNumber: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  itemCount: number;
  token: string;
}

export default function OrderHistoryView() {
  const { t } = useLanguage();
  const th = t?.orderHistory || translations.en.orderHistory;
  const statusLabels = t.order.statuses;

  const saved = useSyncExternalStore(orderHistoryStore.subscribe, orderHistoryStore.getSnapshot, orderHistoryStore.getServerSnapshot);

  const [rows, setRows] = useState<OrderRow[] | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (saved.length === 0) {
      setRows([]);
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/orders/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries: saved.map((e) => ({ orderNumber: e.orderNumber, token: e.token })) }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && Array.isArray(json.data)) {
        setRows(json.data as OrderRow[]);
      } else {
        setError(true);
        setRows(null);
      }
    } catch {
      setError(true);
      setRows(null);
    } finally {
      setLoading(false);
    }
  }, [saved]);

  useEffect(() => {
    void load();
  }, [load]);

  const remove = (orderNumber: string) => {
    orderHistoryStore.remove(orderNumber);
  };

  return (
    <div className="bg-brand-surface py-10 lg:py-14">
      <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-12">
        <nav aria-label="Breadcrumb" className="mb-4 text-xs text-brand-muted">
          <Link href={routes.home} className="hover:text-brand-secondary">
            {t.nav.home}
          </Link>
          <span className="mx-1.5" aria-hidden>
            /
          </span>
          <Link href={routes.shop} className="hover:text-brand-secondary">
            {t.shop.breadcrumb}
          </Link>
          <span className="mx-1.5" aria-hidden>
            /
          </span>
          <span className="font-semibold text-brand-ink">{th.breadcrumb}</span>
        </nav>

        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{th.pageTitle}</h1>
        <p className="mt-2 text-sm text-brand-muted">{th.savedNote}</p>

        {saved.length === 0 ? (
          <div className="mt-8 flex flex-col items-center rounded-2xl border border-brand-border bg-white px-6 py-16 text-center shadow-level-1">
            <div className="mb-4 rounded-full bg-brand-tint p-5 text-brand-secondary">
              <ClipboardList className="h-8 w-8" aria-hidden />
            </div>
            <p className="font-heading text-xl font-bold">{th.empty}</p>
            <p className="mt-1 max-w-md text-sm text-brand-muted">{th.emptyText}</p>
            <Link
              href={routes.shop}
              className="mt-6 rounded-full bg-brand-primary px-7 py-3 text-sm font-bold text-white hover:bg-brand-primary-hover"
            >
              {th.shop}
            </Link>
          </div>
        ) : loading && rows === null ? (
          <p className="mt-8 flex items-center gap-2 text-sm text-brand-muted" role="status">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> {th.loading}
          </p>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-brand-border bg-white p-6 text-center shadow-level-1">
            <p className="text-sm text-brand-muted">{th.error}</p>
            <button
              type="button"
              onClick={() => void load()}
              className="mt-4 rounded-full bg-brand-secondary px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-secondary-hover"
            >
              {th.retry}
            </button>
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {(rows ?? []).map((order) => {
              const meta = ORDER_STATUS_META[order.status];
              return (
                <li
                  key={order.orderNumber}
                  className="rounded-2xl border border-brand-border bg-white p-5 shadow-level-1 transition-shadow hover:shadow-level-2"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">{t.order.number}</p>
                      <p className="font-heading text-lg font-bold text-brand-ink" dir="ltr">
                        {order.orderNumber}
                      </p>
                      <p className="mt-1 text-xs text-brand-muted">
                        {formatDateTime(new Date(order.createdAt))} · {fill(th.items, { n: order.itemCount })}
                      </p>
                    </div>
                    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold', meta.badge)}>
                      <span className={cn('h-1.5 w-1.5 rounded-full', meta.dot)} aria-hidden />
                      {statusLabels[order.status]}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-brand-border pt-4">
                    <p className="font-heading text-xl font-bold tabular-nums text-brand-primary">{formatPrice(order.total)}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => remove(order.orderNumber)}
                        className="inline-flex h-10 items-center gap-1.5 rounded-full border border-brand-border px-4 text-xs font-semibold text-brand-muted hover:border-brand-primary hover:bg-[#FDECEC] hover:text-brand-primary"
                        aria-label={th.remove}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        {th.remove}
                      </button>
                      <Link
                        href={orderHref(order.orderNumber, order.token)}
                        className="inline-flex h-10 items-center gap-1.5 rounded-full bg-brand-secondary px-5 text-xs font-bold text-white hover:bg-brand-secondary-hover"
                      >
                        {th.viewOrder}
                        <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden />
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
            {(rows ?? []).length === 0 && saved.length > 0 && !loading && (
              <li className="rounded-2xl border border-dashed border-brand-border bg-white p-8 text-center text-sm text-brand-muted">
                {th.stale}
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}