/** Detect Vercel Blob configuration (static token or OIDC on deploy). */
export function isBlobConfigured() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      process.env.BLOB_STORE_ID ||
      (process.env.VERCEL === "1" && process.env.VERCEL_ENV)
  );
}

export function getBlobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN;
}
