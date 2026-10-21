import type { Metadata } from 'next';
import db from '@/lib/db';
import { PageHeader } from '@/components/admin/ui';
import ProductForm, { EMPTY_PRODUCT } from '@/components/admin/ProductForm';

export const metadata: Metadata = { title: 'New product' };

export default async function NewProductPage() {
  const categories = await db.category.findMany({
    orderBy: { sortOrder: 'asc' },
    select: { id: true, nameEn: true, isActive: true },
  });

  return (
    <>
      <PageHeader eyebrow="Products" title="Add a new product" description="Fields marked * are required." />
      <ProductForm mode="create" initial={EMPTY_PRODUCT} categories={categories} />
    </>
  );
}
