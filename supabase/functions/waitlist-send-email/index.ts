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
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const RESEND_FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL") || "waitlist@lazyunicorn.ai";

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const { subscriberId, emailType } = await req.json();

    const { data: subscriber, error: subError } = await supabase
      .from("waitlist_subscribers")
      .select("*")
      .eq("id", subscriberId)
      .single();

    if (subError || !subscriber) throw new Error("Subscriber not found");

    const { data: settings } = await supabase
      .from("waitlist_settings")
      .select("*")
      .single();

    if (!settings) throw new Error("Settings not found");

    const siteUrl = Deno.env.get("SITE_URL") || "https://lazyunicorn.ai";
    const referralLink = `${siteUrl}/waitlist?ref=${subscriber.referral_code}`;

    const replaceVars = (text: string) =>
      text
        .replace(/\{\{name\}\}/g, subscriber.name || "there")
        .replace(/\{\{position\}\}/g, subscriber.position?.toString() || "")
        .replace(/\{\{referral_link\}\}/g, referralLink)
        .replace(/\{\{referral_code\}\}/g, subscriber.referral_code);

    let subject: string;
    let bodyText: string;
    let sentField: string;
    let sentAtField: string;

    switch (emailType) {
      case "welcome":
        subject = replaceVars(settings.welcome_email_subject);
        bodyText = replaceVars(settings.welcome_email_body);
        sentField = "welcome_email_sent";
        sentAtField = "welcome_email_sent_at";
        break;
      case "followup":
        subject = replaceVars(settings.followup_subject);
        bodyText = replaceVars(settings.followup_body);
        sentField = "followup_email_sent";
        sentAtField = "followup_email_sent_at";
        break;
      case "launch":
        subject = replaceVars(settings.launch_email_subject);
        bodyText = replaceVars(settings.launch_email_body);
        sentField = "launch_email_sent";
        sentAtField = "launch_email_sent_at";
        break;
      default:
        throw new Error("Invalid email type");
    }

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;color:#1a1a2e;background:#fafafa;">
<div style="background:#fff;border-radius:12px;padding:40px;border:1px solid #e5e5e5;">
<h1 style="font-size:24px;margin:0 0 16px;">${subject}</h1>
<p style="font-size:16px;line-height:1.6;color:#444;">${bodyText.replace(/\n/g, "<br>")}</p>
${emailType === "welcome" && settings.referral_enabled ? `
<div style="margin:24px 0;padding:20px;background:#f0f0ff;border-radius:8px;">
<p style="margin:0 0 8px;font-weight:600;">Share & move up the list:</p>
<p style="margin:0;word-break:break-all;color:#6366f1;">${referralLink}</p>
</div>` : ""}
${emailType === "launch" ? `
<a href="${siteUrl}" style="display:inline-block;margin:24px 0;padding:14px 28px;background:#6366f1;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">Get Started →</a>` : ""}
</div>
<p style="text-align:center;margin:24px 0 0;font-size:12px;color:#999;">Powered by LazyUnicorn.ai</p>
</body></html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        to: [subscriber.email],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Resend API error: ${err}`);
    }

    // Update subscriber email tracking
    await supabase
      .from("waitlist_subscribers")
      .update({
        [sentField]: true,
        [sentAtField]: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscriberId);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    await supabase.from("waitlist_errors").insert({
      error_type: "EMAIL",
      error_message: error.message,
      function_name: "waitlist-send-email",
    });

    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
