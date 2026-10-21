import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import db from '@/lib/db';
import { PUBLIC_PRODUCT_SELECT } from '@/lib/catalog';
import { toCardData } from '@/lib/catalog-types';
import { productHref } from '@/lib/routes';
import { getSiteSettings } from '@/lib/site-data';
import { settingNumber } from '@/lib/settings';
import ProductDetail, { type ProductDetailData } from '@/components/product/ProductDetail';

export const dynamic = 'force-dynamic';

type Params = Promise<{ slug: string }>;

const strings = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);

// cache(): generateMetadata and the page both need the product → one database query.
const getProduct = cache(async (slug: string) =>
  db.product.findFirst({ where: { slug, isActive: true }, select: PUBLIC_PRODUCT_SELECT }),
);

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return { title: 'Product not found' };
  const description = product.description.slice(0, 160);
  return {
    title: product.name,
    description,
    alternates: { canonical: productHref(product) },
    openGraph: { title: product.name, description, images: [product.image], type: 'website' },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();

  const [settings, relatedRows] = await Promise.all([
    getSiteSettings(),
    db.product.findMany({
      // Same category; if the product has none, show featured products instead.
      where: {
        isActive: true,
        id: { not: product.id },
        ...(product.categoryRef ? { categoryRef: { slug: product.categoryRef.slug } } : { isFeatured: true }),
      },
      orderBy: [{ isFeatured: 'desc' }, { updatedAt: 'desc' }],
      take: 4,
      select: PUBLIC_PRODUCT_SELECT,
    }),
  ]);

  const gallery = strings(product.images);
  const data: ProductDetailData = {
    id: product.id,
    slug: product.slug,
    sku: product.sku,
    name: product.name,
    nameAr: product.nameAr,
    description: product.description,
    descriptionAr: product.descriptionAr,
    images: gallery.length ? gallery : [product.image],
    price: product.price,
    salePrice: product.salePrice,
    unit: product.unit,
    packing: product.packing,
    packingAr: product.packingAr,
    capacity: product.capacity,
    material: product.material,
    color: product.color,
    features: strings(product.features),
    featuresAr: strings(product.featuresAr),
    minOrderQty: product.minOrderQty,
    stockQty: product.stockQty,
    inStock: product.inStock,
    category: product.categoryRef,
  };

  // Structured data so Google can show price & availability in search results.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const price = product.salePrice ?? product.price;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku ?? undefined,
    image: data.images.map((src) => (src.startsWith('http') ? src : `${siteUrl}${src}`)),
    brand: { '@type': 'Brand', name: 'White Diamond' },
    category: product.categoryRef?.nameEn,
    offers:
      price != null
        ? {
            '@type': 'Offer',
            priceCurrency: 'PKR',
            price: Math.round(price),
            availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            url: `${siteUrl}${productHref(product)}`,
          }
        : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        // JSON.stringify output with "<" escaped, so product text can never close the script tag
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <ProductDetail
        product={data}
        related={relatedRows.map(toCardData)}
        delivery={{ charge: settingNumber(settings, 'delivery_charge'), threshold: settingNumber(settings, 'free_delivery_threshold') }}
        whatsapp={settings.whatsapp_number}
      />
    </>
  );
}
