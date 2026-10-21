import { NextRequest, NextResponse, after } from 'next/server';
import db from '@/lib/db';
import { serverError, validationError } from '@/lib/api';
import { deliveryFor } from '@/lib/delivery';
import { notifyNewOrder } from '@/lib/notify';
import { orderToken } from '@/lib/order-token';
import { nextOrderNumber } from '@/lib/orders';
import { RateLimiter, getClientIp } from '@/lib/rate-limit';
import { getSettings, settingNumber } from '@/lib/settings';
import { orderRequestSchema } from '@/lib/validation/order';

// At most 10 orders per IP per 15 minutes — stops scripts from flooding the order list.
const orderLimiter = new RateLimiter(10, 15 * 60 * 1000);

const conflict = (code: string, productIds: string[] = []) =>
  NextResponse.json({ success: false, error: code, productIds }, { status: 409 });

/**
 * Public: place an order.
 * SECURITY: the browser only sends product ids + quantities. Every price is looked up
 * again here from the database — a price sent by the browser would be trivial to fake.
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (orderLimiter.retryAfterSeconds(ip) > 0) {
    return NextResponse.json({ success: false, error: 'too_many' }, { status: 429 });
  }

  const parsed = orderRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);
  const { customer, paymentMethod } = parsed.data;

  // Same product twice in the request → one line with the quantities added up
  const quantities = new Map<string, number>();
  for (const item of parsed.data.items) quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);

  try {
    const [products, settings] = await Promise.all([
      db.product.findMany({
        where: { id: { in: [...quantities.keys()] }, isActive: true },
        select: { id: true, name: true, price: true, salePrice: true, minOrderQty: true, inStock: true },
      }),
      getSettings(),
    ]);
    const byId = new Map(products.map((p) => [p.id, p]));

    // Every product must still exist, be in stock, have a price, and meet its minimum quantity.
    const missing = [...quantities.keys()].filter((id) => !byId.has(id));
    if (missing.length) return conflict('unavailable', missing);
    const notAvailable = products.filter((p) => !p.inStock || p.price === null).map((p) => p.id);
    if (notAvailable.length) return conflict('unavailable', notAvailable);
    const belowMinimum = products.filter((p) => quantities.get(p.id)! < p.minOrderQty).map((p) => p.id);
    if (belowMinimum.length) return conflict('min_quantity', belowMinimum);

    const items = products.map((p) => {
      const unitPrice = Math.round(p.salePrice ?? p.price!); // whole rupees
      const quantity = quantities.get(p.id)!;
      return { productId: p.id, productName: p.name, unitPrice, quantity, lineTotal: unitPrice * quantity };
    });
    const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
    const deliveryCharge = deliveryFor(subtotal, settingNumber(settings, 'delivery_charge'), settingNumber(settings, 'free_delivery_threshold'));

    // Order + lines in ONE transaction: both are saved, or (on any error) neither.
    const order = await db.$transaction(async (tx) => {
      const orderNumber = await nextOrderNumber(tx);
      return tx.order.create({
        data: {
          orderNumber,
          customerName: customer.name,
          phone: customer.phone,
          email: customer.email,
          city: customer.city,
          address: customer.address,
          notes: customer.notes,
          paymentMethod,
          subtotal,
          deliveryCharge,
          total: subtotal + deliveryCharge,
          items: { create: items },
        },
        select: { id: true, orderNumber: true, createdAt: true },
      });
    });

    orderLimiter.hit(ip); // count successful orders (validation errors don't use up the limit)

    // Email the owner AFTER the response is sent, so the customer doesn't wait for it.
    after(() =>
      notifyNewOrder(
        { ...order, ...customer, customerName: customer.name, paymentMethod, subtotal, deliveryCharge, total: subtotal + deliveryCharge, items },
        `${request.nextUrl.origin}/admin/orders/${order.id}`,
      ),
    );

    return NextResponse.json(
      { success: true, data: { orderNumber: order.orderNumber, token: orderToken(order.orderNumber) } },
      { status: 201 },
    );
  } catch (err) {
    return serverError('orders POST', err, 'Could not place the order');
  }
}
