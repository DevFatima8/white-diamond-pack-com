'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, Factory, Headphones, Layers, Ruler, Scale, ScanBarcode, ShieldCheck, Sparkles, Target } from 'lucide-react';
import { routes } from '@/lib/routes';
import { GALLERY_GROUPS, type GalleryGroup, type GalleryItem } from '@/lib/gallery-types';
import { cn } from '@/lib/utils';
import { Eyebrow, SectionTitle } from '@/components/ui/SectionRail';
import Reveal from '@/components/ui/Reveal';
import PageHero from './PageHero';
import CtaBand from './CtaBand';
import { pillClass } from './buttons';
import { usePageTexts } from './usePageTexts';

const VALUE_ICONS = [ShieldCheck, Scale, Factory, Headphones];
const QUALITY_ICONS = [Layers, Ruler, Sparkles, ScanBarcode];

/** /about — story, mission & vision, timeline, quality (#quality) and infrastructure (#infrastructure). */
export default function AboutView({ whatsapp, gallery }: { whatsapp: string; gallery: GalleryItem[] }) {
  const { p, isRTL } = usePageTexts();
  const a = p.about;
  // Photos from Admin → Gallery; until the admin adds some, the built-in plant photos
  const photos = gallery.length
    ? gallery.map((g) => ({ image: g.image, caption: (isRTL && g.captionAr) || g.caption, group: g.group }))
    : a.gallery;
  const tabs = GALLERY_GROUPS.filter((g) => photos.some((ph) => ph.group === g));
  const [tab, setTab] = useState<'all' | GalleryGroup>('all');
  const shown = tab === 'all' ? photos : photos.filter((ph) => ph.group === tab);

  return (
    <>
      <PageHero eyebrow={a.eyebrow} title={a.title} intro={a.intro}>
        <Link href={routes.shop} className={pillClass('primary')}>{p.common.shopNow}</Link>
        <Link href={routes.contact} className={pillClass('ghost-dark')}>{p.common.ctaContact}</Link>
      </PageHero>

      {/* Story */}
      <section className="mx-auto grid w-full max-w-site items-center gap-10 px-5 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-24">
        <Reveal>
          <Eyebrow>{a.storyEyebrow}</Eyebrow>
          <SectionTitle>{a.storyTitle}</SectionTitle>
          <div className="mt-6 space-y-4 text-base leading-7 text-brand-muted">
            {a.story.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1} className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-brand-tint shadow-level-2">
            <Image src="/images/hero2.png" alt={a.storyImageAlt} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
          </div>
          <div className="absolute -bottom-6 start-6 rounded-2xl bg-brand-secondary px-5 py-4 text-white shadow-level-3">
            <span className="block font-heading text-3xl font-bold">{a.timeline[0].year}</span>
            <span className="text-xs text-white/85">{a.timeline[0].title}</span>
          </div>
        </Reveal>
      </section>

      {/* Mission, vision, values */}
      <section className="bg-brand-tint py-16 lg:py-20">
        <div className="mx-auto max-w-site px-5 sm:px-6 lg:px-12">
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { icon: Target, title: a.missionTitle, text: a.mission },
              { icon: Eye, title: a.visionTitle, text: a.vision },
            ].map(({ icon: Icon, title, text }) => (
              <Reveal key={title} className="rounded-3xl bg-white p-8 shadow-level-1">
                <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-secondary text-white">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h2 className="font-heading text-2xl font-bold text-brand-navy">{title}</h2>
                <p className="mt-3 text-base leading-7 text-brand-muted">{text}</p>
              </Reveal>
            ))}
          </div>

          <h2 className="mt-14 font-heading text-2xl font-bold text-brand-ink">{a.valuesTitle}</h2>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {a.values.map((v, i) => {
              const Icon = VALUE_ICONS[i % VALUE_ICONS.length];
              return (
                <li key={v.title} className="rounded-2xl border border-brand-border bg-white p-6">
                  <Icon className="mb-4 h-7 w-7 text-brand-primary" aria-hidden />
                  <h3 className="font-heading text-base font-bold text-brand-ink">{v.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-brand-muted">{v.desc}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto w-full max-w-site px-5 py-16 sm:px-6 lg:px-12 lg:py-24">
        <Eyebrow>{a.timelineEyebrow}</Eyebrow>
        <SectionTitle>{a.timelineTitle}</SectionTitle>
        <ol className="mt-10 grid gap-x-6 gap-y-8 border-s-2 border-brand-border ps-6 md:grid-cols-3 md:border-s-0 md:ps-0 lg:grid-cols-6">
          {a.timeline.map((item, i) => (
            <li key={item.year} className="relative md:border-t-2 md:border-brand-border md:pt-8">
              <span
                className="absolute -start-[33px] top-1 h-4 w-4 rounded-full border-4 border-white bg-brand-secondary shadow-level-1 md:-top-[9px] md:start-0"
                aria-hidden
              />
              <Reveal delay={i * 0.05}>
                <span className="font-heading text-2xl font-bold text-brand-primary">{item.year}</span>
                <h3 className="mt-1 font-heading text-base font-bold text-brand-ink">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-brand-muted">{item.desc}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* Quality standards (the client holds no certificates — none are claimed) */}
      <section id="quality" className="scroll-mt-28 bg-brand-tint py-16 text-brand-ink lg:py-24">
        <div className="mx-auto max-w-site px-5 sm:px-6 lg:px-12">
          <div className="max-w-3xl">
            <span className="mb-1 block text-xs font-bold uppercase tracking-[0.14em] text-brand-secondary">{a.qualityEyebrow}</span>
            <h2 className="font-heading text-[28px] font-bold leading-9 tracking-tight sm:text-[40px] sm:leading-[48px]">{a.qualityTitle}</h2>
            <p className="mt-4 text-base leading-7 text-brand-muted">{a.qualityText}</p>
          </div>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {a.qualityPoints.map((q, i) => {
              const Icon = QUALITY_ICONS[i % QUALITY_ICONS.length];
              return (
                <li key={q.title} className="rounded-2xl bg-white p-6 ring-1 ring-brand-border">
                  <Icon className="mb-4 h-7 w-7 text-brand-secondary" aria-hidden />
                  <h3 className="font-heading text-base font-bold">{q.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-brand-muted">{q.desc}</p>
                </li>
              );
            })}
          </ul>

        </div>
      </section>

      {/* Infrastructure */}
      <section id="infrastructure" className="mx-auto w-full max-w-site scroll-mt-28 px-5 py-16 sm:px-6 lg:px-12 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow>{a.infraEyebrow}</Eyebrow>
            <SectionTitle>{a.infraTitle}</SectionTitle>
            <p className="mt-4 text-base leading-7 text-brand-muted">{a.infraText}</p>
          </div>
          <dl className="grid grid-cols-2 gap-4 lg:col-span-5">
            {a.infraFacts.map((f) => (
              <div key={f.label} className="rounded-2xl bg-brand-tint p-5 sm:p-6">
                <dt className="text-xs text-brand-muted">{f.label}</dt>
                <dd className="font-heading text-2xl font-bold text-brand-secondary" dir="auto">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        {tabs.length > 1 && (
          <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label={a.infraTitle}>
            {(['all', ...tabs] as const).map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                  tab === t ? 'bg-brand-secondary text-white' : 'bg-white text-brand-ink ring-1 ring-brand-border hover:text-brand-secondary',
                )}
              >
                {a.galleryTabs[t]}
              </button>
            ))}
          </div>
        )}
        <ul className={cn('grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-3', tabs.length > 1 ? 'mt-6' : 'mt-10')}>
          {shown.map((g, i) => (
            <li key={g.image + i} className={i === 0 ? 'min-[420px]:col-span-2 lg:col-span-2 lg:row-span-2' : undefined}>
              <figure className="group relative h-full min-h-[200px] overflow-hidden rounded-2xl bg-brand-tint sm:min-h-[240px]">
                <Image
                  src={g.image}
                  alt={g.caption || a.infraTitle}
                  fill
                  sizes={i === 0 ? '(min-width: 1024px) 800px, 100vw' : '(min-width: 1024px) 400px, 50vw'}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {g.caption && (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-navy-dark/85 to-transparent px-4 pb-3 pt-10 text-sm font-semibold text-white">
                    {g.caption}
                  </figcaption>
                )}
              </figure>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand whatsapp={whatsapp} />
    </>
  );
}
