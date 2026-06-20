import Image from "next/image";
import { isUnoptimizedImage } from "@/lib/image-utils";

import Link from "next/link";

import { PageHero } from "./PageHero";

import { InfoGrid } from "./InfoGrid";

import { CtaBand } from "./CtaBand";

import { getProductPageData } from "@/lib/product-page-data";

import type { ProductCategory } from "@/lib/types";



const GALLERY_LABELS = [

  "Complete set overview",

  "Material close-up",

  "Finishing detail",

  "In-store presentation",

  "Color variant",

  "Alternative configuration",

];



interface ProductPageTemplateProps {

  category: ProductCategory;

  tagline?: string;

}



export async function ProductPageTemplate({ category, tagline }: ProductPageTemplateProps) {

  const data = await getProductPageData(category);

  const heroImage = data.images[0] ?? "/img/hero-main.jpg";

  const galleryImages = data.images.length > 0 ? data.images : [heroImage];



  return (

    <>

      <PageHero

        tagline={tagline}

        title={data.name}

        description={data.description}

        backgroundImage={heroImage}

        breadcrumbs={[

          { label: "Home", href: "/" },

          { label: "Products", href: "/#products" },

          { label: data.name },

        ]}

      />



      <div className="sec-line" />



      <section className="sec" style={{ background: "var(--char)" }}>

        <div className="sec-c w">

          <div className="p-grid">

            {galleryImages.map((src, i) => (

              <div key={`${src}-${i}`} className={`p-card rv${i > 0 ? ` d${Math.min(i, 4)}` : ""}`}>

                <Image src={src} alt={`${data.name} ${i + 1}`} width={600} height={750} loading="lazy" unoptimized={isUnoptimizedImage(src)} />

                <div className="p-card-ov">

                  <span>{GALLERY_LABELS[i] ?? `Detail ${i + 1}`}</span>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>



      <div className="sec-line" />



      <InfoGrid

        features={data.features}

        image={heroImage}

        imageAlt={data.name}

        description={data.description}

        materials={data.materials}

        moq={data.moq}

      />



      <div className="sec-line" />



      <CtaBand

        title={

          <>

            Need this in <em>your brand&apos;s palette?</em>

          </>

        }

        subtitle="We offer full OEM customization — materials, colors, logo embossing, and packaging."

        buttonText="Learn about OEM"

        buttonHref="/oem"

        bg="var(--char-dd)"

      />



      <div className="sec-line" />



      <CtaBand

        title={

          <>

            Ready to <em>start?</em>

          </>

        }

        subtitle="Share your requirements. We respond within 24 hours."

        buttonText="Get in touch"

        buttonHref="/contact"

        filled

        bg="var(--char-ddd)"

      />

    </>

  );

}

