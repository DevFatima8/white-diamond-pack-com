import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getShopPage } from '@/lib/shop';
import { logDataError } from '@/lib/db-errors';
import ShopUnavailable from '@/components/shop/ShopUnavailable';
import { SHOP_PAGE_SIZE, parseShopParams } from '@/lib/shop-params';
import { getSiteCategories, getSiteSettings } from '@/lib/site-data';
import { categoryHref } from '@/lib/routes';
import ShopView from '@/components/shop/ShopView';

export const dynamic = 'force-dynamic';

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const category = (await getSiteCategories()).find((c) => c.slug === slug);
  if (!category) return { title: 'Category not found' };
  return {
    title: `${category.name} — Wholesale Prices in Pakistan`,
    description: category.description ?? `Buy ${category.name} online from White Diamond, Faisalabad. Delivery across Pakistan.`,
    alternates: { canonical: categoryHref(category.slug) },
    openGraph: category.image ? { images: [category.image] } : undefined,
  };
}

/** /category/<slug> — the shop, locked to one category (only active categories exist here). */
export default async function CategoryPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const { slug } = await params;
  const [categories, settings] = await Promise.all([getSiteCategories(), getSiteSettings()]);
  // No categories at all = the database is offline: show "temporarily unavailable", not a false 404
  if (!categories.length) return <ShopUnavailable whatsapp={settings.whatsapp_number} />;
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const shopParams = parseShopParams(await searchParams, category.slug);
  const result = await getShopPage(shopParams).catch((err) => {
    logDataError('category', err);
    return null;
  });
  if (!result) return <ShopUnavailable whatsapp={settings.whatsapp_number} />;

  return (
    <ShopView
      basePath={categoryHref(category.slug)}
      fixedCategory={category}
      params={shopParams}
      {...result}
      pageSize={SHOP_PAGE_SIZE}
      categories={categories}
      whatsapp={settings.whatsapp_number}
    />
  );
}
