import { Bike, ChefHat, Croissant, Hotel, Store, Utensils, type LucideIcon } from 'lucide-react';
import type { Translations } from '@/lib/i18n/translations';

export type IndustryKey = keyof Translations['industries'];

/**
 * The industries we serve. Text lives in translations (t.industries[key] and the
 * industry pages in lib/i18n/pages.ts). `categories` = category slugs whose products
 * are shown on that industry's page.
 */
export const INDUSTRIES: { key: IndustryKey; slug: string; icon: LucideIcon; image: string; categories: string[] }[] = [
  { key: 'restaurants', slug: 'restaurants-fast-food', icon: Utensils, image: '/images/hero4.png', categories: ['aluminium-foil-containers', 'paper-bags-boxes', 'plastic-containers'] },
  { key: 'bakeries', slug: 'bakeries-confectioneries', icon: Croissant, image: '/images/home/cat-baking-paper.jpg', categories: ['baking-parchment-paper', 'paper-bags-boxes'] },
  { key: 'catering', slug: 'industrial-catering', icon: ChefHat, image: '/images/heavy-duty-foil.png', categories: ['aluminium-foil-rolls', 'aluminium-foil-containers', 'cling-film-wraps'] },
  { key: 'hotels', slug: 'hotels-hospitality', icon: Hotel, image: '/images/hero2.png', categories: ['cling-film-wraps', 'garbage-trash-bags', 'eco-friendly-bamboo'] },
  { key: 'cloudKitchens', slug: 'cloud-kitchens-delivery', icon: Bike, image: '/images/home/cat-paper-bags.jpg', categories: ['plastic-containers', 'aluminium-foil-containers', 'paper-bags-boxes'] },
  { key: 'retail', slug: 'retail-supermarkets', icon: Store, image: '/images/hero1.png', categories: ['aluminium-foil-rolls', 'cling-film-wraps', 'thermal-paper-rolls'] },
];

export const industryBySlug = (slug: string) => INDUSTRIES.find((i) => i.slug === slug);
