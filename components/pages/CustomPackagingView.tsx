'use client';

import Image from 'next/image';
import { Boxes, Package, PenTool, Phone, Ruler, Stamp } from 'lucide-react';
import { contactIconText } from '@/lib/icon-colors';
import { whatsappLink } from '@/lib/phone';
import BrandIcon from '@/components/layout/BrandIcon';
import { Eyebrow, SectionTitle } from '@/components/ui/SectionRail';
import Reveal from '@/components/ui/Reveal';
import PageHero from './PageHero';
import EnquiryForm from './EnquiryForm';
import { pillClass } from './buttons';
import { usePageTexts } from './usePageTexts';

const OPTION_ICONS = [PenTool, Stamp, Ruler, Boxes];

/** /customize-packaging — private label options, process and the quote form (#quote). */
export default function CustomPackagingView({ phone, whatsapp }: { phone: string; whatsapp: string }) {
  const { p, t } = usePageTexts();
  const c = p.customPackaging;

  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} intro={c.intro}>
        <a href="#quote" className={pillClass('primary')}>{c.formTitle}</a>
        <a href={whatsappLink(whatsapp, t.whatsapp.message)} target="_blank" rel="noreferrer" className={pillClass('whatsapp')}>
          <BrandIcon name="whatsapp" className="h-4 w-4" />
          {p.common.ctaWhatsapp}
        </a>
      </PageHero>

      {/* Options */}
      <section className="mx-auto w-full max-w-site px-5 py-16 sm:px-6 lg:px-12 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow>{c.eyebrow}</Eyebrow>
            <SectionTitle>{c.optionsTitle}</SectionTitle>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2">
              {c.options.map((o, i) => {
                const Icon = OPTION_ICONS[i % OPTION_ICONS.length];
                return (
                  <li key={o.title} className="rounded-2xl border border-brand-border bg-white p-6 transition-shadow hover:shadow-level-2">
                    <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-tint text-brand-secondary">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className="font-heading text-base font-bold text-brand-ink">{o.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-brand-muted">{o.desc}</p>
                  </li>
                );
              })}
            </ul>
          </div>
          <Reveal className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-brand-tint shadow-level-2">
              <Image src="/images/hero3.png" alt="" fill sizes="(min-width: 1024px) 460px, 100vw" className="object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section className="bg-brand-tint py-16 text-brand-ink lg:py-20">
        <div className="mx-auto max-w-site px-5 sm:px-6 lg:px-12">
          <h2 className="font-heading text-[28px] font-bold leading-9 sm:text-[40px] sm:leading-[48px]">{c.processTitle}</h2>
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {c.process.map((s, i) => (
              <li key={s.title} className="relative rounded-2xl bg-white p-6 ring-1 ring-brand-border">
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary font-heading text-base font-bold text-white">{i + 1}</span>
                <h3 className="font-heading text-base font-bold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-brand-muted">{s.desc}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex items-start gap-3 rounded-2xl bg-white p-5 ring-1 ring-brand-border sm:p-6">
            <Package className="mt-0.5 h-5 w-5 shrink-0 text-brand-secondary" aria-hidden />
            <p className="text-sm leading-6">
              <span className="font-bold">{c.moqTitle}: </span>
              <span className="text-brand-muted">{c.moqText}</span>
            </p>
          </div>
        </div>
      </section>

      {/* Quote form */}
      <section id="quote" className="mx-auto grid w-full max-w-site scroll-mt-28 gap-10 px-5 py-16 sm:px-6 lg:grid-cols-12 lg:px-12 lg:py-20">
        <div className="lg:col-span-4">
          <SectionTitle>{c.formTitle}</SectionTitle>
          <p className="mt-3 text-base leading-7 text-brand-muted">{c.formText}</p>
          <div className="mt-8 space-y-3">
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-3 rounded-2xl bg-brand-tint p-5 text-sm font-bold text-brand-navy hover:bg-[#FCE8E9]">
              <Phone className={`h-5 w-5 ${contactIconText('phone')}`} aria-hidden />
              <span dir="ltr">{phone}</span>
            </a>
            <a
              href={whatsappLink(whatsapp, t.whatsapp.message)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl bg-brand-tint p-5 text-sm font-bold text-brand-navy hover:bg-[#FCE8E9]"
            >
              <BrandIcon name="whatsapp" className={`h-5 w-5 ${contactIconText('whatsapp')}`} />
              {p.common.ctaWhatsapp}
            </a>
          </div>
        </div>
        <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-level-2 sm:p-8 lg:col-span-8">
          <EnquiryForm
            kind="custom-packaging"
            subjectLabel={c.productLabel}
            subjectOptions={c.productOptions}
            showQuantity
            messagePlaceholder={c.messagePlaceholder}
          />
        </div>
      </section>
    </>
  );
}
