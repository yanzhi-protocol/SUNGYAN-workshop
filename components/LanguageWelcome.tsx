"use client";

import { useEffect, useMemo, useState } from "react";
import { defaultLanguagePreferences, useLanguage, type LanguagePreferences } from "./LanguageProvider";
import { LANGUAGE_OPTIONS, UI, type Language } from "@/lib/i18n";
import { supportsNativeTranslation } from "@/lib/liveTranslation";

function languageLabel(code: Language) {
  return LANGUAGE_OPTIONS.find((option) => option.code === code)?.nativeLabel ?? code;
}

function languageDescription(code: Language) {
  const option = LANGUAGE_OPTIONS.find((item) => item.code === code);
  return option ? `${option.label} · ${option.locale}` : code;
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

  const updateTarget = (next: Language) => {
    if (next === draft.primaryLanguage) {
      setDraft({ primaryLanguage: draft.secondaryLanguage, secondaryLanguage: next });
      return;
    }
    setDraft({ ...draft, secondaryLanguage: next });
  };

  const swapDraft = () => setDraft({ primaryLanguage: draft.secondaryLanguage, secondaryLanguage: draft.primaryLanguage });
  const save = () => setLanguagePreferences(draft, true);
  const resetDraft = () => setDraft(browserDefault);

  return (
    <div className="language-welcome-backdrop" role="presentation">
      <section className="language-welcome language-preferences language-preferences--layered" role="dialog" aria-modal="true" aria-labelledby="language-welcome-title">
        <header className="language-preferences-header">
          <div className="language-welcome-kicker">{"//"} LANGUAGE LAYERS</div>
          <button type="button" className="language-default language-default--top" onClick={resetDraft}>
            {UI.actions.restoreDefault[draft.primaryLanguage]}
          </button>
        </header>

        <div className="language-preferences-rule" />

        <div className="language-preferences-title-row">
          <div>
            <h2 id="language-welcome-title">{UI.actions.chooseLanguage[draft.primaryLanguage]}</h2>
            <p className="language-welcome-intro">{UI.actions.languageIntro[draft.primaryLanguage]}</p>
          </div>
          <span className="language-preferences-index">01 / 02</span>
        </div>

        <section className="language-layer-section" aria-labelledby="primary-language-heading">
          <div className="language-layer-heading">
            <h3 id="primary-language-heading">{UI.actions.primaryLanguage[draft.primaryLanguage]}</h3>
            <span>PRIMARY</span>
          </div>
          <div className="primary-language-cards" role="radiogroup" aria-label={UI.actions.primaryLanguage[draft.primaryLanguage]}>
            {LANGUAGE_OPTIONS.filter((option) => option.code === "zh" || option.code === "en" || option.code === draft.primaryLanguage).map((option) => {
              const selected = option.code === draft.primaryLanguage;
              return (
                <button
                  key={option.code}
                  type="button"
                  className={`primary-language-card${selected ? " is-selected" : ""}`}
                  role="radio"
                  aria-checked={selected}
                  onClick={() => updatePrimary(option.code)}
                >
                  <span className="language-card-native">{option.nativeLabel}</span>
                  <span className="language-card-subtitle">{option.code === "zh" ? "所在地区／翻译语言为主，英文附属" : "英文为主，所在地区语言附属"}</span>
                  {selected && <span className="language-card-check" aria-hidden="true">●</span>}
                </button>
              );
            })}
          </div>
        </section>

        <section className="language-layer-section" aria-labelledby="translation-target-heading">
          <div className="language-layer-heading">
            <h3 id="translation-target-heading">{UI.actions.secondaryLanguage[draft.primaryLanguage]}</h3>
            <span>TRANSLATION TARGET</span>
          </div>
          <div className="translation-target-grid" role="radiogroup" aria-label={UI.actions.secondaryLanguage[draft.primaryLanguage]}>
            {LANGUAGE_OPTIONS.map((option) => {
              const selected = option.code === draft.secondaryLanguage;
              const disabled = option.code === draft.primaryLanguage;
              return (
                <button
                  key={option.code}
                  type="button"
                  className={`translation-target-card${selected ? " is-selected" : ""}${disabled ? " is-disabled" : ""}`}
                  role="radio"
                  aria-checked={selected}
                  aria-disabled={disabled}
                  disabled={disabled}
                  onClick={() => updateTarget(option.code)}
                >
                  <span className="language-card-native">{option.nativeLabel}</span>
                  <span className="language-card-subtitle">{languageDescription(option.code)}</span>
                  {selected && <span className="language-card-check" aria-hidden="true">●</span>}
                </button>
              );
            })}
          </div>
        </section>

        <div className="language-preferences-note">
          <span className="language-preferences-note-mark" aria-hidden="true">{"//"}</span>
          <p>翻譯目標只決定本機 Translator API 的語言；主要閱讀語言決定哪一層文字先顯示。</p>
        </div>

        <div className="language-welcome-actions language-preferences-actions">
          <div className="language-preferences-current" aria-live="polite">
            <span>{primaryOption}</span><span aria-hidden="true">→</span><span>{secondaryOption}</span>
          </div>
          <div className="language-preferences-buttons">
            <button type="button" className="preference-swap" onClick={swapDraft} aria-label={UI.actions.swapLanguages[draft.primaryLanguage]}>⇄</button>
            <button type="button" className="language-confirm" onClick={save}>
              {hasChosenLanguage ? UI.actions.savePreferences[draft.primaryLanguage] : "Continue →"}
            </button>
          </div>
        </div>

        {nativeSupported === false && (
          <p className="language-support-note">
            {draft.primaryLanguage === "zh" ? "目前瀏覽器不支援本機即時翻譯；網站仍會保留原文與可用的附屬內容。" : "This browser does not support local live translation yet. Original and available secondary content will remain visible."}
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
