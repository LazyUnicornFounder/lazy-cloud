import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// --- Inline Twitter/X posting logic ---
function percentEncode(str: string): string {
  return encodeURIComponent(str).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

function generateNonce(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 32; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

async function createOAuthSignature(method: string, url: string, oauthParams: Record<string, string>, consumerSecret: string, tokenSecret: string): Promise<string> {
  const sortedParams = Object.keys(oauthParams).sort().map((k) => `${percentEncode(k)}=${percentEncode(oauthParams[k])}`).join("&");
  const signatureBase = `${method}&${percentEncode(url)}&${percentEncode(sortedParams)}`;
  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(tokenSecret)}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(signingKey), { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(signatureBase));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

async function postTweet(text: string): Promise<{ success: boolean; data?: unknown; error?: string }> {
  const consumerKey = Deno.env.get("TWITTER_CONSUMER_KEY");
  const consumerSecret = Deno.env.get("TWITTER_CONSUMER_SECRET");
  const accessToken = Deno.env.get("TWITTER_ACCESS_TOKEN");
  const accessTokenSecret = Deno.env.get("TWITTER_ACCESS_TOKEN_SECRET");
  if (!consumerKey || !consumerSecret || !accessToken || !accessTokenSecret) {
    return { success: false, error: "Twitter credentials not configured" };
  }
  const url = "https://api.x.com/2/tweets";
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: generateNonce(),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: accessToken,
    oauth_version: "1.0",
  };
  const sig = await createOAuthSignature("POST", url, oauthParams, consumerSecret, accessTokenSecret);
  const params = { ...oauthParams, oauth_signature: sig };
  const authHeader = "OAuth " + Object.keys(params).sort().map((k) => `${percentEncode(k)}="${percentEncode(params[k])}"`).join(", ");
  const response = await fetch(url, { method: "POST", headers: { Authorization: authHeader, "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
  const data = await response.json();
  if (!response.ok) return { success: false, error: data?.detail || data?.title || "Failed to post tweet" };
  return { success: true, data };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const body = await req.json();
  const { action, password, id, updates } = body;

  // Verify admin password
  const adminPassword = Deno.env.get("ADMIN_PASSWORD");
  if (!password || password !== adminPassword) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // === Submission actions ===
    if (action === "list") {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "approve" && id) {
      const { error } = await supabase
        .from("submissions")
        .update({ status: "approved" })
        .eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "reject" && id) {
      const { error } = await supabase
        .from("submissions")
        .update({ status: "rejected" })
        .eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "update_submission" && id && updates) {
      const allowed = ["name", "url", "tagline", "description", "logo_url", "slug"];
      const sanitized: Record<string, unknown> = {};
      for (const key of allowed) {
        if (key in updates) sanitized[key] = updates[key];
      }
      const { error } = await supabase
        .from("submissions")
        .update(sanitized)
        .eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete_submission" && id) {
      const { error } = await supabase
        .from("submissions")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === Blog post actions ===
    if (action === "list_posts") {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "publish_post" && id) {
      // Fetch post details for the tweet
      const { data: post, error: fetchError } = await supabase
        .from("blog_posts")
        .select("title, slug")
        .eq("id", id)
        .single();
      if (fetchError) throw fetchError;

      const { error } = await supabase
        .from("blog_posts")
        .update({ status: "published", published_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;

      // Auto-tweet the published post (non-blocking on failure)
      let tweetResult = null;
      try {
        const tweetText = `${post.title}. 🦄 🤖\nhttps://www.lazyunicorn.ai/blog/${post.slug}`;
        const baseUrl = Deno.env.get("SUPABASE_URL")!;
        const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
        const adminPwd = Deno.env.get("ADMIN_PASSWORD")!;

        const tweetRes = await fetch(`${baseUrl}/functions/v1/post-to-twitter`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${anonKey}`,
          },
          body: JSON.stringify({ text: tweetText, password: adminPwd }),
        });
        tweetResult = await tweetRes.json();
        console.log("Auto-tweet result:", JSON.stringify(tweetResult));
      } catch (tweetErr) {
        console.error("Auto-tweet failed (non-blocking):", tweetErr);
        tweetResult = { success: false, error: tweetErr.message };
      }

      return new Response(JSON.stringify({ success: true, tweet: tweetResult }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "reject_post" && id) {
      const { error } = await supabase
        .from("blog_posts")
        .update({ status: "rejected" })
        .eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete_post" && id) {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === Early access actions ===
    if (action === "list_early_access") {
      const { data, error } = await supabase
        .from("early_access")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === Visitor analytics actions ===
    if (action === "visitors") {
      const { data, error } = await supabase
        .from("visitors")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000);
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "visitor_stats") {
      // Paginate to fetch ALL visitors
      const allVisitors: unknown[] = [];
      const PAGE_SIZE = 1000;
      let offset = 0;
      while (true) {
        const { data: batch, error } = await supabase
          .from("visitors")
          .select("country, country_code, city, region, latitude, longitude, created_at, user_agent, page, referrer")
          .order("created_at", { ascending: false })
          .range(offset, offset + PAGE_SIZE - 1);
        if (error) throw error;
        if (!batch || batch.length === 0) break;
        allVisitors.push(...batch);
        if (batch.length < PAGE_SIZE) break;
        offset += PAGE_SIZE;
      }
      return new Response(JSON.stringify(allVisitors), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
