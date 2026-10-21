import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/site-data';
import PresenceView from '@/components/pages/PresenceView';

export const metadata: Metadata = {
  title: 'Our Presence — Delivery Across Pakistan',
  description:
    'From our Faisalabad plant White Diamond delivers food packaging to 50+ cities: Lahore, Karachi, Islamabad, Multan, Peshawar and more. Delivery areas and times.',
  alternates: { canonical: '/our-presence' },
};

export default async function OurPresencePage() {
  const settings = await getSiteSettings();
  return <PresenceView address={settings.contact_address} whatsapp={settings.whatsapp_number} />;
}
