interface Env {
  ADMIN_SECRET: string;
  GITHUB_TOKEN: string;
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
}

interface CommitBody {
  secret: string;
  slug: string;
  content: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const onRequestPost = async (context: any) => {
  const env = context.env;

  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  let body: CommitBody;
  try {
    body = (await context.request.json()) as CommitBody;
  } catch {
    return new Response(JSON.stringify({ error: "無效的請求格式" }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  // 驗證密鑰
  if (!body.secret || body.secret !== env.ADMIN_SECRET) {
    return new Response(JSON.stringify({ error: "密鑰錯誤" }), {
      status: 401,
      headers: corsHeaders,
    });
  }

  const { slug, content } = body;
  if (!slug || !content) {
    return new Response(JSON.stringify({ error: "缺少必要欄位" }), {
      status: 400,
      headers: corsHeaders,
    });
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
    // 檢查檔案是否已存在（取得 SHA）
    let sha: string | undefined;
    try {
      const checkRes = await fetch(`${apiBase}/contents/${filePath}`, { headers });
      if (checkRes.ok) {
        const checkData = await checkRes.json() as { sha: string };
        sha = checkData.sha;
      }
    } catch {
      // 檔案不存在，正常
    }

    // 建立或更新檔案
    const contentBase64 = btoa(unescape(encodeURIComponent(content)));
    const commitBody: Record<string, unknown> = {
      message: `feat: add log ${slug}`,
      content: contentBase64,
      branch: "main",
    };
    if (sha) commitBody.sha = sha;

    const putRes = await fetch(`${apiBase}/contents/${filePath}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(commitBody),
    });

    if (!putRes.ok) {
      const errData = (await putRes.json()) as { message?: string };
      throw new Error(errData.message ?? `GitHub API 錯誤 ${putRes.status}`);
    }

    const result = (await putRes.json()) as { commit: { sha: string } };
    return new Response(
      JSON.stringify({
        success: true,
        commit: result.commit?.sha?.slice(0, 7),
        file: filePath,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "未知錯誤";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};

export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};
