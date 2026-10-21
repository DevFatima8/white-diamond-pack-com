/**
 * Load env files exactly like `next dev` does (.env.local wins over .env).
 * Import this FIRST in any standalone script that uses the database, before
 * anything creates a PrismaClient. (Prisma's own fallback reads only `.env`,
 * which points to the live database.)
 */
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd(), process.env.NODE_ENV !== 'production', {
  info: () => {},
  error: console.error,
});
