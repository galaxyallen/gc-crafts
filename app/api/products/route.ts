import { NextRequest, NextResponse } from "next/server";
import type { ProductCategory } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { sanitizeString } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category") as ProductCategory | null;

  const products = await prisma.product.findMany({
    where: category ? { category } : undefined,
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const body = await request.json();

  if (!body.name || !body.category) {
    return NextResponse.json({ error: "Name and category are required" }, { status: 400 });
  }

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

  return NextResponse.json(product, { status: 201 });
}
