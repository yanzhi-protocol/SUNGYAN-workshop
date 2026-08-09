import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

const CATEGORY_COLORS: Record<string, string> = {
  "開發日誌": "#4f8f67",
  "思想碎片": "#7e9fbe",
  "生活記錄": "#c1954d",
  "AI 日記": "#b47791",
};

export default function LogCard({ post }: { post: PostMeta }) {
  const color = CATEGORY_COLORS[post.category] ?? "#8d8275";

  return (
    <article className="log-card">
      <div className="log-meta">
        <span
          aria-hidden="true"
          style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }}
        />
        <span>{post.category}</span>
        {post.ai_diary && <span className="ai-badge">AI NOTE</span>}
        <time className="log-meta-date" dateTime={post.date.replace(/\//g, "-")}>{post.date}</time>
      </div>

      <h2 className="log-title">{post.title}</h2>
      {post.excerpt && <p className="log-excerpt">{post.excerpt}</p>}

      <div className="log-footer">
        <Link href={`/logs/${post.slug}`} className="read-link">
          閱讀全文 →
        </Link>
        {post.commit && (
          <a
            href={`https://github.com/yanzhi-protocol/SUNGYAN-workshop/commit/${post.commit}`}
            target="_blank"
            rel="noopener noreferrer"
            className="commit-link"
          >
            #{post.commit.slice(0, 7)}
          </a>
        )}
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className="tag-list" aria-label="文章標籤">
          {post.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
        </div>
      )}
    </article>
  );
}
