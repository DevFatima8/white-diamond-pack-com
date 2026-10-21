'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { OrderStatus } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { adminFetch } from '@/lib/admin/client';
import { ORDER_STATUSES, ORDER_STATUS_META } from '@/lib/orders';
import { Select } from './ui';

/** Status dropdown that saves as soon as a new status is picked. */
export default function OrderStatusSelect({ orderId, orderNumber, initial }: { orderId: string; orderNumber: string; initial: OrderStatus }) {
  const router = useRouter();
  const toast = useToast();
  const [status, setStatus] = useState(initial);
  const [saving, setSaving] = useState(false);

  const change = async (next: OrderStatus) => {
    const previous = status;
    setStatus(next);
    setSaving(true);
    const res = await adminFetch(`/api/admin/orders/${orderId}`, { method: 'PATCH', body: { status: next } });
    setSaving(false);
    if (!res.ok) {
      setStatus(previous);
      toast.error(res.error ?? 'Could not update the status');
      return;
    }
    toast.success(`#${orderNumber} is now ${ORDER_STATUS_META[next].label}`);
    router.refresh(); // sidebar badge + page data
  };

  return (
    <div className="relative">
      <label htmlFor="order-status" className="mb-1.5 block text-[13px] font-semibold text-brand-ink">
        Order status
      </label>
      <Select id="order-status" value={status} onChange={(e) => change(e.target.value as OrderStatus)} disabled={saving}>
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {ORDER_STATUS_META[s].label}
          </option>
        ))}
      </Select>
      {saving && <Loader2 className="absolute right-9 top-[42px] h-4 w-4 animate-spin text-brand-secondary" aria-label="Saving" />}
    </div>
  );
}
