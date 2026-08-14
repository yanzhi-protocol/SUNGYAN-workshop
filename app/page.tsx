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
            <BilingualText as="p" className="eyebrow" value={UI.home.eyebrow} />
            <TypewriterTitle />
            <BilingualText
              as="p"
              className="hero-copy"
              value={UI.home.description}
              preserveLineBreaks
            />
          </div>
          <aside className="hero-side" aria-label="工房狀態 / Workshop status">
            <BilingualText value={UI.home.status[0]} />
            <BilingualText value={UI.home.status[1]} />
            <BilingualText value={UI.home.status[2]} />
            <BilingualText value={UI.home.status[3]} />
          </aside>
        </section>

        <section aria-labelledby="latest-logs">
          <div className="section-heading">
            <BilingualText as="h2" id="latest-logs" value={UI.home.latest} />
            <Link href="/logs" className="subtle-link">
              <BilingualText value={UI.home.all} />
            </Link>
          </div>
          <div className="log-list">
            {posts.map((post) => (
              <LogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

      </main>
    </>
  );
}
