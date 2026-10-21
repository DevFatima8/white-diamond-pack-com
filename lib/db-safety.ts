/**
 * Helpers that stop development tools from touching the LIVE database by accident.
 * Used by prisma.config.ts and scripts/seed.ts. (Not used by the running website.)
 */

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);

export function isLocalDatabaseUrl(url: string | undefined): boolean {
  if (!url) return false;
  try {
    return LOCAL_HOSTS.has(new URL(url).hostname);
  } catch {
    return false;
  }
}

/** "mysql://user:pass@host:3306/db" → "host:3306/db" — never prints the password. */
export function describeDatabaseUrl(url: string | undefined): string {
  if (!url) return '(DATABASE_URL is not set)';
  try {
    const u = new URL(url);
    return `${u.hostname}${u.port ? `:${u.port}` : ''}${u.pathname}`;
  } catch {
    return '(unparseable DATABASE_URL)';
  }
}

/** Set ALLOW_REMOTE_DB=1 to deliberately run a dangerous command against a non-local database. */
export function remoteDatabaseAllowed(): boolean {
  return process.env.ALLOW_REMOTE_DB === '1';
}
