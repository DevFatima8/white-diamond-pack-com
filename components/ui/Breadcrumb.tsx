'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className,
  showHome = true,
}) => {
  const { isRTL, t } = useLanguage();
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center text-xs text-slate-500 dark:text-slate-400 py-3', className)}
    >
      <ol className="flex items-center flex-wrap gap-1.5 list-none m-0 p-0">
        {showHome && (
          <li className="inline-flex items-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-[#E63946] dark:hover:text-[#818CF8] transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="sr-only">{t.common.home}</span>
            </Link>
          </li>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={index}>
              <li className="inline-flex items-center text-slate-400">
                <ChevronIcon className="w-3.5 h-3.5" />
              </li>
              <li className="inline-flex items-center">
                {isLast || !item.href ? (
                  <span
                    className={cn(
                      'font-semibold',
                      isLast
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-600 dark:text-slate-300'
                    )}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-[#E63946] dark:hover:text-[#818CF8] transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
