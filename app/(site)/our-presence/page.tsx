'use client';

import React from 'react';
import Link from 'next/link';
import {
  Globe2,
  Building2,
  Store,
  Warehouse,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import {
  Container,
  SectionTitle,
  Breadcrumb,
  Button,
  ScrollReveal,
  Counter,
} from '@/components/ui';

export default function OurPresencePage() {
  const { isRTL } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const hubs = [
    {
      country: isRTL ? 'الإمارات العربية المتحدة' : 'United Arab Emirates',
      role: isRTL ? 'المقر الرئيسي والمصانع' : 'Global Headquarters & Manufacturing',
      cities: isRTL ? 'الشارقة، دبي، أبوظبي' : 'Sharjah, Dubai, Abu Dhabi',
      details: isRTL
        ? 'أكثر من 8 مصانع مؤتمتة ومستودعات مركزية ومراكز مبيعات مباشرة.'
        : 'Over 8 automated manufacturing plants, central logistics hubs & corporate showrooms.',
    },
    {
      country: isRTL ? 'المملكة العربية السعودية' : 'Kingdom of Saudi Arabia',
      role: isRTL ? 'الفروع الإقليمية ومراكز التوزيع' : 'Regional Branch & Distribution Hub',
      cities: isRTL ? 'الرياض، جدة، الدمام' : 'Riyadh, Jeddah, Dammam',
      details: isRTL
        ? 'تغطية شاملة لقطاع الفنادق والمطاعم الكبرى وتجارة التجزئة في المملكة.'
        : 'Comprehensive distribution coverage for major hospitality chains and retail giants.',
    },
    {
      country: isRTL ? 'سلطنة عمان' : 'Sultanate of Oman',
      role: isRTL ? 'مراكز المبيعات والتوريد' : 'Direct Sales & Commercial Supply Depot',
      cities: isRTL ? 'مسقط، صحار' : 'Muscat, Sohar',
      details: isRTL
        ? 'توريد يومي متواصل للمطاعم ومصانع الأغذية ومستلزمات الضيافة.'
        : 'Daily continuous supply for restaurants, food processors, and catering providers.',
    },
    {
      country: isRTL ? 'الكويت وقطر والبحرين' : 'Kuwait, Qatar & Bahrain',
      role: isRTL ? 'شبكات التوزيع المعتمدة' : 'Certified Distribution Networks',
      cities: isRTL ? 'الكويت، الدوحة، المنامة' : 'Kuwait City, Doha, Manama',
      details: isRTL
        ? 'مستودعات إقليمية وخدمات تسليم سريعة لسلاسل الوجبات السريعة والسوبرماركت.'
        : 'Regional warehousing and express logistics for QSRs and hypermarkets.',
    },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-76px)] py-12 md:py-16">
      <Container size="2xl">
        <Breadcrumb
          items={[
            {
              label: isRTL ? 'حضورنا العالمي' : 'Our Presence',
              href: '/our-presence',
              active: true,
            },
          ]}
        />

        {/* Header Hero */}
        <div className="my-10 text-center max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EEF2FF] dark:bg-[#1E1B4B]/60 text-[#6366F1] dark:text-[#818CF8] border border-[#6366F1]/20 mb-4">
            <Globe2 className="w-3.5 h-3.5" />
            <span>{isRTL ? 'التغطية العالمية' : 'Global Footprint'}</span>
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#1E1B4B] dark:text-white font-heading leading-tight">
            {isRTL
              ? 'حضورنا حول العالم: أكثر من 65 دولة'
              : 'Our Presence: Reaching Across 65+ Countries'}
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {isRTL
              ? 'تعتبر فالكون باك الشريك الموثوق للشركات العالمية وسلاسل الضيافة. تمتلك الشركة 8 فروع إقليمية و24 مركز مبيعات ومعرضاً تقدم حلول التغليف الاستهلاكية لأكثر من 65 دولة.'
              : 'Falcon Pack is the trusted packaging partner for international brands, hospitality conglomerates, and retail leaders. With 8 corporate branches, 24 sales centers, and automated facilities, our export footprint spans over 65 countries.'}
          </p>
        </div>

        {/* Global Numbers Bar */}
        <div className="my-14 grid grid-cols-2 md:grid-cols-4 gap-4 p-8 rounded-3xl bg-[#1E1B4B] text-white shadow-2xl border border-[#6366F1]/20">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-black text-[#818CF8] font-heading">
              <Counter end={8} suffix="" />
            </div>
            <div className="text-sm font-bold mt-1 text-slate-200">
              {isRTL ? 'فروع رئيسية' : 'Operating Branches'}
            </div>
          </div>

          <div className="text-center">
            <div className="text-4xl md:text-5xl font-black text-[#818CF8] font-heading">
              <Counter end={24} suffix="+" />
            </div>
            <div className="text-sm font-bold mt-1 text-slate-200">
              {isRTL ? 'مركز مبيعات ومعرض' : 'Sales Centers'}
            </div>
          </div>

          <div className="text-center">
            <div className="text-4xl md:text-5xl font-black text-[#818CF8] font-heading">
              <Counter end={65} suffix="+" />
            </div>
            <div className="text-sm font-bold mt-1 text-slate-200">
              {isRTL ? 'دولة نصدر إليها' : 'Export Destinations'}
            </div>
          </div>

          <div className="text-center">
            <div className="text-4xl md:text-5xl font-black text-[#818CF8] font-heading">
              <Counter end={3000} suffix="+" />
            </div>
            <div className="text-sm font-bold mt-1 text-slate-200">
              {isRTL ? 'منتج معتمد' : 'Packaging SKUs'}
            </div>
          </div>
        </div>

        {/* Regional Presence Hubs */}
        <div className="my-16">
          <SectionTitle
            badge={isRTL ? 'المحاور الإقليمية' : 'Regional Operating Hubs'}
            title={
              isRTL
                ? 'شبكة توزيع استراتيجية تضمن استمرارية التوريد'
                : 'Strategic Corridors Ensuring Supply Continuity'
            }
            description={
              isRTL
                ? 'تعرف على فروعنا ومراكز العمليات المنتشرة لتلبية طلبات الجملة والحاويات المباشرة.'
                : 'Explore our widespread operational hubs designed to facilitate high-volume container shipments and regional wholesale.'
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            {hubs.map((hub, idx) => (
              <ScrollReveal key={idx} direction="up" delay={idx * 0.1}>
                <div className="p-8 rounded-3xl bg-white dark:bg-[#1E1B4B] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-lg transition-all h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-5 h-5 text-[#E63946] dark:text-[#818CF8]" />
                        <h3 className="text-xl font-bold text-[#1E1B4B] dark:text-white">
                          {hub.country}
                        </h3>
                      </div>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#EEF2FF] dark:bg-white/10 text-[#6366F1] dark:text-[#818CF8]">
                        {hub.cities}
                      </span>
                    </div>

                    <div className="text-sm font-bold text-[#6366F1] dark:text-[#818CF8] mb-2">
                      {hub.role}
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {hub.details}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {isRTL ? 'دعم لوجستي مباشر' : 'Direct Logistics Support'}
                    </span>
                    <Link
                      href="/contact"
                      className="text-xs font-bold text-[#E63946] dark:text-[#818CF8] hover:underline flex items-center gap-1"
                    >
                      {isRTL ? 'تواصل مع الفرع' : 'Contact Branch'}{' '}
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Global Export Inquiries CTA */}
        <div className="mt-20 p-10 md:p-14 rounded-3xl bg-[#1E1B4B] text-white text-center relative overflow-hidden shadow-2xl border border-[#6366F1]/20">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold font-heading">
              {isRTL
                ? 'هل تبحث عن استيراد أو طلب كميات في بلدك؟'
                : 'Looking to Import or Source Products in Your Country?'}
            </h2>
            <p className="mt-4 text-white/90 text-sm md:text-base leading-relaxed">
              {isRTL
                ? 'فريق التصدير الدولي في فالكون باك يقدم استشارات كاملة وشحن الحاويات المباشر لجميع الموانئ العالمية.'
                : 'Falcon Pack’s international commercial team provides end-to-end container export solutions and certified freight forwarding.'}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button href="/contact" variant="primary" size="lg">
                {isRTL ? 'طلب تسعيرة تصدير دولي' : 'Inquire for Export / Distribution'}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
