import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/site-data';
import DivisionsView from '@/components/pages/DivisionsView';

export const metadata: Metadata = {
  title: 'Business Divisions — Packaging, Hygiene & Private Label',
  description:
    'White Diamond Packaging, White Diamond Hygiene and Custom & Private Label: food packaging, hygienic disposables and branded packaging made in Faisalabad.',
  alternates: { canonical: '/business-divisions' },
};

export default async function BusinessDivisionsPage() {
  const settings = await getSiteSettings();
  return <DivisionsView whatsapp={settings.whatsapp_number} />;
}
