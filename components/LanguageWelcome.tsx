"use client";

import { useEffect, useMemo, useState } from "react";
import { LANGUAGE_OPTIONS, UI, type Language } from "@/lib/i18n";
import { supportsNativeTranslation } from "@/lib/liveTranslation";
import { useLanguage } from "./LanguageProvider";

export default function LanguageWelcome({ onClose }: { onClose: () => void }) {
  const { language, setLanguage, hasChosenLanguage } = useLanguage();
  const [selected, setSelected] = useState<Language>(language);
  const [browserSuggested, setBrowserSuggested] = useState(language);
  const [nativeSupported, setNativeSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setSelected(language);
    setBrowserSuggested(language);
    setNativeSupported(supportsNativeTranslation());
  }, [language]);

  const selectedOption = useMemo(
    () => LANGUAGE_OPTIONS.find((option) => option.code === selected) ?? LANGUAGE_OPTIONS[0],
    [selected],
  );

  const confirm = () => setLanguage(selected, true);

  return (
    <div className="language-welcome-backdrop" role="presentation">
      <section className="language-welcome" role="dialog" aria-modal="true" aria-labelledby="language-welcome-title">
        <div className="language-welcome-kicker">SUNGYAN WORKSHOP / LANGUAGE</div>
        <h2 id="language-welcome-title">{UI.actions.chooseLanguage[language]}</h2>
        <p className="language-welcome-intro">{UI.actions.languageIntro[language]}</p>
        <div className="language-grid" role="radiogroup" aria-label={UI.actions.chooseLanguage[language]}>
          {LANGUAGE_OPTIONS.map((option) => {
            const isSelected = option.code === selected;
            const isSuggested = option.code === browserSuggested;
            return (
              <button
                key={option.code}
                type="button"
                className={`language-option${isSelected ? " is-selected" : ""}`}
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelected(option.code)}
              >
                <span className="language-option-native">{option.nativeLabel}</span>
                <span className="language-option-label">{option.label}</span>
                {isSuggested && <span className="language-option-badge">{UI.actions.suggested[language]}</span>}
              </button>
            );
          })}
        </div>
        <div className="language-welcome-actions">
          <span className="language-preview">{selectedOption.nativeLabel}</span>
          <button type="button" className="language-confirm" onClick={confirm}>
            {hasChosenLanguage ? UI.actions.openLanguage[language] : "Continue →"}
          </button>
        </div>
        {nativeSupported === false && (
          <p className="language-support-note">
            {language === "zh" ? "目前瀏覽器不支援本機即時翻譯；網站仍會保留中文原文與既有英文內容。建議使用最新版 Chrome 桌面版。" : "This browser does not support local live translation yet. The site will keep the Chinese original and available English content. Latest desktop Chrome is recommended."}
          </p>
        )}
        {hasChosenLanguage && (
          <button type="button" className="language-dismiss" onClick={onClose}>
            {language === "zh" ? "先不要更改" : "Keep current language"}
          </button>
        )}
      </section>
    </div>
  );
}
