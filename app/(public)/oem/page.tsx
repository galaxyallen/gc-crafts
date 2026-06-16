import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/utils";
import { PageHero } from "@/components/public/PageHero";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "OEM & Factory",
  description:
    "From concept sampling to mass production — custom jewelry display manufacturing under one roof.",
};

const ICONS: Record<string, ReactNode> = {
  Paintbrush: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  ),
  Factory: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M2 20h20" />
      <path d="M5 20V8l7-5 7 5v12" />
      <path d="M9 20v-4h6v4" />
    </svg>
  ),
  Tag: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M9 5H2v7l6.29 6.29c.94.94 2.48.94 3.42 0l3.58-3.58c.94-.94.94-2.48 0-3.42L9 5z" />
      <path d="M6 9h.01" />
    </svg>
  ),
  CheckCircle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
};

export default async function OemPage() {
  const [contents, factoryStats] = await Promise.all([
    prisma.pageContent.findMany({
      where: { section: { in: ["oem_intro", "oem_capabilities", "oem_process", "factory_gallery"] } },
    }),
    prisma.factoryStat.findMany(),
  ]);

  const contentMap = Object.fromEntries(contents.map((c) => [c.section, c]));
  const intro = contentMap.oem_intro;
  const capabilities = parseJson<{ cards: { icon: string; title: string; desc: string }[] }>(
    contentMap.oem_capabilities?.metadata,
    { cards: [] }
  );
  const process = parseJson<{ steps: { name: string; desc: string }[] }>(
    contentMap.oem_process?.metadata,
    { steps: [] }
  );
  const gallery = parseJson<{ images: { url: string; alt: string }[] }>(
    contentMap.factory_gallery?.metadata,
    { images: [] }
  );

  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "OEM & Factory" }]}
        tagline="OEM & Manufacturing"
        title={
          <>
            Your brand,
            <br />
            <em>our production line</em>
          </>
        }
        description={
          intro?.body ??
          "From concept sampling to mass production, our vertically integrated facility handles every stage under one roof — giving you full control with zero coordination overhead."
        }
        backgroundImage={intro?.image}
      />

      <div className="sec-line" />

      <section style={{ background: "var(--char)", padding: "80px 0" }}>
        <div className="w">
          <div className="slb rv">Our facility</div>
          <h2 className="stt rv" style={{ marginBottom: 0 }}>
            Inside the <em>workshop</em>
          </h2>
          <div className="factory-grid">
            {gallery.images.map((img, i) => (
              <div key={img.url} className={`factory-img rv${i > 0 ? ` d${Math.min(i, 4)}` : ""}`}>
                <Image src={img.url} alt={img.alt} width={800} height={500} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="sec-line" />

      <section style={{ background: "var(--cream)", padding: "120px 0" }}>
        <div className="w">
          <div className="slb rv" style={{ color: "var(--gold-d)" }}>
            Capabilities
          </div>
          <h2 className="stt rv" style={{ color: "var(--char-dd)", marginBottom: 48 }}>
            End-to-end <em>in-house</em>
          </h2>
          <div className="oem-page-grid">
            {capabilities.cards.map((card, i) => (
              <div key={card.title} className={`oem-page-card rv d${Math.min(i + 1, 4)}`}>
                <div className="oem-icon">{ICONS[card.icon] ?? ICONS.Factory}</div>
                <h4>{card.title}</h4>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>
          <div className="oem-stats rv">
            {factoryStats.map((stat) => (
              <div key={stat.key} className="oem-stat">
                <div className="oem-stat-n">{stat.value}</div>
                <div className="oem-stat-l">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="sec-line" />

      <section style={{ background: "var(--char-d)", padding: "120px 0" }}>
        <div className="w">
          <div className="slb rv" style={{ textAlign: "center" }}>
            OEM Process
          </div>
          <h2 className="stt rv" style={{ textAlign: "center", marginBottom: 0 }}>
            From brief to <em>delivery</em>
          </h2>
          <div className="proc-row">
            {process.steps.map((step, i) => (
              <div key={step.name} className={`proc-step rv${i > 0 ? ` d${Math.min(i, 4)}` : ""}`}>
                <div className="proc-dot">{i + 1}</div>
                <div className="proc-name">{step.name}</div>
                <div className="proc-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="sec-line" />

      <section className="cta-band" style={{ background: "var(--char-ddd)", padding: "120px 0" }}>
        <h3 className="rv">
          Ready to start <em>your OEM project?</em>
        </h3>
        <p className="rv d1">Tell us about your brand, quantities, and timeline. We&apos;ll respond within 24 hours.</p>
        <Link href="/contact" className="btn btn-f rv d2">
          <span>Get in touch</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </section>
    </>
  );
}
