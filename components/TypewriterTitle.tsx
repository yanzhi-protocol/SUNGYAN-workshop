"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";

const TITLES = {
  zh: { prefix: "穩定中的劇震", suffix: "言織", label: "穩定中的劇震——言織" },
  en: { prefix: "Stability in Turmoil", suffix: "YanZhi", label: "Stability in Turmoil — YanZhi" },
};

export default function TypewriterTitle() {
  const { language } = useLanguage();
  const title = TITLES[language];
  const totalCharacters = title.prefix.length + 1 + title.suffix.length;
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
  }, [language]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisibleCount(totalCharacters);
      return;
    }
    if (visibleCount >= totalCharacters) return;
    const timer = window.setTimeout(() => setVisibleCount((count) => count + 1), 65);
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
    <h1 key={language} className="hero-title" aria-label={title.label}>
      {renderCharacters(title.prefix, 0)}
      <span className={`title-rule${visibleCount > title.prefix.length ? " visible" : ""}`} aria-hidden="true" />
      {renderCharacters(title.suffix, title.prefix.length + 1)}
    </h1>
  );
}
