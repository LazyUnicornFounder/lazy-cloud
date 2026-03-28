import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const REPO_OWNER = "LazyUnicornFounder";
const REPO_NAME = "LazyUnicorn";
const GITHUB_API = "https://api.github.com";

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
