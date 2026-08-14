"use client";

import { LANGUAGE_OPTIONS, UI } from "@/lib/i18n";
import { useLanguage } from "./LanguageProvider";

export default function LanguageSelect() {
  const { primaryLanguage, openLanguagePicker } = useLanguage();
  const current = LANGUAGE_OPTIONS.find((option) => option.code === primaryLanguage);

  return (
    <div className="language-control">
      <button
        type="button"
        className="language-toggle"
        onClick={openLanguagePicker}
        aria-label={UI.actions.openLanguage[primaryLanguage]}
      >
        <span className="language-toggle-caption">READING</span>
        <span className="language-active">{current?.nativeLabel ?? primaryLanguage}</span>
        <span className="language-chevron" aria-hidden="true">⌄</span>
      </button>
      <button type="button" className="language-reopen" onClick={openLanguagePicker} aria-label={UI.actions.openLanguage[primaryLanguage]}>
        ↗
      </button>
    </div>
  );
}
