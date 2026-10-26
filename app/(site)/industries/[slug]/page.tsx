import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductsInCategories, type ProductCardData } from '@/lib/catalog';
import { INDUSTRIES, industryBySlug } from '@/lib/industries';
import { translations } from '@/lib/i18n/translations';
import { pageTexts } from '@/lib/i18n/pages';
import { industryHref } from '@/lib/routes';
import { getSiteSettings } from '@/lib/site-data';
import { logDataError } from '@/lib/db-errors';
import IndustryDetailView from '@/components/pages/IndustryDetailView';

type Params = Promise<{ slug: string }>;

// Only the six known industries exist; any other slug is a 404.
export const dynamicParams = false;
export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }));
}
export const revalidate = 300; // refresh the product list every 5 minutes

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const industry = industryBySlug((await params).slug);
  if (!industry) return {};
  return {
    title: `Packaging for ${translations.en.industries[industry.key].title}`,
    description: pageTexts.en.industries.detail[industry.key].intro,
    alternates: { canonical: industryHref(industry.slug) },
  };
}

export default async function IndustryPage({ params }: { params: Params }) {
  const industry = industryBySlug((await params).slug);
  if (!industry) notFound();

  const [products, settings] = await Promise.all([
    // The page still works (without products) if the database is unreachable
    getProductsInCategories(industry.categories, 8).catch((err): ProductCardData[] => {
      logDataError('industry products', err);
      return [];
    }),
    getSiteSettings(),
  ]);

  return <IndustryDetailView slug={industry.slug} products={products} whatsapp={settings.whatsapp_number} />;
}
