import Link from "next/link";
import Nav from "@/components/Nav";
import TypewriterTitle from "@/components/TypewriterTitle";
import BilingualText from "@/components/BilingualText";
import Greeting from "@/components/Greeting";
import LogCard from "@/components/LogCard";
import { getAllPosts } from "@/lib/posts";
import { UI } from "@/lib/i18n";

export default function Home() {
  const allPosts = getAllPosts();
  const posts = allPosts.slice(0, 5);
  const latestPost = allPosts[0];

  return (
    <>
      <Nav />
      <main className="page-shell">
        <section className="hero">
          <div className="hero-main">
            <BilingualText as="p" className="eyebrow" value={UI.home.eyebrow} />
            <Greeting />
            <TypewriterTitle />
            <BilingualText
              as="p"
              className="hero-copy"
              value={UI.home.description}
              preserveLineBreaks
            />
          </div>
          <aside className="hero-side" aria-label="工房狀態 / Workshop status">
            <div className="hero-side-label"><span className="status-led" aria-hidden="true">●</span> WORKSHOP / LIVE</div>
            <BilingualText value={UI.home.status[0]} />
            <BilingualText value={UI.home.status[1]} />
            <BilingualText value={UI.home.status[2]} />
            <BilingualText value={UI.home.status[3]} />
          </aside>
        </section>

        <section className="workshop-rail" aria-label="工房檔案摘要 / Workshop archive summary">
          <div className="rail-stat">
            <span className="rail-label">RECORDS / 記錄</span>
            <strong>{allPosts.length.toString().padStart(2, "0")}</strong>
          </div>
          <div className="rail-stat">
            <span className="rail-label">LATEST / 最新</span>
            <strong>{latestPost?.date.split("T")[0] ?? "—"}</strong>
          </div>
          <Link href="/timeline" className="rail-action">
            <BilingualText value={UI.nav.timeline} />
            <span aria-hidden="true">↗</span>
          </Link>
        </section>

        <section aria-labelledby="latest-logs">
          <div className="section-heading">
            <BilingualText as="h2" id="latest-logs" value={UI.home.latest} />
            <Link href="/logs" className="subtle-link">
              <BilingualText value={UI.home.all} />
            </Link>
          </div>
          <div className="log-list">
            {posts.map((post, index) => (
              <LogCard key={post.slug} post={post} index={index} />
            ))}
          </div>
        </section>

      </main>
    </>
  );
}
