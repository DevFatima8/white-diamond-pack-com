'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Award,
  ArrowRight,
  Boxes,
  Factory,
  Info,
  Menu,
  Package,
  PenTool,
  ShieldCheck,
  Search,
  ShoppingBag,
  X,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { fill } from '@/lib/i18n/translations';
import { INDUSTRIES } from '@/lib/industries';
import { categoryHref, industryHref, routes } from '@/lib/routes';
import type { CategoryItem } from '@/lib/categories';
import CartDrawer from './CartDrawer';
import LanguageToggle from './LanguageToggle';
import Logo from './Logo';
import MobileMenu from './MobileMenu';
import NavDropdown from './NavDropdown';
import SearchBox from './SearchBox';

export interface HeaderContact {
  phone: string;
  whatsapp: string;
}

/** Simple icon + title + description link used inside dropdown panels. */
function PanelLink({
  href,
  icon: Icon,
  title,
  desc,
  onClick,
}: {
  href: string;
  icon: typeof Info;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <Link href={href} onClick={onClick} className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-brand-tint">
      <span className="rounded-lg bg-brand-tint p-2 text-brand-secondary transition-colors group-hover:bg-white">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <span>
        <span className="block text-sm font-semibold text-brand-ink group-hover:text-brand-secondary">{title}</span>
        <span className="block text-xs leading-5 text-brand-muted">{desc}</span>
      </span>
    </Link>
  );
}

export default function SiteHeader({ categories, contact }: { categories: CategoryItem[]; contact: HeaderContact }) {
  const { t, isRTL } = useLanguage();
  const { count, openDrawer } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false); // search bar under the header
  const tn = t.nav;

  return (
    <header className="sticky top-0 z-40 border-b border-brand-border bg-white shadow-level-1">
      <div className="relative mx-auto flex h-16 max-w-site items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-12">
        <Logo priority className="h-9 lg:h-11 2xl:h-12" />

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-4 xl:flex 2xl:gap-6" aria-label="Main">
          <NavDropdown id="company" label={tn.ourCompany}>
            {(close) => (
              <div className="w-80 space-y-1">
                <PanelLink href={routes.about} icon={Info} title={tn.company.about} desc={tn.company.aboutDesc} onClick={close} />
                <PanelLink href={routes.quality} icon={Award} title={tn.company.quality} desc={tn.company.qualityDesc} onClick={close} />
                <PanelLink href={routes.infrastructure} icon={Factory} title={tn.company.infrastructure} desc={tn.company.infrastructureDesc} onClick={close} />
              </div>
            )}
          </NavDropdown>

          <NavDropdown id="categories" label={tn.categories} align="center">
            {(close) => (
              <div>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      href={categoryHref(c.slug)}
                      onClick={close}
                      className="group flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-brand-tint"
                    >
                      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-brand-surface">
                        <Image src={c.image || '/images/product-placeholder.png'} alt="" fill sizes="48px" className="object-cover" />
                      </span>
                      <span className="min-w-0 text-sm font-semibold text-brand-ink group-hover:text-brand-secondary">{isRTL ? c.nameAr : c.name}</span>
                    </Link>
                  ))}
                </div>
                <Link
                  href={routes.shop}
                  onClick={close}
                  className="mt-3 flex items-center justify-between rounded-xl bg-brand-secondary px-4 py-3 text-sm font-semibold text-white hover:bg-brand-secondary-hover"
                >
                  {tn.viewAllProducts}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
                </Link>
              </div>
            )}
          </NavDropdown>

          <NavDropdown id="industries" label={tn.industries}>
            {(close) => (
              <div className="grid w-[560px] grid-cols-2 gap-1">
                {INDUSTRIES.map(({ key, slug, icon }) => (
                  <PanelLink key={key} href={industryHref(slug)} icon={icon} title={t.industries[key].title} desc={t.industries[key].desc} onClick={close} />
                ))}
              </div>
            )}
          </NavDropdown>

          <NavDropdown id="divisions" label={tn.divisions}>
            {(close) => (
              <div className="w-80 space-y-1">
                <PanelLink href={routes.divisionPackaging} icon={Package} title={tn.divisionItems.packaging.title} desc={tn.divisionItems.packaging.desc} onClick={close} />
                <PanelLink href={routes.divisionHygiene} icon={ShieldCheck} title={tn.divisionItems.hygiene.title} desc={tn.divisionItems.hygiene.desc} onClick={close} />
                <PanelLink href={routes.customPackaging} icon={PenTool} title={tn.divisionItems.oem.title} desc={tn.divisionItems.oem.desc} onClick={close} />
              </div>
            )}
          </NavDropdown>

          <Link href={routes.careers} className="whitespace-nowrap py-2 text-xs font-semibold uppercase tracking-wide text-brand-ink transition-colors hover:text-brand-secondary 2xl:text-[13px]">
            {tn.careers}
          </Link>

          <Link
            href={routes.shop}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-brand-primary px-4 py-2.5 text-xs font-bold uppercase tracking-wider 2xl:px-5 2xl:text-[13px] text-white shadow-md transition hover:bg-brand-primary-hover active:scale-95"
          >
            <Boxes className="hidden h-4 w-4 2xl:block" aria-hidden />
            {tn.shopOnline}
          </Link>
        </nav>

        {/* Right side tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search opens as a full-width bar under the header (the nav leaves no room for an inline box). */}
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            className="rounded-full p-2 text-brand-ink transition-colors hover:bg-brand-tint hover:text-brand-secondary"
            aria-label={tn.searchLabel}
            aria-expanded={searchOpen}
          >
            {searchOpen ? <X className="h-[22px] w-[22px]" aria-hidden /> : <Search className="h-[22px] w-[22px]" aria-hidden />}
          </button>
          <div className="hidden sm:block">
            <LanguageToggle tone="light" />
          </div>
          <button
            type="button"
            onClick={openDrawer}
            className="relative rounded-full p-2 text-brand-ink transition-colors hover:bg-brand-tint hover:text-brand-secondary"
            aria-label={fill(tn.cartWithCount, { n: count })}
          >
            <ShoppingBag className="h-[22px] w-[22px]" aria-hidden />
            {count > 0 && (
              <span className="absolute end-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-primary px-1 text-[10px] font-bold text-white shadow-sm">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="rounded-full p-2 text-brand-ink transition-colors hover:bg-brand-tint xl:hidden"
            aria-label={tn.openMenu}
            aria-expanded={menuOpen}
          >
            <Menu className="h-6 w-6" aria-hidden />
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-brand-border bg-white">
          <div className="mx-auto max-w-site px-4 py-3 sm:px-6 lg:px-12">
            <SearchBox id="header-search" onNavigate={() => setSearchOpen(false)} />
          </div>
        </div>
      )}

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} categories={categories} contact={contact} />
      <CartDrawer />
    </header>
  );
}
