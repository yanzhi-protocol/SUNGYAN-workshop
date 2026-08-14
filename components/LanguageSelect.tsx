"use client";

import { LANGUAGE_OPTIONS, UI } from "@/lib/i18n";
import { useLanguage } from "./LanguageProvider";

export default function LanguageSelect() {
  const { language, setLanguage, openLanguagePicker } = useLanguage();

  return (
    <div className="language-control">
      <label className="sr-only" htmlFor="site-language">{UI.actions.openLanguage[language]}</label>
      <select
        id="site-language"
        className="language-select"
        value={language}
        onChange={(event) => setLanguage(event.target.value as (typeof LANGUAGE_OPTIONS)[number]["code"])}
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <option key={option.code} value={option.code}>{option.nativeLabel}</option>
        ))}
      </select>
      <button type="button" className="language-reopen" onClick={openLanguagePicker} aria-label={UI.actions.openLanguage[language]}>
        ↗
      </button>
    </div>
  );
}
