import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/site-data';
import IndustriesView from '@/components/pages/IndustriesView';

export const metadata: Metadata = {
  title: 'Industries We Serve — Restaurants, Bakeries, Catering & Retail',
  description:
    'Food packaging for restaurants, bakeries, caterers, hotels, cloud kitchens and supermarkets across Pakistan. See the right White Diamond products for your business.',
  alternates: { canonical: '/industries' },
};

export default async function IndustriesPage() {
  const settings = await getSiteSettings();
  return <IndustriesView whatsapp={settings.whatsapp_number} />;
}
