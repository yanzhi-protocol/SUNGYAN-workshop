"use client";

import { useEffect, useMemo, useState } from "react";
import { UI, type Language } from "@/lib/i18n";
import { useLanguage } from "./LanguageProvider";

export default function TypewriterTitle() {
  const { language } = useLanguage();
  const title = useMemo(() => {
    const localized = UI.home.title[language] ?? UI.home.title.en;
    const separator = localized.indexOf("—");
    const prefix = separator >= 0 ? localized.slice(0, separator).trim() : localized;
    const suffix = separator >= 0 ? localized.slice(separator + 1).trim() : "";
    return { prefix, suffix, label: localized };
  }, [language]);
  const totalCharacters = title.prefix.length + (title.suffix ? 1 + title.suffix.length : 0);
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
    <h1 key={language} className={`hero-title hero-title--${language as Language}`} aria-label={title.label}>
      {renderCharacters(title.prefix, 0)}
      {title.suffix && <>
        <span className={`title-rule${visibleCount > title.prefix.length ? " visible" : ""}`} aria-hidden="true" />
        <span className="title-suffix">{renderCharacters(title.suffix, title.prefix.length + 1)}</span>
      </>}
    </h1>
  );
}
