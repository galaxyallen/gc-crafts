import { get } from "@vercel/blob";
import { NextRequest } from "next/server";
export { dynamic } from "@/lib/api-dynamic";
import { getBlobAccess, getBlobCredentials } from "@/lib/blob-env";

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get("pathname");
  if (!pathname) {
    return new Response("Missing pathname", { status: 400 });
  }

  const access = getBlobAccess();
  const { token, storeId, oidcToken } = getBlobCredentials();

  try {
    const result = await get(pathname, {
      access,
      ...(token ? { token } : {}),
      ...(storeId ? { storeId } : {}),
      ...(oidcToken && !token ? { oidcToken } : {}),
    });

    if (!result) {
      return new Response("Not found", { status: 404 });
    }

    const { stream, blob } = result;

    return new Response(stream, {
      headers: {
        "Content-Type": blob.contentType ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("Blob media fetch failed:", err);
    return new Response("Not found", { status: 404 });
  }
}
