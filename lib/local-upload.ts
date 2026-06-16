import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const ALLOWED_EXT = new Set(["jpg", "jpeg", "png", "webp", "gif", "avif"]);

function extensionFromFile(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && ALLOWED_EXT.has(fromName)) return fromName === "jpeg" ? "jpg" : fromName;

  const fromType = file.type.split("/").pop()?.toLowerCase();
  if (fromType && ALLOWED_EXT.has(fromType)) return fromType === "jpeg" ? "jpg" : fromType;

  return "jpg";
}

export async function saveLocalUpload(file: File): Promise<string> {
  const ext = extensionFromFile(file);
  const filename = `${randomUUID()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${filename}`;
}
