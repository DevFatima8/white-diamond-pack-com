import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import db from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { getSettings } from '@/lib/settings';
import { formatPrice } from '@/lib/utils';
import { formatDate } from '@/lib/dates';
import { ORDER_STATUS_META, PAYMENT_METHOD_LABEL } from '@/lib/orders';
import { formatPkMobile } from '@/lib/phone';
import PrintButton from '@/components/admin/PrintButton';

export const dynamic = 'force-dynamic';

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const order = await db.order.findUnique({ where: { id }, select: { orderNumber: true } });
  return { title: order ? `Invoice ${order.orderNumber}` : 'Invoice' };
}

/**
 * Printable invoice (A4). Lives outside the (panel) group so it has no sidebar,
 * which means it must check the admin session itself.
 */
export default async function InvoicePage({ params }: { params: Params }) {
  if (!(await getAdminSession())) redirect('/admin/login');

  const { id } = await params;
  const [order, settings] = await Promise.all([
    db.order.findUnique({ where: { id }, include: { items: { orderBy: { createdAt: 'asc' } } } }),
    getSettings(),
  ]);
  if (!order) notFound();

  return (
    <div dir="ltr" lang="en" className="min-h-screen bg-brand-surface py-8 font-sans text-brand-ink print:bg-white print:py-0">
      {/* Toolbar — hidden when printing */}
      <div className="mx-auto mb-4 flex max-w-[210mm] items-center justify-between px-4 print:hidden">
        <p className="text-sm text-brand-muted">Tip: choose &quot;Save as PDF&quot; in the print dialog to send it on WhatsApp.</p>
        <PrintButton />
      </div>

      <article className="mx-auto max-w-[210mm] bg-white p-10 shadow-level-2 print:max-w-none print:p-0 print:shadow-none">
        <header className="flex flex-col justify-between gap-6 border-b-2 border-brand-navy pb-6 sm:flex-row">
          <div>
            <Image src="/images/logo-web.png" alt="White Diamond" width={800} height={267} className="h-14 w-auto" priority />
            <div className="mt-3 space-y-0.5 text-xs text-brand-muted">
              <div>{settings.contact_address}</div>
              <div>
                {settings.contact_phone} · {settings.contact_email}
              </div>
            </div>
          </div>
          <div className="sm:text-right">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-brand-navy">INVOICE</h1>
            <dl className="mt-2 space-y-0.5 text-sm">
              <div>
                <dt className="inline text-brand-muted">Invoice no. </dt>
                <dd className="inline font-semibold">{order.orderNumber}</dd>
              </div>
              <div>
                <dt className="inline text-brand-muted">Date </dt>
                <dd className="inline">{formatDate(order.createdAt)}</dd>
              </div>
              <div>
                <dt className="inline text-brand-muted">Status </dt>
                <dd className="inline">{ORDER_STATUS_META[order.status].label}</dd>
              </div>
            </dl>
          </div>
        </header>

        <section className="grid gap-6 py-6 sm:grid-cols-2">
          <div>
            <h2 className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-brand-secondary">Bill to</h2>
            <div className="font-semibold">{order.customerName}</div>
            <div className="text-sm">{formatPkMobile(order.phone)}</div>
            {order.email && <div className="text-sm">{order.email}</div>}
            <div className="mt-1 whitespace-pre-line text-sm">{order.address}</div>
            <div className="text-sm font-semibold">{order.city}</div>
          </div>
          <div className="sm:text-right">
            <h2 className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-brand-secondary">Payment</h2>
            <div className="font-semibold">{PAYMENT_METHOD_LABEL[order.paymentMethod]}</div>
          </div>
        </section>

        <table className="w-full text-sm tabular-nums">
          <thead>
            <tr className="border-y border-brand-border bg-brand-surface text-left text-[11px] uppercase tracking-wider text-brand-muted print:bg-transparent">
              <th className="py-2 pl-2 font-semibold">#</th>
              <th className="py-2 font-semibold">Item</th>
              <th className="py-2 text-right font-semibold">Unit price</th>
              <th className="py-2 text-right font-semibold">Qty</th>
              <th className="py-2 pr-2 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={item.id} className="border-b border-brand-border">
                <td className="py-2.5 pl-2 text-brand-muted">{i + 1}</td>
                <td className="py-2.5">{item.productName}</td>
                <td className="py-2.5 text-right">{formatPrice(item.unitPrice)}</td>
                <td className="py-2.5 text-right">{item.quantity}</td>
                <td className="py-2.5 pr-2 text-right">{formatPrice(item.lineTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end">
          <dl className="w-full max-w-xs space-y-1.5 text-sm tabular-nums">
            <div className="flex justify-between">
              <dt className="text-brand-muted">Subtotal</dt>
              <dd>{formatPrice(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-muted">Delivery</dt>
              <dd>{order.deliveryCharge === 0 ? 'Free' : formatPrice(order.deliveryCharge)}</dd>
            </div>
            <div className="flex justify-between border-t-2 border-brand-navy pt-2 text-base font-bold">
              <dt>Total (PKR)</dt>
              <dd>{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </div>

        {order.paymentMethod === 'BANK_TRANSFER' && settings.bank_details && (
          <section className="mt-8 rounded-xl border border-brand-border p-4 text-sm print:break-inside-avoid">
            <h2 className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-brand-secondary">Bank details</h2>
            <p className="whitespace-pre-line">{settings.bank_details}</p>
          </section>
        )}

        <footer className="mt-10 border-t border-brand-border pt-4 text-center text-xs text-brand-muted">
          Thank you for your order! Questions? WhatsApp us at +{settings.whatsapp_number}.
        </footer>
      </article>
    </div>
  );
}
