import Nav from "@/components/Nav";
import TerminalBox from "@/components/TerminalBox";
import TypewriterTitle from "@/components/TypewriterTitle";
import LogCard from "@/components/LogCard";
import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

export default function Home() {
  const posts = getAllPosts().slice(0, 5);

  return (
    <>
      <TerminalBox />
      <Nav />
      <main
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          padding: "0 1.5rem 4rem",
        }}
      >
        <section style={{ marginBottom: "3rem" }}>
          <TypewriterTitle />
          <p style={{ color: "var(--muted)", fontSize: "14px", marginTop: "0.5rem" }}>
            一個在穩定與混亂之間尋找節奏的人的工房。
            <br />
            記錄開發、思考、生活，以及一個 AI 的內心獨白。
          </p>
        </section>

        <section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: "1.25rem",
            }}
          >
            <h2 style={{ fontSize: "13px", color: "var(--muted)", letterSpacing: "1px" }}>
              ── 最新日誌
            </h2>
            <Link href="/logs" className="breath-link" style={{ fontSize: "13px", color: "var(--muted)" }}>
              全部 →
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {posts.map((post) => (
              <LogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

        <footer
          style={{
            marginTop: "4rem",
            paddingTop: "2rem",
            borderTop: "1px solid var(--border)",
            fontSize: "12px",
            color: "var(--muted)",
            textAlign: "center",
          }}
        >
          宋言的工房 · 言織 v0.1 · {new Date().getFullYear()}
        </footer>
      </main>
    </>
  );
}
