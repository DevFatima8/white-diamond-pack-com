'use client';

import Link from 'next/link';
import { ArrowRight, Clock, Weight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import CountUp from '@/components/ui/CountUp';
import Reveal from '@/components/ui/Reveal';
import PakistanMap from './PakistanMap';

/** Dark navy "Over a decade… across Pakistan" section with map and count-up. */
export default function PresenceSection() {
  const { t } = useLanguage();
  const tp = t.home.presence;

  return (
    <section className="relative overflow-hidden bg-brand-navy py-20 text-white">
      <div className="pointer-events-none absolute -end-40 -top-40 h-96 w-96 rounded-full bg-brand-secondary/20 blur-3xl" aria-hidden />
      <div className="relative z-10 mx-auto grid max-w-site items-center gap-12 px-5 sm:px-6 lg:grid-cols-12 lg:px-12">
        <div className="flex flex-col gap-6 lg:col-span-6">
          <div>
            <span className="mb-3 inline-block rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#E1E0FF]">
              {tp.eyebrow}
            </span>
            <h2 className="font-heading text-[28px] font-bold leading-9 tracking-tight sm:text-[40px] sm:leading-[48px]">{tp.title}</h2>
          </div>
          <p className="text-base leading-7 text-[#DAE2FD]/90 sm:text-lg sm:leading-8">{tp.text}</p>

          <div className="py-2">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <CountUp value={50} suffix="+" className="font-heading text-[64px] font-bold leading-none tracking-tighter" />
              <span className="font-heading text-xl font-medium text-[#DAE2FD]">{tp.citiesLabel}</span>
            </div>
            <div className="mt-3 h-1.5 w-32 rounded-full bg-brand-primary shadow-[0_0_12px_rgba(230,57,70,0.8)]" aria-hidden />
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#DAE2FD]/70">{tp.hubsLabel}</span>
            <ul className="flex flex-wrap gap-2 text-[13px] font-semibold">
              {tp.hubs.map((hub, i) => (
                <li key={hub} className={cn('rounded-lg px-3 py-1', i === 0 ? 'bg-white/15 text-white' : 'bg-white/5 text-[#DAE2FD]')}>
                  {hub}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2">
            <Link
              href={routes.presence}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-colors hover:bg-white/20"
            >
              {tp.cta}
              <ArrowRight className="h-[18px] w-[18px] rtl:rotate-180" aria-hidden />
            </Link>
          </div>
        </div>

        <Reveal className="lg:col-span-6">
          <div className="relative overflow-hidden rounded-3xl bg-brand-navy-dark/60 p-6 shadow-2xl backdrop-blur-md lg:p-8">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-6">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-primary opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-primary" />
                </span>
                <span className="font-heading text-[15px] font-bold">{tp.mapTitle}</span>
              </div>
              <span className="shrink-0 rounded-full bg-brand-secondary px-2.5 py-1 text-xs font-bold uppercase tracking-wider">{tp.mapTag}</span>
            </div>

            <div className="flex justify-center py-6">
              <PakistanMap />
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
              <div className="flex items-center gap-3">
                <Clock className="h-[26px] w-[26px] shrink-0 text-[#C0C1FF]" aria-hidden />
                <div>
                  <span className="block font-heading text-base font-bold">{tp.dispatchValue}</span>
                  <span className="text-[11px] text-[#DAE2FD]/70">{tp.dispatchLabel}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Weight className="h-[26px] w-[26px] shrink-0 text-[#C0C1FF]" aria-hidden />
                <div>
                  <span className="block font-heading text-base font-bold">{tp.capacityValue}</span>
                  <span className="text-[11px] text-[#DAE2FD]/70">{tp.capacityLabel}</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
