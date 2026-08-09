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
          <BilingualText as="p" className="eyebrow" zh={UI.home.eyebrow.zh} en={UI.home.eyebrow.en} />
          <TypewriterTitle />
          <BilingualText
            as="p"
            className="hero-copy"
            zh={UI.home.description.zh}
            en={UI.home.description.en}
            preserveLineBreaks
          />
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
