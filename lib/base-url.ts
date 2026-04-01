// Server-only helper for building absolute URLs during SSR/build time.
// Vercel exposes `VERCEL_URL` without a scheme, so we normalize it here.

export function getBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.BASE_URL ||
    process.env.VERCEL_URL ||
    "";

  if (!raw) return "http://localhost:3000";

  let base = raw.trim().replace(/\/+$/, "");

  if (/^https?:\/\//i.test(base)) return base;

  const isLocal =
    base.startsWith("localhost") ||
    base.startsWith("127.0.0.1") ||
    base.startsWith("0.0.0.0");

  return `${isLocal ? "http" : "https"}://${base}`;
}

