/**
 * Every link to a site page goes through here, so a page that moves only needs
 * changing in ONE place.
 */

export const routes = {
  home: '/',
  shop: '/shop',
  cart: '/cart',
  checkout: '/checkout',
  about: '/about',
  quality: '/about#quality',
  infrastructure: '/about#infrastructure',
  presence: '/our-presence',
  contact: '/contact',
  divisions: '/business-divisions',
  divisionPackaging: '/business-divisions#packaging',
  divisionHygiene: '/business-divisions#hygiene',
  careers: '/careers',
  customPackaging: '/customize-packaging',
  bulkQuote: '/customize-packaging#quote',
  industries: '/industries',
  faq: '/faq',
  shipping: '/shipping-returns',
  privacy: '/privacy-policy',
  terms: '/terms',
} as const;

export const categoryHref = (slug: string) => `/category/${encodeURIComponent(slug)}`;

/** A product page. Products without a slug (shouldn't happen after seeding) fall back to a search. */
export const productHref = (product: { slug: string | null; name: string }) =>
  product.slug ? `/product/${encodeURIComponent(product.slug)}` : searchHref(product.name);

export const searchHref = (q: string) => `/shop?q=${encodeURIComponent(q)}`;

/** Order confirmation page; `t` is the signed access token (see lib/order-token.ts). */
export const orderHref = (orderNumber: string, token: string) => `/order/${encodeURIComponent(orderNumber)}?t=${encodeURIComponent(token)}`;

export const industryHref = (slug: string) => `${routes.industries}/${encodeURIComponent(slug)}`;
