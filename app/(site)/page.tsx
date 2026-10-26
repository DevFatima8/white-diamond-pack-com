import type { Metadata } from 'next';
import { logDataError } from '@/lib/db-errors';
import { getSiteCategories, getSiteSettings } from '@/lib/site-data';
import { getFeaturedProducts } from '@/lib/catalog';
import type { ProductCardData } from '@/lib/catalog-types';
import HeroSlider from '@/components/home/HeroSlider';
import CategoryGrid from '@/components/home/CategoryGrid';
import DivisionsSection from '@/components/home/DivisionsSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import PresenceSection from '@/components/home/PresenceSection';
import OemSection from '@/components/home/OemSection';
import StatsStrip from '@/components/home/StatsStrip';
import IndustriesSection from '@/components/home/IndustriesSection';
import InstagramCard from '@/components/pages/InstagramCard';

// Products and categories change in the admin, so always render fresh.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Food Packaging & Disposables Manufacturer in Pakistan',
  description:
    'White Diamond, Faisalabad: aluminium foil, food containers, cling film, baking paper and eco-friendly packaging at factory prices. Nationwide delivery in 24–48 hours.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'White Diamond — Food Packaging & Disposables in Pakistan',
    description:
      'Aluminium foil, food containers, cling film, baking paper and custom packaging at factory prices. Delivered across Pakistan.',
    images: ['/images/home/hero-studio-showcase.jpg'],
  },
};

/**
 * Homepage — sections in the same order as design/stitch/home.
 * Data is loaded on the server; if the database is down, the data sections are
 * simply skipped and the rest of the page still works.
 */
export default async function HomePage() {
  const [categories, featured, settings] = await Promise.all([
    getSiteCategories(), // already loaded by the layout → cached, no 2nd query
    getFeaturedProducts(8).catch((err): ProductCardData[] => {
      logDataError('home featured', err);
      return [];
    }),
    getSiteSettings(),
  ]);

  return (
    <>
      <HeroSlider />
      <CategoryGrid categories={categories} />
      <DivisionsSection />
      <FeaturedProducts products={featured} />
      <PresenceSection />
      <OemSection />
      <StatsStrip />
      <IndustriesSection />
      {settings.social_instagram && (
        <section className="mx-auto w-full max-w-site px-5 pb-16 sm:px-6 lg:px-12">
          <InstagramCard url={settings.social_instagram} />
        </section>
      )}
    </>
  );
}
