import type { Metadata } from "next";
import { ProductPageTemplate } from "@/components/public/ProductPageTemplate";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Necklace Busts",
  description: "Premium necklace bust displays for jewelers.",
};

export default function BustsPage() {
  return <ProductPageTemplate category="BUSTS" tagline="Bust displays" />;
}
