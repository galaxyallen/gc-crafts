import type { PageContent, Product } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ProductCategory } from "@/lib/types";
import { CATEGORY_ROUTES, PRODUCT_CATEGORIES } from "@/lib/types";
import { parseJson } from "@/lib/utils";

export async function getSettingsMap() {
  const rows = await prisma.setting.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export async function getContentMap(sections?: string[]) {
  const contents = sections
    ? await prisma.pageContent.findMany({ where: { section: { in: sections } } })
    : await prisma.pageContent.findMany();
  return Object.fromEntries(contents.map((c) => [c.section, c])) as Record<string, PageContent>;
}

export async function getFactoryStats() {
  return prisma.factoryStat.findMany({ orderBy: { key: "asc" } });
}

export function categorySlug(category: ProductCategory | string) {
  return category.toLowerCase();
}

/** First published product per category (lowest sortOrder). */
export function productsByCategory(products: Product[]) {
  const map = new Map<ProductCategory, Product>();
  for (const product of products) {
    const cat = product.category as ProductCategory;
    if (!map.has(cat)) map.set(cat, product);
  }
  return map;
}

export function productCardFromDb(product: Product | undefined, category: ProductCategory, index: number) {
  const images = product ? parseJson<string[]>(product.images, []) : [];
  const defaults = CATEGORY_CARD_DEFAULTS[category];

  return {
    slug: categorySlug(category),
    num: String(index + 1).padStart(2, "0"),
    name: product?.name ?? defaults.name,
    sub: product?.description ? truncate(product.description, 100) : defaults.sub,
    image: images[0] ?? defaults.image,
    href: CATEGORY_ROUTES[category],
  };
}

export function buildProductCards(products: Product[]) {
  const byCategory = productsByCategory(products);
  return PRODUCT_CATEGORIES.map((category, index) =>
    productCardFromDb(byCategory.get(category), category, index)
  );
}

function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}…`;
}

const CATEGORY_CARD_DEFAULTS: Record<
  ProductCategory,
  { name: string; sub: string; image: string }
> = {
  DISPLAYS: {
    name: "Jewelry Displays",
    sub: "Complete counter sets — rings, earrings, bracelets, pendants",
    image: "/img/displays.webp",
  },
  TRAYS: {
    name: "Jewelry Trays",
    sub: "Stackable trays, inserts, and modular platforms",
    image: "/img/trays.webp",
  },
  BUSTS: {
    name: "Necklace Busts",
    sub: "Half and full busts in every material and finish",
    image: "/img/busts.jpg",
  },
  WATCHES: {
    name: "Watch Displays",
    sub: "Cushions, stands, and winder-ready presentations",
    image: "/img/watches.jpg",
  },
};
