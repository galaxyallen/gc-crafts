import { ProductPageTemplate } from "@/components/public/ProductPageTemplate";
import { getProductMetadata } from "@/lib/product-page-data";

export const revalidate = 3600;

export async function generateMetadata() {
  return getProductMetadata("BUSTS");
}

export default function BustsPage() {
  return <ProductPageTemplate category="BUSTS" tagline="Bust displays" />;
}
