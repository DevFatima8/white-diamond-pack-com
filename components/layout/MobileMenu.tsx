'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ChevronDown, Phone } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { INDUSTRIES } from '@/lib/industries';
import { whatsappLink } from '@/lib/phone';
import { categoryHref, industryHref, routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import type { CategoryItem } from '@/lib/categories';
import BrandIcon from './BrandIcon';
import Drawer from './Drawer';
import LanguageToggle from './LanguageToggle';
import SearchBox from './SearchBox';
import type { HeaderContact } from './SiteHeader';

/** One expandable section of the mobile menu. */
function Accordion({ id, title, open, onToggle, children }: { id: string; title: string; open: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <div className="border-b border-brand-border">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center justify-between py-4 text-start text-[15px] font-semibold text-brand-ink"
      >
        {title}
        <ChevronDown className={cn('h-5 w-5 text-brand-muted transition-transform', open && 'rotate-180')} aria-hidden />
      </button>
      <div id={id} hidden={!open} className="pb-3">
        {children}
      </div>
    </div>
  );
}

export default function MobileMenu({
  open,
  onClose,
  categories,
  contact,
}: {
  open: boolean;
  onClose: () => void;
  categories: CategoryItem[];
  contact: HeaderContact;
}) {
  const { t, isRTL } = useLanguage();
  const tn = t.nav;
  const [section, setSection] = useState<string | null>(null);
  const toggle = (s: string) => setSection((cur) => (cur === s ? null : s));
  // Sub-links: black and slightly larger so they're easy to read on a phone (client request)
  const subLink = 'block rounded-lg px-3 py-3 text-[15px] font-medium text-brand-ink hover:bg-brand-tint hover:text-brand-secondary';

  return (
    <Drawer open={open} onClose={onClose} side="start" title={tn.home} closeLabel={tn.closeMenu}>
      <div className="px-5 pb-8 pt-4">
        <SearchBox id="drawer-search" variant="drawer" onNavigate={onClose} />

        <nav className="mt-4" aria-label="Mobile">
          <Accordion title={tn.ourCompany} id="mobile-company" open={section === 'company'} onToggle={() => toggle('company')}>
            <Link href={routes.about} onClick={onClose} className={subLink}>{tn.company.about}</Link>
            <Link href={routes.quality} onClick={onClose} className={subLink}>{tn.company.quality}</Link>
            <Link href={routes.infrastructure} onClick={onClose} className={subLink}>{tn.company.infrastructure}</Link>
          </Accordion>
          <Accordion title={tn.categories} id="mobile-categories" open={section === 'categories'} onToggle={() => toggle('categories')}>
            {categories.map((c) => (
              <Link key={c.id} href={categoryHref(c.slug)} onClick={onClose} className={subLink}>
                {isRTL ? c.nameAr : c.name}
              </Link>
            ))}
            <Link href={routes.shop} onClick={onClose} className={cn(subLink, 'font-semibold text-brand-secondary')}>
              {tn.viewAllProducts}
            </Link>
          </Accordion>
          <Accordion title={tn.industries} id="mobile-industries" open={section === 'industries'} onToggle={() => toggle('industries')}>
            {INDUSTRIES.map(({ key, slug }) => (
              <Link key={key} href={industryHref(slug)} onClick={onClose} className={subLink}>
                {t.industries[key].title}
              </Link>
            ))}
          </Accordion>
          <Accordion title={tn.divisions} id="mobile-divisions" open={section === 'divisions'} onToggle={() => toggle('divisions')}>
            <Link href={routes.divisionPackaging} onClick={onClose} className={subLink}>{tn.divisionItems.packaging.title}</Link>
            <Link href={routes.divisionHygiene} onClick={onClose} className={subLink}>{tn.divisionItems.hygiene.title}</Link>
            <Link href={routes.customPackaging} onClick={onClose} className={subLink}>{tn.divisionItems.oem.title}</Link>
          </Accordion>
          <Link href={routes.careers} onClick={onClose} className="block border-b border-brand-border py-4 text-[15px] font-semibold text-brand-ink">
            {tn.careers}
          </Link>
        </nav>

        <Link
          href={routes.shop}
          onClick={onClose}
          className="mt-6 flex h-12 items-center justify-center rounded-full bg-brand-primary text-sm font-bold uppercase tracking-wider text-white hover:bg-brand-primary-hover"
        >
          {tn.shopOnline}
        </Link>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm font-semibold text-brand-muted">Language / اللغة</span>
          <LanguageToggle tone="light" />
        </div>

        <div className="mt-6 rounded-2xl bg-brand-tint p-4">
          <p className="mb-3 text-sm font-semibold text-brand-navy">{tn.contactTitle}</p>
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${contact.phone.replace(/\s/g, '')}`}
              className="flex h-11 items-center justify-center gap-2 rounded-full bg-white text-sm font-semibold text-brand-navy"
            >
              <Phone className="h-4 w-4 text-icon-phone" aria-hidden /> <span dir="ltr">{contact.phone}</span>
            </a>
            <a
              href={whatsappLink(contact.whatsapp, t.whatsapp.message)}
              target="_blank"
              rel="noreferrer"
              className="flex h-11 items-center justify-center gap-2 rounded-full bg-icon-whatsapp text-sm font-semibold text-white hover:bg-icon-whatsapp-hover"
            >
              <BrandIcon name="whatsapp" className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
