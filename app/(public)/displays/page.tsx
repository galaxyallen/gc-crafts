import { ProductPageTemplate } from "@/components/public/ProductPageTemplate";
import { getProductMetadata } from "@/lib/product-page-data";

export const revalidate = 3600;

export async function generateMetadata() {
  return getProductMetadata("DISPLAYS");
}

export default function DisplaysPage() {
  return <ProductPageTemplate category="DISPLAYS" tagline="Counter display sets" />;
}
