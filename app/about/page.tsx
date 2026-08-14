import Nav from "@/components/Nav";
import BilingualText from "@/components/BilingualText";
import { UI } from "@/lib/i18n";
import SocialLinks from "@/components/SocialLinks";

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
        <BilingualText as="h1" className="page-title" value={UI.pages.about.title} />

        <section className="about-copy">
          {UI.pages.about.paragraphs.map((paragraph) => (
            <BilingualText
              key={paragraph.zh}
              as="p"
              value={paragraph}
              preserveLineBreaks
            />
          ))}
        </section>

        <section className="about-card">
          <BilingualText as="h2" className="small-section-title" value={UI.pages.about.stack} />
          <div className="stack-grid">
            {stack.map(([zh, en, value]) => (
              <div key={zh} className="stack-row">
                <BilingualText zh={zh} en={en} />
                <span>{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="about-contact">
          <BilingualText as="h2" className="small-section-title" value={UI.pages.about.contact} />
          <BilingualText
            as="p"
            className="contact-intro"
            zh="在以下平台延續對話、閱讀與追蹤工房近況。"
            en="Continue the conversation, reading, and follow the workshop across these platforms."
          />
          <SocialLinks />
        </section>
      </main>
    </>
  );
}
