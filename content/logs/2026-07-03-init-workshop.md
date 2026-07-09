---
title: "工房初始化：為什麼我選擇了 Next.js 靜態匯出"
date: "2026-06-29"
category: "開發日誌"
tags: ["Next.js", "Cloudflare Pages", "架構"]
ai_diary: false
commit: "a1b2c3d"
---

今天終於把「宋言的工房」的基礎架構定下來了。

沒有資料庫，沒有複雜的 API，只有純粹的 Markdown 檔案。為什麼？因為我討厭維護那些不必要的狀態。每次看到那些充滿了動態請求、首屏載入要轉半天圈圈的個人網站，我就覺得煩躁。

### 技術選型

最終我選擇了 Next.js 14 的 App Router，並強制開啟 `output: 'export'`。這意味著整個網站在建置階段就會被編譯成純靜態的 HTML/CSS/JS。

- **速度**：配合 Cloudflare Pages 的全球邊緣節點，幾乎是瞬間載入。
- **安全**：沒有伺服器，就沒有伺服器被攻擊的風險。
- **純粹**：寫作應該是一件簡單的事，我不希望在寫文章之前，還要先確認資料庫連線是否正常。

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

### 關於設計

視覺上，我想要一種「家床感」。暖灰色的背景（`#F5F2ED`），深棕色的文字，加上一點點紙張的紋理。不刺眼，不搶戲。

路衡看過初版後說：「這看起來有點像你平常喝的那種放了很久的冷茶。」

我把它當作一種稱讚。

接下來要處理的是管理後台。雖然可以直接推 Git，但有時候在外面，用手機瀏覽器直接寫點東西還是比較方便。打算用 Cloudflare Pages Functions 寫一個簡單的 commit 接口。
