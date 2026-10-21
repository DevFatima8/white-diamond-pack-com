import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle, ArrowRight, Clock, Package, ShoppingBag, Wallet } from 'lucide-react';
import db from '@/lib/db';
import { formatPrice } from '@/lib/utils';
import { dayKey, formatDate, formatDateTime, lastNDays, startOfDayPKT } from '@/lib/dates';
import { PAYMENT_METHOD_LABEL } from '@/lib/orders';
import { Card, CardHeader, EmptyState, PageHeader } from '@/components/admin/ui';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import SalesChart, { type DailySales } from '@/components/admin/SalesChart';

export const metadata: Metadata = { title: 'Dashboard' };

const LOW_STOCK = 20; // cartons — at or below this, a product counts as "low stock"

export default async function DashboardPage() {
  const days = lastNDays(30);
  const since = startOfDayPKT(days[0]);
  const notCancelled = { status: { not: 'CANCELLED' as const } };

  // All queries run in parallel — one round trip's worth of waiting instead of seven.
  const [totalOrders, revenue, pendingOrders, activeProducts, lowStock, recentOrders, last30] = await Promise.all([
    db.order.count(),
    db.order.aggregate({ _sum: { total: true }, where: notCancelled }),
    db.order.count({ where: { status: 'PENDING' } }),
    db.product.count({ where: { isActive: true } }),
    db.product.count({ where: { isActive: true, stockQty: { not: null, lte: LOW_STOCK } } }),
    db.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { _count: { select: { items: true } } },
    }),
    db.order.findMany({
      where: { ...notCancelled, createdAt: { gte: since } },
      select: { createdAt: true, total: true },
    }),
  ]);

  // Group the last 30 days of orders by PKT calendar day.
  const byDay = new Map(days.map((d) => [d, { revenue: 0, orders: 0 }]));
  for (const o of last30) {
    const bucket = byDay.get(dayKey(o.createdAt));
    if (bucket) {
      bucket.revenue += o.total;
      bucket.orders += 1;
    }
  }
  const chartData: DailySales[] = days.map((d) => ({
    day: d,
    label: formatDate(startOfDayPKT(d)).replace(/ \d{4}$/, ''), // "21 Oct"
    ...byDay.get(d)!,
  }));
  const revenue30 = chartData.reduce((sum, d) => sum + d.revenue, 0);
  const orders30 = chartData.reduce((sum, d) => sum + d.orders, 0);

  const tiles = [
    { label: 'Total orders', value: totalOrders.toLocaleString('en-US'), icon: ShoppingBag, href: '/admin/orders' },
    { label: 'Revenue (all time)', value: formatPrice(revenue._sum.total ?? 0), icon: Wallet, note: 'Excludes cancelled orders' },
    {
      label: 'Pending orders',
      value: pendingOrders.toLocaleString('en-US'),
      icon: Clock,
      href: '/admin/orders?status=PENDING',
      note: pendingOrders > 0 ? 'Call to confirm' : 'All caught up',
      alert: pendingOrders > 0,
    },
    {
      label: 'Active products',
      value: activeProducts.toLocaleString('en-US'),
      icon: Package,
      href: '/admin/products',
      note: lowStock > 0 ? `${lowStock} low on stock` : 'Stock levels OK',
      alert: lowStock > 0,
    },
  ];

  return (
    <>
      <PageHeader eyebrow="Overview" title="Dashboard" description={`Today is ${formatDate(new Date())} (Pakistan time).`} />

      {/* Stat tiles */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map(({ label, value, icon: Icon, href, note, alert }) => {
          const body = (
            <>
              <div className="flex items-start justify-between">
                <span className="text-sm font-medium text-brand-muted">{label}</span>
                <span className="rounded-xl bg-brand-tint p-2 text-brand-secondary">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
              </div>
              <div className="mt-3 font-heading text-[28px] font-bold leading-none text-brand-ink">{value}</div>
              {note && (
                <div className={`mt-2 flex items-center gap-1 text-xs ${alert ? 'font-semibold text-brand-primary' : 'text-brand-muted'}`}>
                  {alert && <AlertTriangle className="h-3.5 w-3.5" aria-hidden />}
                  {note}
                </div>
              )}
            </>
          );
          return href ? (
            <Link key={label} href={href} className="block rounded-xl border border-brand-border bg-white p-5 shadow-level-1 transition hover:-translate-y-0.5 hover:shadow-level-2">
              {body}
            </Link>
          ) : (
            <Card key={label} className="p-5">
              {body}
            </Card>
          );
        })}
      </div>

      {/* Sales chart */}
      <Card className="mt-6">
        <CardHeader title="Revenue — last 30 days" description="Daily order value in PKR (cancelled orders excluded)" />
        <div className="px-5 pb-5 pt-4">
          <div className="mb-4">
            <div className="font-heading text-5xl font-bold tracking-tight text-brand-ink">{formatPrice(revenue30)}</div>
            <div className="mt-1 text-sm text-brand-muted">
              from {orders30} order{orders30 === 1 ? '' : 's'}
            </div>
          </div>
          <SalesChart data={chartData} />
        </div>
      </Card>

      {/* Recent orders */}
      <Card className="mt-6 overflow-hidden">
        <CardHeader
          title="Recent orders"
          description="The 10 newest orders"
          actions={
            <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-secondary hover:underline">
              View all <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          }
        />
        {recentOrders.length === 0 ? (
          <EmptyState icon={<ShoppingBag className="h-5 w-5" />} title="No orders yet">
            Orders placed on the website will appear here.
          </EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-brand-surface text-left text-[11px] uppercase tracking-wider text-brand-muted">
                <tr>
                  <th className="px-5 py-3 font-semibold">Order</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">City</th>
                  <th className="px-5 py-3 font-semibold">Payment</th>
                  <th className="px-5 py-3 text-right font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-brand-surface/60">
                    <td className="px-5 py-3">
                      <Link href={`/admin/orders/${o.id}`} className="font-semibold text-brand-secondary hover:underline">
                        #{o.orderNumber}
                      </Link>
                      <div className="text-xs text-brand-muted">{formatDateTime(o.createdAt)}</div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="font-medium">{o.customerName}</div>
                      <div className="text-xs text-brand-muted">
                        {o._count.items} item{o._count.items === 1 ? '' : 's'}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-brand-muted">{o.city}</td>
                    <td className="px-5 py-3 text-brand-muted">{PAYMENT_METHOD_LABEL[o.paymentMethod]}</td>
                    <td className="px-5 py-3 text-right font-semibold tabular-nums">{formatPrice(o.total)}</td>
                    <td className="px-5 py-3">
                      <OrderStatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
