'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Phone, Mail, Heart } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const pathname = usePathname();
  const { t, isRTL } = useLanguage();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer
      className="section-dark mt-auto"
      style={{ backgroundColor: '#1E1B4B', color: '#EEF2FF' }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Column 1 - Company Info (4 cols) */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-5">
              <img
                src="/images/logo.png"
                className="logo-footer"
                alt="White Diamond"
                style={{ maxWidth: '180px' }}
              />
            </Link>
            <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: '1.8' }}>
              {t.footer.aboutText}
            </p>

            <div className="social-icons flex items-center gap-2 mt-6">
              <Link
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#6366F1] flex items-center justify-center transition-all hover:scale-105"
                title="Facebook"
              >
                <i className="fa-brands fa-facebook-f text-white text-sm"></i>
              </Link>
              <Link
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#6366F1] flex items-center justify-center transition-all hover:scale-105"
                title="Twitter"
              >
                <i className="fa-brands fa-x-twitter text-white text-sm"></i>
              </Link>
              <Link
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#6366F1] flex items-center justify-center transition-all hover:scale-105"
                title="Instagram"
              >
                <i className="fa-brands fa-instagram text-white text-sm"></i>
              </Link>
              <Link
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#6366F1] flex items-center justify-center transition-all hover:scale-105"
                title="YouTube"
              >
                <i className="fa-brands fa-youtube text-white text-sm"></i>
              </Link>
              <Link
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#6366F1] flex items-center justify-center transition-all hover:scale-105"
                title="WhatsApp"
              >
                <i className="fa-brands fa-whatsapp text-white text-sm"></i>
              </Link>
            </div>
          </div>

          {/* Column 2 - Quick Links (2 cols) */}
          <div className="lg:col-span-2 sm:col-span-1">
            <div className="widget">
              <h5
                style={{
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '20px',
                }}
              >
                {t.footer.quickLinks}
              </h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '10px' }}>
                  <Link
                    href="/"
                    style={{ color: '#94A3B8', transition: 'color 0.3s ease', fontSize: '14px' }}
                    className="hover:text-[#818CF8]"
                  >
                    {t.footer.home}
                  </Link>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <Link
                    href="/services"
                    style={{ color: '#94A3B8', transition: 'color 0.3s ease', fontSize: '14px' }}
                    className="hover:text-[#818CF8]"
                  >
                    {t.footer.services}
                  </Link>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <Link
                    href="/products"
                    style={{ color: '#94A3B8', transition: 'color 0.3s ease', fontSize: '14px' }}
                    className="hover:text-[#818CF8]"
                  >
                    {t.footer.products}
                  </Link>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <Link
                    href="/checkout"
                    style={{ color: '#94A3B8', transition: 'color 0.3s ease', fontSize: '14px' }}
                    className="hover:text-[#818CF8]"
                  >
                    {t.footer.checkout}
                  </Link>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <Link
                    href="/contact"
                    style={{ color: '#94A3B8', transition: 'color 0.3s ease', fontSize: '14px' }}
                    className="hover:text-[#818CF8]"
                  >
                    {t.footer.contact}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3 - Our Services (3 cols) */}
          <div className="lg:col-span-3 sm:col-span-1">
            <div className="widget">
              <h5
                style={{
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '20px',
                }}
              >
                {t.footer.ourServices}
              </h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '10px', color: '#94A3B8', fontSize: '14px' }}>
                  {t.footer.serviceList.foilContainers}
                </li>
                <li style={{ marginBottom: '10px', color: '#94A3B8', fontSize: '14px' }}>
                  {t.footer.serviceList.bambooSticks}
                </li>
                <li style={{ marginBottom: '10px', color: '#94A3B8', fontSize: '14px' }}>
                  {t.footer.serviceList.thermalPaper}
                </li>
                <li style={{ marginBottom: '10px', color: '#94A3B8', fontSize: '14px' }}>
                  {t.footer.serviceList.cateringSupplies}
                </li>
                <li style={{ marginBottom: '10px', color: '#94A3B8', fontSize: '14px' }}>
                  {t.footer.serviceList.customPackaging}
                </li>
                <li style={{ marginBottom: '10px', color: '#94A3B8', fontSize: '14px' }}>
                  {t.footer.serviceList.bulkOrders}
                </li>
              </ul>
            </div>
          </div>

          {/* Column 4 - Contact Us (3 cols) */}
          <div className="lg:col-span-3">
            <div className="widget">
              <h5
                style={{
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '20px',
                }}
              >
                {t.footer.contactUs}
              </h5>

              <div style={{ marginBottom: '20px' }}>
                <div
                  className="flex items-center gap-2"
                  style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600', marginBottom: '5px' }}
                >
                  <MapPin className="w-4 h-4 text-[#818CF8]" />
                  <span>{t.footer.officeLocation}</span>
                </div>
                <span style={{ color: '#94A3B8', fontSize: '14px' }}>
                  {t.footer.officeAddress}
                </span>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div
                  className="flex items-center gap-2"
                  style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600', marginBottom: '5px' }}
                >
                  <Phone className="w-4 h-4 text-[#818CF8]" />
                  <span>{t.footer.callUs}</span>
                </div>
                <a
                  href="tel:+923216293333"
                  dir="ltr"
                  style={{ color: '#94A3B8', fontSize: '14px' }}
                  className="hover:text-[#818CF8] transition-colors"
                >
                  +923216293333
                </a>
              </div>

              <div>
                <div
                  className="flex items-center gap-2"
                  style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600', marginBottom: '5px' }}
                >
                  <Mail className="w-4 h-4 text-[#818CF8]" />
                  <span>{t.footer.sendMessage}</span>
                </div>
                <a
                  href="mailto:whitediamond344@gmail.com"
                  dir="ltr"
                  style={{ color: '#94A3B8', fontSize: '14px' }}
                  className="hover:text-[#818CF8] transition-colors"
                >
                  whitediamond344@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subfooter */}
      <div
        className="subfooter py-5 border-t border-white/10"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-[#94A3B8]">
            <div>
              Copyright &copy; {new Date().getFullYear()} - {t.footer.rightsReserved}
            </div>
            <div className="flex items-center gap-1.5">
              <span>{t.footer.developedWith}</span>
              <Heart className="w-3.5 h-3.5 text-[#E63946] fill-current inline-block mx-0.5" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}