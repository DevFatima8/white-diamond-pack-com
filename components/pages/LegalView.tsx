'use client';

import Link from 'next/link';
import { FileText } from 'lucide-react';
import { fill } from '@/lib/i18n/translations';
import { routes } from '@/lib/routes';
import PageHero from './PageHero';
import { usePageTexts } from './usePageTexts';

export type LegalPageKey = 'privacy' | 'terms' | 'shipping';

const LEGAL_LINKS: { key: LegalPageKey; href: string }[] = [
  { key: 'privacy', href: routes.privacy },
  { key: 'terms', href: routes.terms },
  { key: 'shipping', href: routes.shipping },
];

/** Privacy policy, terms of sale and shipping & returns — same simple document layout. */
export default function LegalView({ page }: { page: LegalPageKey }) {
  const { p } = usePageTexts();
  const doc = p[page];

  return (
    <>
      <PageHero eyebrow={doc.title} title={doc.title} intro={doc.intro} />

      <div className="mx-auto grid w-full max-w-site gap-10 px-5 py-16 sm:px-6 lg:grid-cols-12 lg:px-12 lg:py-20">
        <article className="lg:col-span-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">{fill(p.common.lastUpdated, { date: doc.updated })}</p>
          <div className="mt-6 space-y-10">
            {doc.sections.map((s, i) => (
              <section key={s.heading}>
                <h2 className="font-heading text-xl font-bold text-brand-ink">
                  <span className="me-2 text-brand-secondary">{i + 1}.</span>
                  {s.heading}
                </h2>
                {s.paragraphs?.map((para) => (
                  <p key={para} className="mt-3 text-[15px] leading-7 text-brand-muted">{para}</p>
                ))}
                {s.list && (
                  <ul className="mt-3 space-y-2">
                    {s.list.map((li) => (
                      <li key={li} className="flex items-start gap-2.5 text-[15px] leading-7 text-brand-muted">
                        <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-secondary" aria-hidden />
                        {li}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </article>

        <aside className="lg:col-span-4">
          <nav aria-label={p.common.onThisPage} className="sticky top-28 rounded-2xl bg-brand-tint p-6">
            <ul className="space-y-1">
              {LEGAL_LINKS.map((l) => (
                <li key={l.key}>
                  <Link
                    href={l.href}
                    aria-current={l.key === page ? 'page' : undefined}
                    className={
                      l.key === page
                        ? 'flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-bold text-brand-secondary'
                        : 'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-brand-navy hover:bg-white'
                    }
                  >
                    <FileText className="h-4 w-4" aria-hidden />
                    {p[l.key].title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={routes.faq} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-brand-navy hover:bg-white">
                  <FileText className="h-4 w-4" aria-hidden />
                  {p.faq.title}
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
      </div>
    </>
  );
}
