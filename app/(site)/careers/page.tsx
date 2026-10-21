import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/site-data';
import CareersView from '@/components/pages/CareersView';

export const metadata: Metadata = {
  title: 'Careers — Jobs at White Diamond Faisalabad',
  description:
    'Join White Diamond: open positions in sales, production, logistics and marketing in Faisalabad and Lahore. Apply online.',
  alternates: { canonical: '/careers' },
};

export default async function CareersPage() {
  const settings = await getSiteSettings();
  return <CareersView email={settings.contact_email} />;
}
