import type { OrderStatus } from '@prisma/client';
import { ORDER_STATUS_META } from '@/lib/orders';
import { Badge } from './ui';

/** Status pill. Colour + text label, never colour alone. */
export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const meta = ORDER_STATUS_META[status];
  return <Badge className={meta.badge}>{meta.label}</Badge>;
}
