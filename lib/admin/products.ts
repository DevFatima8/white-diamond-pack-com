import type { Prisma } from '@prisma/client';
import type { ProductFormData } from '@/lib/validation/product';

/**
 * Turn validated form data into the columns Prisma writes.
 * Some columns are derived instead of typed by the admin:
 *  - image    = first gallery image (the "main" image)
 *  - category = the category's English name (old text column, kept in sync)
 *  - inStock  = stock > 0, or true when stock isn't tracked (empty)
 */
export function productDataFromForm(
  data: ProductFormData,
  categoryNameEn: string,
): Prisma.ProductUncheckedCreateInput {
  return {
    name: data.name,
    nameAr: data.nameAr,
    slug: data.slug,
    sku: data.sku,
    categoryId: data.categoryId,
    category: categoryNameEn,
    description: data.description,
    descriptionAr: data.descriptionAr,
    image: data.images[0],
    images: data.images,
    price: data.price,
    salePrice: data.salePrice,
    unit: data.unit,
    packing: data.packing,
    packingAr: data.packingAr,
    capacity: data.capacity,
    material: data.material,
    color: data.color,
    features: data.features,
    featuresAr: data.featuresAr,
    stockQty: data.stockQty,
    inStock: data.stockQty === null ? true : data.stockQty > 0,
    minOrderQty: data.minOrderQty,
    isFeatured: data.isFeatured,
    isActive: data.isActive,
  };
}

export const PRODUCT_UNIQUE_FIELDS = { slug: 'slug', sku: 'SKU' };
