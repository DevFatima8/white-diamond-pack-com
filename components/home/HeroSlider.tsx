'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BadgeCheck, Factory, FileText, Layers, Pause, Play, Star, Truck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { fill } from '@/lib/i18n/translations';
import { routes } from '@/lib/routes';

const SLIDE_IMAGES = [
  '/images/home/hero-studio-showcase.jpg',
  '/images/home/cat-aluminium-foil-containers.jpg',
  '/images/home/cat-eco-bagasse.jpg',
  '/images/home/division-packaging-plant.jpg',
];
const INTERVAL_MS = 6000;
const TRUST_ICONS = [BadgeCheck, Factory, Truck];

const pad = (n: number) => String(n).padStart(2, '0');

/** Homepage hero: 4 slides, autoplay with pause, "01 / 04" counter, arrows, stat badge. */
export default function HeroSlider() {
  const { t } = useLanguage();
  const th = t.home.hero;
  const slides = th.slides;
  const total = slides.length;
  const reduceMotion = useReducedMotion();

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false); // user pressed pause
  const [hovering, setHovering] = useState(false); // pointer over / focus inside

  const go = useCallback((delta: number) => setIndex((i) => (i + delta + total) % total), [total]);

  // Autoplay — not while paused, hovered/focused, or when the visitor prefers reduced motion.
  useEffect(() => {
    if (paused || hovering || reduceMotion) return;
    const timer = setInterval(() => go(1), INTERVAL_MS);
    return () => clearInterval(timer);
  }, [paused, hovering, reduceMotion, go]);

  const slide = slides[index];

  return (
    <section
      className="relative overflow-hidden bg-brand-surface py-10 lg:py-16"
      aria-roledescription="carousel"
      aria-label={slide.highlight}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocusCapture={() => setHovering(true)}
      onBlurCapture={() => setHovering(false)}
    >
      <div className="mx-auto grid max-w-site items-center gap-8 px-5 sm:px-6 lg:grid-cols-12 lg:gap-6 lg:px-12">
        {/* Text column */}
        <div className="relative z-10 flex flex-col gap-6 lg:col-span-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#FCE8E9] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#5C0E0E] shadow-sm">{slide.badge}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-accent px-3 py-1 text-xs font-bold text-brand-navy">
              <Star className="h-3.5 w-3.5 fill-brand-primary text-brand-primary" aria-hidden />
              {th.experience}
            </span>
          </div>

          {/* All slide texts sit in the SAME grid cell, so the block is exactly as tall as the
              longest one: no empty gap, and the buttons below never jump between slides.
              Only the visible slide is a real <h1>; the hidden ones are aria-hidden. */}
          <div className="grid">
            {slides.map((s, i) => {
              const active = i === index;
              const Heading = active ? 'h1' : 'p';
              return (
                <div
                  key={i}
                  aria-hidden={!active}
                  className={`[grid-area:1/1] transition-[opacity,transform] duration-500 ${active ? 'translate-y-0 opacity-100' : 'pointer-events-none invisible translate-y-3 opacity-0'}`}
                >
                  <Heading className="font-heading text-[36px] font-bold leading-[44px] tracking-tight text-brand-ink sm:text-[46px] sm:leading-[54px] lg:text-[56px] lg:leading-[64px]">
                    {s.title} <span className="block text-brand-primary">{s.highlight}</span>
                  </Heading>
                  <p className="mt-5 max-w-xl text-base leading-7 text-brand-muted sm:text-lg sm:leading-8">{s.description}</p>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href={routes.shop}
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-brand-primary px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-brand-primary-hover active:scale-95"
            >
              {th.shopNow}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" aria-hidden />
            </Link>
            <Link
              href={routes.bulkQuote}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-secondary px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-brand-secondary-hover active:scale-95"
            >
              <FileText className="h-4 w-4" aria-hidden />
              {th.bulkQuote}
            </Link>
          </div>

          {/* Slider controls */}
          <div className="flex items-center gap-4 border-t border-brand-border pt-5 sm:gap-6">
            <div className="flex items-baseline gap-2 font-heading text-xl font-bold tracking-wider" aria-hidden>
              <span className="text-brand-primary">{pad(index + 1)}</span>
              <span className="text-[15px] font-normal text-brand-muted">/ {pad(total)}</span>
            </div>
            <span className="sr-only" aria-live="polite">
              {fill(th.slideLabel, { n: index + 1, total })}
            </span>
            <div className="h-1.5 max-w-[180px] flex-1 overflow-hidden rounded-full bg-brand-tint">
              <div className="h-full rounded-full bg-brand-primary transition-all duration-500" style={{ width: `${((index + 1) / total) * 100}%` }} />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? th.play : th.pause}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-ink shadow-sm transition hover:bg-brand-tint"
              >
                {paused ? <Play className="h-4 w-4" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}
              </button>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label={th.previous}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-ink shadow-sm transition hover:bg-brand-tint active:scale-90"
              >
                <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label={th.next}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-ink shadow-sm transition hover:bg-brand-tint active:scale-90"
              >
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
              </button>
            </div>
          </div>

          <ul className="grid gap-3 sm:grid-cols-3">
            {th.trust.map((item, i) => {
              const Icon = TRUST_ICONS[i];
              return (
                <li key={item} className="flex items-center gap-2 text-xs font-semibold text-brand-ink">
                  <Icon className="h-[18px] w-[18px] shrink-0 text-brand-secondary" aria-hidden />
                  {item}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Visual column */}
        <div className="relative lg:col-span-6">
          <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-3xl bg-brand-tint p-4 shadow-sm sm:min-h-[460px] sm:p-6 lg:p-10">
            {/* dotted background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#FBD5D8_0.75px,transparent_0.75px)] opacity-20 [background-size:16px_16px]" aria-hidden />
            <div className="relative z-10 w-full overflow-hidden rounded-2xl bg-white p-2 shadow-lg">
              <div className="relative h-[240px] overflow-hidden rounded-xl sm:h-[360px]">
                {SLIDE_IMAGES.map((src, i) => (
                  <Image
                    key={src}
                    src={src}
                    alt={i === index ? slides[i].imageAlt : ''}
                    fill
                    priority={i === 0}
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className={`object-cover transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`}
                  />
                ))}
              </div>
            </div>

            {/* Floating spec badge */}
            {/* On phones the badge sits under the image; from sm up it floats over the bottom edge */}
            <div className="relative z-20 mt-3 flex w-full flex-col items-start justify-between gap-3 rounded-2xl bg-white/95 p-5 text-brand-ink shadow-level-3 ring-1 ring-brand-border backdrop-blur-md sm:absolute sm:inset-x-6 sm:bottom-6 sm:mt-0 sm:w-auto sm:flex-row sm:items-center lg:inset-x-10">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-primary text-white shadow-md">
                  <Layers className="h-5 w-5" aria-hidden />
                </span>
                <span>
                  <span className="block font-heading text-[15px] font-bold leading-tight">{slide.statTitle}</span>
                  <span className="text-xs text-brand-muted">{slide.statDesc}</span>
                </span>
              </div>
              <span className="shrink-0 rounded-full bg-brand-accent-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-secondary">{slide.statTag}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
