import Link from "next/link";
import type { SiteSettings } from "./Footer";

interface InquiryCtaProps {
  settings: SiteSettings;
}

export function InquiryCta({ settings }: InquiryCtaProps) {
  const email = settings.email ?? "hello@gccrafts.com";
  const whatsapp = settings.whatsapp ?? "";
  const whatsappHref = whatsapp ? `https://wa.me/${whatsapp.replace(/[^\d+]/g, "")}` : "#";

  return (
    <section className="sec inq-s" id="inquiry">
      <div className="sec-bg bg-inq" />
      <div className="sec-c w">
        <div className="cta-band" style={{ padding: "120px 0" }}>
          <div className="slb rv">Start a project</div>
          <h2 className="stt rv" style={{ textAlign: "center", marginBottom: 16 }}>
            Tell us what
            <br />
            you&apos;re <em>looking for</em>
          </h2>
          <p
            className="rv d1"
            style={{
              fontSize: 14,
              color: "var(--t2)",
              marginBottom: 36,
              maxWidth: 440,
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.8,
              textAlign: "center",
            }}
          >
            Share your requirements — materials, quantities, brand guidelines, timeline. We respond within 24 hours
            with an initial concept direction.
          </p>
          <Link href="/contact" className="btn btn-f rv d2" style={{ margin: "0 auto", display: "inline-flex" }}>
            <span>Get in touch</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <div className="rv d3" style={{ marginTop: 28, fontSize: 12, color: "var(--t3)", textAlign: "center" }}>
            or reach us directly —{" "}
            <a href={whatsappHref} style={{ color: "var(--gold)", borderBottom: "1px solid rgba(196,162,101,.2)" }}>
              WhatsApp
            </a>{" "}
            ·{" "}
            <a
              href={`mailto:${email}`}
              style={{ color: "var(--gold)", borderBottom: "1px solid rgba(196,162,101,.2)" }}
            >
              {email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
