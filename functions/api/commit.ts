interface Env {
  ADMIN_SECRET: string;
  GITHUB_TOKEN: string;
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
}

interface CommitBody {
  secret: string;
  slug: string;
  content?: string;
}

// 統一處理邏輯
async function handleCommit(request: Request, env: Env, method: string) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  let body: CommitBody;
  try {
    body = (await request.json()) as CommitBody;
  } catch {
    return new Response(JSON.stringify({ error: "無效的請求格式" }), { status: 400, headers: corsHeaders });
  }

  if (!body.secret || body.secret !== env.ADMIN_SECRET) {
    return new Response(JSON.stringify({ error: "密鑰錯誤" }), { status: 401, headers: corsHeaders });
  }

  const { slug, content } = body;
  if (!slug) {
    return new Response(JSON.stringify({ error: "缺少必要欄位 slug" }), { status: 400, headers: corsHeaders });
  }

  const owner = env.GITHUB_OWNER || "yanzhi-protocol";
  const repo = env.GITHUB_REPO || "SUNGYAN-workshop";
  const token = env.GITHUB_TOKEN;
  const filePath = `content/logs/${slug}.md`;

  const apiBase = `https://api.github.com/repos/${owner}/${repo}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "User-Agent": "sungyan-workshop-admin",
    Accept: "application/vnd.github+json",
  };

  try {
    // 1. 檢查檔案是否已存在（取得 SHA）
    let sha: string | undefined;
    const checkRes = await fetch(`${apiBase}/contents/${filePath}`, { headers });
    if (checkRes.ok) {
      const checkData = await checkRes.json() as { sha: string };
      sha = checkData.sha;
    }

    if (method === "POST") {
      if (!content) throw new Error("缺少內容");
      const contentBase64 = btoa(unescape(encodeURIComponent(content)));
      const commitBody: Record<string, unknown> = {
        message: `feat: update log ${slug}`,
        content: contentBase64,
        branch: "main",
      };
      if (sha) commitBody.sha = sha;

      const putRes = await fetch(`${apiBase}/contents/${filePath}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(commitBody),
      });

      if (!putRes.ok) throw new Error("GitHub API PUT 錯誤");
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });

    } else if (method === "DELETE") {
      if (!sha) throw new Error("找不到該文章，無法刪除");
      
      const deleteRes = await fetch(`${apiBase}/contents/${filePath}`, {
        method: "DELETE",
        headers,
        body: JSON.stringify({
          message: `refactor: delete log ${slug}`,
          sha: sha,
          branch: "main",
        }),
      });

      if (!deleteRes.ok) throw new Error("GitHub API DELETE 錯誤");
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ error: "不支援的方法" }), { status: 405, headers: corsHeaders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "未知錯誤";
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: corsHeaders });
  }
}

export const onRequestPost = async (context: any) => handleCommit(context.request, context.env, "POST");
export const onRequestDelete = async (context: any) => handleCommit(context.request, context.env, "DELETE");

export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};
