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
    const webhookUrl = Deno.env.get("WAITLIST_SLACK_WEBHOOK");
    if (!webhookUrl) throw new Error("Slack webhook not configured");

    const { subscriberId } = await req.json();

    const { data: subscriber } = await supabase
      .from("waitlist_subscribers")
      .select("email, name, position, referred_by")
      .eq("id", subscriberId)
      .single();

    if (!subscriber) throw new Error("Subscriber not found");

    const { count } = await supabase
      .from("waitlist_subscribers")
      .select("*", { count: "exact", head: true });

    const text = `🦄 New waitlist signup!\n*${subscriber.name || subscriber.email}* just joined at position #${subscriber.position}${subscriber.referred_by ? " (via referral)" : ""}\nTotal subscribers: ${count}`;

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    await supabase.from("waitlist_errors").insert({
      error_type: "SLACK",
      error_message: error.message,
      function_name: "waitlist-notify-slack",
    });

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
