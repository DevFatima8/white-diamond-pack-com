import type { NextRequest } from 'next/server';

/**
 * A tiny in-memory rate limiter (fixed window).
 *
 * It keeps a counter per key (e.g. per IP address) in a Map in server memory.
 * Limitations, which are fine for a single small Node.js server:
 *  - counters reset when the server restarts;
 *  - with several server instances each one counts separately.
 * For a bigger deployment you would move this to Redis or the database.
 */
interface Bucket {
  count: number;
  resetAt: number; // timestamp (ms) when this window ends
}

export class RateLimiter {
  private buckets = new Map<string, Bucket>();

  constructor(
    private readonly maxAttempts: number,
    private readonly windowMs: number,
  ) {}

  /** Is this key currently blocked? Returns seconds to wait, or 0 if allowed. */
  retryAfterSeconds(key: string): number {
    const bucket = this.getActiveBucket(key);
    if (!bucket || bucket.count < this.maxAttempts) return 0;
    return Math.ceil((bucket.resetAt - Date.now()) / 1000);
  }

  /** Record one (failed) attempt for this key. */
  hit(key: string): void {
    const bucket = this.getActiveBucket(key);
    if (bucket) {
      bucket.count += 1;
    } else {
      this.buckets.set(key, { count: 1, resetAt: Date.now() + this.windowMs });
    }
    this.cleanup();
  }

  /** Forget a key, e.g. after a successful login. */
  reset(key: string): void {
    this.buckets.delete(key);
  }

  private getActiveBucket(key: string): Bucket | undefined {
    const bucket = this.buckets.get(key);
    if (bucket && bucket.resetAt <= Date.now()) {
      this.buckets.delete(key);
      return undefined;
    }
    return bucket;
  }

  // Drop expired entries now and then so the Map can't grow forever.
  private cleanup(): void {
    if (this.buckets.size < 1000) return;
    const now = Date.now();
    for (const [key, bucket] of this.buckets) {
      if (bucket.resetAt <= now) this.buckets.delete(key);
    }
  }
}

/** Best-effort client IP. Behind Hostinger's proxy the real IP is in x-forwarded-for. */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}
