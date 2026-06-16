import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/utils";
import { HomeEffects } from "@/components/public/HomeEffects";
import { HeroSection } from "@/components/public/HeroSection";
import { ProductGrid } from "@/components/public/ProductGrid";
import { CapabilitySection } from "@/components/public/CapabilitySection";
import { OemPreview } from "@/components/public/OemPreview";
import { MaterialScroll } from "@/components/public/MaterialScroll";
import { TrustStats } from "@/components/public/TrustStats";
import { InquiryCta } from "@/components/public/InquiryCta";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "GC CRAFTS — Bespoke Jewelry Display",
  description:
    "We design, manufacture, and deliver premium display systems for jewelers and watchmakers who believe presentation is the first impression.",
};

async function getHomeData() {
  const [contents, materials, factoryStats, products, settingsRows] = await Promise.all([
    prisma.pageContent.findMany(),
    prisma.material.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.factoryStat.findMany(),
    prisma.product.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    prisma.setting.findMany(),
  ]);

  const contentMap = Object.fromEntries(contents.map((c) => [c.section, c]));
  const settings = Object.fromEntries(settingsRows.map((r) => [r.key, r.value]));

  const productImages: Record<string, string> = {};
  for (const product of products) {
    const images = parseJson<string[]>(product.images, []);
    const slug = product.category.toLowerCase();
    if (images[0]) productImages[slug] = images[0];
  }

  const trustMeta = parseJson<{ stats: { value: string; label: string }[] }>(
    contentMap.trust_stats?.metadata,
    { stats: [] }
  );

  const oemCards = parseJson<{ cards: { icon: string; title: string; desc: string }[] }>(
    contentMap.oem_capabilities?.metadata,
    { cards: [] }
  );

  return {
    hero: contentMap.hero,
    brandQuote: contentMap.brand_quote,
    trustStats: trustMeta.stats,
    oemIntro: contentMap.oem_intro,
    oemCards: oemCards.cards,
    factoryStats: factoryStats.map((s) => ({ value: s.value, label: s.label })),
    capabilityDesign: contentMap.capability_design,
    capabilityManufacture: contentMap.capability_manufacture,
    capabilityDeliver: contentMap.capability_deliver,
    materials,
    productImages,
    settings,
  };
}

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <>
      <HomeEffects />
      <HeroSection
        title={data.hero?.title}
        subtitle={data.hero?.subtitle}
        body={data.hero?.body}
        image={data.hero?.image}
      />
      <ProductGrid images={data.productImages} />
      <CapabilitySection
        design={{
          title: data.capabilityDesign?.title,
          body: data.capabilityDesign?.body,
          image: data.capabilityDesign?.image,
        }}
        manufacture={{
          title: data.capabilityManufacture?.title,
          body: data.capabilityManufacture?.body,
          image: data.capabilityManufacture?.image,
        }}
        deliver={{
          title: data.capabilityDeliver?.title,
          body: data.capabilityDeliver?.body,
          image: data.capabilityDeliver?.image,
        }}
      />
      <OemPreview
        title={data.oemIntro?.title}
        body={data.oemIntro?.body}
        cards={data.oemCards}
        stats={data.factoryStats}
      />
      <MaterialScroll materials={data.materials} />
      <TrustStats quote={data.brandQuote?.body} stats={data.trustStats} />
      <InquiryCta settings={data.settings} />
    </>
  );
}
