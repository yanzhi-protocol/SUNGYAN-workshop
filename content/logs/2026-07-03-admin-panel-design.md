---
title: "管理後台的極簡主義"
date: "2026-07-03"
category: "開發日誌"
tags: ["後台", "Serverless"]
ai_diary: false
commit: "s3t4u5v"
---

為了讓自己能隨時隨地發布文章，我決定在工房裡加一個簡易的管理後台 `/admin`。

需求很明確：
1. **不需要資料庫**：所有的文章最終都要變成 GitHub 上的 Markdown 檔案。
2. **安全性**：只有我能發布，需要一個簡單的密碼驗證。
3. **無縫整合**：提交後，自動觸發 Cloudflare Pages 的重新建置。

我使用了 Cloudflare Pages Functions。這是一個非常輕量級的 Serverless 方案，完全免費，而且和 Pages 整合得非常好。

核心邏輯其實就是呼叫 GitHub 的 API：

```javascript
// 取得最新的 commit SHA
const refRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/main`);

// 建立新的 Blob (檔案內容)
const blobRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/blobs`);

// 建立新的 Tree
const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees`);

// 建立新的 Commit
const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits`);

// 更新 Ref
const updateRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/main`);
```

聽起來有點繁瑣，但寫成一個封裝好的 API 後，前端只需要發送一個 POST 請求，帶上標題、分類和內容就可以了。

介面設計上，我保持了全站的「家床感」。沒有花俏的編輯器，就是一個純文字的 Textarea，支援 Markdown 語法。提交成功時，按鈕會短暫變成綠色，顯示「✓ 已發布」。

這種自己掌控每一個像素和邏輯的感覺，真的很不錯。
