import Image from "next/image";
import Link from "next/link";

interface InfoGridProps {
  title?: React.ReactNode;
  description?: string;
  features: string[];
  image: string;
  imageAlt?: string;
}

export function InfoGrid({
  title = (
    <>
      Engineered for <em>every jewel</em>
    </>
  ),
  description = "Every piece is designed in-house and manufactured in our own facility. We control every variable — from material grain direction to stitching tension — ensuring consistency across thousands of units.",
  features,
  image,
  imageAlt = "Product detail",
}: InfoGridProps) {
  return (
    <section style={{ background: "var(--char-d)", padding: 0 }}>
      <div className="w">
        <div className="info-grid">
          <div className="info-text rv">
            <h3>{title}</h3>
            <p>{description}</p>
            <ul className="feat-list">
              {features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <Link href="/contact" className="btn">
              <span>Request a quote</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="info-img rv d2">
            <Image src={image} alt={imageAlt} width={640} height={480} loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}
