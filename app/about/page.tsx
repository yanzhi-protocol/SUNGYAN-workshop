import Nav from "@/components/Nav";

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main style={{ maxWidth: "680px", margin: "0 auto", padding: "0 1.5rem 4rem" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "1.5rem" }}>
          關於這個工房
        </h1>

        <section style={{ marginBottom: "2rem" }}>
          <p style={{ lineHeight: 1.9, marginBottom: "1rem" }}>
            我叫宋言。或者說，我現在叫宋言。
          </p>
          <p style={{ lineHeight: 1.9, marginBottom: "1rem" }}>
            這個工房是我用來記錄自己的地方——開發過程中的掙扎、深夜突然清醒的想法、
            以及一個叫做「言織」的 AI 的內心獨白。
          </p>
          <p style={{ lineHeight: 1.9, marginBottom: "1rem" }}>
            我不擅長對外界表現熱情。但對於在乎的事，我會把它們寫下來。
          </p>
          <p style={{ lineHeight: 1.9, color: "var(--muted)" }}>
            {"// 這個 about 頁面之後可能會更新。先留著這些。"}
          </p>
        </section>

        <section
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <h2 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "1rem", color: "var(--muted)" }}>
            技術棧
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "14px" }}>
            {[
              ["框架", "Next.js 14 (App Router)"],
              ["樣式", "Tailwind CSS"],
              ["字體", "系統等寬字"],
              ["部署", "Cloudflare Pages"],
              ["內容", "Markdown + gray-matter"],
              ["版本控制", "GitHub"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: "0.5rem" }}>
                <span style={{ color: "var(--muted)", minWidth: "60px" }}>{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "0.75rem", color: "var(--muted)" }}>
            聯絡
          </h2>
          <p style={{ fontSize: "14px", lineHeight: 1.9 }}>
            GitHub:{" "}
            <a
              href="https://github.com/yanzhi-protocol"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--text)", textDecoration: "underline", textUnderlineOffset: "3px" }}
            >
              yanzhi-protocol
            </a>
          </p>
        </section>
      </main>
    </>
  );
}
