import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { assertHttpImageUrl, handleRouteError } from "@/lib/api-errors";
import { sanitizeString } from "@/lib/utils";

type RouteParams = { params: { id: string } };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();

    if (Array.isArray(body.images)) {
      for (const url of body.images) {
        if (typeof url === "string" && url) assertHttpImageUrl(url, "Product image");
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(body.name && { name: sanitizeString(body.name, 200) }),
        ...(body.slug && { slug: sanitizeString(body.slug, 200) }),
        ...(body.category && { category: body.category }),
        ...(body.description !== undefined && { description: sanitizeString(body.description, 5000) }),
        ...(body.materials !== undefined && { materials: sanitizeString(body.materials, 500) }),
        ...(body.moq !== undefined && { moq: sanitizeString(body.moq, 100) }),
        ...(body.features !== undefined && { features: JSON.stringify(body.features) }),
        ...(body.images !== undefined && { images: JSON.stringify(body.images) }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
        ...(body.published !== undefined && { published: body.published }),
        ...(body.seoTitle !== undefined && { seoTitle: body.seoTitle ? sanitizeString(body.seoTitle, 200) : null }),
        ...(body.seoDesc !== undefined && { seoDesc: body.seoDesc ? sanitizeString(body.seoDesc, 500) : null }),
      },
    });

    return NextResponse.json(product);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleRouteError(err);
  }
}
