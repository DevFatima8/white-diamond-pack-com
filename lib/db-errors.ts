/**
 * Is this error just "the database can't be reached"? (server stopped, wrong host,
 * Docker not running…) Those are expected during outages and get a short warning;
 * anything else is a real bug and is logged in full.
 */
export function isDbUnreachable(err: unknown): boolean {
  if (typeof err !== 'object' || err === null) return false;
  const name = 'name' in err ? String(err.name) : '';
  const code = 'errorCode' in err ? String(err.errorCode) : 'code' in err ? String(err.code) : '';
  // P1001 = can't reach server, P1002 = timed out, P1017 = server closed the connection
  return name === 'PrismaClientInitializationError' || ['P1001', 'P1002', 'P1017'].includes(code);
}

/** Log a failed public-page query: one short line for an outage, the full error otherwise. */
export function logDataError(context: string, err: unknown) {
  if (isDbUnreachable(err)) console.warn(`[${context}] database unreachable — showing fallback content`);
  else console.error(`[${context}]`, err);
}
