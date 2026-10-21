import { z } from 'zod';
import { normalizePkMobile } from '@/lib/phone';

/**
 * Checkout + quote validation, shared by the browser forms and the API routes.
 * Error messages are KEYS (e.g. 'phone') that the forms translate into EN/AR.
 */

/** Pakistani mobile: accepts "0321-6293333", "+92 321 6293333", … and outputs "03216293333". */
export const pkMobileSchema = z
  .string()
  .trim()
  .transform((v, ctx) => {
    const normalized = normalizePkMobile(v);
    if (!normalized) {
      ctx.addIssue({ code: 'custom', message: 'phone' });
      return z.NEVER;
    }
    return normalized;
  });

const optionalEmail = z
  .string()
  .trim()
  .max(254)
  .refine((v) => v === '' || z.email().safeParse(v).success, 'email')
  .transform((v) => (v ? v.toLowerCase() : null));

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v ? v : null));

export const orderCustomerSchema = z.object({
  name: z.string().trim().min(2, 'name').max(120, 'name'),
  phone: pkMobileSchema,
  email: optionalEmail,
  city: z.string().trim().min(2, 'city').max(80, 'city'),
  address: z.string().trim().min(8, 'address').max(500, 'address'),
  notes: optionalText(1000),
});

export const orderRequestSchema = z.object({
  customer: orderCustomerSchema,
  paymentMethod: z.enum(['COD', 'BANK_TRANSFER']),
  items: z
    .array(
      z.object({
        productId: z.string().min(1).max(40),
        quantity: z.number().int().min(1).max(100_000),
      }),
    )
    .min(1)
    .max(50),
});
export type OrderRequest = z.input<typeof orderRequestSchema>;

export const quoteRequestSchema = z.object({
  name: z.string().trim().min(2, 'name').max(120, 'name'),
  phone: pkMobileSchema,
  email: optionalEmail,
  company: optionalText(150),
  message: z.string().trim().min(5, 'message').max(2000, 'message'),
  productId: z.string().max(40).optional(),
  quantity: z.number().int().min(1).max(10_000_000).optional(),
});
export type QuoteRequest = z.input<typeof quoteRequestSchema>;

/** Contact page, "Customize packaging" quote form and job applications (POST /api/contact). */
export const CONTACT_KINDS = ['contact', 'custom-packaging', 'career'] as const;
export const contactRequestSchema = z.object({
  kind: z.enum(CONTACT_KINDS),
  name: z.string().trim().min(2, 'name').max(120, 'name'),
  phone: pkMobileSchema,
  email: optionalEmail,
  company: optionalText(150),
  subject: optionalText(150), // topic / packaging type / job title (chosen from fixed lists in the forms)
  quantity: z.number().int().min(1).max(10_000_000).optional(),
  message: z.string().trim().min(5, 'message').max(3000, 'message'),
});
export type ContactRequest = z.input<typeof contactRequestSchema>;
