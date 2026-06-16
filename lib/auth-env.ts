/** Ensure NextAuth env vars work on Vercel without manual NEXTAUTH_URL when using *.vercel.app */
export function ensureAuthEnv() {
  if (!process.env.NEXTAUTH_URL && process.env.VERCEL_URL) {
    process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
  }
  if (!process.env.AUTH_TRUST_HOST) {
    process.env.AUTH_TRUST_HOST = "true";
  }
}

export function getNextAuthSecret() {
  return process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
}
