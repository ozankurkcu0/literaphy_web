import "server-only";

/**
 * Basit, süreç-içi (in-memory) giriş deneme sınırlayıcı. Vercel'in
 * serverless ortamında zaman zaman birden fazla instance çalışabildiği
 * için mükemmel/dağıtık bir koruma değil — bu ölçekte ekstra bir Redis/DB
 * kurmaya değmez, ama tek instance'ta art arda şifre denemesini fiilen
 * zorlaştırıyor ve rastgele denemeleri caydırıyor.
 */
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 dakika içinde
const LOCKOUT_MS = 15 * 60 * 1000; // ...5 hatadan sonra 15 dakika kilit

interface Bucket {
  count: number;
  windowStart: number;
  lockedUntil: number | null;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
}

export function checkLoginRateLimit(key: string): RateLimitResult {
  const bucket = buckets.get(key);
  if (!bucket?.lockedUntil) return { allowed: true };

  const now = Date.now();
  if (bucket.lockedUntil <= now) return { allowed: true };

  return { allowed: false, retryAfterSeconds: Math.ceil((bucket.lockedUntil - now) / 1000) };
}

export function recordFailedLoginAttempt(key: string): void {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.windowStart > WINDOW_MS) {
    buckets.set(key, { count: 1, windowStart: now, lockedUntil: null });
    return;
  }

  const count = bucket.count + 1;
  buckets.set(key, {
    count,
    windowStart: bucket.windowStart,
    lockedUntil: count >= MAX_ATTEMPTS ? now + LOCKOUT_MS : null,
  });
}

export function resetLoginRateLimit(key: string): void {
  buckets.delete(key);
}
