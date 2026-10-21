'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { fill } from '@/lib/i18n/translations';
import { cn } from '@/lib/utils';

/**
 * Main image + thumbnails. On devices with a mouse, hovering zooms in (2×) around the
 * pointer: we move the CSS transform-origin to where the pointer is.
 */
export default function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const src = images[active] ?? '/images/product-placeholder.png';

  return (
    <div>
      <div
        className="relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl border border-brand-border bg-brand-surface"
        onPointerMove={(e) => {
          if (e.pointerType !== 'mouse') return;
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        onPointerLeave={() => setZoom(null)}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-contain transition-transform duration-200 ease-out"
          style={zoom ? { transform: 'scale(2)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
        />
        <span className="pointer-events-none absolute bottom-3 end-3 hidden rounded-full bg-white/90 px-3 py-1 text-[11px] text-brand-muted shadow-sm lg:block">
          {t.product.zoomHint}
        </span>
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={fill(t.product.showImage, { n: i + 1 })}
              aria-pressed={i === active}
              className={cn(
                'relative aspect-square overflow-hidden rounded-xl border-2 bg-brand-surface transition',
                i === active ? 'border-brand-secondary' : 'border-transparent hover:border-brand-border',
              )}
            >
              <Image src={img} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
