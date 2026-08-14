"use client";

import { useEffect, useState } from "react";
import type { Language, LocalizedValue } from "@/lib/i18n";
import { useLanguage } from "./LanguageProvider";
import { translateText } from "@/lib/liveTranslation";

type Props = {
  value?: LocalizedValue;
  zh?: string;
  en?: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  preserveLineBreaks?: boolean;
  id?: string;
};

export default function BilingualText({ value, zh = "", en = "", as: Tag = "span", className = "", preserveLineBreaks = false, id }: Props) {
  const { language } = useLanguage();
  const original = value?.zh ?? zh;
  const english = value?.en ?? en;
  const directTranslation = value?.[language] ?? (language === "zh" ? original : language === "en" ? english : "");
  const [translated, setTranslated] = useState(directTranslation);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (directTranslation) {
      setTranslated(directTranslation);
      setTranslating(false);
      return () => { cancelled = true; };
    }
    if (!original.trim() || language === "zh") {
      setTranslated(original || english);
      setTranslating(false);
      return () => { cancelled = true; };
    }

    setTranslating(true);
    setTranslated(english || original);
    translateText(original, language, (progress) => {
      if (!cancelled && progress.stage === "translating") setTranslating(true);
    }).then((result) => {
      if (!cancelled) {
        if (result) setTranslated(result);
        setTranslating(false);
      }
    }).catch(() => {
      if (!cancelled) setTranslating(false);
    });

    return () => { cancelled = true; };
  }, [directTranslation, original, english, language]);

  const secondary = language === "zh" ? english : original;
  return (
    <Tag id={id} className={`bilingual-text ${preserveLineBreaks ? "bilingual-text--multiline" : ""} ${translating ? "bilingual-text--translating" : ""} ${className}`}>
      <span className="bilingual-primary" aria-busy={translating}>{translated || original}</span>
      {secondary && <span className="bilingual-secondary">{secondary}</span>}
    </Tag>
  );
}

export function bilingualValue(zh: string, en: string): LocalizedValue {
  return { zh, en };
}

export type { Language };
