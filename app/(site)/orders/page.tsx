import type { Metadata } from 'next';
import OrderHistoryView from '@/components/orders/OrderHistoryView';

export const metadata: Metadata = { title: 'Your orders', robots: { index: false } };

export default function OrdersPage() {
  return <OrderHistoryView />;
}