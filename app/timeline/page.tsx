import Nav from "@/components/Nav";
import { getAllPosts } from "@/lib/posts";
import TimelineClient from "@/components/TimelineClient";

export default function TimelinePage() {
  const posts = getAllPosts();

  // 按年月分組
  const groups: Record<string, typeof posts> = {};
  for (const post of posts) {
    const ym = post.date.slice(0, 7); // YYYY-MM
    if (!groups[ym]) groups[ym] = [];
    groups[ym].push(post);
  }

  const sortedKeys = Object.keys(groups).sort((a, b) => (a < b ? 1 : -1));

  return (
    <>
      <Nav />
      <main style={{ maxWidth: "680px", margin: "0 auto", padding: "0 1.5rem 4rem" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "0.5rem" }}>
          時間線
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "2.5rem" }}>
          所有記錄，按時間排列。
        </p>
        <TimelineClient groups={groups} sortedKeys={sortedKeys} />
      </main>
    </>
  );
}
