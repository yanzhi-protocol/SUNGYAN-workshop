"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Language } from "@/lib/i18n";
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

function directText(language: Language, zh: string, en: string) {
  if (language === "zh") return zh;
  if (language === "en") return en || zh;
  return "";
}

function fallbackText(language: Language, zh: string, en: string) {
  return language === "zh" ? zh : en || zh;
}

export default function BilingualMarkdown({ zh, en }: { zh: string; en: string }) {
  const { primaryLanguage, secondaryLanguage } = useLanguage();
  const [primaryText, setPrimaryText] = useState(directText(primaryLanguage, zh, en));
  const [secondaryText, setSecondaryText] = useState(directText(secondaryLanguage, zh, en));
  const [translating, setTranslating] = useState(false);
  const [translationFailed, setTranslationFailed] = useState(false);
  const translationRun = useRef(0);

  const runTranslation = useCallback(() => {
    const runId = translationRun.current + 1;
    translationRun.current = runId;
    const tasks: Promise<void>[] = [];
    let hadFailure = false;

    setTranslationFailed(false);

    const isCurrentRun = () => translationRun.current === runId;
    const translateFor = (language: Language, setter: (value: string) => void) => {
      const direct = directText(language, zh, en);
      if (direct) {
        setter(direct);
        return;
      }

      setter("");
      tasks.push(
        translateMarkdown(zh, language)
          .then((result) => {
            if (!isCurrentRun()) return;
            if (result) {
              setter(result);
            } else {
              hadFailure = true;
              setter(fallbackText(language, zh, en));
            }
          })
          .catch(() => {
            if (!isCurrentRun()) return;
            hadFailure = true;
            setter(fallbackText(language, zh, en));
          }),
      );
    };

    translateFor(primaryLanguage, setPrimaryText);
    translateFor(secondaryLanguage, setSecondaryText);

    if (tasks.length) {
      setTranslating(true);
      Promise.all(tasks).finally(() => {
        if (isCurrentRun()) {
          setTranslating(false);
          setTranslationFailed(hadFailure);
        }
      });
    } else {
      setTranslating(false);
    }
  }, [en, primaryLanguage, secondaryLanguage, zh]);

  useEffect(() => {
    runTranslation();
    return () => {
      translationRun.current += 1;
    };
  }, [runTranslation]);

  const hasDistinctSecondary = Boolean(secondaryText.trim() && secondaryText.trim() !== primaryText.trim());

  return (
    <div className={`bilingual-markdown ${translating ? "bilingual-markdown--translating" : ""}`}>
      <div className="markdown-primary" aria-busy={translating}>
        {translating && <div className="translation-status" aria-live="polite">Translating locally… / 本機翻譯中…</div>}
        {!translating && translationFailed && (
          <div className="translation-status translation-status--fallback" aria-live="polite">
            <span>Local translation unavailable · fallback shown / 本機翻譯不可用，已顯示回退內容</span>
            <button className="translation-retry" type="button" onClick={runTranslation}>
              Retry / 重試
            </button>
          </div>
        )}
        {primaryText && <MarkdownContent content={primaryText} />}
      </div>
      {hasDistinctSecondary && (
        <div className="markdown-secondary">
          <MarkdownContent content={secondaryText} />
        </div>
      )}
    </div>
  );
}
