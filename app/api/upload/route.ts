import { NextRequest, NextResponse } from "next/server";

export { dynamic } from "@/lib/api-dynamic";

import { requireAuth } from "@/lib/api-auth";

import { uploadToBlob } from "@/lib/blob-upload";

import { isBlobConfigured } from "@/lib/blob-env";

import { saveLocalUpload } from "@/lib/local-upload";
import { revalidatePublicSite } from "@/lib/revalidate-site";



const BLOB_SETUP_HINT =

  "Vercel Blob is not configured. Create a Blob store in Vercel Storage, open it → Projects → Connect to gc-crafts, then Redeploy. If the store is Private, also add BLOB_ACCESS=private.";



function isBlobCredentialError(message: string) {

  return /no blob credentials|no read-write token|not configured|BLOB_READ_WRITE_TOKEN|BLOB_STORE_ID|oidcToken/i.test(

    message

  );

}



export async function POST(request: NextRequest) {

  const { error } = await requireAuth(request);

  if (error) return error;



  const formData = await request.formData();

  const file = formData.get("file") as File | null;



  if (!file) {

    return NextResponse.json({ error: "No file provided" }, { status: 400 });

  }



  if (!file.type.startsWith("image/")) {

    return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });

  }



  if (process.env.VERCEL === "1" || isBlobConfigured()) {

    try {

      const result = await uploadToBlob(file);
      revalidatePublicSite();
      return NextResponse.json(result);

    } catch (err) {

      console.error("Blob upload failed:", err);

      const message = err instanceof Error ? err.message : String(err);

      if (isBlobCredentialError(message)) {

        return NextResponse.json({ error: BLOB_SETUP_HINT }, { status: 503 });

      }

      return NextResponse.json({ error: `Upload failed: ${message}` }, { status: 500 });

    }

  }



  const url = await saveLocalUpload(file);

  return NextResponse.json({ url, publicId: "local" });

}

