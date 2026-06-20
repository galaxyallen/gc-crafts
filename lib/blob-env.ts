export type BlobAccess = "public" | "private";

/** Detect Vercel Blob configuration (token, store id, or Vercel OIDC on deploy). */
export function isBlobConfigured() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      process.env.BLOB_STORE_ID ||
      process.env.VERCEL === "1"
  );
}

export function getBlobAccess(): BlobAccess {
  const access = process.env.BLOB_ACCESS?.toLowerCase();
  if (access === "private" || access === "public") return access;
  // Stores connected via BLOB_STORE_ID (Vercel OIDC) are typically private.
  if (process.env.BLOB_STORE_ID) return "private";
  return "public";
}

export function getBlobCredentials() {
  return {
    token: process.env.BLOB_READ_WRITE_TOKEN,
    storeId: process.env.BLOB_STORE_ID,
    oidcToken: process.env.VERCEL_OIDC_TOKEN,
  };
}
