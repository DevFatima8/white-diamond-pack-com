import type { OrderStatus, PaymentMethod, Prisma } from '@prisma/client';

export const ORDER_STATUSES: OrderStatus[] = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

/**
 * Label + badge style per status. Brand colours only (no green/orange):
 * red = needs attention, maroon = in progress / done, grey = cancelled.
 */
export const ORDER_STATUS_META: Record<OrderStatus, { label: string; badge: string; dot: string }> = {
  PENDING: { label: 'Pending', badge: 'bg-[#FDECEC] text-brand-primary ring-1 ring-brand-primary/25', dot: 'bg-brand-primary' },
  CONFIRMED: { label: 'Confirmed', badge: 'bg-brand-tint text-brand-secondary ring-1 ring-brand-secondary/25', dot: 'bg-brand-secondary' },
  SHIPPED: { label: 'Shipped', badge: 'bg-brand-secondary text-white', dot: 'bg-brand-secondary' },
  DELIVERED: { label: 'Delivered', badge: 'bg-brand-secondary text-white', dot: 'bg-brand-secondary' },
  CANCELLED: { label: 'Cancelled', badge: 'bg-slate-100 text-brand-muted line-through', dot: 'bg-slate-400' },
};

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  COD: 'Cash on Delivery',
  BANK_TRANSFER: 'Bank Transfer',
};

export function isOrderStatus(value: string | undefined | null): value is OrderStatus {
  return !!value && (ORDER_STATUSES as string[]).includes(value);
}

/**
 * Next order number, e.g. "WD-1001". Must be called INSIDE the transaction that
 * creates the order: the increment locks the counter row until the transaction
 * ends, so two simultaneous checkouts can never get the same number.
 */
export async function nextOrderNumber(tx: Prisma.TransactionClient): Promise<string> {
  const counter = await tx.counter.upsert({
    where: { name: 'order' },
    create: { name: 'order', value: 1001 }, // only if the seed never ran
    update: { value: { increment: 1 } },
  });
  return `WD-${counter.value}`;
}
