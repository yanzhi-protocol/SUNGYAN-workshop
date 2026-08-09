"use client";

import type { Language } from "@/lib/i18n";
import { useLanguage } from "./LanguageProvider";

type BilingualValue = {
  zh: string;
  en: string;
};

type Props = BilingualValue & {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  preserveLineBreaks?: boolean;
  id?: string;
};

export default function BilingualText({ as: Tag = "span", zh, en, className = "", preserveLineBreaks = false, id }: Props) {
  const { language } = useLanguage();
  const primary = language === "zh" ? zh : en;
  const secondary = language === "zh" ? en : zh;

  return (
    <Tag id={id} className={`bilingual-text ${preserveLineBreaks ? "bilingual-text--multiline" : ""} ${className}`}>
      <span className="bilingual-primary">{primary}</span>
      <span className="bilingual-secondary">{secondary}</span>
    </Tag>
  );
}

export function bilingualValue(zh: string, en: string): BilingualValue {
  return { zh, en };
}

export type { Language };
