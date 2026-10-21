import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/site-data';
import CustomPackagingView from '@/components/pages/CustomPackagingView';

export const metadata: Metadata = {
  title: 'Custom & Private Label Packaging — Request a Quote',
  description:
    'Logo printing, embossed foil, custom roll sizes and branded cartons for restaurant chains, supermarkets and distributors. Request a custom packaging quote from White Diamond.',
  alternates: { canonical: '/customize-packaging' },
};

export default async function CustomizePackagingPage() {
  const settings = await getSiteSettings();
  return <CustomPackagingView phone={settings.contact_phone} whatsapp={settings.whatsapp_number} />;
}
