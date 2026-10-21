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

  return (
    <SiteMotion>
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
