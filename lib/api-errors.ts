import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export function apiError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export function handleRouteError(err: unknown) {
  console.error("[api]", err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return apiError("Duplicate value — slug or key already exists.", 409);
    }
    if (err.code === "P2025") {
      return apiError("Record not found.", 404);
    }
  }

  if (err instanceof Error) {
    return apiError(err.message, 500);
  }

  return apiError("Internal server error", 500);
}

export function assertHttpImageUrl(value: string, field = "Image") {
  if (value.startsWith("data:")) {
    throw new Error(`${field} must be uploaded — base64 images are too large to save. Use the upload button.`);
  }
  if (value.length > 4096) {
    throw new Error(`${field} URL is too long. Re-upload the image.`);
  }
}
