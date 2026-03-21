// Twitter/X auto-post edge function

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function percentEncode(str: string): string {
  return encodeURIComponent(str).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

function generateNonce(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function createOAuthSignature(
  method: string,
  url: string,
  oauthParams: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string
): Promise<string> {
  // IMPORTANT: Do NOT include POST body params for JSON content type
  const sortedParams = Object.keys(oauthParams)
    .sort()
    .map((k) => `${percentEncode(k)}=${percentEncode(oauthParams[k])}`)
    .join("&");

  const signatureBase = `${method}&${percentEncode(url)}&${percentEncode(sortedParams)}`;
  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(tokenSecret)}`;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(signingKey),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(signatureBase));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

function buildAuthHeader(oauthParams: Record<string, string>, signature: string): string {
  const params = { ...oauthParams, oauth_signature: signature };
  const header = Object.keys(params)
    .sort()
    .map((k) => `${percentEncode(k)}="${percentEncode(params[k])}"`)
    .join(", ");
  return `OAuth ${header}`;
}

async function postTweet(text: string): Promise<{ success: boolean; data?: unknown; error?: string }> {
  const consumerKey = Deno.env.get("TWITTER_CONSUMER_KEY")!;
  const consumerSecret = Deno.env.get("TWITTER_CONSUMER_SECRET")!;
  const accessToken = Deno.env.get("TWITTER_ACCESS_TOKEN")!;
  const accessTokenSecret = Deno.env.get("TWITTER_ACCESS_TOKEN_SECRET")!;

  const url = "https://api.x.com/2/tweets";
  const method = "POST";

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: generateNonce(),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: accessToken,
    oauth_version: "1.0",
  };

  const signature = await createOAuthSignature(method, url, oauthParams, consumerSecret, accessTokenSecret);
  const authHeader = buildAuthHeader(oauthParams, signature);

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Twitter API error:", JSON.stringify(data));
    return { success: false, error: data?.detail || data?.title || "Failed to post tweet" };
  }

  return { success: true, data };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { text, password } = body;

    // Verify admin password
    const adminPassword = Deno.env.get("ADMIN_PASSWORD");
    if (!password || password !== adminPassword) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!text || typeof text !== "string" || text.length === 0) {
      return new Response(JSON.stringify({ error: "Tweet text is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (text.length > 280) {
      return new Response(JSON.stringify({ error: "Tweet exceeds 280 characters" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await postTweet(text);

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
