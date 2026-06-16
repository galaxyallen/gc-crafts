"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: string;
  duration?: number;
  className?: string;
}

function parseStatValue(raw: string): { target: number; suffix: string } {
  const trimmed = raw.trim();
  const match = trimmed.match(/^([\d,]+)(.*)$/);
  if (!match) return { target: 0, suffix: trimmed };

  let numStr = match[1].replace(/,/g, "");
  let suffix = match[2] || "";

  if (numStr.toLowerCase().includes("k")) {
    numStr = numStr.toLowerCase().replace("k", "");
    suffix = `k${suffix}`;
  }

  const target = parseInt(numStr, 10);
  return { target: Number.isNaN(target) ? 0 : target, suffix };
}

export function AnimatedCounter({ value, duration = 2000, className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState("0");
  const { target, suffix } = parseStatValue(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;

        const start = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(target * eased);
          setDisplay(String(current));
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
