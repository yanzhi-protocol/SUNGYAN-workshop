"use client";
import { useState } from "react";

const CATEGORIES = ["開發日誌", "思想碎片", "生活記錄", "AI 日記"];

export default function AdminClient() {
  const [secret, setSecret] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [authError, setAuthError] = useState("");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [tags, setTags] = useState("");
  const [aiDiary, setAiDiary] = useState(false);
  const [content, setContent] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (!secret.trim()) {
      setAuthError("請輸入密鑰");
      return;
    }
    // 前端驗證：實際驗證在 API 端
    setUnlocked(true);
    setAuthError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setErrorMsg("標題和內容為必填項目");
      return;
    }
    setStatus("loading");
    setErrorMsg("");

    const today = new Date().toISOString().slice(0, 10);
    const slug = `${today}-${title
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fff]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40)}`;

    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${today}"
category: "${category}"
tags: [${tagList.map((t) => `"${t}"`).join(", ")}]
ai_diary: ${aiDiary}
---

`;
    const fullContent = frontmatter + content;

    try {
      const res = await fetch("/api/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret,
          slug,
          content: fullContent,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }

      setStatus("success");
      setTitle("");
      setContent("");
      setTags("");
      setAiDiary(false);
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "發布失敗，請稍後再試");
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "0.6rem 0.75rem",
    fontSize: "15px",
    color: "var(--text)",
    fontFamily: "inherit",
    outline: "none",
  };

  if (!unlocked) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "360px",
            padding: "2rem",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
          }}
        >
          <h1 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "0.25rem" }}>
            工房後台
          </h1>
          <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "1.5rem" }}>
            輸入管理密鑰以繼續
          </p>
          <form onSubmit={handleUnlock}>
            <input
              type="password"
              placeholder="ADMIN_SECRET"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              style={{ ...inputStyle, marginBottom: "0.75rem" }}
            />
            {authError && (
              <p style={{ fontSize: "13px", color: "#ef4444", marginBottom: "0.75rem" }}>
                {authError}
              </p>
            )}
            <button
              type="submit"
              style={{
                width: "100%",
                background: "var(--text)",
                color: "var(--bg)",
                border: "none",
                borderRadius: "8px",
                padding: "0.65rem",
                fontSize: "15px",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "transform 200ms",
              }}
            >
              解鎖
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: "680px",
        margin: "0 auto",
        padding: "2rem 1.5rem 4rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ fontSize: "20px", fontWeight: 700 }}>發布新日誌</h1>
        <span style={{ fontSize: "12px", color: "var(--muted)" }}>
          工房後台 · 已解鎖
        </span>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{ fontSize: "13px", color: "var(--muted)", display: "block", marginBottom: "0.4rem" }}>
            標題 *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="文章標題"
            style={inputStyle}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: "13px", color: "var(--muted)", display: "block", marginBottom: "0.4rem" }}>
              分類
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ ...inputStyle }}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: "13px", color: "var(--muted)", display: "block", marginBottom: "0.4rem" }}>
              標籤（逗號分隔）
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="tag1, tag2"
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            id="ai_diary"
            checked={aiDiary}
            onChange={(e) => setAiDiary(e.target.checked)}
            style={{ width: "16px", height: "16px", cursor: "pointer" }}
          />
          <label
            htmlFor="ai_diary"
            style={{ fontSize: "14px", cursor: "pointer" }}
          >
            這是 AI 日記 🤖
          </label>
        </div>

        <div>
          <label style={{ fontSize: "13px", color: "var(--muted)", display: "block", marginBottom: "0.4rem" }}>
            內容（Markdown）*
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="在這裡撰寫 Markdown 內容..."
            rows={16}
            style={{
              ...inputStyle,
              resize: "vertical",
              lineHeight: 1.7,
            }}
          />
        </div>

        {errorMsg && (
          <p style={{ fontSize: "13px", color: "#ef4444" }}>{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          style={{
            background:
              status === "success"
                ? "#4ADE80"
                : status === "loading"
                ? "var(--muted)"
                : "var(--text)",
            color: status === "success" ? "#1a1a1a" : "var(--bg)",
            border: "none",
            borderRadius: "8px",
            padding: "0.75rem",
            fontSize: "15px",
            cursor: status === "loading" ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            transition: "background 300ms ease-out, transform 200ms",
            fontWeight: 600,
          }}
        >
          {status === "loading"
            ? "發布中..."
            : status === "success"
            ? "✓ 已發布"
            : "發布文章"}
        </button>
      </form>
    </main>
  );
}
