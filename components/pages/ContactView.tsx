'use client';

import { Clock, Mail, MapPin, Navigation, Phone } from 'lucide-react';
import type { ReactNode } from 'react';
import { whatsappLink } from '@/lib/phone';
import BrandIcon from '@/components/layout/BrandIcon';
import { SectionTitle } from '@/components/ui/SectionRail';
import PageHero from './PageHero';
import EnquiryForm from './EnquiryForm';
import { usePageTexts } from './usePageTexts';

export interface ContactDetails {
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
}

/** /contact — contact cards, message form (→ Admin → Messages), map and hours. */
export default function ContactView({ contact }: { contact: ContactDetails }) {
  const { p, t } = usePageTexts();
  const c = p.contact;
  const mapQuery = encodeURIComponent(contact.address);

  const cards: { icon: ReactNode; title: string; value: string; sub?: string; href: string; external?: boolean; ltr?: boolean }[] = [
    { icon: <Phone className="h-5 w-5" aria-hidden />, title: c.callTitle, value: contact.phone, href: `tel:${contact.phone.replace(/\s/g, '')}`, ltr: true },
    {
      icon: <BrandIcon name="whatsapp" className="h-5 w-5" />,
      title: c.whatsappTitle,
      value: c.whatsappText,
      href: whatsappLink(contact.whatsapp, t.whatsapp.message),
      external: true,
    },
    { icon: <Mail className="h-5 w-5" aria-hidden />, title: c.emailTitle, value: contact.email, href: `mailto:${contact.email}`, ltr: true },
    {
      icon: <MapPin className="h-5 w-5" aria-hidden />,
      title: c.visitTitle,
      value: contact.address,
      href: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
      external: true,
    },
  ];

  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} intro={c.intro} />

      <section className="mx-auto -mt-8 w-full max-w-site px-5 sm:px-6 lg:px-12">
        <ul className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <li key={card.title}>
              <a
                href={card.href}
                {...(card.external && { target: '_blank', rel: 'noreferrer' })}
                className="group flex h-full items-start gap-4 rounded-2xl border border-brand-border bg-white p-5 shadow-level-2 transition-colors hover:border-brand-secondary"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand-secondary transition-colors group-hover:bg-brand-secondary group-hover:text-white">
                  {card.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-bold uppercase tracking-wider text-brand-muted">{card.title}</span>
                  <span className="mt-1 block break-words text-sm font-semibold text-brand-navy" dir={card.ltr ? 'ltr' : undefined}>
                    {card.value}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto grid w-full max-w-site gap-10 px-5 py-16 sm:px-6 lg:grid-cols-12 lg:px-12 lg:py-20">
        <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-level-1 sm:p-8 lg:col-span-7">
          <SectionTitle className="text-2xl sm:text-[32px] sm:leading-10">{c.formTitle}</SectionTitle>
          <p className="mb-8 mt-2 text-sm leading-6 text-brand-muted">{c.formText}</p>
          <EnquiryForm kind="contact" subjectLabel={c.topicLabel} subjectOptions={c.topics} />
        </div>

        <div className="flex flex-col gap-6 lg:col-span-5">
          <div className="overflow-hidden rounded-3xl border border-brand-border bg-brand-tint shadow-level-1">
            <iframe
              title={c.mapLabel}
              src={`https://maps.google.com/maps?q=${mapQuery}&z=14&output=embed`}
              className="h-72 w-full border-0 lg:h-80"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-5">
              <div>
                <h2 className="font-heading text-base font-bold text-brand-ink">{c.mapTitle}</h2>
                <p className="mt-0.5 text-sm text-brand-muted">{contact.address}</p>
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-secondary px-4 text-xs font-bold text-white hover:bg-brand-secondary-hover"
              >
                <Navigation className="h-4 w-4" aria-hidden />
                {c.directions}
              </a>
            </div>
          </div>

          <div className="rounded-3xl bg-brand-navy p-6 text-white sm:p-8">
            <h2 className="flex items-center gap-2 font-heading text-lg font-bold">
              <Clock className="h-5 w-5 text-[#A5B4FC]" aria-hidden />
              {c.hoursTitle}
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-[#DAE2FD]">
              {c.hours.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
