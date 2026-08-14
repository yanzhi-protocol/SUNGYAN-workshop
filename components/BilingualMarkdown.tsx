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
  const { language } = useLanguage();
  const [translated, setTranslated] = useState(language === "zh" ? zh : en);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (language === "zh") {
      setTranslated(zh);
      setTranslating(false);
      return () => { cancelled = true; };
    }
    setTranslated(en || zh);
    setTranslating(true);
    translateMarkdown(zh, language, (progress) => {
      if (!cancelled) setTranslating(progress.stage === "downloading" || progress.stage === "translating");
    }).then((result) => {
      if (!cancelled) {
        if (result) setTranslated(result);
        setTranslating(false);
      }
    }).catch(() => {
      if (!cancelled) setTranslating(false);
    });
    return () => { cancelled = true; };
  }, [zh, en, language]);

  return (
    <div className={`bilingual-markdown ${translating ? "bilingual-markdown--translating" : ""}`}>
      <div className="markdown-primary" aria-busy={translating}>
        {translating && <div className="translation-status" aria-live="polite">Translating locally…</div>}
        <MarkdownContent content={translated} />
      </div>
      <div className="markdown-secondary">
        <MarkdownContent content={language === "zh" ? en : zh} />
      </div>
    </div>
  );
}
