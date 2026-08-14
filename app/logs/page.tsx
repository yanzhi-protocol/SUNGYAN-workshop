import Nav from "@/components/Nav";
import LogCard from "@/components/LogCard";
import BilingualText from "@/components/BilingualText";
import { getAllPosts, getAllCategories } from "@/lib/posts";
import { categoryEnglish, UI } from "@/lib/i18n";

export default function LogsPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const categoriesZh = categories.join("、");
  const categoriesEn = categories.map(categoryEnglish).join(", ");

  return (
    <>
      <Nav />
      <main className="page-shell page-narrow">
        <BilingualText as="h1" className="page-title" zh={UI.pages.logs.title.zh} en={UI.pages.logs.title.en} />
        <BilingualText
          as="p"
          className="page-intro"
          zh={UI.pages.logs.summary.zh.replace("{count}", String(posts.length)).replace("{categories}", categoriesZh)}
          en={UI.pages.logs.summary.en.replace("{count}", String(posts.length)).replace("{categories}", categoriesEn)}
        />

        <div className="archive-overview" aria-label="檔案庫摘要 / Archive overview">
          <div><span>RECORDS / 記錄</span><strong>{posts.length.toString().padStart(2, "0")}</strong></div>
          <div><span>STREAMS / 類別</span><strong>{categories.length.toString().padStart(2, "0")}</strong></div>
          <div><span>UPDATED / 更新</span><strong>{posts[0]?.date.split("T")[0] ?? "—"}</strong></div>
        </div>
        <div className="category-strip" aria-label="文章分類 / Article categories">
          {categories.map((category) => (
            <span className="category-chip" key={category}>
              <span className="category-chip-dot" aria-hidden="true" />
              <BilingualText zh={category} en={categoryEnglish(category)} />
            </span>
          ))}
        </div>

        <div className="log-list">
          {posts.map((post, index) => (
            <LogCard key={post.slug} post={post} index={index} />
          ))}
        </div>
      </main>
    </>
  );
}
