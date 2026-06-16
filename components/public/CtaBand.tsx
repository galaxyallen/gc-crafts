import Link from "next/link";

interface CtaBandProps {
  title: React.ReactNode;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
  filled?: boolean;
  bg?: string;
}

export function CtaBand({
  title,
  subtitle,
  buttonText = "Get in touch",
  buttonHref = "/contact",
  filled = false,
  bg = "var(--char-dd)",
}: CtaBandProps) {
  return (
    <section className="cta-band" style={{ background: bg }}>
      <h3 className="rv">{title}</h3>
      {subtitle && <p className="rv d1">{subtitle}</p>}
      <Link href={buttonHref} className={`btn ${filled ? "btn-f" : ""} rv d2`}>
        <span>{buttonText}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>
    </section>
  );
}
