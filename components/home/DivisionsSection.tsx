'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, Building2, Check, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import Reveal from '@/components/ui/Reveal';
import SectionRail, { Eyebrow, SectionTitle } from '@/components/ui/SectionRail';

/** Two manufacturing divisions in alternating image/text rows. */
export default function DivisionsSection() {
  const { t } = useLanguage();
  const td = t.home.divisions;

  const rows = [
    { key: 'packaging', data: td.packaging, image: '/images/home/division-packaging.jpg', icon: BadgeCheck, badge: 'bg-brand-navy-dark', iconColor: 'text-brand-primary' },
    { key: 'hygiene', data: td.hygiene, image: '/images/home/division-hygiene.jpg', icon: ShieldCheck, badge: 'bg-brand-secondary', iconColor: 'text-white' },
  ] as const;

  return (
    <section className="bg-brand-tint/60 py-16">
      <div className="mx-auto max-w-site px-5 sm:px-6 lg:px-12">
        <SectionRail label={td.label} icon={Building2}>
          <div className="mb-12">
            <Eyebrow>{td.eyebrow}</Eyebrow>
            <SectionTitle>{td.title}</SectionTitle>
          </div>

          <div className="flex flex-col gap-12">
            {rows.map(({ key, data, image, icon: Icon, badge, iconColor }, i) => {
              const imageFirst = i % 2 === 1; // second row: image on the start side
              return (
                <Reveal key={key}>
                  <div className="grid items-center gap-8 rounded-3xl bg-white p-6 shadow-level-1 sm:p-8 lg:grid-cols-12 lg:p-10">
                    <div className={cn('flex flex-col gap-4 lg:col-span-6', imageFirst ? 'lg:order-2' : 'lg:order-1')}>
                      <span className="w-fit rounded-full bg-brand-tint px-3 py-1 text-xs font-bold text-brand-secondary">{data.tag}</span>
                      <h3 className="font-heading text-[28px] font-semibold leading-9 text-brand-ink">{data.title}</h3>
                      <p className="text-[15px] leading-6 text-brand-muted">{data.desc}</p>
                      <ul className="space-y-2.5 pt-2 text-[13px] text-brand-ink">
                        {data.points.map((p) => (
                          <li key={p} className="flex items-center gap-2.5">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E1E0FF] text-[#07006C]">
                              <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                            </span>
                            {p}
                          </li>
                        ))}
                      </ul>
                      <Link href={routes.divisions} className="mt-2 inline-flex w-fit items-center gap-2 text-sm font-bold text-brand-secondary transition-colors hover:text-brand-primary">
                        {td.readMore}
                        <span className="sr-only">: {data.title}</span>
                        <ArrowRight className="h-[18px] w-[18px] rtl:rotate-180" aria-hidden />
                      </Link>
                    </div>

                    <div className={cn('relative lg:col-span-6', imageFirst ? 'lg:order-1' : 'lg:order-2')}>
                      <div className="relative h-64 overflow-hidden rounded-2xl shadow-md sm:h-72">
                        <Image src={image} alt={data.imageAlt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
                      </div>
                      <div
                        className={cn(
                          'absolute -bottom-3 flex items-center gap-3 rounded-2xl px-5 py-3 text-white shadow-xl sm:bottom-4',
                          imageFirst ? '-start-1 sm:start-4' : '-end-1 sm:end-4',
                          badge,
                        )}
                      >
                        <Icon className={cn('h-7 w-7', iconColor)} aria-hidden />
                        <span className="flex flex-col">
                          <span className="font-heading text-sm font-bold">{data.badgeTitle}</span>
                          <span className="text-[11px] text-white/80">{data.badgeDesc}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </SectionRail>
      </div>
    </section>
  );
}
