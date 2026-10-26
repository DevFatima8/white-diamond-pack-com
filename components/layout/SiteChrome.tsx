import type { ReactNode } from 'react';
import { getSiteCategories, getSiteSettings } from '@/lib/site-data';
import SiteHeader from './SiteHeader';
import SiteFooter, { type FooterSettings } from './SiteFooter';
import SiteMotion from './SiteMotion';
import WhatsAppButton from './WhatsAppButton';

/**
 * Header + footer + floating WhatsApp button around public content. Used by the
 * (site) layout and by the root 404 page (which renders outside that layout).
 * Categories (for the menus) and settings (contact details, social links) are
 * loaded once here on the server. If the database is unreachable the site still
 * renders — just without categories and with the default contact details.
 */
export default async function SiteChrome({ children }: { children: ReactNode }) {
  const [categories, settings] = await Promise.all([getSiteCategories(), getSiteSettings()]);

  const socials: FooterSettings['socials'] = (
    [
      { name: 'facebook', label: 'Facebook', url: settings.social_facebook },
      { name: 'instagram', label: 'Instagram', url: settings.social_instagram },
      { name: 'linkedin', label: 'LinkedIn', url: settings.social_linkedin },
      { name: 'youtube', label: 'YouTube', url: settings.social_youtube },
      { name: 'tiktok', label: 'TikTok', url: settings.social_tiktok },
    ] as const
  ).filter((s) => s.url.startsWith('https://')); // empty = hidden (brief: no dead social links)

  // Structured data for Google: who the business is, where, and how to reach it
  // (helps the Google business card / local results). Values come from Admin → Settings.
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001').replace(/\/+$/, '');
  const businessJsonLd = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    '@id': `${siteUrl}/#business`,
    name: 'White Diamond',
    description: 'Manufacturer and supplier of aluminium foil, food containers, cling film, baking paper and food packaging in Faisalabad, Pakistan.',
    url: siteUrl,
    logo: `${siteUrl}/images/logo-icon.png`,
    image: `${siteUrl}/images/home/hero-studio-showcase.jpg`,
    telephone: settings.contact_phone,
    email: settings.contact_email,
    address: { '@type': 'PostalAddress', streetAddress: settings.contact_address, addressLocality: 'Faisalabad', addressRegion: 'Punjab', addressCountry: 'PK' },
    areaServed: { '@type': 'Country', name: 'Pakistan' },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '18:00' },
    ],
    sameAs: socials.map((s) => s.url),
  };

  return (
    <SiteMotion>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd).replace(/</g, '\\u003c') }} />
      <SiteHeader categories={categories} contact={{ phone: settings.contact_phone, whatsapp: settings.whatsapp_number }} />
      <main id="main" className="flex w-full flex-1 flex-col">
        {children}
      </main>
      <SiteFooter
        categories={categories}
        settings={{
          phone: settings.contact_phone,
          email: settings.contact_email,
          address: settings.contact_address,
          whatsapp: settings.whatsapp_number,
          socials: [...socials],
        }}
      />
      <WhatsAppButton number={settings.whatsapp_number} />
    </SiteMotion>
  );
}
