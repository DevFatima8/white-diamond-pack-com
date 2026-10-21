/**
 * Shop URL parameters — browser-safe (no database import), so both the server page
 * and Client Components (filters, pagination) can use them.
 */

export const SHOP_PAGE_SIZE = 12;
export const SORTS = ['newest', 'price-asc', 'price-desc', 'name'] as const;
export type ShopSort = (typeof SORTS)[number];

/** Shop filters, read from the URL (?q=&category=&min=&max=&stock=1&sort=&page=&view=). */
export interface ShopParams {
  q: string;
  category: string; // category slug, '' = all
  min: number | null;
  max: number | null;
  inStock: boolean;
  sort: ShopSort;
  page: number;
  view: 'grid' | 'list';
}

type RawParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';
const rupees = (v: string) => {
  const n = Number(v.replace(/[^\d]/g, ''));
  return v.trim() !== '' && Number.isFinite(n) && n >= 0 ? Math.min(n, 100_000_000) : null;
};

/** Read and clean the URL params — anything invalid falls back to a safe default. */
export function parseShopParams(raw: RawParams, fixedCategory?: string): ShopParams {
  const sort = first(raw.sort) as ShopSort;
  const page = Number(first(raw.page));
  let min = rupees(first(raw.min));
  let max = rupees(first(raw.max));
  if (min !== null && max !== null && min > max) [min, max] = [max, min];
  return {
    q: first(raw.q).trim().slice(0, 80),
    category: fixedCategory ?? first(raw.category).trim().slice(0, 120),
    min,
    max,
    inStock: first(raw.stock) === '1',
    sort: SORTS.includes(sort) ? sort : 'newest',
    page: Number.isInteger(page) && page > 0 ? Math.min(page, 10_000) : 1,
    view: first(raw.view) === 'list' ? 'list' : 'grid',
  };
}

/** Build a shop URL from the current params plus changes (page resets to 1 unless given). */
export function shopHref(basePath: string, params: ShopParams, changes: Partial<ShopParams> = {}, fixedCategory = false): string {
  const next = { ...params, page: 1, ...changes };
  const sp = new URLSearchParams();
  if (next.q) sp.set('q', next.q);
  if (next.category && !fixedCategory) sp.set('category', next.category);
  if (next.min !== null) sp.set('min', String(next.min));
  if (next.max !== null) sp.set('max', String(next.max));
  if (next.inStock) sp.set('stock', '1');
  if (next.sort !== 'newest') sp.set('sort', next.sort);
  if (next.view !== 'grid') sp.set('view', next.view);
  if (next.page > 1) sp.set('page', String(next.page));
  const qs = sp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
