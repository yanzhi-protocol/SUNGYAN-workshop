import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Nav from "@/components/Nav";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default function LogPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <>
      <Nav />
      <main className="page-shell">
        <header className="article-header">
          <div className="article-meta">
            <span>{post.category}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.date}>{post.date}</time>
            {post.commit && (
              <>
                <span aria-hidden="true">·</span>
                <a
                  href={`https://github.com/yanzhi-protocol/SUNGYAN-workshop/commit/${post.commit}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  #{post.commit.slice(0, 7)}
                </a>
              </>
            )}
          </div>
          <h1 className="article-title">{post.title}</h1>
          {post.tags && post.tags.length > 0 && (
            <div className="tag-list" aria-label="文章標籤">
              {post.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
            </div>
          )}
        </header>

        <article className="article-body">
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
            {post.content}
          </ReactMarkdown>
        </article>

        <Link href="/logs" className="back-link">
          ← 返回日誌列表
        </Link>
      </main>
    </>
  );
}
