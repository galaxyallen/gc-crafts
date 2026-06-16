import { put } from "@vercel/blob";
import { randomUUID } from "crypto";

const ALLOWED_EXT = new Set(["jpg", "jpeg", "png", "webp", "gif", "avif"]);

function extensionFromFile(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && ALLOWED_EXT.has(fromName)) return fromName === "jpeg" ? "jpg" : fromName;

  const fromType = file.type.split("/").pop()?.toLowerCase();
  if (fromType && ALLOWED_EXT.has(fromType)) return fromType === "jpeg" ? "jpg" : fromType;

  return "jpg";
}

export async function uploadToBlob(file: File) {
  const ext = extensionFromFile(file);
  const pathname = `gc-crafts/${randomUUID()}.${ext}`;

  const blob = await put(pathname, file, {
    access: "public",
    contentType: file.type || undefined,
  });

  return { url: blob.url, publicId: blob.pathname };
}
