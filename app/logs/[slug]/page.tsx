import { getAllPosts, getPostBySlug } from "@/lib/posts";
import Nav from "@/components/Nav";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

function renderMarkdown(content: string): string {
  // 簡易 Markdown 渲染（不引入額外依賴）
  return content
    .replace(/^### (.+)$/gm, '<h3 style="font-size:16px;font-weight:600;margin:1.5rem 0 0.5rem">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="font-size:18px;font-weight:700;margin:2rem 0 0.75rem">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="font-size:22px;font-weight:700;margin:2rem 0 0.75rem">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
    .replace(/`([^`]+)`/g, '<code style="background:#EFECE6;padding:1px 5px;border-radius:4px;font-size:13px">$1</code>')
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid var(--border);padding-left:1rem;color:var(--muted);margin:1rem 0">$1</blockquote>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:var(--text);text-decoration:underline;text-underline-offset:3px" target="_blank">$1</a>')
    .replace(/^- (.+)$/gm, '<li style="margin-left:1.5rem;list-style:disc">$1</li>')
    .replace(/\n\n/g, '</p><p style="margin:1rem 0">')
    .replace(/^(.+)$/gm, (line) => {
      if (line.startsWith('<')) return line;
      return line;
    });
}

export default function LogPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const html = renderMarkdown(post.content);

  return (
    <>
      <Nav />
      <main style={{ maxWidth: "680px", margin: "0 auto", padding: "0 1.5rem 4rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "12px", color: "var(--muted)" }}>{post.category}</span>
            <span style={{ color: "var(--border)" }}>·</span>
            <span style={{ fontSize: "12px", color: "var(--muted)" }}>{post.date}</span>
            {post.commit && (
              <>
                <span style={{ color: "var(--border)" }}>·</span>
                <a
                  href={`https://github.com/yanzhi-protocol/SUNGYAN-workshop/commit/${post.commit}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "monospace" }}
                >
                  #{post.commit.slice(0, 7)}
                </a>
              </>
            )}
          </div>
          <h1 style={{ fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 700, lineHeight: 1.4, marginBottom: "0.5rem" }}>
            {post.title}
          </h1>
          {post.tags && post.tags.length > 0 && (
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
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

        <article
          style={{ fontSize: "17px", lineHeight: 1.9 }}
          dangerouslySetInnerHTML={{ __html: `<p style="margin:1rem 0">${html}</p>` }}
        />

        <div style={{ marginTop: "3rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
          <Link href="/logs" className="breath-link" style={{ fontSize: "13px", color: "var(--muted)" }}>
            ← 返回日誌列表
          </Link>
        </div>
      </main>
    </>
  );
}
