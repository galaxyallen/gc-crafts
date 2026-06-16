import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { ProductCategory } from "../lib/types";

const prisma = new PrismaClient();

const pageContents = [
  {
    section: "hero",
    title: "The silent art of presentation",
    subtitle: "Bespoke jewelry display",
    body: "We design, manufacture, and deliver premium display systems for jewelers and watchmakers who believe presentation is not an afterthought — it's the first impression.",
    image: "/img/hero-main.jpg",
  },
  {
    section: "brand_quote",
    body: "A display should never compete with its jewel. It should be felt, not seen — a presence that says this belongs here.",
  },
  {
    section: "trust_stats",
    metadata: JSON.stringify({
      stats: [
        { value: "16+", label: "Years of craft" },
        { value: "200+", label: "Brands served" },
        { value: "35", label: "Countries reached" },
        { value: "50k+", label: "Pieces delivered" },
      ],
    }),
  },
  {
    section: "oem_intro",
    title: "Your brand, our production line",
    body: "From concept sampling to mass production, our vertically integrated facility handles every stage under one roof — giving you full control with zero coordination overhead.",
  },
  {
    section: "oem_capabilities",
    metadata: JSON.stringify({
      cards: [
        { icon: "Paintbrush", title: "Custom Design", desc: "3D modeling, material sampling, and prototype iteration" },
        { icon: "Factory", title: "Own Factory", desc: "1,000m²+ with CNC, laser cutting, and finishing lines" },
        { icon: "Tag", title: "Private Label", desc: "Logo embossing, branded packaging, and custom labeling" },
        { icon: "CheckCircle", title: "Quality Assured", desc: "Five-point QC at every station. ISO-compliant processes" },
      ],
    }),
  },
  {
    section: "oem_process",
    metadata: JSON.stringify({
      steps: [
        { name: "Brief", desc: "Share your vision" },
        { name: "Design", desc: "3D renders & samples" },
        { name: "Approve", desc: "Confirm prototype" },
        { name: "Produce", desc: "Mass production + QC" },
        { name: "Deliver", desc: "Global white-glove" },
      ],
    }),
  },
  {
    section: "factory_gallery",
    metadata: JSON.stringify({
      images: [
        { url: "/img/factory.jpg", alt: "Factory floor" },
        { url: "/img/detail1.webp", alt: "Production detail" },
        { url: "/img/detail2.webp", alt: "Finishing line" },
        { url: "/img/detail3.webp", alt: "Quality control" },
      ],
    }),
  },
  {
    section: "capability_design",
    title: "Design",
    body: "Your brief becomes a photorealistic 3D render within days. We iterate until the material palette, proportions, and brand language are exactly right.",
    image: "/img/detail1.webp",
  },
  {
    section: "capability_manufacture",
    title: "Manufacture",
    body: "Precision CNC cutting, hand-wrapped surfaces, and a five-point inspection at every station. Our production line — not a subcontractor's.",
    image: "/img/factory.jpg",
  },
  {
    section: "capability_deliver",
    title: "Deliver",
    body: "Individually cushioned, foam-locked packaging. White-glove shipping to 35 countries — tracked, insured, on schedule.",
    image: "/img/detail3.webp",
  },
  {
    section: "page_contact",
    title: "Let's create something, extraordinary",
    subtitle: "Get in touch",
    body: "Whether you're looking for standard products or a fully custom OEM solution, we'd love to hear from you.",
    image: "/img/hero-main.jpg",
  },
];

const factoryStats = [
  { key: "facility_size", value: "1,000+", label: "m² facility" },
  { key: "workers", value: "50+", label: "Skilled workers" },
  { key: "lead_time", value: "15", label: "Days avg. lead time" },
  { key: "moq", value: "50", label: "Sets min. order" },
];

const materials = [
  { name: "PU Leather", subtitle: "12 colorways", image: "/img/detail1.webp", sortOrder: 1 },
  { name: "Microfiber Suede", subtitle: "8 colorways", image: "/img/detail2.webp", sortOrder: 2 },
  { name: "Solid Walnut", subtitle: "Natural grain", image: "/img/detail3.webp", sortOrder: 3 },
  { name: "Brushed Brass", subtitle: "Gold / Rose / Silver", image: "/img/detail4.jpg", sortOrder: 4 },
  { name: "Stone Resin", subtitle: "Wabi-sabi texture", image: "/img/detail5.jpg", sortOrder: 5 },
  { name: "Velvet", subtitle: "6 colorways", image: "/img/busts.jpg", sortOrder: 6 },
  { name: "Belgian Linen", subtitle: "Natural / Dyed", image: "/img/trays.webp", sortOrder: 7 },
  { name: "Piano Lacquer", subtitle: "High-gloss black", image: "/img/watches.jpg", sortOrder: 8 },
  { name: "Alcantara", subtitle: "Ultra-soft finish", image: "/img/displays.webp", sortOrder: 9 },
];

const settings = [
  { key: "company_name", value: "GC CRAFTS" },
  { key: "email", value: "hello@gccrafts.com" },
  { key: "whatsapp", value: "+852 xxxx xxxx" },
  { key: "instagram", value: "https://instagram.com/gccrafts" },
  { key: "linkedin", value: "https://linkedin.com/company/gccrafts" },
  { key: "address_1", value: "Guangzhou, Guangdong, China" },
  { key: "address_2", value: "Hong Kong SAR, China" },
  { key: "notification_email", value: "hello@gccrafts.com" },
];

const products = [
  {
    category: "DISPLAYS" as ProductCategory,
    name: "Jewelry Displays",
    slug: "jewelry-displays",
    description: "Complete counter presentation systems — ring holders, earring stands, bracelet bars, pendant displays, and watch cushions. Every piece coordinates as a unified visual language for your retail counter.",
    materials: "PU leather, microfiber, velvet, walnut, stone resin",
    moq: "50 sets",
    features: [
      "Ring slots, earring cards, pendant hooks, bracelet rolls",
      "Full counter sets from 12 to 48 pieces",
      "Available in PU leather, microfiber, velvet, walnut, stone resin",
      "Gold, silver, or rose-gold metal accents",
      "Custom logo embossing and brand colors",
      "MOQ: 50 sets",
    ],
    images: ["/img/displays.webp", "/img/detail1.webp", "/img/detail2.webp", "/img/detail3.webp", "/img/detail4.jpg", "/img/detail5.jpg"],
    sortOrder: 1,
    published: true,
    seoTitle: "Jewelry Displays — GC CRAFTS",
    seoDesc: "Premium jewelry counter display sets for retail jewelers.",
  },
  {
    category: "TRAYS" as ProductCategory,
    name: "Jewelry Trays",
    slug: "jewelry-trays",
    description: "Stackable trays, modular inserts, and platform systems designed for flexible counter layouts. Mix and match sizes to create the perfect presentation grid.",
    materials: "PU leather, microfiber suede, velvet, Belgian linen",
    moq: "100 pieces",
    features: [
      "Stackable modular tray systems",
      "Custom insert configurations",
      "Anti-slip base pads included",
      "Available in 6 standard sizes",
      "Custom dimensions on request",
      "MOQ: 100 pieces",
    ],
    images: ["/img/trays.webp", "/img/detail1.webp", "/img/detail2.webp", "/img/detail3.webp"],
    sortOrder: 2,
    published: true,
    seoTitle: "Jewelry Trays — GC CRAFTS",
    seoDesc: "Modular jewelry tray systems for retail counters.",
  },
  {
    category: "BUSTS" as ProductCategory,
    name: "Necklace Busts",
    slug: "necklace-busts",
    description: "Half and full bust forms in every material and finish. Designed to showcase necklaces and pendants with elegant necklines that complement any jewelry style.",
    materials: "PU leather, velvet, microfiber, stone resin",
    moq: "50 pieces",
    features: [
      "Half and full bust forms",
      "Adjustable height options",
      "Removable base plates",
      "Custom neck angle available",
      "Brand logo embossing",
      "MOQ: 50 pieces",
    ],
    images: ["/img/busts.jpg", "/img/detail1.webp", "/img/detail3.webp", "/img/detail4.jpg"],
    sortOrder: 3,
    published: true,
    seoTitle: "Necklace Busts — GC CRAFTS",
    seoDesc: "Premium necklace bust displays for jewelers.",
  },
  {
    category: "WATCHES" as ProductCategory,
    name: "Watch Displays",
    slug: "watch-displays",
    description: "Cushions, stands, and winder-ready presentations for luxury timepieces. Every display protects and elevates the watch while keeping it accessible for try-on.",
    materials: "PU leather, microfiber, brushed brass accents",
    moq: "50 pieces",
    features: [
      "Single and multi-watch stands",
      "Winder-compatible designs",
      "Anti-scratch interior lining",
      "Lockable security options",
      "Custom brand embossing",
      "MOQ: 50 pieces",
    ],
    images: ["/img/watches.jpg", "/img/detail1.webp", "/img/detail2.webp", "/img/detail5.jpg"],
    sortOrder: 4,
    published: true,
    seoTitle: "Watch Displays — GC CRAFTS",
    seoDesc: "Luxury watch display stands and cushions.",
  },
];

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@gccrafts.com";
  const password = process.env.ADMIN_PASSWORD ?? "admin123456";
  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.admin.upsert({
    where: { email },
    update: { password: hashedPassword },
    create: { email, password: hashedPassword, name: "Admin" },
  });

  for (const content of pageContents) {
    await prisma.pageContent.upsert({
      where: { section: content.section },
      update: content,
      create: content,
    });
  }

  for (const stat of factoryStats) {
    await prisma.factoryStat.upsert({
      where: { key: stat.key },
      update: stat,
      create: stat,
    });
  }

  for (const material of materials) {
    const existing = await prisma.material.findFirst({ where: { sortOrder: material.sortOrder } });
    if (existing) {
      await prisma.material.update({ where: { id: existing.id }, data: material });
    } else {
      await prisma.material.create({ data: material });
    }
  }

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting,
    });
  }

  for (const product of products) {
    const { features, images, ...rest } = product;
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        ...rest,
        features: JSON.stringify(features),
        images: JSON.stringify(images),
      },
      create: {
        ...rest,
        features: JSON.stringify(features),
        images: JSON.stringify(images),
      },
    });
  }

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
