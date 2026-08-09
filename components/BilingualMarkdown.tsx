"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLanguage } from "./LanguageProvider";

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
  const primary = language === "zh" ? zh : en;
  const secondary = language === "zh" ? en : zh;

  return (
    <div className="bilingual-markdown">
      <div className="markdown-primary">
        <MarkdownContent content={primary} />
      </div>
      <div className="markdown-secondary">
        <MarkdownContent content={secondary} />
      </div>
    </div>
  );
}
