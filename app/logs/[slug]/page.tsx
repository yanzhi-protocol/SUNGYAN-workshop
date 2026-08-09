import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import BilingualText from "@/components/BilingualText";
import BilingualMarkdown from "@/components/BilingualMarkdown";
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
            <BilingualText zh={post.category} en={post.category_en} />
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
          <BilingualText as="h1" className="article-title" zh={post.title} en={post.title_en} />
          {post.tags && post.tags.length > 0 && (
            <div className="tag-list" aria-label="文章標籤 / Article tags">
              {post.tags.map((tag, index) => (
                <span key={tag} className="tag">
                  <BilingualText zh={tag} en={post.tags_en[index] ?? tag} />
                </span>
              ))}
            </div>
          )}
        </header>

        <article className="article-body">
          <BilingualMarkdown zh={post.content} en={post.content_en} />
        </article>

        <Link href="/logs" className="back-link">
          <BilingualText zh="← 返回日誌列表" en="← Back to journal" />
        </Link>
      </main>
    </>
  );
}
