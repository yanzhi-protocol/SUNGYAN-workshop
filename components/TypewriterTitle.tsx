"use client";

import { useMemo } from "react";
import { UI } from "@/lib/i18n";
import { useLanguage } from "./LanguageProvider";

export default function TypewriterTitle() {
  const { primaryLanguage } = useLanguage();
  const title = useMemo(() => {
    const localized = UI.home.title[primaryLanguage] ?? UI.home.title.en;
    const separator = localized.indexOf("—");
    return {
      prefix: separator >= 0 ? localized.slice(0, separator).trim() : localized,
      suffix: separator >= 0 ? localized.slice(separator + 1).trim() : "",
      label: localized,
    };
  }, [primaryLanguage]);

  return (
    <h1 className={`hero-title hero-title--${primaryLanguage}`} aria-label={title.label}>
      <span className="hero-title-prefix">{title.prefix}</span>
      {title.suffix && (
        <span className="hero-title-suffix">
          <span className="hero-title-divider" aria-hidden="true">—</span>
          {title.suffix}
        </span>
      )}
    </h1>
  );
}
