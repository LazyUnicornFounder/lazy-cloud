import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Scan all agent error tables for recent errors
    const errorTables = [
      "blog_errors", "seo_errors", "geo_errors", "voice_errors",
      "stream_errors", "granola_errors", "crawl_errors", "perplexity_errors",
      "store_errors", "pay_errors", "sms_errors", "drop_errors", "print_errors",
      "mail_errors", "churn_errors", "alert_errors", "telegram_errors",
      "contentful_errors", "supabase_errors", "security_errors",
      "code_errors", "gitlab_errors", "linear_errors", "design_errors",
      "youtube_errors", "repurpose_errors", "trend_errors",
      "fix_errors", "build_errors", "intel_errors", "agent_errors",
    ];

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const issues: { table: string; count: number; latest: string }[] = [];

    for (const table of errorTables) {
      try {
        const { count, data } = await supabase
          .from(table)
          .select("created_at", { count: "exact", head: false })
          .gte("created_at", since)
          .order("created_at", { ascending: false })
          .limit(1);

        if (count && count > 0) {
          issues.push({
            table,
            count,
            latest: data?.[0]?.created_at ?? since,
          });
        }
      } catch {
        // Table may not exist yet — skip
      }
    }

    // Log results to watch_issues if table exists
    if (issues.length > 0) {
      try {
        await supabase.from("watch_issues").insert(
          issues.map((i) => ({
            source_table: i.table,
            error_count: i.count,
            latest_error_at: i.latest,
            status: "open",
          }))
        );
      } catch {
        // Table may not exist
      }
    }

    return new Response(
      JSON.stringify({ ok: true, issues_found: issues.length, issues }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
