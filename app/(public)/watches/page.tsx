import type { Metadata } from "next";
import { ProductPageTemplate } from "@/components/public/ProductPageTemplate";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Watch Displays",
  description: "Luxury watch display stands and cushions.",
};

export default function WatchesPage() {
  return <ProductPageTemplate category="WATCHES" tagline="Watch presentation" />;
}
