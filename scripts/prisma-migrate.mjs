/**
 * Run Prisma migrations using a direct (non-pooled) Postgres URL.
 * Neon/PgBouncer pooled connections cannot acquire pg_advisory_lock reliably.
 */
import { execSync } from "node:child_process";

const unpooled =
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.PGHOST_UNPOOLED;

if (unpooled) {
  process.env.DATABASE_URL = unpooled;
  console.log("[prisma-migrate] Using direct (non-pooled) DATABASE_URL for migrate deploy");
} else {
  console.warn(
    "[prisma-migrate] No unpooled URL found; migrate may fail on pooled Neon connections"
  );
}

execSync("npx prisma migrate deploy", { stdio: "inherit" });
