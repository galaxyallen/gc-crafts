import type { Metadata } from "next";
import { ProductPageTemplate } from "@/components/public/ProductPageTemplate";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Jewelry Trays",
  description: "Modular jewelry tray systems for retail counters.",
};

export default function TraysPage() {
  return <ProductPageTemplate category="TRAYS" tagline="Display trays & inserts" />;
}
