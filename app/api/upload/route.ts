import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { uploadToBlob } from "@/lib/blob-upload";
import { isBlobConfigured } from "@/lib/blob-env";
import { saveLocalUpload } from "@/lib/local-upload";

const BLOB_SETUP_HINT =
  "Vercel Blob is not configured. In Vercel: Storage → your Blob store → Projects → Connect to gc-crafts → Redeploy.";

export async function POST(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
  }

  if (process.env.VERCEL || isBlobConfigured()) {
    try {
      const result = await uploadToBlob(file);
      return NextResponse.json(result);
    } catch (err) {
      console.error("Blob upload failed:", err);
      const message = err instanceof Error ? err.message : String(err);
      if (/token|not configured|BLOB_/i.test(message)) {
        return NextResponse.json({ error: BLOB_SETUP_HINT }, { status: 503 });
      }
      return NextResponse.json({ error: `Upload failed: ${message}` }, { status: 500 });
    }
  }

  const url = await saveLocalUpload(file);
  return NextResponse.json({ url, publicId: "local" });
}
