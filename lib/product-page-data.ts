import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import type { ProductCategory } from "@/lib/types";
import { FALLBACK_PRODUCTS } from "@/lib/fallback-products";
import { parseJson } from "@/lib/utils";

export async function getProductPageData(category: ProductCategory) {
  const dbProduct = await prisma.product.findFirst({
    where: { category, published: true },
    orderBy: { sortOrder: "asc" },
  });

  const fallback = FALLBACK_PRODUCTS[category];

  return {
    name: dbProduct?.name ?? fallback.name,
    description: dbProduct?.description ?? fallback.description,
    materials: dbProduct?.materials ?? "",
    moq: dbProduct?.moq ?? "",
    features: dbProduct ? parseJson<string[]>(dbProduct.features, fallback.features) : fallback.features,
    images: dbProduct ? parseJson<string[]>(dbProduct.images, fallback.images) : fallback.images,
    seoTitle: dbProduct?.seoTitle ?? null,
    seoDesc: dbProduct?.seoDesc ?? null,
  };
}

export async function getProductMetadata(category: ProductCategory): Promise<Metadata> {
  const data = await getProductPageData(category);
  return {
    title: data.seoTitle ?? data.name,
    description: data.seoDesc ?? data.description,
  };
}
