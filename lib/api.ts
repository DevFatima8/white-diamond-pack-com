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

/** Prisma error code P2025 = "record to update/delete was not found". */
export function isNotFoundError(err: unknown): boolean {
  return typeof err === 'object' && err !== null && 'code' in err && err.code === 'P2025';
}
