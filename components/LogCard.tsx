import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

const CATEGORY_COLORS: Record<string, string> = {
  "開發日誌": "#4ADE80",
  "思想碎片": "#93C5FD",
  "生活記錄": "#FCD34D",
  "AI 日記": "#F9A8D4",
};

export default function LogCard({ post }: { post: PostMeta }) {
  const color = CATEGORY_COLORS[post.category] ?? "#B0A89E";
  return (
    <div className="log-card">
      {post.ai_diary && (
        <span
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            fontSize: "16px",
          }}
          title="AI 日記"
        >
          🤖<span className="ai-pulse" />
        </span>
      )}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: color,
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: "12px", color: "var(--muted)" }}>
          {post.category}
        </span>
        <span style={{ fontSize: "12px", color: "var(--muted)", marginLeft: "auto" }}>
          {post.date}
        </span>
      </div>
      <h2
        style={{
          fontSize: "17px",
          fontWeight: 600,
          marginBottom: "0.5rem",
          lineHeight: 1.5,
        }}
      >
        {post.title}
      </h2>
      {post.excerpt && (
        <p
          style={{
            fontSize: "14px",
            color: "var(--muted)",
            lineHeight: 1.7,
            marginBottom: "0.75rem",
          }}
        >
          {post.excerpt}
        </p>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          href={`/logs/${post.slug}`}
          className="breath-link"
          style={{ fontSize: "13px" }}
        >
          閱讀全文 →
        </Link>
        {post.commit && (
          <a
            href={`https://github.com/yanzhi-protocol/SUNGYAN-workshop/commit/${post.commit}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "11px",
              color: "var(--muted)",
              fontFamily: "monospace",
              textDecoration: "none",
            }}
          >
            #{post.commit.slice(0, 7)}
          </a>
        )}
      </div>
      {post.tags && post.tags.length > 0 && (
        <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {post.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: "11px",
                background: "var(--border)",
                color: "var(--muted)",
                padding: "1px 8px",
                borderRadius: "99px",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
