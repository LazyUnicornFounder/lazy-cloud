// Admin write proxy — validates ADMIN_PASSWORD then performs DB writes using service_role
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Tables allowed to be written via this proxy
const ALLOWED_TABLES = new Set([
  "voice_settings",
  "stream_settings",
  "granola_settings",
  "seo_settings",
  "geo_settings",
  "blog_settings",
  "product_publish_settings",
  "prompt_versions",
  "prompt_releases",
]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { password, table, operation, data, match } = await req.json();

    // Validate admin password
    const adminPassword = Deno.env.get("ADMIN_PASSWORD");
    if (!password || password !== adminPassword) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate table
    if (!table || !ALLOWED_TABLES.has(table)) {
      return new Response(JSON.stringify({ error: `Table "${table}" is not allowed` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate operation
    if (!["insert", "update", "upsert", "select"].includes(operation)) {
      return new Response(JSON.stringify({ error: `Operation "${operation}" is not allowed` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let result;

    if (operation === "select") {
      let query = supabase.from(table).select("*");
      if (match) {
        for (const [key, value] of Object.entries(match)) {
          query = query.eq(key, value);
        }
      }
      result = await query;
    } else if (operation === "insert") {
      result = await supabase.from(table).insert(data).select();
    } else if (operation === "update") {
      if (!match || Object.keys(match).length === 0) {
        return new Response(JSON.stringify({ error: "Update requires match criteria" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      let query = supabase.from(table).update(data);
      for (const [key, value] of Object.entries(match)) {
        query = query.eq(key, value);
      }
      result = await query.select();
    } else if (operation === "upsert") {
      result = await supabase.from(table).upsert(data).select();
    }

    if (result?.error) {
      return new Response(JSON.stringify({ error: result.error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ data: result?.data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
