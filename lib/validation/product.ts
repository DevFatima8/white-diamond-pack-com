import { z } from 'zod';

/**
 * Validation rules for product data coming from the admin panel.
 *
 * zod's `z.object` keeps ONLY the keys listed here and drops everything else.
 * That is the "whitelist": a request can't sneak in fields like `id` or
 * `createdAt` and have them written to the database.
 */

// Empty string → null (clears the field). Missing (undefined) stays undefined,
// so a partial update doesn't accidentally wipe fields it didn't send.
const optionalText = (max: number) =>
  z.string().trim().max(max).nullable().optional().transform((v) => (v === '' ? null : v));

// Either a full https URL (Cloudinary) or a local path like /images/foo.png
const imageUrl = z
  .string()
  .trim()
  .min(1)
  .max(2000)
  .refine((v) => v.startsWith('/') || /^https:\/\/\S+$/.test(v), {
    message: 'Image must be an https URL or a path starting with /',
  });

const features = z.array(z.string().trim().min(1).max(100)).max(30);

const productFields = z.object({
  name: z.string().trim().min(2).max(255),
  category: z.string().trim().min(1).max(100),
  image: imageUrl,
  description: z.string().trim().min(1).max(10_000),
  packing: z.string().trim().min(1).max(255),
  capacity: optionalText(100),
  material: optionalText(100),
  color: optionalText(100),
  price: z.number().nonnegative().max(100_000_000).nullable().optional(),
  features,
  inStock: z.boolean().optional(),
});

// Create: `features` may be omitted and becomes [].
export const productCreateSchema = productFields.extend({ features: features.default([]) });

// Update: every field is optional — only the fields sent are changed.
// (Built from `productFields`, which has no defaults: in zod 4 a default would
// still be applied to a missing key and silently overwrite saved data.)
export const productUpdateSchema = productFields.partial();

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
