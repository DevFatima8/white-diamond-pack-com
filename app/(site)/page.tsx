'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Sparkles,
  Layers,
  Droplets,
  Building2,
  Store,
  Globe2,
  Warehouse,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Award,
  Factory,
  Compass,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { homepageContent, HeroSlide, BusinessVertical, GlobalStat } from '@/lib/content';
import {
  Container,
  SectionTitle,
  Button,
  ScrollReveal,
  Counter,
} from '@/components/ui';

export default function HomePage() {
  const { locale, isRTL } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  const { hero, businessVerticals, expertise, customPackaging, globalPresence } =
    homepageContent;

  // Hero Slider State
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideCount = hero.slides.length;
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Video error fallback state
  const [videoError, setVideoError] = useState(false);

  // Auto slide effect: changes every 2 seconds (2000ms)
  useEffect(() => {
    if (isPaused) return;

    slideTimerRef.current = setTimeout(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slideCount);
    }, 2000);

    return () => {
      if (slideTimerRef.current) {
        clearTimeout(slideTimerRef.current);
      }
    };
  }, [currentSlideIndex, isPaused, slideCount]);

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slideCount);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slideCount) % slideCount);
  };

  const currentSlide = hero.slides[currentSlideIndex];

  // Helper for localized strings
  const getLocalized = (obj: { en: string; ar: string }) => {
    return locale === 'ar' ? obj.ar : obj.en;
  };

  return (
    <div className="w-full overflow-hidden bg-background">
      {/* ======================================================== */}
      {/* 1. HERO / BANNER SLIDER SECTION (100VH / 1 SCREEN)       */}
      {/* ======================================================== */}
      <section className="relative w-full min-h-[calc(100vh-76px)] lg:h-[calc(100vh-76px)] flex items-center justify-center bg-[#12102E] overflow-hidden select-none snap-start">
        {/* Layered Background Slide Images (Smooth Cross-fade without flicker) */}
        <div className="absolute inset-0 z-0">
          {hero.slides.map((slide, index) => {
            const isActive = index === currentSlideIndex;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Background Image with subtle Ken Burns scale effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={slide.image}
                    alt={getLocalized(slide.title)}
                    className={`w-full h-full object-cover object-center transition-transform duration-[2000ms] ease-out ${
                      isActive ? 'scale-105' : 'scale-100'
                    }`}
                  />
                </div>

                {/* Ambient Dark Navy & Indigo Gradient Overlays for High Legibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#1E1B4B]/95 via-[#1E1B4B]/80 to-[#12102E]/60 rtl:bg-gradient-to-l rtl:from-[#1E1B4B]/95 rtl:via-[#1E1B4B]/80 rtl:to-[#12102E]/60 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12102E] via-transparent to-black/30 pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Hero Interactive Content Overlay */}
        <div className="relative w-full z-20 h-full flex items-center py-6 sm:py-8 lg:py-0">
          <Container size="2xl" className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Slide Narrative Content (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col items-start text-start">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`content-${currentSlide.id}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35 }}
                    className="w-full"
                  >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6366F1]/30 border border-[#818CF8]/40 backdrop-blur-md text-[#EEF2FF] text-xs sm:text-sm font-bold uppercase tracking-wider mb-3.5 shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 text-[#818CF8] shrink-0" />
                      <span>{getLocalized(currentSlide.badge)}</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white font-heading leading-[1.12] tracking-tight mb-3.5 drop-shadow-md">
                      {getLocalized(currentSlide.title)}
                    </h1>

                    {/* Description */}
                    <p className="text-sm sm:text-base md:text-lg text-slate-200/90 max-w-xl font-normal leading-relaxed mb-6 drop-shadow-sm">
                      {getLocalized(currentSlide.description)}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6">
                      <Link
                        href={currentSlide.primaryButton.href}
                        className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3 rounded-xl bg-[#E63946] hover:bg-[#C92A37] text-white font-bold text-sm sm:text-base transition-all duration-300 shadow-xl shadow-[#E63946]/40 group hover:scale-[1.02] active:scale-95"
                      >
                        <span>{getLocalized(currentSlide.primaryButton.label)}</span>
                        <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                      </Link>

                      <Link
                        href={currentSlide.secondaryButton.href}
                        className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/20 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-md"
                      >
                        <span>{getLocalized(currentSlide.secondaryButton.label)}</span>
                      </Link>
                    </div>

                    {/* Trust Highlights */}
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-3.5 border-t border-white/15 text-xs sm:text-sm text-slate-300 font-medium">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#818CF8]" />
                        <span>{isRTL ? 'معتمد غذائياً 100%' : '100% Food-Safe Grade'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-[#818CF8]" />
                        <span>{isRTL ? 'معايير جودة معتمدة' : 'ISO Certified Quality'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#818CF8]" />
                        <span>{isRTL ? 'توريد سريع للكميات' : 'Bulk Supply Ready'}</span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Column: Visual Product Showcase Card + 9+ Years Badge (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center">
                <div className="w-full max-w-sm sm:max-w-md bg-white/10 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-white/20 shadow-2xl relative overflow-hidden group">
                  {/* Spotlight illumination on featured product */}
                  <div className="relative w-full aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-b from-white/15 to-transparent flex items-center justify-center p-3 sm:p-4">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={`preview-${currentSlide.id}`}
                        src={currentSlide.image}
                        alt={getLocalized(currentSlide.title)}
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{ duration: 0.35 }}
                        className="w-full h-full object-contain filter drop-shadow-2xl"
                      />
                    </AnimatePresence>
                  </div>

                  {/* 9+ Years Badge attached cleanly to showcase */}
                  <div
                    className="mt-3.5 bg-[#E63946]/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 shadow-xl border border-white/20 flex items-center gap-3.5 text-white"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    <div className="flex flex-col items-center sm:items-start shrink-0 text-white">
                      <span className="text-2xl sm:text-3xl font-black font-heading leading-none tracking-tight">
                        9+
                      </span>
                      <span className="text-[11px] sm:text-xs font-bold tracking-wide mt-0.5">
                        {isRTL ? 'سنوات' : 'Years'}
                      </span>
                    </div>
                    <div className="w-[1.5px] h-9 bg-white/60 shrink-0" />
                    <div className="text-xs sm:text-sm font-bold leading-snug">
                      {isRTL
                        ? 'من الخبرة في تطوير وتسويق المنتجات الاستهلاكية المتميزة'
                        : 'of expertise in Developing & Marketing Premium Disposable Products'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>

          {/* Left Arrow Navigation */}
          <button
            type="button"
            onClick={handlePrevSlide}
            aria-label="Previous Slide"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-[#E63946] text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-xl"
          >
            {isRTL ? <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" /> : <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>

          {/* Right Arrow Navigation */}
          <button
            type="button"
            onClick={handleNextSlide}
            aria-label="Next Slide"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-[#E63946] text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-xl"
          >
            {isRTL ? <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" /> : <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>

          {/* Slider Pagination & Counter (Bottom Center) */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 shadow-xl">
            <span className="text-white/70 text-xs font-mono font-bold">
              0{currentSlideIndex + 1} / 0{slideCount}
            </span>
            <div className="w-[1px] h-3 bg-white/20" />
            <div className="flex items-center gap-2">
              {hero.slides.map((_, index) => {
                const isActive = index === currentSlideIndex;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentSlideIndex(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`transition-all duration-300 rounded-full ${
                      isActive
                        ? 'w-7 sm:w-9 h-2.5 bg-[#6366F1] shadow-sm'
                        : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/80'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Floating WhatsApp Live Chat Widget (Bottom Corner) */}
          <div className="absolute bottom-5 right-5 sm:bottom-6 sm:right-6 rtl:right-auto rtl:left-5 rtl:sm:left-6 z-30 flex items-center gap-2 select-none">
            <div className="hidden sm:flex bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-slate-200 items-center gap-1.5 transition-transform hover:scale-105">
              <span>{isRTL ? 'تحدث معنا' : 'Chat with us'}</span>
              <span>👋</span>
            </div>
            <a
              href="https://wa.me/923216293333"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#E63946] hover:bg-[#C92A37] text-white flex items-center justify-center shadow-xl shadow-[#E63946]/30 hover:scale-110 active:scale-95 transition-all"
              title="Chat with us"
            >
              <i className="fa-brands fa-whatsapp text-2xl text-white"></i>
            </a>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. BUSINESS VERTICALS: PACKAGING & DETERGENTS (100VH)    */}
      {/* ======================================================== */}
      <section className="relative w-full min-h-screen lg:h-screen flex items-center justify-center bg-[#EEF2FF]/60 dark:bg-[#12102E] py-12 lg:py-0 overflow-hidden snap-start">
        <Container size="2xl" className="w-full">
          <ScrollReveal direction="up">
            <SectionTitle
              badge={getLocalized(businessVerticals.sectionBadge)}
              title={getLocalized(businessVerticals.sectionTitle)}
              description={getLocalized(businessVerticals.sectionDescription)}
              align="center"
              className="mb-6 lg:mb-8"
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {businessVerticals.items.map((vertical: BusinessVertical) => {
              return (
                <ScrollReveal
                  key={vertical.id}
                  direction="up"
                  delay={0.15}
                  className="h-full"
                >
                  <div className="bg-white dark:bg-[#1E1B4B] rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full group">
                    <div>
                      {/* Top Row: Icon + Badge */}
                      <div className="flex items-center justify-between mb-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] dark:bg-[#12102E] border border-[#6366F1]/20 flex items-center justify-center text-[#6366F1] dark:text-[#818CF8]">
                            {vertical.iconName === 'Package' ? (
                              <Package className="w-5 h-5" />
                            ) : (
                              <Sparkles className="w-5 h-5" />
                            )}
                          </div>
                          <span className="text-xs font-bold uppercase tracking-wider text-[#6366F1] dark:text-[#818CF8] bg-[#EEF2FF] dark:bg-white/5 px-3 py-1 rounded-full">
                            {getLocalized(vertical.badge)}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl sm:text-2xl font-extrabold text-[#1E1B4B] dark:text-white font-heading tracking-tight mb-2.5">
                        {getLocalized(vertical.title)}
                      </h3>

                      {/* Image Preview Banner */}
                      <div className="relative aspect-[16/8] rounded-xl overflow-hidden bg-slate-100 dark:bg-black/40 border border-slate-200/80 dark:border-white/10 mb-3.5 shadow-inner">
                        <img
                          src={vertical.image}
                          alt={getLocalized(vertical.title)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 mb-3.5">
                        {getLocalized(vertical.description)}
                      </p>

                      {/* Features List */}
                      <div className="space-y-2 mb-4">
                        {vertical.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-[#E63946] dark:text-[#818CF8] shrink-0 mt-0.5" />
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                              {getLocalized(feat)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Read More Button */}
                    <div className="pt-3.5 border-t border-slate-100 dark:border-white/5">
                      <Button
                        href={vertical.link.href}
                        variant="primary"
                        size="sm"
                        rightIcon={<ArrowIcon className="w-4 h-4" />}
                        className="w-full sm:w-auto"
                      >
                        {getLocalized(vertical.link.label)}
                      </Button>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ======================================================== */}
      {/* 3. "OVER THREE DECADES OF EXPERTISE..." SECTION (100VH)  */}
      {/* ======================================================== */}
      <section className="relative w-full min-h-screen lg:h-screen flex items-center justify-center bg-white dark:bg-[#12102E] py-12 lg:py-0 overflow-hidden snap-start">
        <Container size="2xl" className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Big Counter & Narrative (7 cols) */}
            <div className="lg:col-span-7">
              <ScrollReveal direction="up">
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-3 bg-[#EEF2FF] dark:bg-[#1E1B4B]/70 border border-[#6366F1]/20 text-[#6366F1] dark:text-[#818CF8]">
                  <Award className="w-3.5 h-3.5" />
                  <span>{getLocalized(expertise.badge)}</span>
                </span>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E1B4B] dark:text-white font-heading leading-tight tracking-tight">
                  {getLocalized(expertise.title)}
                </h2>

                <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {getLocalized(expertise.description)}
                </p>

                {/* Big Counter Block ("65+ Countries") */}
                <div className="my-5 p-4 sm:p-6 rounded-2xl bg-[#EEF2FF] dark:bg-[#1E1B4B]/60 border border-[#6366F1]/20 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-4xl sm:text-5xl font-black text-[#E63946] dark:text-[#F87171] font-heading flex items-center tracking-tight">
                      <Counter end={expertise.counterValue} suffix={expertise.counterSuffix} />
                    </div>
                    <div className="text-sm sm:text-base font-bold text-[#1E1B4B] dark:text-white mt-1">
                      {getLocalized(expertise.counterLabel)}
                    </div>
                    <div className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5 max-w-md">
                      {getLocalized(expertise.counterSubtext)}
                    </div>
                  </div>

                  <div className="shrink-0">
                    <Button
                      href={expertise.link.href}
                      variant="primary"
                      size="md"
                      rightIcon={<ArrowIcon className="w-4 h-4" />}
                    >
                      {getLocalized(expertise.link.label)}
                    </Button>
                  </div>
                </div>

                {/* Bullet Highlights */}
                <div className="space-y-2">
                  {expertise.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-[#EEF2FF] dark:bg-[#6366F1]/20 flex items-center justify-center shrink-0 mt-0.5 text-[#6366F1] dark:text-[#818CF8]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        {getLocalized(feat)}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column: Presence Map Image (5 cols) */}
            <div className="lg:col-span-5">
              <ScrollReveal direction="up" delay={0.2}>
                <div className="relative rounded-3xl bg-gradient-to-br from-[#1E1B4B] to-[#12102E] p-5 sm:p-6 text-white shadow-2xl border border-slate-800 overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#6366F1]/20 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Globe2 className="w-4 h-4 text-[#818CF8]" />
                      <span className="font-bold text-xs sm:text-sm tracking-wide">
                        {isRTL ? 'الانتشار والتغطية العالمية' : 'Global Distribution Reach'}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#6366F1]/20 text-[#818CF8]">
                      Active Hubs
                    </span>
                  </div>

                  {/* Presence Map Image */}
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-950/80 border border-slate-800 flex items-center justify-center p-2">
                    <img
                      src={expertise.mapImage}
                      alt="Falcon Pack Global Presence Map"
                      className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                    />
                  </div>

                  {/* Map Footnote */}
                  <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                      <div className="text-base font-black text-[#6366F1]">30+</div>
                      <div className="text-[10px] text-slate-400">
                        {isRTL ? 'سنوات من الخبرة' : 'Years Heritage'}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                      <div className="text-base font-black text-[#6366F1]">1,500+</div>
                      <div className="text-[10px] text-slate-400">
                        {isRTL ? 'فريق عمل عالمي' : 'Team Members'}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </Container>
      </section>

      {/* ======================================================== */}
      {/* 4. "CUSTOMIZE YOUR PACKAGING" (VIDEO SECTION - 100VH)    */}
      {/* ======================================================== */}
      <section className="relative w-full min-h-screen lg:h-screen flex items-center justify-center py-12 lg:py-0 overflow-hidden bg-black text-white snap-start">
        {/* Background Video with Poster Fallback */}
        {!videoError ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={customPackaging.videoPoster}
            onError={() => setVideoError(true)}
            className="absolute inset-0 w-full h-full object-cover opacity-35 z-0"
          >
            <source src={customPackaging.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={customPackaging.videoPoster}
            alt="Customize packaging video poster"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 z-0 pointer-events-none select-none"
          />
        )}

        {/* Ambient Dark Overlay with Brand Accents */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/85 to-black/95 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1E1B4B]/40 via-transparent to-black/90 z-10 pointer-events-none" />

        <Container size="2xl" className="relative z-20 w-full">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal direction="up">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold tracking-wider uppercase text-[#818CF8] mb-3.5 backdrop-blur-md">
                <Factory className="w-3.5 h-3.5 text-[#818CF8]" />
                <span>{getLocalized(customPackaging.badge)}</span>
              </span>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-heading tracking-tight leading-tight">
                {getLocalized(customPackaging.title)}
              </h2>

              <p className="mt-3 text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed max-w-2xl mx-auto">
                {getLocalized(customPackaging.description)}
              </p>
            </ScrollReveal>

            {/* Custom Packaging Capabilities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 text-left">
              {customPackaging.highlights.map((item, idx) => (
                <ScrollReveal key={idx} direction="up" delay={idx * 0.08}>
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-[#6366F1]/20 hover:border-[#818CF8]/40 transition-all duration-300 h-full flex flex-col justify-between">
                    <div>
                      <div className="w-7 h-7 rounded-lg bg-[#6366F1]/20 text-[#818CF8] flex items-center justify-center font-bold text-xs mb-2.5">
                        0{idx + 1}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white mb-1">
                        {getLocalized(item.title)}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-gray-400 leading-relaxed">
                        {getLocalized(item.desc)}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Action Buttons */}
            <ScrollReveal direction="up" delay={0.35}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <Button
                  href={customPackaging.primaryBtn.href}
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowIcon className="w-4 h-4" />}
                >
                  {getLocalized(customPackaging.primaryBtn.label)}
                </Button>

                <Button
                  href={customPackaging.secondaryBtn.href}
                  variant="outline"
                  size="md"
                  className="text-white border-white/30 hover:bg-white/10"
                >
                  {getLocalized(customPackaging.secondaryBtn.label)}
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* ======================================================== */}
      {/* 5. "GLOBAL PRESENCE" STATS (100VH / 1 SCREEN)            */}
      {/* ======================================================== */}
      <section className="relative w-full min-h-screen lg:h-screen flex items-center justify-center bg-[#EEF2FF]/60 dark:bg-[#12102E] py-12 lg:py-0 overflow-hidden snap-start">
        <Container size="2xl" className="w-full">
          <ScrollReveal direction="up">
            <SectionTitle
              badge={getLocalized(globalPresence.badge)}
              title={getLocalized(globalPresence.title)}
              description={getLocalized(globalPresence.description)}
              align="center"
              className="mb-8 lg:mb-12"
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {globalPresence.stats.map((stat: GlobalStat, index: number) => {
              return (
                <ScrollReveal key={stat.id} direction="up" delay={index * 0.1}>
                  <div className="group relative rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#1E1B4B] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-[#6366F1]/50 transition-all duration-300 flex flex-col justify-between h-full">
                    {/* Top Row Icon */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-2xl bg-[#EEF2FF] dark:bg-[#12102E] border border-[#6366F1]/20 text-[#6366F1] dark:text-[#818CF8] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        {stat.iconName === 'Building' && <Building2 className="w-5 h-5" />}
                        {stat.iconName === 'Store' && <Store className="w-5 h-5" />}
                        {stat.iconName === 'Globe' && <Globe2 className="w-5 h-5" />}
                        {stat.iconName === 'Warehouse' && <Warehouse className="w-5 h-5" />}
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400 group-hover:text-[#6366F1] dark:group-hover:text-[#818CF8] transition-colors">
                        0{index + 1}
                      </span>
                    </div>

                    {/* Animated Number Counter */}
                    <div>
                      <div className="text-3xl sm:text-4xl font-black text-[#1E1B4B] dark:text-white font-heading tracking-tight flex items-baseline gap-1">
                        {stat.prefix && <span>{stat.prefix}</span>}
                        <Counter
                          end={stat.value}
                          suffix={stat.suffix}
                          className="text-[#E63946] dark:text-[#F87171]"
                        />
                      </div>

                      {/* Stat Label */}
                      <h4 className="text-base font-bold text-[#1E1B4B] dark:text-white mt-1.5">
                        {getLocalized(stat.label)}
                      </h4>

                      {/* Stat Description */}
                      <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1.5 leading-relaxed">
                        {getLocalized(stat.description)}
                      </p>
                    </div>

                    {/* Bottom Indicator */}
                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-semibold text-[#6366F1] dark:text-[#818CF8]">
                      <span>{isRTL ? 'معتمد ومؤكد' : 'Verified Hubs'}</span>
                      <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </Container>
      </section>
    </div>
  );
}
