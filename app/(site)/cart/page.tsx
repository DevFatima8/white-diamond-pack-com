import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/site-data';
import { settingNumber } from '@/lib/settings';
import CartPageView from '@/components/cart/CartPageView';

export const metadata: Metadata = { title: 'Shopping Cart', robots: { index: false } };

export default async function CartPage() {
  const settings = await getSiteSettings();
  return (
    <CartPageView
      delivery={{ charge: settingNumber(settings, 'delivery_charge'), threshold: settingNumber(settings, 'free_delivery_threshold') }}
    />
  );
}
