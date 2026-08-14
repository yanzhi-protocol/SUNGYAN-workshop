"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLanguage } from "./LanguageProvider";
import { translateMarkdown } from "@/lib/liveTranslation";

function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ href, children, ...props }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default function BilingualMarkdown({ zh, en }: { zh: string; en: string }) {
  const { primaryLanguage, secondaryLanguage } = useLanguage();
  const [primaryText, setPrimaryText] = useState(primaryLanguage === "zh" ? zh : en || zh);
  const [secondaryText, setSecondaryText] = useState(secondaryLanguage === "zh" ? zh : en || zh);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const tasks: Promise<void>[] = [];
    const translateFor = (language: typeof primaryLanguage, setter: (value: string) => void) => {
      if (language === "zh") {
        setter(zh);
        return;
      }
      if (language === "en") {
        setter(en || zh);
        return;
      }
      setter(en || zh);
      tasks.push(
        translateMarkdown(zh, language, () => {
          if (!cancelled) setTranslating(true);
        }).then((result) => {
          if (!cancelled && result) setter(result);
        }),
      );
    };

    translateFor(primaryLanguage, setPrimaryText);
    translateFor(secondaryLanguage, setSecondaryText);
    if (tasks.length) {
      setTranslating(true);
      Promise.all(tasks).finally(() => {
        if (!cancelled) setTranslating(false);
      });
    } else {
      setTranslating(false);
    }
    return () => { cancelled = true; };
  }, [zh, en, primaryLanguage, secondaryLanguage]);

  return (
    <div className={`bilingual-markdown ${translating ? "bilingual-markdown--translating" : ""}`}>
      <div className="markdown-primary" aria-busy={translating}>
        {translating && <div className="translation-status" aria-live="polite">Translating locally…</div>}
        <MarkdownContent content={primaryText} />
      </div>
      <div className="markdown-secondary">
        <MarkdownContent content={secondaryText} />
      </div>
    </div>
  );
}
