import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Banknote, MapPin, MessageCircle, Phone, Printer, StickyNote, User } from 'lucide-react';
import db from '@/lib/db';
import { formatPrice } from '@/lib/utils';
import { formatDateTime } from '@/lib/dates';
import { PAYMENT_METHOD_LABEL } from '@/lib/orders';
import { formatPkMobile, whatsappLink } from '@/lib/phone';
import { Card, CardHeader, PageHeader, buttonClass } from '@/components/admin/ui';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import OrderStatusSelect from '@/components/admin/OrderStatusSelect';

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const order = await db.order.findUnique({ where: { id }, select: { orderNumber: true } });
  return { title: order ? `Order #${order.orderNumber}` : 'Order not found' };
}

export default async function OrderDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: { items: { orderBy: { createdAt: 'asc' } } },
  });
  if (!order) notFound();

  const whatsappMessage =
    `Assalam-o-Alaikum ${order.customerName}, this is White Diamond regarding your order #${order.orderNumber} ` +
    `(${formatPrice(order.total)}). We would like to confirm your order and delivery details.`;

  return (
    <>
      <Link href="/admin/orders" className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-brand-muted hover:text-brand-secondary">
        <ArrowLeft className="h-4 w-4" aria-hidden /> All orders
      </Link>
      <PageHeader
        title={
          <span className="flex flex-wrap items-center gap-3">
            Order #{order.orderNumber} <OrderStatusBadge status={order.status} />
          </span>
        }
        description={`Placed ${formatDateTime(order.createdAt)} · last updated ${formatDateTime(order.updatedAt)}`}
        actions={
          <>
            <a href={`tel:${order.phone}`} className={buttonClass({ variant: 'secondary' })}>
              <Phone className="h-4 w-4" aria-hidden /> Call
            </a>
            <a href={whatsappLink(order.phone, whatsappMessage)} target="_blank" rel="noreferrer" className={buttonClass({ variant: 'secondary' })}>
              <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp customer
            </a>
            <a href={`/admin/invoice/${order.id}`} target="_blank" rel="noreferrer" className={buttonClass({ variant: 'navy' })}>
              <Printer className="h-4 w-4" aria-hidden /> Invoice
            </a>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <Card className="self-start overflow-hidden lg:col-span-2">
          <CardHeader title="Items" description={`${order.items.length} line${order.items.length === 1 ? '' : 's'} · prices as at the time of ordering`} />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="bg-brand-surface text-left text-[11px] uppercase tracking-wider text-brand-muted">
                <tr>
                  <th className="px-5 py-3 font-semibold">Product</th>
                  <th className="px-5 py-3 text-right font-semibold">Unit price</th>
                  <th className="px-5 py-3 text-right font-semibold">Qty</th>
                  <th className="px-5 py-3 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border tabular-nums">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-5 py-3">
                      {item.productId ? (
                        <Link href={`/admin/products/${item.productId}`} className="font-medium text-brand-ink hover:text-brand-secondary">
                          {item.productName}
                        </Link>
                      ) : (
                        <span className="font-medium">
                          {item.productName} <span className="text-xs text-brand-muted">(product deleted)</span>
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">{formatPrice(item.unitPrice)}</td>
                    <td className="px-5 py-3 text-right">{item.quantity}</td>
                    <td className="px-5 py-3 text-right font-semibold">{formatPrice(item.lineTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <dl className="space-y-2 border-t border-brand-border bg-brand-surface/60 px-5 py-4 text-sm tabular-nums">
            <div className="flex justify-between">
              <dt className="text-brand-muted">Subtotal</dt>
              <dd>{formatPrice(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-muted">Delivery</dt>
              <dd>{order.deliveryCharge === 0 ? 'Free' : formatPrice(order.deliveryCharge)}</dd>
            </div>
            <div className="flex justify-between border-t border-brand-border pt-2 text-base font-bold">
              <dt>Total</dt>
              <dd className="text-brand-primary">{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </Card>

        <div className="space-y-6">
          <Card className="p-5">
            <OrderStatusSelect orderId={order.id} orderNumber={order.orderNumber} initial={order.status} />
            <p className="mt-2 text-xs text-brand-muted">Changes are saved immediately.</p>
          </Card>

          <Card>
            <CardHeader title="Customer" />
            <dl className="space-y-4 p-5 text-sm">
              <div className="flex gap-3">
                <User className="mt-0.5 h-4 w-4 shrink-0 text-brand-secondary" aria-hidden />
                <div>
                  <dt className="sr-only">Name</dt>
                  <dd className="font-semibold">{order.customerName}</dd>
                  {order.email && <dd className="text-brand-muted">{order.email}</dd>}
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-secondary" aria-hidden />
                <div>
                  <dt className="sr-only">Phone</dt>
                  <dd>
                    <a href={`tel:${order.phone}`} className="font-medium tabular-nums hover:text-brand-secondary">
                      {formatPkMobile(order.phone)}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-secondary" aria-hidden />
                <div>
                  <dt className="sr-only">Delivery address</dt>
                  <dd className="whitespace-pre-line">{order.address}</dd>
                  <dd className="font-semibold">{order.city}</dd>
                </div>
              </div>
              {order.notes && (
                <div className="flex gap-3 rounded-xl bg-brand-tint p-3">
                  <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-brand-secondary" aria-hidden />
                  <div>
                    <dt className="text-xs font-semibold text-brand-secondary">Customer note</dt>
                    <dd className="whitespace-pre-line">{order.notes}</dd>
                  </div>
                </div>
              )}
            </dl>
          </Card>

          <Card className="p-5">
            <div className="flex items-start gap-3 text-sm">
              <Banknote className="mt-0.5 h-4 w-4 shrink-0 text-brand-secondary" aria-hidden />
              <div>
                <div className="font-semibold">{PAYMENT_METHOD_LABEL[order.paymentMethod]}</div>
                <div className="text-xs text-brand-muted">
                  {order.paymentMethod === 'BANK_TRANSFER'
                    ? 'Check that the payment has arrived before shipping.'
                    : `Collect ${formatPrice(order.total)} on delivery.`}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
