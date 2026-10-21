import { NextResponse } from 'next/server';
import db from '@/lib/db';

// Public health check. It only says whether the database answers —
// the real error is logged on the server, never sent to the browser.
export async function GET() {
  let dbStatus: 'connected' | 'unreachable' = 'unreachable';
  try {
    await db.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (err) {
    console.error('[health] database check failed:', err);
  }

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbStatus,
  });
}
