import { permanentRedirect } from 'next/navigation';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/**
 * The old catalogue address. /products now permanently redirects (HTTP 308) to /shop,
 * keeping any filters, e.g. /products?q=foil → /shop?q=foil.
 */
export default async function ProductsRedirect({ searchParams }: { searchParams: SearchParams }) {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    for (const v of Array.isArray(value) ? value : value ? [value] : []) sp.append(key, v);
  }
  const qs = sp.toString();
  permanentRedirect(qs ? `/shop?${qs}` : '/shop');
}
