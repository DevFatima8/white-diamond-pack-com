import { z } from 'zod';
import { imageUrlSchema, slugSchema } from './product';
import { ORDER_STATUSES } from '@/lib/orders';
import { SETTING_KEYS } from '@/data/default-settings';

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Max ${max} characters`)
    .nullish()
    .transform((v) => (v ? v : null));

// ── Categories ────────────────────────────────────────────
export const categoryFormSchema = z.object({
  nameEn: z.string().trim().min(2, 'English name is required').max(150),
  nameAr: z.string().trim().min(1, 'Arabic name is required').max(150),
  slug: slugSchema.max(120),
  descriptionEn: optionalText(2000),
  descriptionAr: optionalText(2000),
  image: imageUrlSchema.nullable(),
  isActive: z.boolean(),
});
export type CategoryFormData = z.output<typeof categoryFormSchema>;

export const categoryToggleSchema = z.object({ isActive: z.boolean() });

/** New order of categories: the full list of ids, top to bottom. */
export const categoryReorderSchema = z.object({
  ids: z.array(z.string().min(1)).min(1).max(500),
});

// ── Orders & messages ─────────────────────────────────────
export const orderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES as [string, ...string[]]),
});

export const messageReadSchema = z.object({ isRead: z.boolean() });

// ── Settings ──────────────────────────────────────────────
const wholeRupeesString = z
  .string()
  .trim()
  .regex(/^\d{1,9}$/, 'Whole rupees, numbers only');

const socialUrl = z
  .string()
  .trim()
  .max(300)
  .refine((v) => v === '' || /^https:\/\/\S+$/.test(v), 'Must start with https:// (or leave empty to hide)');

export const settingsSchema = z.object({
  [SETTING_KEYS.deliveryCharge]: wholeRupeesString,
  [SETTING_KEYS.freeDeliveryThreshold]: wholeRupeesString,
  [SETTING_KEYS.bankDetails]: z.string().trim().max(2000),
  [SETTING_KEYS.whatsappNumber]: z
    .string()
    .trim()
    .regex(/^92\d{10}$/, 'International format without +, e.g. 923216293333'),
  [SETTING_KEYS.contactPhone]: z.string().trim().min(5).max(40),
  [SETTING_KEYS.contactEmail]: z.email('Enter a valid email').max(254),
  [SETTING_KEYS.contactAddress]: z.string().trim().min(5).max(300),
  [SETTING_KEYS.socialFacebook]: socialUrl,
  [SETTING_KEYS.socialInstagram]: socialUrl,
  [SETTING_KEYS.socialLinkedin]: socialUrl,
  [SETTING_KEYS.socialYoutube]: socialUrl,
  [SETTING_KEYS.socialTiktok]: socialUrl,
});
export type SettingsFormData = z.output<typeof settingsSchema>;
