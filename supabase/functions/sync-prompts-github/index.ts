import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

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
  "lazy-contentful": "Lazy Contentful",
  "lazy-store": "Lazy Store",
  "lazy-drop": "Lazy Drop",
  "lazy-print": "Lazy Print",
  "lazy-pay": "Lazy Pay",
  "lazy-sms": "Lazy SMS",
  "lazy-mail": "Lazy Mail",
  "lazy-voice": "Lazy Voice",
  "lazy-stream": "Lazy Stream",
  "lazy-youtube": "Lazy YouTube",
  "lazy-code": "Lazy GitHub",
  "lazy-gitlab": "Lazy GitLab",
  "lazy-linear": "Lazy Linear",
  "lazy-design": "Lazy Design",
  "lazy-auth": "Lazy Auth",
  "lazy-alert": "Lazy Alert",
  "lazy-telegram": "Lazy Telegram",
  "lazy-supabase": "Lazy Supabase",
  "lazy-security": "Lazy Security",
  "lazy-granola": "Lazy Granola",
  "lazy-watch": "Lazy Watch",
  "lazy-fix": "Lazy Fix",
  "lazy-build": "Lazy Build",
  "lazy-intel": "Lazy Intel",
  "lazy-repurpose": "Lazy Repurpose",
  "lazy-trend": "Lazy Trend",
  "lazy-churn": "Lazy Churn",
};

const CATEGORY_MAP: Record<string, string> = {
  "lazy-run": "🚀 Unicorn",
  "lazy-blogger": "✍️ Content",
  "lazy-seo": "✍️ Content",
  "lazy-geo": "✍️ Content",
  "lazy-crawl": "✍️ Content",
  "lazy-perplexity": "✍️ Content",
  "lazy-contentful": "✍️ Content",
  "lazy-store": "🛒 Commerce",
  "lazy-drop": "🛒 Commerce",
  "lazy-print": "🛒 Commerce",
  "lazy-pay": "🛒 Commerce",
  "lazy-sms": "🛒 Commerce",
  "lazy-mail": "🛒 Commerce",
  "lazy-voice": "🎙️ Media",
  "lazy-stream": "🎙️ Media",
  "lazy-youtube": "🎙️ Media",
  "lazy-code": "🛠️ Dev",
  "lazy-gitlab": "🛠️ Dev",
  "lazy-linear": "🛠️ Dev",
  "lazy-design": "🛠️ Dev",
  "lazy-auth": "🛠️ Dev",
  "lazy-granola": "🛠️ Dev",
  "lazy-admin": "⚙️ Ops",
  "lazy-alert": "⚙️ Ops",
  "lazy-telegram": "⚙️ Ops",
  "lazy-supabase": "⚙️ Ops",
  "lazy-security": "⚙️ Ops",
  "lazy-watch": "⚙️ Ops",
  "lazy-fix": "⚙️ Ops",
  "lazy-build": "⚙️ Ops",
  "lazy-intel": "⚙️ Ops",
  "lazy-repurpose": "⚙️ Ops",
  "lazy-trend": "⚙️ Ops",
  "lazy-churn": "⚙️ Ops",
};

// Canonical order matching the platform
const CANONICAL_ORDER = [
  "lazy-run",
  "lazy-blogger", "lazy-seo", "lazy-geo", "lazy-crawl", "lazy-perplexity", "lazy-contentful",
  "lazy-store", "lazy-drop", "lazy-print", "lazy-pay", "lazy-sms", "lazy-mail",
  "lazy-voice", "lazy-stream", "lazy-youtube",
  "lazy-code", "lazy-gitlab", "lazy-linear", "lazy-design", "lazy-auth", "lazy-granola",
  "lazy-admin", "lazy-alert", "lazy-telegram", "lazy-supabase", "lazy-security",
  "lazy-watch", "lazy-fix", "lazy-build", "lazy-intel", "lazy-repurpose", "lazy-trend", "lazy-churn",
];

interface PromptPayload {
  product: string;
  version: string;
  prompt_text: string;
}

function dedupePrompts(prompts: PromptPayload[]) {
  const latestByProduct = new Map<string, PromptPayload>();

  for (const prompt of prompts) {
    const existing = latestByProduct.get(prompt.product);
    if (!existing) {
      latestByProduct.set(prompt.product, prompt);
      continue;
    }

    const existingVersion = existing.version.split(".").map(Number);
    const nextVersion = prompt.version.split(".").map(Number);
    const maxLength = Math.max(existingVersion.length, nextVersion.length);

    let shouldReplace = false;
    for (let i = 0; i < maxLength; i += 1) {
      const currentPart = nextVersion[i] ?? 0;
      const existingPart = existingVersion[i] ?? 0;
      if (currentPart > existingPart) {
        shouldReplace = true;
        break;
      }
      if (currentPart < existingPart) {
        break;
      }
    }

    if (shouldReplace || prompt.prompt_text.length > existing.prompt_text.length) {
      latestByProduct.set(prompt.product, prompt);
    }
  }

  return Array.from(latestByProduct.values());
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
    "2. Pick an agent below and copy its prompt",
    "3. Paste the prompt into your Lovable chat",
    "4. Follow any setup steps the prompt asks for (most agents are zero-config)",
    "",
    "### ⚙️ Configuration",
    "",
    "Most agents work immediately with no setup. Some require external API keys or credentials:",
    "",
    "| Agent | Requires | Where to get it |",
    "| ----- | -------- | --------------- |",
    "| Lazy Voice | ElevenLabs API key | [elevenlabs.io](https://elevenlabs.io) |",
    "| Lazy Stream | Twitch Client ID & Secret | [dev.twitch.tv](https://dev.twitch.tv) |",
    "| Lazy Pay | Stripe / Polar keys | [stripe.com](https://stripe.com) or [polar.sh](https://polar.sh) |",
    "| Lazy SMS | Twilio credentials | [twilio.com](https://twilio.com) |",
    "| Lazy Mail | Resend API key | [resend.com](https://resend.com) |",
    "| Lazy GitHub | GitHub token | [github.com/settings/tokens](https://github.com/settings/tokens) |",
    "| Lazy GitLab | GitLab token | [gitlab.com/-/user_settings/personal_access_tokens](https://gitlab.com/-/user_settings/personal_access_tokens) |",
    "| Lazy Contentful | Contentful API key | [contentful.com](https://app.contentful.com) |",
    "| Lazy Store | Shopify credentials | [shopify.dev](https://shopify.dev) |",
    "| Lazy Drop | AutoDS API key | [autods.com](https://autods.com) |",
    "| Lazy Print | Printful API key | [printful.com](https://printful.com) |",
    "",
    "> **Tip:** The prompt itself will walk you through setup — just paste it and follow the instructions.",
    "",
    "## 📦 Agents",
    "",
    "| Agent | Category | Prompt |",
    "| ----- | -------- | ------ |",
  ];

  // Sort by canonical order
  const sorted = [...prompts].sort((a, b) => {
    const idxA = CANONICAL_ORDER.indexOf(a.product);
    const idxB = CANONICAL_ORDER.indexOf(b.product);
    return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
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

    // Parse body — may be empty for cron-triggered calls
    let product: string | undefined;
    let version: string | undefined;
    let prompt_text: string | undefined;
    let all_prompts: PromptPayload[] | undefined;

    try {
      const body = await req.json();
      product = body.product;
      version = body.version;
      prompt_text = body.prompt_text;
      all_prompts = body.all_prompts;
    } catch {
      // Empty body — cron mode, will auto-fetch below
    }

    // If no prompts provided, fetch all current prompts from DB (cron mode)
    if (!all_prompts || all_prompts.length === 0) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const sb = createClient(supabaseUrl, supabaseKey);
      const { data, error: dbError } = await sb
        .from("prompt_versions")
        .select("product, version, prompt_text")
        .eq("is_current", true);
      if (dbError) throw new Error(`DB fetch failed: ${dbError.message}`);
      all_prompts = dedupePrompts((data || []) as PromptPayload[]);
    } else {
      all_prompts = dedupePrompts(all_prompts);
    }

    // Push individual prompt file if specified
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

    // In cron mode (no specific product), push ALL prompt files
    if (!product && all_prompts.length > 0) {
      for (const p of all_prompts) {
        const label = PRODUCT_LABELS[p.product] || p.product;
        const category = CATEGORY_MAP[p.product] || "Other";
        const fileContent = [
          `# ${label}`,
          "",
          `> Category: ${category} · Version: ${p.version}`,
          "",
          "## Prompt",
          "",
          "````",
          p.prompt_text,
          "````",
          "",
          `---`,
          `*Auto-synced from [Lazy Unicorn](https://lazyunicorn.co)*`,
          "",
        ].join("\n");
        await upsertFile(GITHUB_TOKEN, `prompts/${p.product}.md`, fileContent, `Sync ${label} v${p.version}`);
      }
    }

    // Always update README
    if (all_prompts.length > 0) {
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
