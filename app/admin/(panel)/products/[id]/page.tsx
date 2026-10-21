import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import db from '@/lib/db';
import { PageHeader } from '@/components/admin/ui';
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
    capacity: product.capacity ?? '',
    material: product.material ?? '',
    color: product.color ?? '',
    features: stringList(product.features),
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
        // TODO(Phase 5): add a "View in shop" link once /product/[slug] exists
      />
      <ProductForm mode="edit" productId={product.id} initial={initial} categories={categories} />
    </>
  );
}
