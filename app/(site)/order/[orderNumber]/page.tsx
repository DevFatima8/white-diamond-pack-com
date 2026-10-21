import type { Metadata } from 'next';
import db from '@/lib/db';
import { formatDateTime } from '@/lib/dates';
import { verifyOrderToken } from '@/lib/order-token';
import { getSiteSettings } from '@/lib/site-data';
import OrderConfirmation, { OrderNotFound } from '@/components/checkout/OrderConfirmation';

export const dynamic = 'force-dynamic';
// Private page: never index, never send the URL (with its token) to other sites.
export const metadata: Metadata = { title: 'Order confirmation', robots: { index: false, follow: false }, referrer: 'no-referrer' };

type Params = Promise<{ orderNumber: string }>;
type SearchParams = Promise<{ t?: string }>;

/**
 * Order confirmation. Opens only with the signed token from checkout (?t=…), because
 * order numbers are sequential and the page shows the customer's name and address.
 */
export default async function OrderPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const orderNumber = decodeURIComponent((await params).orderNumber).toUpperCase();
  const { t: token } = await searchParams;

  const valid = /^WD-\d{1,9}$/.test(orderNumber) && verifyOrderToken(orderNumber, token);
  const [order, settings] = await Promise.all([
    valid ? db.order.findUnique({ where: { orderNumber }, include: { items: { orderBy: { createdAt: 'asc' } } } }) : null,
    getSiteSettings(),
  ]);

  if (!order) {
    // Same message whether the order doesn't exist or the token is wrong (don't reveal which).
    return <OrderNotFound />;
  }

  return (
    <OrderConfirmation
      order={{
        orderNumber: order.orderNumber,
        createdAt: formatDateTime(order.createdAt),
        status: order.status,
        paymentMethod: order.paymentMethod,
        customerName: order.customerName,
        phone: order.phone,
        city: order.city,
        address: order.address,
        subtotal: order.subtotal,
        deliveryCharge: order.deliveryCharge,
        total: order.total,
        items: order.items.map((i) => ({ id: i.id, productName: i.productName, unitPrice: i.unitPrice, quantity: i.quantity, lineTotal: i.lineTotal })),
      }}
      bankDetails={settings.bank_details}
      whatsapp={settings.whatsapp_number}
    />
  );
}
