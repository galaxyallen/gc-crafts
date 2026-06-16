import type { ProductCategory } from "@/lib/types";

export interface FallbackProduct {
  name: string;
  description: string;
  features: string[];
  images: string[];
}

export const FALLBACK_PRODUCTS: Record<ProductCategory, FallbackProduct> = {
  DISPLAYS: {
    name: "Jewelry Displays",
    description:
      "Complete counter presentation systems — ring holders, earring stands, bracelet bars, pendant displays, and watch cushions. Every piece coordinates as a unified visual language for your retail counter.",
    features: [
      "Ring slots, earring cards, pendant hooks, bracelet rolls",
      "Full counter sets from 12 to 48 pieces",
      "Available in PU leather, microfiber, velvet, walnut, stone resin",
      "Gold, silver, or rose-gold metal accents",
      "Custom logo embossing and brand colors",
      "MOQ: 50 sets",
    ],
    images: [
      "/img/displays.webp",
      "/img/detail1.webp",
      "/img/detail2.webp",
      "/img/detail3.webp",
      "/img/detail4.jpg",
      "/img/detail5.jpg",
    ],
  },
  TRAYS: {
    name: "Jewelry Trays",
    description:
      "Stackable trays, modular inserts, and platform systems designed for flexible counter layouts. Mix and match sizes to create the perfect presentation grid.",
    features: [
      "Stackable modular tray systems",
      "Custom insert configurations",
      "Anti-slip base pads included",
      "Available in 6 standard sizes",
      "Custom dimensions on request",
      "MOQ: 100 pieces",
    ],
    images: ["/img/trays.webp", "/img/detail1.webp", "/img/detail2.webp", "/img/detail3.webp"],
  },
  BUSTS: {
    name: "Necklace Busts",
    description:
      "Half and full bust forms in every material and finish. Designed to showcase necklaces and pendants with elegant necklines that complement any jewelry style.",
    features: [
      "Half and full bust forms",
      "Adjustable height options",
      "Removable base plates",
      "Custom neck angle available",
      "Brand logo embossing",
      "MOQ: 50 pieces",
    ],
    images: ["/img/busts.jpg", "/img/detail1.webp", "/img/detail3.webp", "/img/detail4.jpg"],
  },
  WATCHES: {
    name: "Watch Displays",
    description:
      "Cushions, stands, and winder-ready presentations for luxury timepieces. Every display protects and elevates the watch while keeping it accessible for try-on.",
    features: [
      "Single and multi-watch stands",
      "Winder-compatible designs",
      "Anti-scratch interior lining",
      "Lockable security options",
      "Custom brand embossing",
      "MOQ: 50 pieces",
    ],
    images: ["/img/watches.jpg", "/img/detail1.webp", "/img/detail2.webp", "/img/detail5.jpg"],
  },
};
