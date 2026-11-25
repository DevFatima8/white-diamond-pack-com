import type { BrandIconName } from '@/components/layout/BrandIcon';
import { cn } from '@/lib/utils';

export type ContactChannel = 'phone' | 'whatsapp' | 'email' | 'location';

/** Inline Lucide / brand SVG icons in contact lists */
export function contactIconText(channel: ContactChannel): string {
  const map: Record<ContactChannel, string> = {
    phone: 'text-icon-phone',
    whatsapp: 'text-icon-whatsapp',
    email: 'text-icon-email',
    location: 'text-icon-location',
  };
  return map[channel];
}

/** Rounded icon tile on contact cards (with group-hover fill) */
export function contactIconTile(channel: ContactChannel): string {
  const map: Record<ContactChannel, string> = {
    phone: 'bg-icon-phone/10 text-icon-phone group-hover:bg-icon-phone group-hover:text-white',
    whatsapp: 'bg-icon-whatsapp/10 text-icon-whatsapp group-hover:bg-icon-whatsapp group-hover:text-white',
    email: 'bg-icon-email/10 text-icon-email group-hover:bg-icon-email group-hover:text-white',
    location: 'bg-icon-location/10 text-icon-location group-hover:bg-icon-location group-hover:text-white',
  };
  return map[channel];
}

export function contactCardBorderHover(channel: ContactChannel): string {
  const map: Record<ContactChannel, string> = {
    phone: 'hover:border-icon-phone',
    whatsapp: 'hover:border-icon-whatsapp',
    email: 'hover:border-icon-email',
    location: 'hover:border-icon-location',
  };
  return map[channel];
}

export function socialLinkClasses(name: BrandIconName): string {
  const hover: Record<BrandIconName, string> = {
    facebook: 'text-social-facebook hover:bg-social-facebook',
    instagram: 'text-social-instagram hover:bg-social-instagram',
    linkedin: 'text-social-linkedin hover:bg-social-linkedin',
    youtube: 'text-social-youtube hover:bg-social-youtube',
    tiktok: 'text-social-tiktok hover:bg-social-tiktok',
    whatsapp: 'text-icon-whatsapp hover:bg-icon-whatsapp',
  };
  return cn(
    'flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-level-1 transition-colors hover:text-white',
    hover[name],
  );
}