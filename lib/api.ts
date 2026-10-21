import { NextResponse } from 'next/server';
import { z } from 'zod';

/** 400 response listing which fields failed validation, e.g. { fieldErrors: { name: ['Too short'] } }. */
export function validationError(error: z.ZodError) {
  return NextResponse.json(
    { success: false, error: 'Invalid input', details: z.flattenError(error) },
    { status: 400 },
  );
}

/**
 * 500 response with a generic message. The real error is logged on the server only,
 * so database details or stack traces never reach the browser.
 */
export function serverError(
  context: string,
  err: unknown,
  message = 'Something went wrong',
  status = 500, // use 503 "Service Unavailable" when the database can't be reached
) {
  console.error(`[${context}]`, err);
  return NextResponse.json({ success: false, error: message }, { status });
}

/**
 * Prisma error P2002 = a UNIQUE column already has this value (e.g. slug or sku).
 * Returns a 409 response with a field error, or null if it's a different error.
 */
export function uniqueConflict(err: unknown, labels: Record<string, string>) {
  if (typeof err !== 'object' || err === null || !('code' in err) || err.code !== 'P2002') return null;
  const meta = 'meta' in err ? (err.meta as { target?: unknown } | undefined) : undefined;
  const target = Array.isArray(meta?.target) ? meta.target.join(',') : String(meta?.target ?? '');
  const field = Object.keys(labels).find((f) => target.includes(f));
  const fieldErrors = field ? { [field]: [`This ${labels[field]} is already used by another item`] } : {};
  return NextResponse.json(
    { success: false, error: 'Already exists', details: { formErrors: field ? [] : ['Duplicate value'], fieldErrors } },
    { status: 409 },
  );
}

/** Prisma error code P2025 = "record to update/delete was not found". */
export function isNotFoundError(err: unknown): boolean {
  return typeof err === 'object' && err !== null && 'code' in err && err.code === 'P2025';
}
