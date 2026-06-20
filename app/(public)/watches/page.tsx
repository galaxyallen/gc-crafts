import { ProductPageTemplate } from "@/components/public/ProductPageTemplate";

import { getProductMetadata } from "@/lib/product-page-data";



export const revalidate = 3600;



export async function generateMetadata() {

  return getProductMetadata("WATCHES");

}



export default function WatchesPage() {

  return <ProductPageTemplate category="WATCHES" tagline="Watch presentation" />;

}

