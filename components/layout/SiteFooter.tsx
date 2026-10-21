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
  const heading = 'mb-5 font-heading text-[15px] font-bold uppercase tracking-wider text-white';
  const link = 'text-sm text-[#C7D2FE]/80 transition-colors hover:text-white';

  const quickLinks = [
    { href: routes.about, label: tf.links.about },
    { href: routes.shop, label: tf.links.shop },
    { href: routes.presence, label: tf.links.presence },
    { href: routes.customPackaging, label: tf.links.customPackaging },
    { href: routes.careers, label: tf.links.careers },
    { href: routes.contact, label: tf.links.contact },
  ];

  return (
    <footer className="bg-brand-navy-dark text-white">
      <div className="mx-auto grid max-w-site gap-10 px-5 pb-10 pt-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:px-12">
        <div>
          <Logo className="h-14" />
          <p className="mt-5 max-w-sm text-sm leading-6 text-[#C7D2FE]/80">{tf.about}</p>
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
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-brand-secondary"
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
          <ul className="space-y-4 text-sm text-[#C7D2FE]/80">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#A5B4FC]" aria-hidden />
              <span>{settings.address}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#A5B4FC]" aria-hidden />
              <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="hover:text-white" dir="ltr">
                {settings.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#A5B4FC]" aria-hidden />
              <a href={`mailto:${settings.email}`} className="break-all hover:text-white">
                {settings.email}
              </a>
            </li>
            <li className="flex gap-3">
              <BrandIcon name="whatsapp" className="mt-0.5 h-4 w-4 shrink-0 text-[#A5B4FC]" />
              <a href={whatsappLink(settings.whatsapp, t.whatsapp.message)} target="_blank" rel="noreferrer" className="hover:text-white">
                {tf.whatsapp} <span dir="ltr">+{settings.whatsapp}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-site flex-col gap-3 px-5 py-6 text-xs text-[#C7D2FE]/60 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-12">
          <p>{fill(tf.rights, { year: new Date().getFullYear() })}</p>
          <div className="flex gap-5">
            <Link href={routes.privacy} className="hover:text-white">{tf.privacy}</Link>
            <Link href={routes.terms} className="hover:text-white">{tf.terms}</Link>
            <Link href={routes.shipping} className="hover:text-white">{tf.shipping}</Link>
            <Link href={routes.faq} className="hover:text-white">{tf.faq}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
