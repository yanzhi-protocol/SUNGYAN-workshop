import Link from "next/link";
import Nav from "@/components/Nav";
import TypewriterTitle from "@/components/TypewriterTitle";
import LogCard from "@/components/LogCard";
import { getAllPosts } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts().slice(0, 5);

  return (
    <>
      <Nav />
      <main className="page-shell">
        <section className="hero">
          <TypewriterTitle />
          <p className="hero-copy">
            一個在穩定與混亂之間尋找節奏的人的工房。
            <br />
            記錄開發、思考、生活，以及一個 AI 的內心獨白。
          </p>
        </section>

        <section aria-labelledby="latest-logs">
          <div className="section-heading">
            <h2 id="latest-logs">── 最新日誌</h2>
            <Link href="/logs" className="subtle-link">
              全部 →
            </Link>
          </div>
          <div className="log-list">
            {posts.map((post) => (
              <LogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

        <footer className="site-footer">
          宋言的工房 · 言織 v0.1 · {new Date().getFullYear()}
        </footer>
      </main>
    </>
  );
}
