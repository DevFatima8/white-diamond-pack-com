import type { Metadata } from 'next';
import { pageTexts } from '@/lib/i18n/pages';
import { getSiteSettings } from '@/lib/site-data';
import FaqView from '@/components/pages/FaqView';

export const metadata: Metadata = {
  title: 'FAQ — Ordering, Delivery & Payment',
  description: 'Answers about ordering food packaging from White Diamond: minimum order, delivery times across Pakistan, cash on delivery, bank transfer and product use.',
  alternates: { canonical: '/faq' },
};

// FAQPage structured data (English) so search engines can show the answers directly.
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: pageTexts.en.faq.groups.flatMap((g) =>
    g.items.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
  ),
};

export default async function FaqPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }} />
      <FaqView whatsapp={settings.whatsapp_number} />
    </>
  );
}
