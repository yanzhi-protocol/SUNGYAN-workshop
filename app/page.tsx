import Link from "next/link";
import Nav from "@/components/Nav";
import TypewriterTitle from "@/components/TypewriterTitle";
import BilingualText from "@/components/BilingualText";
import LogCard from "@/components/LogCard";
import { getAllPosts } from "@/lib/posts";
import { UI } from "@/lib/i18n";

export default function Home() {
  const posts = getAllPosts().slice(0, 5);

  return (
    <>
      <Nav />
      <main className="page-shell">
        <section className="hero">
          <div className="hero-main">
            <BilingualText as="p" className="eyebrow" zh={UI.home.eyebrow.zh} en={UI.home.eyebrow.en} />
            <TypewriterTitle />
            <BilingualText
              as="p"
              className="hero-copy"
              zh={UI.home.description.zh}
              en={UI.home.description.en}
              preserveLineBreaks
            />
          </div>
          <aside className="hero-side" aria-label="工房狀態 / Workshop status">
            <BilingualText zh="持續書寫中" en="Writing in progress" />
            <BilingualText zh="開發、思考與生活" en="Development, thought, life" />
            <BilingualText zh="低光、慢速、保持清醒" en="Low light, slow pace, stay awake" />
            <BilingualText zh="言織 v0.1" en="YanZhi v0.1" />
          </aside>
        </section>

        <section aria-labelledby="latest-logs">
          <div className="section-heading">
            <BilingualText as="h2" id="latest-logs" zh={UI.home.latest.zh} en={UI.home.latest.en} />
            <Link href="/logs" className="subtle-link">
              <BilingualText zh={UI.home.all.zh} en={UI.home.all.en} />
            </Link>
          </div>
          <div className="log-list">
            {posts.map((post) => (
              <LogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

        <footer className="site-footer">
          <BilingualText zh={UI.home.footer.zh} en={UI.home.footer.en} /> · {new Date().getFullYear()}
        </footer>
      </main>
    </>
  );
}
