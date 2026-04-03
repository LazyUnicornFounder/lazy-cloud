import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { password, action, client_id, subject, body: emailBody } = await req.json();

    const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD");
    if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    if (action === "list_clients") {
      // Get all users with a paid tier
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .not("paid_tier", "is", null)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get auth user emails for these profiles
      const enriched = [];
      for (const profile of profiles || []) {
        const { data: userData } = await supabase.auth.admin.getUserById(profile.user_id);
        enriched.push({
          ...profile,
          email: userData?.user?.email || "unknown",
          last_sign_in: userData?.user?.last_sign_in_at || null,
        });
      }

      return new Response(JSON.stringify({ clients: enriched }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "get_client") {
      if (!client_id) throw new Error("client_id is required");

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", client_id)
        .single();

      if (error) throw error;

      const { data: userData } = await supabase.auth.admin.getUserById(client_id);
      const { data: org } = await supabase
        .from("org_members")
        .select("org_id, role, organizations(name, plan, industry)")
        .eq("user_id", client_id)
        .limit(1)
        .maybeSingle();

      return new Response(
        JSON.stringify({
          client: {
            ...profile,
            email: userData?.user?.email || "unknown",
            last_sign_in: userData?.user?.last_sign_in_at || null,
            org: org?.organizations || null,
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (action === "send_email") {
      if (!client_id || !subject || !emailBody) {
        throw new Error("client_id, subject, and body are required");
      }

      const { data: userData } = await supabase.auth.admin.getUserById(client_id);
      const recipientEmail = userData?.user?.email;
      if (!recipientEmail) throw new Error("Client email not found");

      // Use Supabase's built-in email via the auth admin API or a simple fetch
      // For now, log the message and store it
      const { error: insertError } = await supabase.from("client_messages").insert({
        client_user_id: client_id,
        recipient_email: recipientEmail,
        subject,
        body: emailBody,
        status: "sent",
      });

      if (insertError) throw insertError;

      return new Response(JSON.stringify({ success: true, email: recipientEmail }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "list_messages") {
      const query = supabase
        .from("client_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (client_id) {
        query.eq("client_user_id", client_id);
      }

      const { data, error } = await query.limit(100);
      if (error) throw error;

      return new Response(JSON.stringify({ messages: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Invalid action");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("admin-clients error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
