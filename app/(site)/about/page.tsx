import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/site-data';
import { getSiteGallery } from '@/lib/gallery';
import AboutView from '@/components/pages/AboutView';

export const metadata: Metadata = {
  title: 'About Us — Food Packaging Manufacturer in Faisalabad',
  description:
    'White Diamond makes aluminium foil, food containers, cling film and baking paper in Faisalabad and supplies food businesses across Pakistan. Our story, quality and infrastructure.',
  alternates: { canonical: '/about' },
};

export default async function AboutPage() {
  const [settings, gallery] = await Promise.all([getSiteSettings(), getSiteGallery()]);
  return <AboutView whatsapp={settings.whatsapp_number} gallery={gallery} />;
}
