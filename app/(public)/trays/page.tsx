import { ProductPageTemplate } from "@/components/public/ProductPageTemplate";
import { getProductMetadata } from "@/lib/product-page-data";

export const revalidate = 3600;

export async function generateMetadata() {
  return getProductMetadata("TRAYS");
}

export default function TraysPage() {
  return <ProductPageTemplate category="TRAYS" tagline="Display trays & inserts" />;
}
