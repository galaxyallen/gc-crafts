"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { isUnoptimizedImage } from "@/lib/image-utils";

interface HeroSectionProps {
  title?: string | null;
  subtitle?: string | null;
  body?: string | null;
  image?: string | null;
}

function parseHeroTitle(title: string) {
  const match = title.match(/^(.+?)\s+of\s+(.+)$/i);
  if (match) {
    return { line1: match[1], line2Prefix: "of ", line2Emphasis: match[2] };
  }
  return { line1: title, line2Prefix: "", line2Emphasis: "" };
}

export function HeroSection({ title, subtitle, body, image }: HeroSectionProps) {
  const heroImage = image ?? "/img/hero-main.jpg";
  const fullTitle = title ?? "The silent art of presentation";
  const { line1, line2Prefix, line2Emphasis } = parseHeroTitle(fullTitle);

  useEffect(() => {
    document.body.classList.add("loaded");
  }, []);

  return (
    <section className="hero">
      <div className="hero-img" aria-hidden="true">
        <Image src={heroImage} alt="" fill priority className="hero-img-inner" sizes="100vw" unoptimized={isUnoptimizedImage(heroImage)} />
      </div>

      <div className="hero-mesh" aria-hidden="true">
        <span />
        <span />
      </div>

      <div className="hero-c">
        <p className="hero-tag h-f hf1">{subtitle ?? "Bespoke jewelry display"}</p>
        <h1>
          <span className="h-rev hd1">
            <span>{line1}</span>
          </span>
          {line2Emphasis && (
            <>
              <br />
              <span className="h-rev hd2">
                <span>
                  {line2Prefix}
                  <em>{line2Emphasis}</em>
                </span>
              </span>
            </>
          )}
        </h1>
        <p className="hero-p h-f hf2">
          {body ??
            "We design, manufacture, and deliver premium display systems for jewelers and watchmakers who believe presentation is not an afterthought — it's the first impression."}
        </p>
        <div className="hero-cta h-f hf3">
          <Link href="#products" className="btn btn-f">
            <span>Explore</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <span className="sep" aria-hidden="true" />
          <Link href="/contact" className="sm">
            or start a project
          </Link>
        </div>
      </div>

      <div className="hscroll h-f hf4" aria-hidden="true">
        <span>Scroll</span>
        <div className="hbar" />
      </div>
    </section>
  );
}
