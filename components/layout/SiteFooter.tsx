'use client';

import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { fill } from '@/lib/i18n/translations';
import { whatsappLink } from '@/lib/phone';
import { categoryHref, routes } from '@/lib/routes';
import type { CategoryItem } from '@/lib/categories';
import BrandIcon, { type BrandIconName } from './BrandIcon';
import Logo from './Logo';

export interface FooterSettings {
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  socials: { name: BrandIconName; label: string; url: string }[]; // only filled-in links
}

export default function SiteFooter({ categories, settings }: { categories: CategoryItem[]; settings: FooterSettings }) {
  const { t, isRTL } = useLanguage();
  const tf = t.footer;
  const heading = 'mb-5 font-heading text-[15px] font-bold uppercase tracking-wider text-brand-ink';
  const link = 'text-sm text-brand-muted transition-colors hover:text-brand-secondary';

  const quickLinks = [
    { href: routes.about, label: tf.links.about },
    { href: routes.shop, label: tf.links.shop },
    { href: routes.presence, label: tf.links.presence },
    { href: routes.customPackaging, label: tf.links.customPackaging },
    { href: routes.careers, label: tf.links.careers },
    { href: routes.contact, label: tf.links.contact },
  ];

  return (
    <footer className="border-t border-brand-border bg-brand-tint text-brand-ink">
      <div className="mx-auto grid max-w-site gap-10 px-5 pb-10 pt-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:px-12">
        <div>
          <Logo className="h-14" />
          <p className="mt-5 max-w-sm text-sm leading-6 text-brand-muted">{tf.about}</p>
          {settings.socials.length > 0 && (
            <div className="mt-6">
              <p className="sr-only">{tf.followUs}</p>
              <ul className="flex gap-2">
                {settings.socials.map((s) => (
                  <li key={s.name}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-secondary shadow-level-1 transition-colors hover:bg-brand-secondary hover:text-white"
                    >
                      <BrandIcon name={s.name} className="h-4 w-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <nav aria-label={tf.quickLinks}>
          <h2 className={heading}>{tf.quickLinks}</h2>
          <ul className="space-y-3">
            {quickLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className={link}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={tf.categories}>
          <h2 className={heading}>{tf.categories}</h2>
          <ul className="space-y-3">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={categoryHref(c.slug)} className={link}>
                  {isRTL ? c.nameAr : c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={heading}>{tf.contact}</h2>
          {/* Each row is one big link (easy to tap). Phone/email open the phone or mail app;
              the address opens Google Maps; WhatsApp opens a chat. */}
          <ul className="space-y-1 text-sm text-brand-muted">
            {[
              { key: 'address', icon: <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-secondary" aria-hidden />, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`, external: true, label: settings.address },
              { key: 'phone', icon: <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-secondary" aria-hidden />, href: `tel:${settings.phone.replace(/\s/g, '')}`, label: <span dir="ltr">{settings.phone}</span> },
              { key: 'email', icon: <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-secondary" aria-hidden />, href: `mailto:${settings.email}`, label: <span className="break-all">{settings.email}</span> },
              { key: 'whatsapp', icon: <BrandIcon name="whatsapp" className="mt-0.5 h-4 w-4 shrink-0 text-brand-secondary" />, href: whatsappLink(settings.whatsapp, t.whatsapp.message), external: true, label: <>{tf.whatsapp} <span dir="ltr">+{settings.whatsapp}</span></> },
            ].map((row) => (
              <li key={row.key}>
                <a
                  href={row.href}
                  {...(row.external && { target: '_blank', rel: 'noreferrer' })}
                  className="-mx-2 flex gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-white hover:text-brand-secondary"
                >
                  {row.icon}
                  <span>{row.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-border bg-[#FCE8E9]">
        <div className="mx-auto flex max-w-site flex-col gap-3 px-5 py-6 text-xs text-brand-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-12">
          <p>{fill(tf.rights, { year: new Date().getFullYear() })}</p>
          <div className="flex gap-5">
            <Link href={routes.privacy} className="hover:text-brand-secondary">{tf.privacy}</Link>
            <Link href={routes.terms} className="hover:text-brand-secondary">{tf.terms}</Link>
            <Link href={routes.shipping} className="hover:text-brand-secondary">{tf.shipping}</Link>
            <Link href={routes.faq} className="hover:text-brand-secondary">{tf.faq}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
