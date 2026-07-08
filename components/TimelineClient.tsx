"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

const MONTH_NAMES = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"];

interface Props {
  groups: Record<string, PostMeta[]>;
  sortedKeys: string[];
}

export default function TimelineClient({ groups, sortedKeys }: Props) {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

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
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {sortedKeys.map((ym, idx) => {
        const [year, month] = ym.split("-");
        const monthLabel = MONTH_NAMES[parseInt(month, 10) - 1];
        return (
          <div
            key={ym}
            className="timeline-section"
            ref={(el) => { sectionRefs.current[idx] = el; }}
            style={{ marginBottom: "2.5rem" }}
          >
            <h2
              style={{
                fontSize: "13px",
                color: "var(--muted)",
                letterSpacing: "2px",
                marginBottom: "1rem",
              }}
            >
              ── {year} 年 {monthLabel} 月 ──
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {groups[ym].map((post) => (
                <div
                  key={post.slug}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "baseline",
                  }}
                >
                  <span style={{ fontSize: "12px", color: "var(--muted)", flexShrink: 0, minWidth: "60px" }}>
                    {post.date.slice(5).replace("-", "/")}
                  </span>
                  <Link
                    href={`/logs/${post.slug}`}
                    className="breath-link"
                    style={{ fontSize: "15px" }}
                  >
                    {post.title}
                  </Link>
                  <span style={{ fontSize: "11px", color: "var(--muted)", marginLeft: "auto", flexShrink: 0 }}>
                    {post.category}
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
