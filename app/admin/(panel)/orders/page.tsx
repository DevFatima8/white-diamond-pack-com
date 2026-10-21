import type { Metadata } from 'next';
import Link from 'next/link';
import type { OrderStatus, Prisma } from '@prisma/client';
import { Search, ShoppingBag } from 'lucide-react';
import db from '@/lib/db';
import { cn, formatPrice } from '@/lib/utils';
import { endOfDayPKT, formatDateTime, isDayString, startOfDayPKT } from '@/lib/dates';
import { ORDER_STATUSES, ORDER_STATUS_META, PAYMENT_METHOD_LABEL, isOrderStatus } from '@/lib/orders';
import { formatPkMobile, normalizePkMobile } from '@/lib/phone';
import { Card, EmptyState, Input, PageHeader, buttonClass } from '@/components/admin/ui';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import Pagination, { parsePage } from '@/components/admin/Pagination';

export const metadata: Metadata = { title: 'Orders' };

const PAGE_SIZE = 20;

type SearchParams = Promise<{ q?: string; status?: string; from?: string; to?: string; page?: string }>;

export default async function OrdersPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const q = (sp.q ?? '').trim().slice(0, 60);
  const status = isOrderStatus(sp.status) ? sp.status : undefined;
  const from = isDayString(sp.from) ? sp.from : undefined;
  const to = isDayString(sp.to) ? sp.to : undefined;

  // Filters except status — the status tiles show counts for these filters.
  const base: Prisma.OrderWhereInput = {};
  if (q) {
    const phone = normalizePkMobile(q); // "0321-6293333" also matches "03216293333"
    base.OR = [
      { orderNumber: { contains: q.toUpperCase().replace(/^#/, '') } },
      { customerName: { contains: q } },
      { phone: { contains: phone ?? (q.replace(/\D/g, '') || q) } },
    ];
  }
  if (from || to) {
    base.createdAt = {
      ...(from && { gte: startOfDayPKT(from) }),
      ...(to && { lt: endOfDayPKT(to) }), // "to" day is included
    };
  }
  const where: Prisma.OrderWhereInput = status ? { ...base, status } : base;

  const [total, grouped] = await Promise.all([
    db.order.count({ where }),
    db.order.groupBy({ by: ['status'], where: base, _count: true }),
  ]);
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(parsePage(sp.page), pageCount);
  const orders = await db.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: { _count: { select: { items: true } } },
  });

  const countFor = (s: OrderStatus) => grouped.find((g) => g.status === s)?._count ?? 0;
  const allCount = grouped.reduce((sum, g) => sum + g._count, 0);
  const filterParams = { q: q || undefined, from, to };
  const tileHref = (s?: OrderStatus) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...filterParams, status: s })) if (v) p.set(k, v);
    const qs = p.toString();
    return qs ? `/admin/orders?${qs}` : '/admin/orders';
  };
  const filtered = Boolean(q || from || to || status);

  return (
    <>
      <PageHeader eyebrow="Sales" title="Orders" description="Click an order to see details, change its status, call or WhatsApp the customer." />

      {/* Status tiles = quick filters (counts respect the search and dates) */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {[undefined, ...ORDER_STATUSES].map((s) => {
          const active = s === status;
          const count = s ? countFor(s) : allCount;
          return (
            <Link
              key={s ?? 'all'}
              href={tileHref(s)}
              aria-current={active ? 'true' : undefined}
              className={cn(
                'rounded-xl border bg-white p-4 shadow-level-1 transition hover:shadow-level-2',
                active ? 'border-brand-secondary ring-2 ring-brand-secondary/20' : 'border-brand-border',
              )}
            >
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-brand-muted">
                {s && <span className={cn('h-2 w-2 rounded-full', ORDER_STATUS_META[s].dot)} aria-hidden />}
                {s ? ORDER_STATUS_META[s].label : 'All orders'}
              </div>
              <div className="mt-2 font-heading text-2xl font-bold text-brand-ink">{count}</div>
            </Link>
          );
        })}
      </div>

      <Card className="overflow-hidden">
        <form method="GET" className="flex flex-col gap-3 border-b border-brand-border p-4 lg:flex-row lg:items-end" role="search">
          {status && <input type="hidden" name="status" value={status} />}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <Input name="q" type="search" defaultValue={q} placeholder="Order number, phone or customer name…" className="pl-10" aria-label="Search orders" />
          </div>
          <label className="flex flex-col gap-1 text-xs font-semibold text-brand-muted">
            From
            <Input name="from" type="date" defaultValue={from} className="lg:w-44" />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-brand-muted">
            To
            <Input name="to" type="date" defaultValue={to} className="lg:w-44" />
          </label>
          <div className="flex gap-2">
            <button type="submit" className={buttonClass({ variant: 'navy' }, 'h-11')}>
              Apply
            </button>
            {filtered && (
              <Link href="/admin/orders" className={buttonClass({ variant: 'ghost' }, 'h-11')}>
                Clear
              </Link>
            )}
          </div>
        </form>

        {orders.length === 0 ? (
          <EmptyState icon={<ShoppingBag className="h-5 w-5" />} title={filtered ? 'No orders match these filters' : 'No orders yet'}>
            {filtered ? 'Try a different search or date range.' : 'Orders placed on the website will appear here.'}
          </EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead className="bg-brand-surface text-left text-[11px] uppercase tracking-wider text-brand-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Order</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">City</th>
                  <th className="px-4 py-3 font-semibold">Payment</th>
                  <th className="px-4 py-3 text-right font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {orders.map((o) => (
                  <tr key={o.id} className="relative hover:bg-brand-surface/60">
                    <td className="px-4 py-3">
                      {/* The link's ::after covers the whole row, so the full row is clickable */}
                      <Link href={`/admin/orders/${o.id}`} className="font-semibold text-brand-secondary after:absolute after:inset-0 hover:underline">
                        #{o.orderNumber}
                      </Link>
                      <div className="text-xs text-brand-muted">{formatDateTime(o.createdAt)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{o.customerName}</div>
                      <div className="text-xs tabular-nums text-brand-muted">{formatPkMobile(o.phone)}</div>
                    </td>
                    <td className="px-4 py-3 text-brand-muted">{o.city}</td>
                    <td className="px-4 py-3 text-brand-muted">{PAYMENT_METHOD_LABEL[o.paymentMethod]}</td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      <div className="font-semibold">{formatPrice(o.total)}</div>
                      <div className="text-xs text-brand-muted">
                        {o._count.items} item{o._count.items === 1 ? '' : 's'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          basePath="/admin/orders"
          params={{ ...filterParams, status }}
          page={page}
          pageCount={pageCount}
          total={total}
          pageSize={PAGE_SIZE}
        />
      </Card>
    </>
  );
}
