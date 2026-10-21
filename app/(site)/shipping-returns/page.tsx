import type { Metadata } from 'next';
import LegalView from '@/components/pages/LegalView';

export const metadata: Metadata = {
  title: 'Shipping & Returns',
  description: 'White Diamond delivery areas, delivery times and charges across Pakistan, plus our returns, replacements and refunds policy.',
  alternates: { canonical: '/shipping-returns' },
};

export default function ShippingReturnsPage() {
  return <LegalView page="shipping" />;
}
