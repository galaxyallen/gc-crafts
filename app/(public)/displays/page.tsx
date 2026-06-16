import type { Metadata } from "next";
import { ProductPageTemplate } from "@/components/public/ProductPageTemplate";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Jewelry Displays",
  description: "Premium jewelry counter display sets for retail jewelers.",
};

export default function DisplaysPage() {
  return <ProductPageTemplate category="DISPLAYS" tagline="Counter display sets" />;
}
