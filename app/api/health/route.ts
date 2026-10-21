import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  let dbStatus = 'disconnected';
  try {
    // Attempt quick query to test DB connectivity
    await db.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (err: any) {
    dbStatus = `unreachable (${err.message || 'connection error'})`;
  }

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: {
      type: process.env.DB_CONNECTION || 'mysql',
      status: dbStatus,
    },
  });
}
