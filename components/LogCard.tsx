import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import BilingualText from "./BilingualText";

const CATEGORY_COLORS: Record<string, string> = {
  "開發日誌": "#4f8f67",
  "思想碎片": "#7e9fbe",
  "生活記錄": "#c1954d",
  "AI 日記": "#b47791",
  "流浪日誌": "#c1954d",
  "震驚日誌": "#b47791",
};

export default function LogCard({ post, index = 0 }: { post: PostMeta; index?: number }) {
  const color = CATEGORY_COLORS[post.category] ?? "#8d8275";

  return (
    <article className="log-card">
      <span className="log-card-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <div className="log-meta">
        <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
        <BilingualText zh={post.category} en={post.category_en} />
        {post.ai_diary && <span className="ai-badge">AI NOTE</span>}
        <time className="log-meta-date" dateTime={post.date.replace(/\//g, "-")}>{post.date}</time>
      </div>

      <BilingualText as="h2" className="log-title" zh={post.title} en={post.title_en} />
      {post.excerpt && post.excerpt_en && (
        <BilingualText as="p" className="log-excerpt" zh={post.excerpt} en={post.excerpt_en} />
      )}

      <div className="log-footer">
        <Link href={`/logs/${post.slug}`} className="read-link">
          <BilingualText zh="閱讀全文 →" en="Read more →" />
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
        <div className="tag-list" aria-label="文章標籤 / Article tags">
          {post.tags.map((tag, index) => (
            <span key={tag} className="tag">
              <BilingualText zh={tag} en={post.tags_en[index] ?? tag} />
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
