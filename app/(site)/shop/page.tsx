import type { Metadata } from 'next';
import { getShopPage } from '@/lib/shop';
import { SHOP_PAGE_SIZE, parseShopParams } from '@/lib/shop-params';
import { getSiteCategories, getSiteSettings } from '@/lib/site-data';
import { logDataError } from '@/lib/db-errors';
import ShopView from '@/components/shop/ShopView';
import ShopUnavailable from '@/components/shop/ShopUnavailable';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Shop Online — Food Packaging at Factory Prices',
  description:
    'Buy aluminium foil, foil and plastic containers, cling film, baking paper, paper bags and eco-friendly disposables online. Wholesale prices in PKR, delivery across Pakistan.',
  alternates: { canonical: '/shop' },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** /shop — server-rendered from the database; all filters live in the URL. */
export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const params = parseShopParams(await searchParams);
  const [categories, settings] = await Promise.all([getSiteCategories(), getSiteSettings()]);
  // Database offline → a friendly "temporarily unavailable" panel instead of an error page
  const result = await getShopPage(params).catch((err) => {
    logDataError('shop', err);
    return null;
  });
  if (!result) return <ShopUnavailable whatsapp={settings.whatsapp_number} />;

  return (
    <ShopView
      basePath="/shop"
      params={params}
      {...result}
      pageSize={SHOP_PAGE_SIZE}
      categories={categories}
      whatsapp={settings.whatsapp_number}
    />
  );
}
