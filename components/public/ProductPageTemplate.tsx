import Image from "next/image";
import type { ProductCategory } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/utils";
import { notFound } from "next/navigation";
import { PageHero } from "./PageHero";
import { InfoGrid } from "./InfoGrid";
import { CtaBand } from "./CtaBand";

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
  const product = await prisma.product.findFirst({
    where: { category, published: true },
    orderBy: { sortOrder: "asc" },
  });

  if (!product) notFound();

  const features = parseJson<string[]>(product.features, []);
  const images = parseJson<string[]>(product.images, []);
  const heroImage = images[0] ?? "/img/hero-main.jpg";
  const galleryImages = images.length > 0 ? images : [heroImage];

  return (
    <>
      <PageHero
        tagline={tagline}
        title={product.name}
        description={product.description}
        backgroundImage={heroImage}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/#products" },
          { label: product.name },
        ]}
      />

      <div className="sec-line" />

      <section className="sec" style={{ background: "var(--char)" }}>
        <div className="sec-c w">
          <div className="p-grid">
            {galleryImages.map((src, i) => (
              <div key={`${src}-${i}`} className={`p-card rv${i > 0 ? ` d${Math.min(i, 4)}` : ""}`}>
                <Image src={src} alt={`${product.name} ${i + 1}`} width={600} height={750} loading="lazy" />
                <div className="p-card-ov">
                  <span>{GALLERY_LABELS[i] ?? `Detail ${i + 1}`}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="sec-line" />

      <InfoGrid features={features} image={heroImage} imageAlt={product.name} description={product.description} />

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
