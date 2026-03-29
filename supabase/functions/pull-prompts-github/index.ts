import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const REPO_OWNER = "LazyUnicornFounder";
const REPO_NAME = "LazyUnicorn";
const GITHUB_API = "https://api.github.com";

const PRODUCT_LABELS: Record<string, string> = {
  "lazy-run": "Lazy Run", "lazy-admin": "Lazy Admin", "lazy-blogger": "Lazy Blogger",
  "lazy-seo": "Lazy SEO", "lazy-geo": "Lazy GEO", "lazy-crawl": "Lazy Crawl",
  "lazy-perplexity": "Lazy Perplexity", "lazy-contentful": "Lazy Contentful",
  "lazy-store": "Lazy Store", "lazy-drop": "Lazy Drop", "lazy-print": "Lazy Print",
  "lazy-pay": "Lazy Pay", "lazy-sms": "Lazy SMS", "lazy-mail": "Lazy Mail",
  "lazy-voice": "Lazy Voice", "lazy-stream": "Lazy Stream", "lazy-youtube": "Lazy YouTube",
  "lazy-code": "Lazy GitHub", "lazy-gitlab": "Lazy GitLab", "lazy-linear": "Lazy Linear",
  "lazy-design": "Lazy Design", "lazy-auth": "Lazy Auth", "lazy-alert": "Lazy Alert",
  "lazy-telegram": "Lazy Telegram", "lazy-supabase": "Lazy Supabase",
  "lazy-security": "Lazy Security", "lazy-granola": "Lazy Granola",
  "lazy-watch": "Lazy Watch", "lazy-fix": "Lazy Fix", "lazy-build": "Lazy Build",
  "lazy-intel": "Lazy Intel", "lazy-repurpose": "Lazy Repurpose",
  "lazy-trend": "Lazy Trend", "lazy-churn": "Lazy Churn",
};

async function githubRequest(path: string, token: string) {
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  const body = await res.text();
  return { status: res.status, data: body ? JSON.parse(body) : null };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const GITHUB_TOKEN = Deno.env.get("GITHUB_PROMPTS_TOKEN");
    if (!GITHUB_TOKEN) throw new Error("GITHUB_PROMPTS_TOKEN is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, supabaseKey);

    // List all files in prompts/ directory
    const { status, data: files } = await githubRequest(
      `/repos/${REPO_OWNER}/${REPO_NAME}/contents/prompts`,
      GITHUB_TOKEN
    );

    if (status !== 200 || !Array.isArray(files)) {
      throw new Error(`Failed to list prompts directory: ${status}`);
    }

    const results: { product: string; version: string; action: string }[] = [];

    for (const file of files) {
      if (!file.name.endsWith(".md")) continue;
      const product = file.name.replace(".md", "");

      // Fetch file content
      const { status: fStatus, data: fData } = await githubRequest(
        `/repos/${REPO_OWNER}/${REPO_NAME}/contents/prompts/${file.name}`,
        GITHUB_TOKEN
      );
      if (fStatus !== 200 || !fData?.content) continue;

      const decoded = decodeURIComponent(escape(atob(fData.content.replace(/\n/g, ""))));

      // Extract version from the "> Category: ... · Version: ..." line
      const versionMatch = decoded.match(/Version:\s*([\d.]+)/);
      const version = versionMatch ? versionMatch[1] : "0.0.1";

      // Extract prompt text between ```` markers
      const promptMatch = decoded.match(/````\n([\s\S]*?)\n````/);
      if (!promptMatch) continue;
      const promptText = promptMatch[1];

      // Check if this version already exists in DB
      const { data: existing } = await sb
        .from("prompt_versions")
        .select("id, version, prompt_text")
        .eq("product", product)
        .eq("is_current", true)
        .limit(1)
        .single();

      if (existing && existing.version === version && existing.prompt_text === promptText) {
        results.push({ product, version, action: "unchanged" });
        continue;
      }

      // If GitHub has a newer/different version, upsert it
      // Mark all existing as not current
      await sb
        .from("prompt_versions")
        .update({ is_current: false })
        .eq("product", product)
        .eq("is_current", true);

      // Insert new version
      await sb.from("prompt_versions").insert({
        product,
        version,
        prompt_text: promptText,
        is_current: true,
      });

      // Auto-create changelog entry
      const agentName = PRODUCT_LABELS[product] || product;
      const prevVersion = existing?.version || "0.0.0";
      const isMajor = version.split(".")[0] !== prevVersion.split(".")[0];
      const isMinor = version.split(".")[1] !== prevVersion.split(".")[1];
      const changeType = isMajor ? "major" : isMinor ? "minor" : "fix";

      await sb.from("prompt_releases").insert({
        engine_name: agentName,
        version,
        release_date: new Date().toISOString().split("T")[0],
        change_type: changeType,
        summary: `Prompt updated to v${version} (synced from GitHub)`,
        upgrade_complexity: "drop-in",
        published: true,
      });

      results.push({ product, version, action: "updated" });
    }

    const updated = results.filter(r => r.action === "updated").length;
    const unchanged = results.filter(r => r.action === "unchanged").length;

    return new Response(
      JSON.stringify({ success: true, updated, unchanged, details: results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("GitHub pull error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
