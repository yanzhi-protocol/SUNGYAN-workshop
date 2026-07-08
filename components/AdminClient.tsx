"use client";
import { useState, useEffect } from "react";

const CATEGORIES = ["開發日誌", "思想碎片", "生活記錄", "AI 日記"];

interface PostMeta {
  slug: string;
  title: string;
  date: string;
  category: string;
}

export default function AdminClient() {
  const [secret, setSecret] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [authError, setAuthError] = useState("");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [tags, setTags] = useState("");
  const [aiDiary, setAiDiary] = useState(false);
  const [content, setContent] = useState("");

  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // 取得文章列表 (這裡因為是靜態匯出，我們透過 API 或從 build 時期傳入，
  // 但為了方便，我們在解鎖後嘗試從本地 API 獲取，或者提示用戶手動輸入 slug 刪除)
  // 由於是 output: export，我們無法在客戶端直接讀取檔案系統。
  // 我們改為：解鎖後顯示「發布文章」和「刪除指定文章」兩個區塊。

  function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (!secret.trim()) {
      setAuthError("請輸入密鑰");
      return;
    }
    setUnlocked(true);
    setAuthError("");
  }

  async function handleDelete(slug: string) {
    if (!confirm(`確定要刪除「${slug}」嗎？這將會從 GitHub 移除檔案。`)) return;
    
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/commit", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, slug }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }

      alert("刪除成功！GitHub 正在重新部署。");
      setStatus("idle");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "刪除失敗");
    }
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
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div style={{ width: "100%", maxWidth: "360px", padding: "2rem", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px" }}>
          <h1 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "0.25rem" }}>工房後台</h1>
          <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "1.5rem" }}>輸入管理密鑰以繼續</p>
          <form onSubmit={handleUnlock}>
            <input type="password" placeholder="ADMIN_SECRET" value={secret} onChange={(e) => setSecret(e.target.value)} style={{ ...inputStyle, marginBottom: "0.75rem" }} />
            {authError && <p style={{ fontSize: "13px", color: "#ef4444", marginBottom: "0.75rem" }}>{authError}</p>}
            <button type="submit" style={{ width: "100%", background: "var(--text)", color: "var(--bg)", border: "none", borderRadius: "8px", padding: "0.65rem", fontSize: "15px", cursor: "pointer", fontFamily: "inherit" }}>解鎖</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: "680px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700 }}>工房管理</h1>
        <span style={{ fontSize: "12px", color: "var(--muted)" }}>已解鎖</span>
      </div>

      <section style={{ marginBottom: "3rem", padding: "1.5rem", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px" }}>
        <h2 style={{ fontSize: "16px", marginBottom: "1rem" }}>發布新日誌</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="標題 *" style={inputStyle} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="標籤 (tag1, tag2)" style={inputStyle} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input type="checkbox" id="ai_diary" checked={aiDiary} onChange={(e) => setAiDiary(e.target.checked)} />
            <label htmlFor="ai_diary" style={{ fontSize: "14px" }}>這是 AI 日記 🤖</label>
          </div>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Markdown 內容 *" rows={10} style={{ ...inputStyle, resize: "vertical" }} />
          {errorMsg && <p style={{ fontSize: "13px", color: "#ef4444" }}>{errorMsg}</p>}
          <button type="submit" disabled={status === "loading"} style={{ background: status === "success" ? "#4ADE80" : "var(--text)", color: status === "success" ? "#1a1a1a" : "var(--bg)", border: "none", borderRadius: "8px", padding: "0.75rem", fontWeight: 600, cursor: "pointer" }}>
            {status === "loading" ? "處理中..." : status === "success" ? "✓ 已發布" : "發布文章"}
          </button>
        </form>
      </section>

      <section style={{ padding: "1.5rem", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px" }}>
        <h2 style={{ fontSize: "16px", marginBottom: "1rem" }}>刪除文章</h2>
        <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "1rem" }}>請輸入文章的 slug (例如: 2026-06-29-init-workshop) 進行刪除：</p>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input 
            type="text" 
            id="delete-slug"
            placeholder="文章 slug" 
            style={inputStyle} 
          />
          <button 
            onClick={() => {
              const input = document.getElementById("delete-slug") as HTMLInputElement;
              if (input.value) handleDelete(input.value);
            }}
            style={{ background: "#ef4444", color: "white", border: "none", borderRadius: "8px", padding: "0 1.5rem", cursor: "pointer", whiteSpace: "nowrap" }}
          >
            刪除
          </button>
        </div>
      </section>
    </main>
  );
}
