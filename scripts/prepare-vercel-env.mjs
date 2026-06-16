/**
 * Vercel Neon/Postgres integrations often inject POSTGRES_URL but not DATABASE_URL.
 * Prisma expects DATABASE_URL — map common Vercel env names before migrate/build.
 */
const aliases = [
  "POSTGRES_URL",
  "POSTGRES_URL_NON_POOLING",
  "POSTGRES_PRISMA_URL",
  "DATABASE_URL_UNPOOLED",
];

if (!process.env.DATABASE_URL) {
  for (const key of aliases) {
    if (process.env[key]) {
      process.env.DATABASE_URL = process.env[key];
      console.log(`[prepare-vercel-env] DATABASE_URL ← ${key}`);
      break;
    }
  }
}

if (!process.env.DATABASE_URL) {
  console.error(
    "[prepare-vercel-env] Missing DATABASE_URL.\n" +
      "Add it in Vercel → Project → Settings → Environment Variables,\n" +
      "or connect a Postgres store (Neon) via Storage → Connect to Project."
  );
  process.exit(1);
}
