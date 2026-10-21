import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/site-data';
import { settingNumber } from '@/lib/settings';
import CheckoutView from '@/components/checkout/CheckoutView';

export const metadata: Metadata = { title: 'Checkout', robots: { index: false } };

export default async function CheckoutPage() {
  const settings = await getSiteSettings();
  return (
    <CheckoutView
      delivery={{ charge: settingNumber(settings, 'delivery_charge'), threshold: settingNumber(settings, 'free_delivery_threshold') }}
      bankDetails={settings.bank_details}
    />
  );
}
