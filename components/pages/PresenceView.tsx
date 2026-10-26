'use client';

import Link from 'next/link';
import { ArrowRight, Clock, Factory, MapPin, Truck } from 'lucide-react';
import { routes } from '@/lib/routes';
import { Eyebrow, SectionTitle } from '@/components/ui/SectionRail';
import CountUp from '@/components/ui/CountUp';
import Reveal from '@/components/ui/Reveal';
import PakistanMap from '@/components/home/PakistanMap';
import PageHero from './PageHero';
import CtaBand from './CtaBand';
import { pillClass } from './buttons';
import { usePageTexts } from './usePageTexts';

/** /our-presence — Pakistan map, head office, delivery regions and times. */
export default function PresenceView({ address, whatsapp }: { address: string; whatsapp: string }) {
  const { p, t } = usePageTexts();
  const pr = p.presence;
  const tp = t.home.presence;

  return (
    <>
      <PageHero eyebrow={pr.eyebrow} title={pr.title} intro={pr.intro} />

      <section className="mx-auto grid w-full max-w-site gap-8 px-5 py-16 sm:px-6 lg:grid-cols-12 lg:px-12 lg:py-20">
        <Reveal className="lg:col-span-7">
          <div className="relative h-full overflow-hidden rounded-3xl bg-white p-6 text-brand-ink shadow-level-2 ring-1 ring-brand-border lg:p-8">
            <div className="pointer-events-none absolute -end-24 -top-24 h-72 w-72 rounded-full bg-brand-secondary/25 blur-3xl" aria-hidden />
            <div className="relative flex items-center justify-between gap-3 border-b border-brand-border pb-5">
              <span className="font-heading text-[15px] font-bold">{tp.mapTitle}</span>
              <span className="shrink-0 rounded-full bg-brand-secondary px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">{tp.mapTag}</span>
            </div>
            <div className="relative flex justify-center py-6">
              <PakistanMap />
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col gap-6 lg:col-span-5">
          <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-level-1 sm:p-8">
            <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary text-white">
              <Factory className="h-6 w-6" aria-hidden />
            </span>
            <h2 className="font-heading text-xl font-bold text-brand-ink">{pr.hqTitle}</h2>
            <p className="mt-1 text-sm text-brand-muted">{pr.hqText}</p>
            <p className="mt-4 flex items-start gap-2 text-sm font-semibold text-brand-navy">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-secondary" aria-hidden />
              {address}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl bg-brand-tint p-6">
              <CountUp value={50} suffix="+" className="font-heading text-4xl font-bold text-brand-secondary" />
              <p className="mt-1 text-xs text-brand-muted">{tp.citiesLabel}</p>
            </div>
            <div className="rounded-3xl bg-brand-tint p-6">
              <span className="block font-heading text-2xl font-bold text-brand-secondary sm:text-[28px]">{tp.dispatchValue}</span>
              <p className="mt-1 text-xs text-brand-muted">{tp.dispatchLabel}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Regions */}
      <section className="bg-brand-tint/60 py-16">
        <div className="mx-auto max-w-site px-5 sm:px-6 lg:px-12">
          <Eyebrow>{pr.eyebrow}</Eyebrow>
          <SectionTitle>{pr.regionsTitle}</SectionTitle>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pr.regions.map((r) => (
              <li key={r.name} className="rounded-2xl bg-white p-6 shadow-level-1">
                <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-brand-navy">
                  <MapPin className="h-5 w-5 text-brand-primary" aria-hidden />
                  {r.name}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {r.cities.map((c) => (
                    <li key={c} className="rounded-lg bg-brand-tint px-2.5 py-1 text-[13px] font-medium text-brand-ink">
                      {c}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Delivery times + distributor */}
      <section className="mx-auto grid w-full max-w-site gap-8 px-5 pt-16 sm:px-6 lg:grid-cols-12 lg:px-12">
        <div className="lg:col-span-7">
          <h2 className="flex items-center gap-2 font-heading text-2xl font-bold text-brand-ink">
            <Truck className="h-6 w-6 text-brand-secondary" aria-hidden />
            {pr.deliveryTitle}
          </h2>
          <div className="mt-5 overflow-hidden rounded-2xl border border-brand-border">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-brand-border">
                {pr.delivery.map((row) => (
                  <tr key={row.area} className="bg-white">
                    <th scope="row" className="px-5 py-4 text-start font-medium text-brand-ink">{row.area}</th>
                    <td className="whitespace-nowrap px-5 py-4 text-end font-bold text-brand-secondary">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-4 w-4" aria-hidden />
                        {row.time}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-brand-muted">{pr.deliveryNote}</p>
        </div>
        <div className="rounded-3xl bg-brand-tint p-8 text-brand-ink ring-1 ring-brand-border lg:col-span-5">
          <h2 className="font-heading text-2xl font-bold">{pr.distributorTitle}</h2>
          <p className="mt-3 text-sm leading-6 text-brand-muted">{pr.distributorText}</p>
          <Link href={routes.contact} className={pillClass('primary', 'mt-6')}>
            {pr.distributorCta}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
          </Link>
        </div>
      </section>

      <CtaBand whatsapp={whatsapp} />
    </>
  );
}
