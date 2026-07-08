import Nav from "@/components/Nav";
import LogCard from "@/components/LogCard";
import { getAllPosts, getAllCategories } from "@/lib/posts";

export default function LogsPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();

  return (
    <>
      <Nav />
      <main style={{ maxWidth: "680px", margin: "0 auto", padding: "0 1.5rem 4rem" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "0.5rem" }}>
          開發日誌
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "2rem" }}>
          共 {posts.length} 篇 · 涵蓋{" "}
          {categories.join("、")}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {posts.map((post) => (
            <LogCard key={post.slug} post={post} />
          ))}
        </div>
      </main>
    </>
  );
}
