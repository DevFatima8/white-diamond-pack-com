import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/site-data';
import ContactView from '@/components/pages/ContactView';

export const metadata: Metadata = {
  title: 'Contact Us — Sales, Bulk Orders & Support',
  description:
    'Call, WhatsApp or email White Diamond in Faisalabad for food packaging orders, bulk quotes and distributor enquiries. Head office: Sheikhupura Road, Faisalabad.',
  alternates: { canonical: '/contact' },
};

export default async function ContactPage() {
  const s = await getSiteSettings();
  return <ContactView contact={{ phone: s.contact_phone, email: s.contact_email, address: s.contact_address, whatsapp: s.whatsapp_number }} />;
}
