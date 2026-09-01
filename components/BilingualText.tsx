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

function directValue(value: LocalizedValue | undefined, zh: string, en: string, language: Language) {
  return value?.[language] ?? (language === "zh" ? zh : language === "en" ? en : "");
}

export default function BilingualText({ value, zh = "", en = "", as: Tag = "span", className = "", preserveLineBreaks = false, id }: Props) {
  const { primaryLanguage, secondaryLanguage } = useLanguage();
  const sourceChinese = value?.zh ?? zh;
  const sourceEnglish = value?.en ?? en;
  const directPrimary = directValue(value, sourceChinese, sourceEnglish, primaryLanguage);
  const directSecondary = directValue(value, sourceChinese, sourceEnglish, secondaryLanguage);
  const [primaryText, setPrimaryText] = useState(directPrimary || sourceEnglish || sourceChinese);
  const [secondaryText, setSecondaryText] = useState(directSecondary || sourceChinese || sourceEnglish);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const pending: Promise<void>[] = [];
    setPrimaryText(directPrimary || sourceEnglish || sourceChinese);
    setSecondaryText(directSecondary || sourceChinese || sourceEnglish);

    if (!directPrimary && primaryLanguage !== "zh" && sourceChinese.trim()) {
      pending.push(
        translateText(sourceChinese, primaryLanguage, () => {
          if (!cancelled) setTranslating(true);
        }).then((result) => {
          if (!cancelled && result) setPrimaryText(result);
        }),
      );
    }
    if (!directSecondary && secondaryLanguage !== "zh" && sourceChinese.trim() && secondaryLanguage !== primaryLanguage) {
      pending.push(
        translateText(sourceChinese, secondaryLanguage, () => {
          if (!cancelled) setTranslating(true);
        }).then((result) => {
          if (!cancelled && result) setSecondaryText(result);
        }),
      );
    }
    if (pending.length) {
      setTranslating(true);
      Promise.all(pending).finally(() => {
        if (!cancelled) setTranslating(false);
      });
    } else {
      setTranslating(false);
    }
    return () => { cancelled = true; };
  }, [directPrimary, directSecondary, sourceChinese, sourceEnglish, primaryLanguage, secondaryLanguage]);

  const hasDistinctSecondary = Boolean(secondaryText.trim() && secondaryText.trim() !== primaryText.trim());

  return (
    <Tag id={id} className={`bilingual-text ${preserveLineBreaks ? "bilingual-text--multiline" : ""} ${translating ? "bilingual-text--translating" : ""} ${className}`}>
      <span className="bilingual-primary" aria-busy={translating}>{primaryText}</span>
      {hasDistinctSecondary && <span className="bilingual-secondary">{secondaryText}</span>}
    </Tag>
  );
}

export function bilingualValue(zh: string, en: string): LocalizedValue {
  return { zh, en };
}

export type { Language };
