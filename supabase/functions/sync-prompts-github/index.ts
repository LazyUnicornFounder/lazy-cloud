import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const REPO_OWNER = "LazyUnicornFounder";
const REPO_NAME = "LazyUnicorn";
const GITHUB_API = "https://api.github.com";

// Pretty labels for the product keys
const PRODUCT_LABELS: Record<string, string> = {
  "lazy-run": "Lazy Run",
  "lazy-admin": "Lazy Admin",
  "lazy-blogger": "Lazy Blogger",
  "lazy-seo": "Lazy SEO",
  "lazy-geo": "Lazy GEO",
  "lazy-crawl": "Lazy Crawl",
  "lazy-perplexity": "Lazy Perplexity",
  "lazy-store": "Lazy Store",
  "lazy-pay": "Lazy Pay",
  "lazy-sms": "Lazy SMS",
  "lazy-voice": "Lazy Voice",
  "lazy-stream": "Lazy Stream",
  "lazy-code": "Lazy GitHub",
  "lazy-gitlab": "Lazy GitLab",
  "lazy-linear": "Lazy Linear",
  "lazy-mail": "Lazy Mail",
  "lazy-alert": "Lazy Alert",
  "lazy-telegram": "Lazy Telegram",
  "lazy-contentful": "Lazy Contentful",
  "lazy-supabase": "Lazy Supabase",
  "lazy-security": "Lazy Security",
  "lazy-auth": "Lazy Auth",
  "lazy-design": "Lazy Design",
};

const CATEGORY_MAP: Record<string, string> = {
  "lazy-run": "🚀 Unicorn",
  "lazy-admin": "🚀 Unicorn",
  "lazy-blogger": "✍️ Content",
  "lazy-seo": "✍️ Content",
  "lazy-geo": "✍️ Content",
  "lazy-crawl": "✍️ Content",
  "lazy-perplexity": "✍️ Content",
  "lazy-contentful": "✍️ Content",
  "lazy-store": "🛒 Commerce",
  "lazy-pay": "🛒 Commerce",
  "lazy-sms": "🛒 Commerce",
  "lazy-mail": "🛒 Commerce",
  "lazy-voice": "🎙️ Media",
  "lazy-stream": "🎙️ Media",
  "lazy-code": "🛠️ Dev",
  "lazy-gitlab": "🛠️ Dev",
  "lazy-linear": "🛠️ Dev",
  "lazy-design": "🛠️ Dev",
  "lazy-auth": "🛠️ Dev",
  "lazy-alert": "⚙️ Ops",
  "lazy-telegram": "⚙️ Ops",
  "lazy-supabase": "⚙️ Ops",
  "lazy-security": "⚙️ Ops",
};

interface PromptPayload {
  product: string;
  version: string;
  prompt_text: string;
}

async function githubRequest(path: string, token: string, options: RequestInit = {}) {
  const res = await fetch(`${GITHUB_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const body = await res.text();
  return { status: res.status, data: body ? JSON.parse(body) : null };
}

async function upsertFile(
  token: string,
  filePath: string,
  content: string,
  commitMessage: string
) {
  // Check if file exists to get its SHA
  const { status, data: existing } = await githubRequest(
    `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`,
    token
  );

  const body: Record<string, string> = {
    message: commitMessage,
    content: btoa(unescape(encodeURIComponent(content))),
  };

  if (status === 200 && existing?.sha) {
    body.sha = existing.sha;
  }

  const { status: putStatus, data: putData } = await githubRequest(
    `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`,
    token,
    { method: "PUT", body: JSON.stringify(body) }
  );

  if (putStatus !== 200 && putStatus !== 201) {
    throw new Error(`GitHub API error ${putStatus}: ${JSON.stringify(putData)}`);
  }

  return putData;
}

function buildReadme(prompts: PromptPayload[]) {
  const lines: string[] = [
    "# 🦄 Lazy Unicorn — Prompt Library",
    "",
    "**Open-source mega-prompts that turn Lovable into an autonomous business engine.**",
    "",
    "Each prompt is a complete set of instructions. Paste one into a [Lovable](https://lovable.dev) project and it auto-configures everything — database tables, edge functions, UI components, and scheduling.",
    "",
    "## 🚀 Quick Start",
    "",
    "1. Open [lovable.dev](https://lovable.dev) and create a new project",
    "2. Pick an engine below and copy its prompt",
    "3. Paste the prompt into your Lovable chat",
    "4. Your engine is live — zero config required",
    "",
    "## 📦 Engines",
    "",
    "| Engine | Category | Prompt |",
    "| ------ | -------- | ------ |",
  ];

  // Sort by category
  const sorted = [...prompts].sort((a, b) => {
    const catA = CATEGORY_MAP[a.product] || "Other";
    const catB = CATEGORY_MAP[b.product] || "Other";
    return catA.localeCompare(catB);
  });

  for (const p of sorted) {
    const label = PRODUCT_LABELS[p.product] || p.product;
    const cat = CATEGORY_MAP[p.product] || "Other";
    const file = `prompts/${p.product}.md`;
    lines.push(`| ${label} | ${cat} | [View prompt](${file}) |`);
  }

  lines.push(
    "",
    "## 📄 License",
    "",
    "MIT — use these prompts however you like.",
    "",
    "## 🔗 Links",
    "",
    "- [Lazy Unicorn](https://lazyunicorn.co) — The full platform",
    "- [Lovable](https://lovable.dev) — The AI builder these prompts are designed for",
    "",
    "---",
    "",
    "*Prompts are synced automatically from the Lazy Unicorn admin dashboard.*",
    ""
  );

  return lines.join("\n");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const GITHUB_TOKEN = Deno.env.get("GITHUB_PROMPTS_TOKEN");
    if (!GITHUB_TOKEN) {
      throw new Error("GITHUB_PROMPTS_TOKEN is not configured");
    }

    const { product, version, prompt_text, all_prompts } = await req.json();

    // Push the single prompt file
    if (product && prompt_text) {
      const label = PRODUCT_LABELS[product] || product;
      const category = CATEGORY_MAP[product] || "Other";
      const fileContent = [
        `# ${label}`,
        "",
        `> Category: ${category} · Version: ${version}`,
        "",
        "## Prompt",
        "",
        "````",
        prompt_text,
        "````",
        "",
        `---`,
        `*Auto-synced from [Lazy Unicorn](https://lazyunicorn.co)*`,
        "",
      ].join("\n");

      await upsertFile(
        GITHUB_TOKEN,
        `prompts/${product}.md`,
        fileContent,
        `Update ${label} prompt to v${version}`
      );
    }

    // Update README if all_prompts provided
    if (all_prompts && Array.isArray(all_prompts) && all_prompts.length > 0) {
      const readme = buildReadme(all_prompts);
      await upsertFile(GITHUB_TOKEN, "README.md", readme, "Update README");
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("GitHub sync error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
