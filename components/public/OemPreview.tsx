import Link from "next/link";
import type { ReactNode } from "react";
import { CmsTitle } from "@/lib/cms-title";

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

interface OemCard {
  icon: string;
  title: string;
  desc: string;
}

interface FactoryStat {
  value: string;
  label: string;
}

interface OemPreviewProps {
  title?: string | null;
  body?: string | null;
  cards: OemCard[];
  stats: FactoryStat[];
}

function parseStatValue(value: string) {
  const digits = value.replace(/,/g, "").match(/^(\d+)/);
  if (digits) {
    const suffix = value.slice(digits[0].length);
    return { num: digits[1], suffix };
  }
  return { num: value, suffix: "" };
}

export function OemPreview({ title, body, cards, stats }: OemPreviewProps) {
  return (
    <section className="sec oem-s" id="oem">
      <div className="sec-bg bg-oem" />
      <div className="sec-c w">
        <div className="oem-intro">
          <div>
            <div className="slb rv">OEM & Factory</div>
            <h2 className="stt rv">
              {title ? <CmsTitle text={title} /> : (
                <>
                  Your brand,
                  <br />
                  <em>our production line</em>
                </>
              )}
            </h2>
          </div>
          <p className="rv d2">
            {body ??
              "From concept sampling to mass production, our vertically integrated facility handles every stage under one roof — giving you full control with zero coordination overhead."}
          </p>
        </div>

        <div className="oem-grid">
          {cards.map((card, i) => (
            <div key={card.title} className={`oem-card rv d${Math.min(i + 1, 4)}`}>
              <div className="oem-icon">{ICONS[card.icon] ?? ICONS.Factory}</div>
              <h4>{card.title}</h4>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>

        <div className="oem-stats rv">
          {stats.map((stat) => {
            const { num, suffix } = parseStatValue(stat.value);
            return (
              <div key={stat.label} className="oem-stat">
                <div className="oem-stat-n">
                  {num}
                  {suffix}
                </div>
                <div className="oem-stat-l">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 48 }} className="rv">
          <Link href="/oem" className="btn btn-dark">
            <span>Explore full OEM capabilities</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
