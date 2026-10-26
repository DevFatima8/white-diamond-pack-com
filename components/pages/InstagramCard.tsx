'use client';

import { ArrowRight } from 'lucide-react';
import BrandIcon from '@/components/layout/BrandIcon';
import { cn } from '@/lib/utils';
import { usePageTexts } from './usePageTexts';

/** "@whitediamond" from "https://instagram.com/whitediamond/?hl=en" */
function handleFrom(url: string): string | null {
  try {
    const first = new URL(url).pathname.split('/').filter(Boolean)[0];
    return first ? `@${first}` : null;
  } catch {
    return null;
  }
}

/**
 * Instagram card — shown only when Admin → Settings → Instagram has a link.
 * (No feed API: the client keeps full control by just setting the profile link.)
 */
export default function InstagramCard({ url, className }: { url: string; className?: string }) {
  const { p } = usePageTexts();
  const c = p.common;
  if (!url.startsWith('https://')) return null;
  const handle = handleFrom(url);

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={cn(
        'group flex flex-col gap-5 rounded-3xl bg-[linear-gradient(135deg,#C1121F_0%,#8B1414_100%)] p-6 text-white shadow-level-2 transition-transform hover:-translate-y-0.5 sm:flex-row sm:items-center sm:justify-between sm:p-8',
        className,
      )}
    >
      <span className="flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
          <BrandIcon name="instagram" className="h-7 w-7" />
        </span>
        <span className="min-w-0">
          <span className="block text-xs font-bold uppercase tracking-[0.14em] text-white/80">{c.instagramEyebrow}</span>
          <span className="block font-heading text-xl font-bold sm:text-2xl">{handle ?? c.instagramTitle}</span>
          <span className="mt-1 block text-sm text-white/85">{c.instagramText}</span>
        </span>
      </span>
      <span className="inline-flex h-11 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-white px-5 text-sm font-bold text-brand-primary sm:self-auto">
        {c.instagramCta}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" aria-hidden />
      </span>
    </a>
  );
}
