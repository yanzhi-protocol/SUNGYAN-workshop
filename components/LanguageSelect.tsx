"use client";

import { LANGUAGE_OPTIONS, UI, type Language } from "@/lib/i18n";
import { useLanguage } from "./LanguageProvider";

export default function LanguageSelect() {
  const { primaryLanguage, openLanguagePicker, setPrimaryLanguage } = useLanguage();

  return (
    <div className="language-control">
      <label className="sr-only" htmlFor="site-language">{UI.actions.primaryLanguage[primaryLanguage]}</label>
      <select
        id="site-language"
        className="language-select"
        value={primaryLanguage}
        onChange={(event) => setPrimaryLanguage(event.target.value as Language)}
        aria-label={UI.actions.primaryLanguage[primaryLanguage]}
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <option key={option.code} value={option.code}>{option.nativeLabel}</option>
        ))}
      </select>
      <button type="button" className="language-reopen" onClick={openLanguagePicker} aria-label={UI.actions.openLanguage[primaryLanguage]}>
        ↗
      </button>
    </div>
  );
}
