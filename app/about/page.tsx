import Nav from "@/components/Nav";
import BilingualText from "@/components/BilingualText";
import { UI } from "@/lib/i18n";

const stack = [
  ["框架", "Framework", "Next.js 14 (App Router)"],
  ["樣式", "Styling", "Tailwind CSS"],
  ["字體", "Typography", "系統等寬字 / System monospace"],
  ["部署", "Deployment", "Cloudflare Pages"],
  ["內容", "Content", "Markdown + gray-matter"],
  ["版本控制", "Version control", "GitHub"],
];

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="page-shell page-narrow about-page">
        <BilingualText as="h1" className="page-title" zh={UI.pages.about.title.zh} en={UI.pages.about.title.en} />

        <section className="about-copy">
          {UI.pages.about.paragraphs.map((paragraph) => (
            <BilingualText
              key={paragraph.zh}
              as="p"
              zh={paragraph.zh}
              en={paragraph.en}
              preserveLineBreaks
            />
          ))}
        </section>

        <section className="about-card">
          <BilingualText as="h2" className="small-section-title" zh={UI.pages.about.stack.zh} en={UI.pages.about.stack.en} />
          <div className="stack-grid">
            {stack.map(([zh, en, value]) => (
              <div key={zh} className="stack-row">
                <BilingualText zh={zh} en={en} />
                <span>{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <BilingualText as="h2" className="small-section-title" zh={UI.pages.about.contact.zh} en={UI.pages.about.contact.en} />
          <p className="contact-line">
            <BilingualText zh="GitHub" en="GitHub" />{" "}
            <a href="https://github.com/yanzhi-protocol" target="_blank" rel="noopener noreferrer">
              yanzhi-protocol
            </a>
          </p>
        </section>
      </main>
    </>
  );
}
