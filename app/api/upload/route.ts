import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { uploadToBlob } from "@/lib/blob-upload";
import { saveLocalUpload } from "@/lib/local-upload";

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

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const result = await uploadToBlob(file);
      return NextResponse.json(result);
    } catch (err) {
      console.error("Blob upload failed:", err);
      return NextResponse.json({ error: "Failed to upload to Vercel Blob" }, { status: 500 });
    }
  }

  if (process.env.VERCEL) {
    return NextResponse.json(
      {
        error:
          "Vercel Blob is not configured. Create a Blob store in Vercel Storage and connect it to this project.",
      },
      { status: 503 }
    );
  }

  const url = await saveLocalUpload(file);
  return NextResponse.json({ url, publicId: "local" });
}
