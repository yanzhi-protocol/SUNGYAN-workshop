import Link from "next/link";
import Nav from "@/components/Nav";
import BilingualText from "@/components/BilingualText";
import UpdateFeed from "@/components/UpdateFeed";
import { UI } from "@/lib/i18n";
import { getAllUpdates, getUpdateCounts } from "@/lib/updates";

export const metadata = {
  title: "最新動態 · 宋言的工房",
  description: "宋言的工房圖片與影片最新動態。",
};

export default function UpdatesPage() {
  const updates = getAllUpdates();
  const counts = getUpdateCounts(updates);

  return (
    <>
      <Nav />
      <main className="page-shell page-narrow updates-page">
        <BilingualText as="h1" className="page-title" value={UI.pages.updates.title} />
        <BilingualText as="p" className="page-intro" value={UI.pages.updates.intro} preserveLineBreaks />

        <section className="updates-overview" aria-label="最新動態摘要 / Latest updates summary">
          <div>
            <span>RECORDS / 記錄</span>
            <strong>{counts.total.toString().padStart(2, "0")} <BilingualText value={UI.pages.updates.count} /></strong>
          </div>
          <div>
            <span>IMAGES / 圖片</span>
            <strong>{counts.images.toString().padStart(2, "0")}</strong>
          </div>
          <div>
            <span>VIDEOS / 影片</span>
            <strong>{counts.videos.toString().padStart(2, "0")}</strong>
          </div>
        </section>

        <section className="updates-upload-note" aria-labelledby="updates-upload-title">
          <div>
            <BilingualText as="h2" id="updates-upload-title" className="small-section-title" value={UI.pages.updates.guide} />
            <p>GitHub: <code>public/updates/</code></p>
            <p className="updates-upload-note-copy">檔名開頭使用 UTC 時間，雙底線後接文案；網站會自動依時間由新到舊排列。</p>
          </div>
          <Link
            className="updates-upload-link"
            href="https://github.com/yanzhi-protocol/SUNGYAN-workshop/tree/main/public/updates"
            target="_blank"
            rel="noreferrer"
          >
            Open GitHub ↗
          </Link>
        </section>

        {updates.length > 0 ? (
          <UpdateFeed updates={updates} />
        ) : (
          <section className="updates-empty">
            <BilingualText value={UI.pages.updates.empty} preserveLineBreaks />
          </section>
        )}
      </main>
    </>
  );
}
