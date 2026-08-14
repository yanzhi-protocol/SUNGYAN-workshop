"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import BilingualText from "./BilingualText";
import { useLanguage } from "./LanguageProvider";
import { languageOption } from "@/lib/i18n";

function formatMonth(year: string, monthIndex: number, language: Parameters<typeof languageOption>[0]) {
  return new Intl.DateTimeFormat(languageOption(language).locale, { year: "numeric", month: "long" }).format(new Date(Number(year), monthIndex, 1));
}

interface Props {
  groups: Record<string, PostMeta[]>;
  sortedKeys: string[];
}

export default function TimelineClient({ groups, sortedKeys }: Props) {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { primaryLanguage, secondaryLanguage } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    sectionRefs.current.forEach((element) => {
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {sortedKeys.map((ym, idx) => {
        const [year, month] = ym.split("-");
        const monthIndex = parseInt(month, 10) - 1;
        return (
          <div
            key={ym}
            className="timeline-section"
            ref={(element) => { sectionRefs.current[idx] = element; }}
            style={{ marginBottom: "2.5rem" }}
          >
            <h2 className="timeline-heading">
              <span className="bilingual-text bilingual-text--compact">
                <span className="bilingual-primary">{formatMonth(year, monthIndex, primaryLanguage)}</span>
                <span className="bilingual-secondary">{formatMonth(year, monthIndex, secondaryLanguage)}</span>
              </span>
            </h2>
            <div className="timeline-list">
              {groups[ym].map((post) => (
                <div key={post.slug} className="timeline-row">
                  <span className="timeline-date">{post.date.slice(5).replace("-", "/")}</span>
                  <Link href={`/logs/${post.slug}`} className="breath-link timeline-title">
                    <BilingualText zh={post.title} en={post.title_en} />
                  </Link>
                  <span className="timeline-category">
                    <BilingualText zh={post.category} en={post.category_en} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
