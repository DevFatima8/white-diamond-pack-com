/**
 * Prisma CLI configuration.
 *
 * 1. Same env files as Next.js
 *    Without this file, the Prisma CLI reads only `.env`, which points to the LIVE
 *    database, even when `.env.local` points to the local Docker database. With a
 *    config file, Prisma no longer loads env files itself, so we load them here with
 *    Next.js's own loader: `.env.local` wins over `.env`, exactly like `npm run dev`.
 *
 * 2. Safety net
 *    Commands that write to a database (db push, migrate, studio, …) are refused
 *    when DATABASE_URL is not a local database, unless ALLOW_REMOTE_DB=1 is set.
 *    Read-only and offline commands (generate, validate, format, migrate diff) always work,
 *    so `npm run build` on the server is not affected.
 */
import { loadEnvConfig } from '@next/env';
import { defineConfig } from 'prisma/config';
import { describeDatabaseUrl, isLocalDatabaseUrl, remoteDatabaseAllowed } from './lib/db-safety';

loadEnvConfig(process.cwd(), process.env.NODE_ENV !== 'production', { info: () => {}, error: console.error });

const [command, subcommand] = process.argv.slice(2).filter((arg) => !arg.startsWith('-'));
const writesToDatabase =
  (command === 'db' && ['push', 'execute', 'seed'].includes(subcommand ?? '')) ||
  (command === 'migrate' && ['dev', 'deploy', 'reset', 'resolve'].includes(subcommand ?? '')) ||
  command === 'studio';

const url = process.env.DATABASE_URL;
if (writesToDatabase && !isLocalDatabaseUrl(url) && !remoteDatabaseAllowed()) {
  throw new Error(
    `Refusing to run "prisma ${command}${subcommand ? ` ${subcommand}` : ''}" against a non-local database ` +
      `(${describeDatabaseUrl(url)}).\n` +
      'For local development, make sure .env.local sets DATABASE_URL to the Docker database.\n' +
      'If you really mean to change the remote database, re-run with ALLOW_REMOTE_DB=1.',
  );
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
});
