"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import BilingualText from "./BilingualText";
import { useLanguage } from "./LanguageProvider";

const MONTH_NAMES = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
const MONTH_NAMES_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

interface Props {
  groups: Record<string, PostMeta[]>;
  sortedKeys: string[];
}

export default function TimelineClient({ groups, sortedKeys }: Props) {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { language } = useLanguage();

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
                <span className="bilingual-primary">{language === "zh" ? `${year} 年 ${MONTH_NAMES[monthIndex]}` : `${year} ${MONTH_NAMES_EN[monthIndex]}`}</span>
                <span className="bilingual-secondary">{language === "zh" ? `${year} ${MONTH_NAMES_EN[monthIndex]}` : `${year} 年 ${MONTH_NAMES[monthIndex]}`}</span>
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
