"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function observeReveal() {
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("v");
          revealObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.06, rootMargin: "0px 0px -50px 0px" }
  );

  document.querySelectorAll(".rv:not(.v), .rv-s:not(.v)").forEach((el) => revealObs.observe(el));

  const counterObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        const target = Number(el.dataset.t);
        if (Number.isNaN(target)) return;
        const suffixMatch = el.innerHTML.match(/<i>.*?<\/i>/);
        const suffix = suffixMatch ? suffixMatch[0] : "";
        const start = performance.now();
        const animate = (now: number) => {
          const p = Math.min((now - start) / 1400, 1);
          const v = Math.round((1 - Math.pow(1 - p, 4)) * target);
          el.innerHTML = `${v}${suffix}`;
          if (p < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        counterObs.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll(".ts-n[data-t]").forEach((el) => counterObs.observe(el));

  return () => {
    revealObs.disconnect();
    counterObs.disconnect();
  };
}

function bindMaterialScroll() {
  const mscroll = document.querySelector(".mscroll") as HTMLElement | null;
  if (!mscroll) return undefined;

  let down = false;
  let sx = 0;
  let sl = 0;

  const onDown = (e: Event) => {
    const ev = e as MouseEvent;
    down = true;
    sx = ev.pageX - mscroll.offsetLeft;
    sl = mscroll.scrollLeft;
    mscroll.style.cursor = "grabbing";
  };
  const onUp = () => {
    down = false;
    mscroll.style.cursor = "grab";
  };
  const onMove = (e: Event) => {
    if (!down) return;
    const ev = e as MouseEvent;
    ev.preventDefault();
    const x = ev.pageX - mscroll.offsetLeft;
    mscroll.scrollLeft = sl - (x - sx) * 1.5;
  };

  mscroll.addEventListener("mousedown", onDown);
  mscroll.addEventListener("mouseleave", onUp);
  mscroll.addEventListener("mouseup", onUp);
  mscroll.addEventListener("mousemove", onMove);

  return () => {
    mscroll.removeEventListener("mousedown", onDown);
    mscroll.removeEventListener("mouseleave", onUp);
    mscroll.removeEventListener("mouseup", onUp);
    mscroll.removeEventListener("mousemove", onMove);
  };
}

export function SiteEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const nav = document.getElementById("nav");
    const onScroll = () => nav?.classList.toggle("f", window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const onAnchorClick = (ev: MouseEvent) => {
      const anchor = (ev.target as Element).closest('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        ev.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    };
    document.addEventListener("click", onAnchorClick);

    const onLoad = () => document.body.classList.add("loaded");
    window.addEventListener("load", onLoad);
    if (document.readyState === "complete") onLoad();

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onAnchorClick);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    let cleanupReveal: (() => void) | undefined;
    let cleanupScroll: (() => void) | undefined;

    const frame = requestAnimationFrame(() => {
      cleanupReveal = observeReveal();
      cleanupScroll = bindMaterialScroll();
    });

    return () => {
      cancelAnimationFrame(frame);
      cleanupReveal?.();
      cleanupScroll?.();
    };
  }, [pathname]);

  return null;
}
