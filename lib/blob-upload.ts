import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { getBlobAccess, getBlobCredentials } from "./blob-env";

const ALLOWED_EXT = new Set(["jpg", "jpeg", "png", "webp", "gif", "avif"]);

function extensionFromFile(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && ALLOWED_EXT.has(fromName)) return fromName === "jpeg" ? "jpg" : fromName;

  const fromType = file.type.split("/").pop()?.toLowerCase();
  if (fromType && ALLOWED_EXT.has(fromType)) return fromType === "jpeg" ? "jpg" : fromType;

  return "jpg";
}

function blobPutOptions(file: File) {
  const access = getBlobAccess();
  const { token, storeId, oidcToken } = getBlobCredentials();

  return {
    access,
    contentType: file.type || undefined,
    ...(token ? { token } : {}),
    ...(storeId ? { storeId } : {}),
    ...(oidcToken && !token ? { oidcToken } : {}),
  } as const;
}

export function publicBlobUrl(pathname: string) {
  return `/api/media?pathname=${encodeURIComponent(pathname)}`;
}

export async function uploadToBlob(file: File) {
  const ext = extensionFromFile(file);
  const pathname = `gc-crafts/${randomUUID()}.${ext}`;
  const access = getBlobAccess();

  const blob = await put(pathname, file, blobPutOptions(file));

  const url = access === "private" ? publicBlobUrl(blob.pathname) : blob.url;
  return { url, publicId: blob.pathname };
}
