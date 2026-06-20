import Link from "next/link";
import Image from "next/image";
import { isUnoptimizedImage } from "@/lib/image-utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: React.ReactNode;
  tagline?: string | null;
  description?: string | null;
  breadcrumbs?: BreadcrumbItem[];
  backgroundImage?: string | null;
}

export function PageHero({ title, tagline, description, breadcrumbs, backgroundImage }: PageHeroProps) {
  return (
    <section className="pg-hero">
      <div className="pg-hero-bg">
        {backgroundImage && (
          <>
            <Image
              src={backgroundImage}
              alt=""
              fill
              priority
              className="object-cover opacity-35"
              sizes="100vw"
              unoptimized={isUnoptimizedImage(backgroundImage)}
            />
            <div className="pg-hero-overlay" aria-hidden="true" />
          </>
        )}
      </div>
      <div className="sec-c w">
        {breadcrumbs && (
          <div className="breadcrumb rv">
            {breadcrumbs.map((crumb, i) => (
              <span key={`${crumb.label}-${i}`} style={{ display: "contents" }}>
                {i > 0 && <span>/</span>}
                {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : crumb.label}
              </span>
            ))}
          </div>
        )}
        {tagline && <div className="slb rv">{tagline}</div>}
        <h1 className="stt rv">{title}</h1>
        {description && <p className="rv d1">{description}</p>}
      </div>
    </section>
  );
}
