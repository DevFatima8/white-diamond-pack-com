'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingCart,
  ChevronDown,
  X,
  Menu as MenuIcon,
  Package,
  Layers,
  Leaf,
  ShieldCheck,
  Building2,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { CategoryItem, fallbackCategories } from '@/lib/categories';

export default function Header({
  className = 'transparent scroll-light',
  useHeaderInner = false,
}: {
  className?: string;
  useHeaderInner?: boolean;
}) {
  const { getTotalItems } = useCart();
  const { locale, setLocale, isRTL, t } = useLanguage();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<CategoryItem[]>(fallbackCategories);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Fetch dynamic categories from DB / API
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setCategories(data.data);
        }
      })
      .catch((err) => {
        console.warn('Could not load categories dynamically, using fallback', err);
      });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleMouseEnter = (menuKey: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(menuKey);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const toggleMobileAccordion = (key: string) => {
    setMobileAccordion(mobileAccordion === key ? null : key);
  };

  const cartCount = mounted ? getTotalItems() : 0;
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#1E1B4B]/95 backdrop-blur-md shadow-xl py-2'
          : 'bg-[#1E1B4B] py-3'
      } ${className}`}
      style={{ backgroundColor: '#1E1B4B', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="container-fluid px-4 px-md-5">
        <div className="flex items-center justify-between h-[52px]">
          {/* Logo Section */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="inline-block transition-transform hover:scale-105 duration-200">
              <img
                src="/images/logo.png"
                alt="White Diamond"
                className="h-8 md:h-9 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center justify-center flex-1 mx-6">
            <ul className="flex items-center gap-5 xl:gap-7 m-0 p-0 list-none">
              {/* OUR COMPANY */}
              <li className="relative">
                <Link
                  href="/about"
                  className="text-white text-[12px] font-bold tracking-[0.5px] uppercase transition-colors hover:text-[#818CF8] py-2 inline-flex items-center"
                >
                  {t.nav.ourCompany}
                </Link>
              </li>

              {/* CATEGORIES (MEGA MENU) */}
              <li
                className="relative"
                onMouseEnter={() => handleMouseEnter('categories')}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href="/products"
                  className={`text-[12px] font-bold tracking-[0.5px] uppercase transition-colors py-2 inline-flex items-center gap-1 ${
                    activeDropdown === 'categories' ? 'text-[#818CF8]' : 'text-white hover:text-[#818CF8]'
                  }`}
                >
                  {t.nav.categories}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === 'categories' ? 'rotate-180' : ''
                    }`}
                  />
                </Link>

                {/* Animated Mega Menu */}
                <AnimatePresence>
                  {activeDropdown === 'categories' && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className={`absolute top-full ${
                        isRTL ? 'right-[-120px]' : 'left-[-120px]'
                      } mt-2 w-[720px] rounded-2xl bg-[#12102E]/98 backdrop-blur-xl border border-[#6366F1]/20 shadow-2xl p-6 text-white z-50`}
                    >
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-[#818CF8]" />
                          <span className="text-xs font-bold tracking-wider uppercase text-[#818CF8]">
                            {t.nav.exploreCatalogue}
                          </span>
                        </div>
                        <Link
                          href="/products"
                          onClick={() => setActiveDropdown(null)}
                          className="text-xs text-white/80 hover:text-white inline-flex items-center gap-1 font-semibold transition-colors"
                        >
                          {t.nav.viewAllCategories}
                          <ArrowIcon className="w-3.5 h-3.5 text-[#818CF8]" />
                        </Link>
                      </div>

                      <div className="grid grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                        {categories.map((cat, idx) => (
                          <Link
                            key={cat.id || idx}
                            href={`/products?category=${encodeURIComponent(cat.name)}`}
                            onClick={() => setActiveDropdown(null)}
                            className="group p-3 rounded-xl bg-white/[0.03] hover:bg-[#6366F1]/15 border border-white/5 hover:border-[#6366F1]/30 transition-all duration-200 flex items-start gap-3"
                          >
                            <div className="w-9 h-9 rounded-lg bg-[#6366F1]/20 border border-[#6366F1]/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-[#818CF8]">
                              {idx % 4 === 0 && <Package className="w-4 h-4" />}
                              {idx % 4 === 1 && <Leaf className="w-4 h-4" />}
                              {idx % 4 === 2 && <Layers className="w-4 h-4" />}
                              {idx % 4 === 3 && <ShieldCheck className="w-4 h-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-white group-hover:text-[#818CF8] transition-colors truncate">
                                {cat.name}
                              </h4>
                              <p className="text-[11px] text-white/60 line-clamp-2 mt-0.5 leading-snug">
                                {cat.description || t.nav.exploreCatalogue}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#818CF8]" />
                          Heavy-duty certified food contact safe packaging
                        </span>
                        <Link
                          href="/products"
                          onClick={() => setActiveDropdown(null)}
                          className="text-[#818CF8] hover:underline font-semibold"
                        >
                          View 100% Recyclable Lines &rarr;
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>

              {/* INDUSTRY WE SERVE */}
              <li
                className="relative"
                onMouseEnter={() => handleMouseEnter('industry')}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href="/services"
                  className={`text-[12px] font-bold tracking-[0.5px] uppercase transition-colors py-2 inline-flex items-center gap-1 ${
                    activeDropdown === 'industry' ? 'text-[#818CF8]' : 'text-white hover:text-[#818CF8]'
                  }`}
                >
                  {t.nav.industryWeServe}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === 'industry' ? 'rotate-180' : ''
                    }`}
                  />
                </Link>

                <AnimatePresence>
                  {activeDropdown === 'industry' && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className={`absolute top-full ${
                        isRTL ? 'right-0' : 'left-0'
                      } mt-2 w-[420px] rounded-2xl bg-[#12102E]/98 backdrop-blur-xl border border-[#6366F1]/20 shadow-2xl p-4 text-white z-50`}
                    >
                      <div className="space-y-1.5">
                        {Object.values(t.industryMenu).map((item, idx) => (
                          <Link
                            key={idx}
                            href="/services"
                            onClick={() => setActiveDropdown(null)}
                            className="group p-2.5 rounded-xl hover:bg-white/[0.05] flex items-start gap-3 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-lg bg-[#1E1B4B]/80 border border-[#6366F1]/30 flex items-center justify-center shrink-0 text-[#818CF8]">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white group-hover:text-[#818CF8] transition-colors">
                                {item.title}
                              </div>
                              <p className="text-[11px] text-white/60 leading-snug mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>

              {/* BUSINESS DIVISIONS */}
              <li
                className="relative"
                onMouseEnter={() => handleMouseEnter('divisions')}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href="/about"
                  className={`text-[12px] font-bold tracking-[0.5px] uppercase transition-colors py-2 inline-flex items-center gap-1 ${
                    activeDropdown === 'divisions' ? 'text-[#818CF8]' : 'text-white hover:text-[#818CF8]'
                  }`}
                >
                  {t.nav.businessDivisions}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === 'divisions' ? 'rotate-180' : ''
                    }`}
                  />
                </Link>

                <AnimatePresence>
                  {activeDropdown === 'divisions' && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className={`absolute top-full ${
                        isRTL ? 'right-0' : 'left-0'
                      } mt-2 w-[400px] rounded-2xl bg-[#12102E]/98 backdrop-blur-xl border border-[#6366F1]/20 shadow-2xl p-4 text-white z-50`}
                    >
                      <div className="space-y-1.5">
                        {Object.values(t.divisionsMenu).map((item, idx) => (
                          <Link
                            key={idx}
                            href="/about"
                            onClick={() => setActiveDropdown(null)}
                            className="group p-2.5 rounded-xl hover:bg-white/[0.05] flex items-start gap-3 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-lg bg-[#1E1B4B]/80 border border-[#6366F1]/30 flex items-center justify-center shrink-0 text-[#818CF8]">
                              <Briefcase className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white group-hover:text-[#818CF8] transition-colors">
                                {item.title}
                              </div>
                              <p className="text-[11px] text-white/60 leading-snug mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>

              {/* CAREERS */}
              <li
                className="relative"
                onMouseEnter={() => handleMouseEnter('careers')}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href="/contact"
                  className={`text-[12px] font-bold tracking-[0.5px] uppercase transition-colors py-2 inline-flex items-center gap-1 ${
                    activeDropdown === 'careers' ? 'text-[#818CF8]' : 'text-white hover:text-[#818CF8]'
                  }`}
                >
                  {t.nav.careers}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === 'careers' ? 'rotate-180' : ''
                    }`}
                  />
                </Link>

                <AnimatePresence>
                  {activeDropdown === 'careers' && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className={`absolute top-full ${
                        isRTL ? 'right-0' : 'left-0'
                      } mt-2 w-[340px] rounded-2xl bg-[#12102E]/98 backdrop-blur-xl border border-[#6366F1]/20 shadow-2xl p-3 text-white z-50`}
                    >
                      <div className="space-y-1">
                        {Object.values(t.careersMenu).map((item, idx) => (
                          <Link
                            key={idx}
                            href="/contact"
                            onClick={() => setActiveDropdown(null)}
                            className="group p-2.5 rounded-xl hover:bg-white/[0.05] block transition-colors"
                          >
                            <div className="text-xs font-bold text-white group-hover:text-[#818CF8] transition-colors">
                              {item.title}
                            </div>
                            <p className="text-[11px] text-white/60 leading-snug mt-0.5">
                              {item.desc}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>

              {/* SHOP ONLINE */}
              <li
                className="relative"
                onMouseEnter={() => handleMouseEnter('shop')}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href="/products"
                  className="text-[#E63946] hover:text-[#F87171] text-[12px] font-bold tracking-[0.5px] uppercase py-2 inline-flex items-center gap-1 transition-colors"
                >
                  {t.nav.shopOnline}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === 'shop' ? 'rotate-180' : ''
                    }`}
                  />
                </Link>

                <AnimatePresence>
                  {activeDropdown === 'shop' && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className={`absolute top-full ${
                        isRTL ? 'right-0' : 'left-0'
                      } mt-2 w-[360px] rounded-2xl bg-[#12102E]/98 backdrop-blur-xl border border-[#E63946]/30 shadow-2xl p-4 text-white z-50`}
                    >
                      <div className="space-y-2">
                        {Object.values(t.shopMenu).map((item, idx) => (
                          <Link
                            key={idx}
                            href="/products"
                            onClick={() => setActiveDropdown(null)}
                            className="group p-2.5 rounded-xl hover:bg-[#E63946]/15 border border-transparent hover:border-[#E63946]/30 block transition-all"
                          >
                            <div className="text-xs font-bold text-white group-hover:text-[#F87171] transition-colors flex items-center justify-between">
                              {item.title}
                              <ArrowIcon className="w-3.5 h-3.5 text-[#E63946] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-[11px] text-white/60 leading-snug mt-0.5">
                              {item.desc}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            </ul>
          </nav>

          {/* Right Section: Search + Language Switcher + Cart + Mobile Hamburger */}
          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            {/* Search Input (Desktop) */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex relative items-center">
              <Search className="w-3.5 h-3.5 text-white/60 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder={t.nav.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/20 hover:bg-white/25 focus:bg-white/30 text-white text-[12px] rounded-full pl-8 pr-4 py-1.5 w-40 lg:w-48 outline-none border border-white/10 focus:border-[#6366F1]/80 transition-all placeholder:text-white/50"
              />
            </form>

            {/* Language Switcher (EN / AR) */}
            <div className="flex flex-col items-center justify-center select-none">
              <span className="text-[9px] text-white/70 font-medium leading-none mb-1">
                {t.nav.language}
              </span>
              <div className="inline-flex items-center bg-white/20 rounded-full p-0.5 border border-white/10 h-5">
                <button
                  type="button"
                  onClick={() => setLocale('en')}
                  className={`px-2 h-4 rounded-full text-[9px] font-bold tracking-wider flex items-center justify-center transition-all ${
                    locale === 'en'
                      ? 'bg-white text-[#0f0f0f] shadow-sm'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLocale('ar')}
                  className={`px-2 h-4 rounded-full text-[9px] font-bold tracking-wider flex items-center justify-center transition-all ${
                    locale === 'ar'
                      ? 'bg-white text-[#0f0f0f] shadow-sm'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  AR
                </button>
              </div>
            </div>

            {/* Shopping Cart Button */}
            <Link
              href="/checkout"
              className="relative p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              title={t.nav.cart}
            >
              <ShoppingCart className="w-5 h-5 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#E63946] text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
              aria-label="Open menu"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu (Offcanvas) with framer-motion */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: isRTL ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className={`fixed top-0 bottom-0 ${
                isRTL ? 'left-0' : 'right-0'
              } w-[85%] max-w-[360px] bg-[#12102E] text-white z-50 flex flex-col shadow-2xl border-l border-white/10 lg:hidden overflow-hidden`}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  <img src="/images/logo.png" alt="White Diamond" className="h-7 w-auto" />
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Search */}
              <div className="p-4 border-b border-white/10">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Search className="w-4 h-4 text-white/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder={t.nav.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-white/40 border border-white/10 focus:border-[#6366F1] outline-none"
                  />
                </form>
              </div>

              {/* Drawer Navigation Links & Accordions */}
              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {/* OUR COMPANY */}
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white/5 text-sm font-bold text-white uppercase tracking-wider"
                >
                  {t.nav.ourCompany}
                </Link>

                {/* CATEGORIES Accordion */}
                <div className="rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleMobileAccordion('categories')}
                    className="w-full flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white/5 text-sm font-bold text-white uppercase tracking-wider transition-colors"
                  >
                    <span>{t.nav.categories}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#818CF8] transition-transform ${
                        mobileAccordion === 'categories' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {mobileAccordion === 'categories' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-black/30 rounded-lg px-2 py-1 space-y-1"
                      >
                        {categories.map((cat, idx) => (
                          <Link
                            key={cat.id || idx}
                            href={`/products?category=${encodeURIComponent(cat.name)}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-2 px-3 text-xs text-white/80 hover:text-[#818CF8] rounded-md transition-colors"
                          >
                            {cat.name}
                          </Link>
                        ))}
                        <Link
                          href="/products"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-2 px-3 text-xs font-bold text-[#818CF8] border-t border-white/10 mt-1"
                        >
                          {t.nav.viewAllCategories} &rarr;
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* INDUSTRY WE SERVE Accordion */}
                <div className="rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleMobileAccordion('industry')}
                    className="w-full flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white/5 text-sm font-bold text-white uppercase tracking-wider transition-colors"
                  >
                    <span>{t.nav.industryWeServe}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#818CF8] transition-transform ${
                        mobileAccordion === 'industry' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {mobileAccordion === 'industry' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-black/30 rounded-lg px-2 py-1 space-y-1"
                      >
                        {Object.values(t.industryMenu).map((item, idx) => (
                          <Link
                            key={idx}
                            href="/services"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-2 px-3 text-xs text-white/80 hover:text-[#818CF8] rounded-md transition-colors"
                          >
                            {item.title}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* BUSINESS DIVISIONS Accordion */}
                <div className="rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleMobileAccordion('divisions')}
                    className="w-full flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white/5 text-sm font-bold text-white uppercase tracking-wider transition-colors"
                  >
                    <span>{t.nav.businessDivisions}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#818CF8] transition-transform ${
                        mobileAccordion === 'divisions' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {mobileAccordion === 'divisions' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-black/30 rounded-lg px-2 py-1 space-y-1"
                      >
                        {Object.values(t.divisionsMenu).map((item, idx) => (
                          <Link
                            key={idx}
                            href="/about"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-2 px-3 text-xs text-white/80 hover:text-[#818CF8] rounded-md transition-colors"
                          >
                            {item.title}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* CAREERS Accordion */}
                <div className="rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleMobileAccordion('careers')}
                    className="w-full flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white/5 text-sm font-bold text-white uppercase tracking-wider transition-colors"
                  >
                    <span>{t.nav.careers}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#818CF8] transition-transform ${
                        mobileAccordion === 'careers' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {mobileAccordion === 'careers' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-black/30 rounded-lg px-2 py-1 space-y-1"
                      >
                        {Object.values(t.careersMenu).map((item, idx) => (
                          <Link
                            key={idx}
                            href="/contact"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-2 px-3 text-xs text-white/80 hover:text-[#818CF8] rounded-md transition-colors"
                          >
                            {item.title}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* SHOP ONLINE */}
                <Link
                  href="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-3 px-4 rounded-xl bg-[#E63946] hover:bg-[#C92A37] text-white shadow-md text-sm font-bold uppercase tracking-wider transition-colors"
                >
                  <span>{t.nav.shopOnline}</span>
                  <ArrowIcon className="w-4 h-4" />
                </Link>
              </div>

              {/* Drawer Footer with Language and Quick Contact */}
              <div className="p-4 border-t border-white/10 bg-black/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/70">{t.nav.language}</span>
                  <div className="inline-flex bg-white/20 rounded-full p-0.5 border border-white/10">
                    <button
                      type="button"
                      onClick={() => setLocale('en')}
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        locale === 'en' ? 'bg-white text-black' : 'text-white'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocale('ar')}
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        locale === 'ar' ? 'bg-white text-black' : 'text-white'
                      }`}
                    >
                      AR
                    </button>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-white/60 space-y-1">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#818CF8]" />
                    <span>+923216293333</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#818CF8]" />
                    <span>whitediamond344@gmail.com</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}