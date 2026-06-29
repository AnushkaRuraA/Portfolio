/**
 * Tiny in-memory rate limiter for the /mod login route.
 *
 * Note: in a serverless environment this is per-instance (not globally shared),
 * so it's a basic brute-force speed bump rather than a hard guarantee. For
 * stronger protection across instances you'd back this with Redis/Upstash.
 * For a single-admin portfolio it's sufficient.
 */

interface Attempt {
  count: number;
  firstAt: number;
  blockedUntil: number;
}

declare global {
  // eslint-disable-next-line no-var
  var _loginAttempts: Map<string, Attempt> | undefined;
}

const attempts: Map<string, Attempt> =
  global._loginAttempts ?? new Map<string, Attempt>();
if (!global._loginAttempts) global._loginAttempts = attempts;

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 6;
const BLOCK_MS = 15 * 60 * 1000;

export function checkRateLimit(key: string): {
  allowed: boolean;
  retryAfterSec?: number;
} {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry) return { allowed: true };

  if (entry.blockedUntil > now) {
    return { allowed: false, retryAfterSec: Math.ceil((entry.blockedUntil - now) / 1000) };
  }

  // Reset the window if it has elapsed.
  if (now - entry.firstAt > WINDOW_MS) {
    attempts.delete(key);
    return { allowed: true };
  }

  return { allowed: true };
}

/** Call after a FAILED login attempt. */
export function registerFailure(key: string): void {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now - entry.firstAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAt: now, blockedUntil: 0 });
    return;
  }

  entry.count += 1;
  if (entry.count >= MAX_ATTEMPTS) {
    entry.blockedUntil = now + BLOCK_MS;
  }
  attempts.set(key, entry);
}

/** Call after a SUCCESSFUL login to clear the counter. */
export function clearAttempts(key: string): void {
  attempts.delete(key);
}

// ── Generic fixed-window limiter (e.g. contact form) ──────────
interface Bucket {
  count: number;
  resetAt: number;
}

declare global {
  // eslint-disable-next-line no-var
  var _rateBuckets: Map<string, Bucket> | undefined;
}

const buckets: Map<string, Bucket> =
  global._rateBuckets ?? new Map<string, Bucket>();
if (!global._rateBuckets) global._rateBuckets = buckets;

/**
 * Allow at most `max` hits per `windowMs` for a given key. Returns whether the
 * request is allowed and, if not, when to retry.
 */
export function rateLimit(
  key: string,
  max: number,
  windowMs: number
): { allowed: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (bucket.count >= max) {
    return { allowed: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { allowed: true };
}
