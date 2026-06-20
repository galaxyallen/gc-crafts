import { NextRequest, NextResponse } from "next/server";
export { dynamic } from "@/lib/api-dynamic";
import type { ProductCategory } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import { requireAuth, hasAuthSession } from "@/lib/api-auth";
import { assertHttpImageUrl, handleRouteError } from "@/lib/api-errors";
import { sanitizeString } from "@/lib/utils";
import { revalidatePublicSite } from "@/lib/revalidate-site";

function validateProductImages(images: unknown) {
  if (!Array.isArray(images)) return;
  for (const url of images) {
    if (typeof url === "string" && url) assertHttpImageUrl(url, "Product image");
  }
}

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get("category") as ProductCategory | null;
    const authed = await hasAuthSession(request);

    const products = await prisma.product.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(authed ? {} : { published: true }),
      },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(products);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireAuth(request);
  if (error) return error;

  try {
    const body = await request.json();

    if (!body.name || !body.category) {
      return NextResponse.json({ error: "Name and category are required" }, { status: 400 });
    }

    validateProductImages(body.images);

    const product = await prisma.product.create({
      data: {
        name: sanitizeString(body.name, 200),
        slug: sanitizeString(body.slug ?? body.name.toLowerCase().replace(/\s+/g, "-"), 200),
        category: body.category,
        description: sanitizeString(body.description ?? "", 5000),
        materials: sanitizeString(body.materials ?? "", 500),
        moq: sanitizeString(body.moq ?? "", 100),
        features: JSON.stringify(body.features ?? []),
        images: JSON.stringify(body.images ?? []),
        sortOrder: body.sortOrder ?? 0,
        published: body.published ?? false,
        seoTitle: body.seoTitle ? sanitizeString(body.seoTitle, 200) : null,
        seoDesc: body.seoDesc ? sanitizeString(body.seoDesc, 500) : null,
      },
    });

    revalidatePublicSite();

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}
