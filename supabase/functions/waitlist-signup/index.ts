import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const { email, name, referralCode, utmSource, utmMedium, utmCampaign } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return new Response(
        JSON.stringify({ error: "Valid email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: settings } = await supabase
      .from("waitlist_settings")
      .select("*")
      .single();

    if (!settings?.is_running) {
      return new Response(
        JSON.stringify({ error: "Waitlist is not currently active" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (settings?.is_launched) {
      return new Response(
        JSON.stringify({ error: "Waitlist is closed. Please sign up directly!" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check existing
    const { data: existing } = await supabase
      .from("waitlist_subscribers")
      .select("id, referral_code, position")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (existing) {
      return new Response(
        JSON.stringify({
          success: true,
          alreadyExists: true,
          position: existing.position,
          referralCode: existing.referral_code,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Find referrer
    let referrerId = null;
    if (referralCode) {
      const { data: referrer } = await supabase
        .from("waitlist_subscribers")
        .select("id")
        .eq("referral_code", referralCode.toUpperCase().trim())
        .single();
      if (referrer) referrerId = referrer.id;
    }

    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    const { data: subscriber, error: insertError } = await supabase
      .from("waitlist_subscribers")
      .insert({
        email: email.toLowerCase().trim(),
        name: name || null,
        referred_by: referrerId,
        ip_address: ipAddress,
        user_agent: userAgent,
        utm_source: utmSource || null,
        utm_medium: utmMedium || null,
        utm_campaign: utmCampaign || null,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Update daily stats
    await supabase.rpc("increment_daily_signups");

    // Trigger welcome email
    if (settings.welcome_email_enabled) {
      try {
        await supabase.functions.invoke("waitlist-send-email", {
          body: { subscriberId: subscriber.id, emailType: "welcome" },
        });
      } catch (e) {
        console.error("Welcome email failed:", e);
      }
    }

    // Trigger Slack notification
    if (settings.slack_enabled) {
      try {
        await supabase.functions.invoke("waitlist-notify-slack", {
          body: { subscriberId: subscriber.id },
        });
      } catch (e) {
        console.error("Slack notification failed:", e);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        position: subscriber.position,
        referralCode: subscriber.referral_code,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    await supabase.from("waitlist_errors").insert({
      error_type: "SIGNUP",
      error_message: error.message,
      error_details: { stack: error.stack },
      function_name: "waitlist-signup",
    });

    return new Response(
      JSON.stringify({ error: "Failed to join waitlist. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
