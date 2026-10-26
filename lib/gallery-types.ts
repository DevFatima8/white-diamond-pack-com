import { z } from 'zod';

/**
 * Photo gallery (About page → "Our plant" section), managed in Admin → Gallery.
 * Stored as JSON in the `settings` table under GALLERY_SETTING_KEY, so the live
 * database needed no new table. Browser-safe file (no database import).
 */
export const GALLERY_SETTING_KEY = 'gallery_items';

export const GALLERY_GROUPS = ['office', 'production', 'products'] as const;
export type GalleryGroup = (typeof GALLERY_GROUPS)[number];

export const GALLERY_GROUP_LABEL: Record<GalleryGroup, string> = {
  office: 'Office',
  production: 'Production',
  products: 'Finished products',
};

const imageUrl = z
  .string()
  .trim()
  .min(1)
  .max(2000)
  .refine((v) => v.startsWith('/') || /^https:\/\/\S+$/.test(v), 'Image must be an https URL or a path starting with /');

export const galleryItemSchema = z.object({
  id: z.string().trim().min(1).max(40),
  image: imageUrl,
  caption: z.string().trim().max(120),
  captionAr: z.string().trim().max(120),
  group: z.enum(GALLERY_GROUPS),
});
export const gallerySchema = z.array(galleryItemSchema).max(80, 'Max 80 photos');

export type GalleryItem = z.infer<typeof galleryItemSchema>;
