"use client";

import { useEffect, useState } from "react";

const TITLE = "穩定中的劇震——言織";

export default function TypewriterTitle() {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisibleCount(TITLE.length);
      return;
    }

    if (visibleCount >= TITLE.length) return;
    const timer = window.setTimeout(() => {
      setVisibleCount((count) => count + 1);
    }, 65);
    return () => window.clearTimeout(timer);
  }, [visibleCount]);

  return (
    <h1 className="hero-title" aria-label={TITLE}>
      {TITLE.split("").map((char, index) => (
        <span
          key={`${char}-${index}`}
          className={`typewriter-char${index < visibleCount ? " visible" : ""}`}
          aria-hidden="true"
        >
          {char}
        </span>
      ))}
    </h1>
  );
}
