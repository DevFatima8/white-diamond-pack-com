'use client';

import { useEffect } from 'react';
import { orderHistoryStore } from '@/lib/order-history-store';

/** Saves this order to local history when the customer opens a valid confirmation link. */
export default function RememberOrder({ orderNumber, token }: { orderNumber: string; token: string }) {
  useEffect(() => {
    orderHistoryStore.add(orderNumber, token);
  }, [orderNumber, token]);
  return null;
}