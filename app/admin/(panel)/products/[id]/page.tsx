import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import db from '@/lib/db';
import { ExternalLink } from 'lucide-react';
import { PageHeader, buttonClass } from '@/components/admin/ui';
import ProductForm, { type ProductFormValues } from '@/components/admin/ProductForm';

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id }, select: { name: true } });
  return { title: product ? `Edit: ${product.name}` : 'Product not found' };
}

/** Json column → string[] (anything unexpected becomes an empty list). */
const stringList = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];

export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    db.product.findUnique({ where: { id } }),
    db.category.findMany({ orderBy: { sortOrder: 'asc' }, select: { id: true, nameEn: true, isActive: true } }),
  ]);
  if (!product) notFound();

  // Database row → form values (numbers become text, missing values become "").
  const gallery = stringList(product.images);
  const initial: ProductFormValues = {
    name: product.name,
    nameAr: product.nameAr ?? '',
    slug: product.slug ?? '',
    sku: product.sku ?? '',
    categoryId: product.categoryId ?? '',
    description: product.description,
    descriptionAr: product.descriptionAr ?? '',
    images: gallery.length ? gallery : product.image ? [product.image] : [],
    price: product.price != null ? String(Math.round(product.price)) : '',
    salePrice: product.salePrice != null ? String(Math.round(product.salePrice)) : '',
    unit: product.unit,
    packing: product.packing,
    packingAr: product.packingAr ?? '',
    capacity: product.capacity ?? '',
    material: product.material ?? '',
    color: product.color ?? '',
    features: stringList(product.features),
    featuresAr: stringList(product.featuresAr),
    stockQty: product.stockQty != null ? String(product.stockQty) : '',
    minOrderQty: String(product.minOrderQty),
    isFeatured: product.isFeatured,
    isActive: product.isActive,
  };

  return (
    <>
      <PageHeader
        eyebrow="Products"
        title={product.name}
        description="Edit the details below and save."
        actions={
          product.slug && product.isActive ? (
            <a href={`/product/${product.slug}`} target="_blank" rel="noreferrer" className={buttonClass({ variant: 'secondary', size: 'sm' })}>
              <ExternalLink className="h-4 w-4" aria-hidden /> View in shop
            </a>
          ) : undefined
        }
      />
      <ProductForm mode="edit" productId={product.id} initial={initial} categories={categories} />
    </>
  );
}
