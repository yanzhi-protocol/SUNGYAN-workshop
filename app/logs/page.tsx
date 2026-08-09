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

        <div className="log-list">
          {posts.map((post) => (
            <LogCard key={post.slug} post={post} />
          ))}
        </div>
      </main>
    </>
  );
}
