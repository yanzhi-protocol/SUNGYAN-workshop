"use client";

import { useEffect, useMemo, useState } from "react";
import { defaultLanguagePreferences, useLanguage, type LanguagePreferences } from "./LanguageProvider";
import { LANGUAGE_OPTIONS, UI, type Language } from "@/lib/i18n";
import { supportsNativeTranslation } from "@/lib/liveTranslation";

function languageLabel(code: Language) {
  return LANGUAGE_OPTIONS.find((option) => option.code === code)?.nativeLabel ?? code;
}

export default function LanguageWelcome({ onClose }: { onClose: () => void }) {
  const { primaryLanguage, secondaryLanguage, setLanguagePreferences, hasChosenLanguage } = useLanguage();
  const [draft, setDraft] = useState<LanguagePreferences>({ primaryLanguage, secondaryLanguage });
  const [browserDefault, setBrowserDefault] = useState<LanguagePreferences>({ primaryLanguage, secondaryLanguage });
  const [nativeSupported, setNativeSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const detected = defaultLanguagePreferences(window.navigator.language);
    setDraft({ primaryLanguage, secondaryLanguage });
    setBrowserDefault(detected);
    setNativeSupported(supportsNativeTranslation());
  }, [primaryLanguage, secondaryLanguage]);

  const primaryOption = useMemo(() => languageLabel(draft.primaryLanguage), [draft.primaryLanguage]);
  const secondaryOption = useMemo(() => languageLabel(draft.secondaryLanguage), [draft.secondaryLanguage]);

  const updatePrimary = (next: Language) => {
    setDraft({
      primaryLanguage: next,
      secondaryLanguage: next === draft.secondaryLanguage ? (next === "en" ? "zh" : "en") : draft.secondaryLanguage,
    });
  };

  const updateSecondary = (next: Language) => {
    if (next === draft.primaryLanguage) return;
    setDraft({ ...draft, secondaryLanguage: next });
  };

  const swapDraft = () => setDraft({ primaryLanguage: draft.secondaryLanguage, secondaryLanguage: draft.primaryLanguage });
  const save = () => setLanguagePreferences(draft, true);
  const resetDraft = () => setDraft(browserDefault);

  return (
    <div className="language-welcome-backdrop" role="presentation">
      <section className="language-welcome language-preferences" role="dialog" aria-modal="true" aria-labelledby="language-welcome-title">
        <div className="language-welcome-kicker">SUNGYAN WORKSHOP / LANGUAGE PREFERENCES</div>
        <h2 id="language-welcome-title">{UI.actions.chooseLanguage[draft.primaryLanguage]}</h2>
        <p className="language-welcome-intro">{UI.actions.languageIntro[draft.primaryLanguage]}</p>

        <div className="preference-fields">
          <label className="preference-field">
            <span className="preference-label">{UI.actions.primaryLanguage[draft.primaryLanguage]}</span>
            <select value={draft.primaryLanguage} onChange={(event) => updatePrimary(event.target.value as Language)}>
              {LANGUAGE_OPTIONS.map((option) => <option key={option.code} value={option.code}>{option.nativeLabel} · {option.label}</option>)}
            </select>
            <small>{primaryOption}</small>
          </label>
          <button type="button" className="preference-swap" onClick={swapDraft} aria-label={UI.actions.swapLanguages[draft.primaryLanguage]}>
            ⇄
          </button>
          <label className="preference-field">
            <span className="preference-label">{UI.actions.secondaryLanguage[draft.primaryLanguage]}</span>
            <select value={draft.secondaryLanguage} onChange={(event) => updateSecondary(event.target.value as Language)}>
              {LANGUAGE_OPTIONS.filter((option) => option.code !== draft.primaryLanguage).map((option) => <option key={option.code} value={option.code}>{option.nativeLabel} · {option.label}</option>)}
            </select>
            <small>{secondaryOption}</small>
          </label>
        </div>

        <div className="preference-summary">
          <span>{primaryOption}</span>
          <span aria-hidden="true">→</span>
          <span>{secondaryOption}</span>
        </div>

        <div className="language-welcome-actions">
          <button type="button" className="language-default" onClick={resetDraft}>
            {UI.actions.restoreDefault[draft.primaryLanguage]}
          </button>
          <button type="button" className="language-confirm" onClick={save}>
            {hasChosenLanguage ? UI.actions.savePreferences[draft.primaryLanguage] : "Continue →"}
          </button>
        </div>

        {nativeSupported === false && (
          <p className="language-support-note">
            {draft.primaryLanguage === "zh" ? "目前瀏覽器不支援本機即時翻譯；網站仍會保留中文原文與英文附屬內容。建議使用最新版 Chrome 桌面版。" : "This browser does not support local live translation yet. The site will keep the Chinese original and English secondary content. Latest desktop Chrome is recommended."}
          </p>
        )}
        {hasChosenLanguage && (
          <button type="button" className="language-dismiss" onClick={onClose}>
            {draft.primaryLanguage === "zh" ? "取消" : "Cancel"}
          </button>
        )}
      </section>
    </div>
  );
}
