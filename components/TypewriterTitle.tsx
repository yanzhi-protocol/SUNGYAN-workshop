"use client";

import { useEffect, useState } from "react";

const PREFIX = "穩定中的劇震";
const SUFFIX = "言織";
const TITLE = `${PREFIX}——${SUFFIX}`;

export default function TypewriterTitle() {
  const [visibleCount, setVisibleCount] = useState(0);
  const totalCharacters = PREFIX.length + 1 + SUFFIX.length;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisibleCount(totalCharacters);
      return;
    }

    if (visibleCount >= totalCharacters) return;
    const timer = window.setTimeout(() => {
      setVisibleCount((count) => count + 1);
    }, 65);
    return () => window.clearTimeout(timer);
  }, [totalCharacters, visibleCount]);

  const renderCharacters = (text: string, offset: number) =>
    text.split("").map((char, index) => (
      <span
        key={`${char}-${offset + index}`}
        className={`typewriter-char${offset + index < visibleCount ? " visible" : ""}`}
        aria-hidden="true"
      >
        {char}
      </span>
    ));

  return (
    <h1 className="hero-title" aria-label={TITLE}>
      {renderCharacters(PREFIX, 0)}
      <span
        className={`title-rule${visibleCount > PREFIX.length ? " visible" : ""}`}
        aria-hidden="true"
      />
      {renderCharacters(SUFFIX, PREFIX.length + 1)}
    </h1>
  );
}
