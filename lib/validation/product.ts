import { z } from 'zod';

/**
 * Validation for the admin product form. The SAME schema is used:
 *  - in the browser, to show errors next to each field before submitting;
 *  - on the server (/api/admin/products), which is the check that really matters,
 *    because anyone can send a request without using our form.
 *
 * `z.object` keeps only the keys listed here, so unknown fields (id, createdAt…)
 * can never reach the database. Prices are whole PKR.
 */

// "" → null, so clearing an optional field really clears it in the database.
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Max ${max} characters`)
    .nullish()
    .transform((v) => (v ? v : null));

export const imageUrlSchema = z
  .string()
  .trim()
  .min(1)
  .max(2000)
  .refine((v) => v.startsWith('/') || /^https:\/\/\S+$/.test(v), {
    message: 'Image must be an https URL or a path starting with /',
  });

export const slugSchema = z
  .string()
  .trim()
  .min(2, 'At least 2 characters')
  .max(191)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Only lowercase letters, numbers and single dashes');

const rupees = (label: string) =>
  z
    .number({ error: `${label} must be a number` })
    .int(`${label} must be whole rupees`)
    .min(0, `${label} can't be negative`)
    .max(100_000_000, `${label} is too large`);

export const productFormSchema = z
  .object({
    name: z.string().trim().min(2, 'Name is required').max(255),
    nameAr: optionalText(255),
    slug: slugSchema,
    sku: optionalText(64),
    categoryId: z.string().trim().min(1, 'Choose a category'),
    description: z.string().trim().min(1, 'Description is required').max(10_000),
    descriptionAr: optionalText(10_000),
    images: z.array(imageUrlSchema).min(1, 'Add at least one image').max(10, 'Max 10 images'),
    price: rupees('Price'),
    salePrice: rupees('Sale price').nullable(),
    unit: z.string().trim().min(1, 'Unit is required').max(50),
    packing: z.string().trim().min(1, 'Packing is required').max(255),
    packingAr: optionalText(255),
    capacity: optionalText(100),
    material: optionalText(100),
    color: optionalText(100),
    features: z.array(z.string().trim().min(1).max(100)).max(30, 'Max 30 features'),
    featuresAr: z.array(z.string().trim().min(1).max(100)).max(30, 'Max 30 features'),
    stockQty: z.number().int('Whole number').min(0, "Can't be negative").max(10_000_000).nullable(),
    minOrderQty: z.number().int('Whole number').min(1, 'At least 1').max(100_000),
    isFeatured: z.boolean(),
    isActive: z.boolean(),
  })
  .refine((p) => p.salePrice === null || p.salePrice < p.price, {
    path: ['salePrice'],
    message: 'Sale price must be lower than the price',
  });

export type ProductFormInput = z.input<typeof productFormSchema>;
export type ProductFormData = z.output<typeof productFormSchema>;

/** Quick on/off switches from the products table. */
export const productToggleSchema = z
  .object({ isFeatured: z.boolean().optional(), isActive: z.boolean().optional() })
  .refine((v) => v.isFeatured !== undefined || v.isActive !== undefined, 'Nothing to update');
