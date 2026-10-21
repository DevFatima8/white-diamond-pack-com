'use client';

import { useState } from 'react';
import { Briefcase, Clock, GraduationCap, HeartHandshake, MapPin, TrendingUp, Wallet } from 'lucide-react';
import { fill } from '@/lib/i18n/translations';
import { Eyebrow, SectionTitle } from '@/components/ui/SectionRail';
import Reveal from '@/components/ui/Reveal';
import PageHero from './PageHero';
import EnquiryForm from './EnquiryForm';
import { pillClass } from './buttons';
import { usePageTexts } from './usePageTexts';

const WHY_ICONS = [TrendingUp, GraduationCap, Wallet, HeartHandshake];

/** /careers — why join, open positions, and the application form (#apply). */
export default function CareersView({ email }: { email: string }) {
  const { p } = usePageTexts();
  const c = p.careers;
  // Index into the position list (0 = general application), so switching language keeps the choice.
  const positions = [c.generalApplication, ...c.jobs.map((j) => j.title)];
  const [position, setPosition] = useState(0);

  const applyFor = (jobIndex: number) => {
    setPosition(jobIndex + 1);
    document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} intro={c.intro}>
        <a href="#openings" className={pillClass('primary')}>{c.openingsTitle}</a>
      </PageHero>

      <section className="mx-auto w-full max-w-site px-5 py-16 sm:px-6 lg:px-12 lg:py-20">
        <SectionTitle>{c.whyTitle}</SectionTitle>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {c.why.map((w, i) => {
            const Icon = WHY_ICONS[i % WHY_ICONS.length];
            return (
              <li key={w.title} className="rounded-2xl bg-brand-tint p-6">
                <Icon className="mb-4 h-7 w-7 text-brand-secondary" aria-hidden />
                <h3 className="font-heading text-base font-bold text-brand-ink">{w.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-brand-muted">{w.desc}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <section id="openings" className="scroll-mt-28 bg-brand-tint/60 py-16 lg:py-20">
        <div className="mx-auto max-w-site px-5 sm:px-6 lg:px-12">
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <SectionTitle>{c.openingsTitle}</SectionTitle>
          <ul className="mt-8 grid gap-6 lg:grid-cols-2">
            {c.jobs.map((job, i) => (
              <li key={job.id}>
                <Reveal delay={(i % 2) * 0.06} className="flex h-full flex-col rounded-3xl bg-white p-6 shadow-level-1 sm:p-8">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-secondary">{job.department}</span>
                  <h3 className="mt-1 font-heading text-xl font-bold text-brand-ink">{job.title}</h3>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-brand-navy">
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-tint px-3 py-1">
                      <MapPin className="h-3.5 w-3.5" aria-hidden />
                      {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-tint px-3 py-1">
                      <Clock className="h-3.5 w-3.5" aria-hidden />
                      {job.type}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-brand-muted">{job.desc}</p>
                  <ul className="mt-4 space-y-1.5">
                    {job.requirements.map((r) => (
                      <li key={r} className="flex items-start gap-2 text-[13px] text-brand-ink">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" aria-hidden />
                        {r}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-6">
                    <button type="button" onClick={() => applyFor(i)} className={pillClass('secondary', 'h-11')}>
                      <Briefcase className="h-4 w-4" aria-hidden />
                      {c.apply}
                    </button>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="apply" className="mx-auto grid w-full max-w-site scroll-mt-28 gap-10 px-5 py-16 sm:px-6 lg:grid-cols-12 lg:px-12 lg:py-20">
        <div className="lg:col-span-4">
          <SectionTitle>{c.formTitle}</SectionTitle>
          <p className="mt-3 text-base leading-7 text-brand-muted">{c.formText}</p>
          <p className="mt-6 rounded-2xl bg-brand-tint p-4 text-sm leading-6 text-brand-navy">
            {fill(c.cvNote, { email })}
          </p>
        </div>
        <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-level-2 sm:p-8 lg:col-span-8">
          <EnquiryForm
            kind="career"
            subjectLabel={c.positionLabel}
            subjectOptions={positions}
            subject={positions[position]}
            onSubjectChange={(v) => setPosition(Math.max(0, positions.indexOf(v)))}
            messageLabel={c.messageLabel}
            messagePlaceholder={c.messagePlaceholder}
            showCompany={false}
          />
        </div>
      </section>
    </>
  );
}
