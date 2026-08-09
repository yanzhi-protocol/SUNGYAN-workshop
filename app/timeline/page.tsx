import Nav from "@/components/Nav";
import BilingualText from "@/components/BilingualText";
import { getAllPosts } from "@/lib/posts";
import TimelineClient from "@/components/TimelineClient";
import { UI } from "@/lib/i18n";

export default function TimelinePage() {
  const posts = getAllPosts();
  const groups: Record<string, typeof posts> = {};
  for (const post of posts) {
    const ym = post.date.slice(0, 7);
    if (!groups[ym]) groups[ym] = [];
    groups[ym].push(post);
  }
  const sortedKeys = Object.keys(groups).sort((a, b) => (a < b ? 1 : -1));

  return (
    <>
      <Nav />
      <main className="page-shell page-narrow">
        <BilingualText as="h1" className="page-title" zh={UI.pages.timeline.title.zh} en={UI.pages.timeline.title.en} />
        <BilingualText as="p" className="page-intro" zh={UI.pages.timeline.intro.zh} en={UI.pages.timeline.intro.en} />
        <TimelineClient groups={groups} sortedKeys={sortedKeys} />
      </main>
    </>
  );
}
