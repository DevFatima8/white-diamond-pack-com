'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ExternalLink,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonClass } from './ui';

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: number;
}

export interface AdminShellProps {
  adminLabel: string;
  pendingOrders: number;
  unreadMessages: number;
  children: ReactNode;
}

export default function AdminShell({ adminLabel, pendingOrders, unreadMessages, children }: AdminShellProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const nav: NavItem[] = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag, badge: pendingOrders },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/categories', label: 'Categories', icon: FolderTree },
    { href: '/admin/messages', label: 'Messages', icon: Mail, badge: unreadMessages },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  // /admin must match exactly; the others also match their sub-pages (/admin/products/123).
  const isActive = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href));

  // While the mobile drawer is open: close on Escape, and stop the page behind it from scrolling.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawerOpen(false);
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [drawerOpen]);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 pb-6 pt-6">
        {/* Logo image only — it already contains the name. */}
        <Link href="/admin" className="inline-flex p-1" onClick={() => setDrawerOpen(false)}>
          <Image src="/images/logo-web.png" alt="White Diamond" width={800} height={267} priority className="h-9 w-auto" />
        </Link>
        <button
          type="button"
          onClick={() => setDrawerOpen(false)}
          className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3" aria-label="Admin">
        {nav.map(({ href, label, icon: Icon, badge }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setDrawerOpen(false)}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                active ? 'bg-brand-secondary text-white shadow-level-2' : 'text-white/75 hover:bg-white/[0.07] hover:text-white',
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
              <span className="flex-1">{label}</span>
              {!!badge && (
                <span className="rounded-full bg-brand-primary px-2 py-0.5 text-[10px] font-bold text-white">
                  {badge > 99 ? '99+' : badge} new
                </span>
              )}
            </Link>
          );
        })}

        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.07] hover:text-white"
        >
          <ExternalLink className="h-[18px] w-[18px]" aria-hidden />
          View store
        </a>
      </nav>

      <div className="mx-3 mb-4 mt-6 border-t border-white/10 pt-4">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-secondary font-heading text-sm font-bold uppercase text-white">
            {adminLabel.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-white">{adminLabel}</div>
            <div className="text-[11px] text-white/50">Administrator</div>
          </div>
        </div>
        {/* A normal form POST: works even before JavaScript has loaded. */}
        <form action="/api/auth/logout" method="POST" className="mt-3">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/75 transition-colors hover:bg-white/[0.07] hover:text-white"
          >
            <LogOut className="h-[18px] w-[18px]" aria-hidden />
            Sign out
          </button>
        </form>
      </div>
    </div>
  );

  return (
    // Admin is English-only, so force left-to-right even if the visitor chose Arabic on the site.
    <div dir="ltr" lang="en" className="min-h-screen bg-brand-surface font-sans text-brand-ink">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-brand-navy lg:block">{sidebar}</aside>

      {/* Mobile drawer */}
      <div className={cn('fixed inset-0 z-50 lg:hidden', drawerOpen ? 'visible' : 'invisible')} aria-hidden={!drawerOpen}>
        <div
          className={cn('absolute inset-0 bg-brand-navy-dark/60 transition-opacity', drawerOpen ? 'opacity-100' : 'opacity-0')}
          onClick={() => setDrawerOpen(false)}
        />
        <aside
          className={cn(
            'absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-brand-navy shadow-level-3 transition-transform duration-200',
            drawerOpen ? 'translate-x-0' : '-translate-x-full',
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Admin menu"
        >
          {sidebar}
        </aside>
      </div>

      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-brand-border bg-white/90 px-4 backdrop-blur sm:px-6 print:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="rounded-lg p-2 text-brand-navy hover:bg-brand-tint lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <form action="/admin/orders" method="GET" className="relative hidden max-w-sm flex-1 sm:block" role="search">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              name="q"
              type="search"
              placeholder="Search orders by number, phone or name…"
              className="h-10 w-full rounded-full border border-brand-border bg-brand-surface pl-10 pr-4 text-sm focus:border-brand-secondary focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-brand-secondary/15"
              aria-label="Search orders"
            />
          </form>

          <div className="ml-auto flex items-center gap-2">
            <Link href="/admin/products/new" className={buttonClass({ size: 'sm' }, 'h-9 px-4')}>
              <Plus className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">New product</span>
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
