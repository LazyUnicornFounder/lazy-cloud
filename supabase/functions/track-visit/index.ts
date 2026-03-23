import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + "lazy-unicorn-salt");
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 16);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json().catch(() => ({}));
    const page = body.page || "/";
    const referrer = body.referrer || "";

    // Get IP from headers
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() 
      || req.headers.get("cf-connecting-ip") 
      || "unknown";

    const ipHash = await hashIP(ip);
    const userAgent = req.headers.get("user-agent") || "";

    // Get geo info from Cloudflare headers (available in Supabase edge functions)
    let country = req.headers.get("cf-ipcountry") || null;
    let countryCode = country;
    let city: string | null = null;
    let region: string | null = null;
    let latitude: number | null = null;
    let longitude: number | null = null;

    // If no CF headers, try free IP geolocation
    if (!country && ip !== "unknown") {
      try {
        const geoRes = await fetch(`https://ipapi.co/${ip}/json/`, {
          headers: { "User-Agent": "LazyUnicorn/1.0" },
        });
        if (geoRes.ok) {
          const geo = await geoRes.json();
          country = geo.country_name || null;
          countryCode = geo.country_code || null;
          city = geo.city || null;
          region = geo.region || null;
          latitude = geo.latitude || null;
          longitude = geo.longitude || null;
        }
      } catch (e) {
        console.error("Geo lookup failed:", e);
      }
    }

    // Deduplicate: skip if same ip_hash visited in last 30 minutes
    const { data: recent } = await supabase
      .from("visitors")
      .select("id")
      .eq("ip_hash", ipHash)
      .gte("created_at", new Date(Date.now() - 30 * 60 * 1000).toISOString())
      .limit(1);

    if (recent && recent.length > 0) {
      return new Response(JSON.stringify({ tracked: false, reason: "recent" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error } = await supabase.from("visitors").insert({
      ip_hash: ipHash,
      country,
      country_code: countryCode,
      city,
      region,
      user_agent: userAgent,
      page,
      referrer,
      latitude,
      longitude,
    });

    if (error) throw error;

    // Update total visitor count in app_config
    const { count } = await supabase
      .from("visitors")
      .select("id", { count: "exact", head: true });
    if (count !== null) {
      await supabase
        .from("app_config")
        .upsert({ key: "total_visitors", value: String(count) });
    }

    return new Response(JSON.stringify({ tracked: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("track-visit error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
