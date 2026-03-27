import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";

const LazyStreamSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    twitch_client_id: "",
    twitch_client_secret: "",
    twitch_username: "",
    content_niche: "",
    site_url: "",
    business_name: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.twitch_client_id || !form.twitch_client_secret || !form.twitch_username) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);

    try {
      // Get Twitch access token
      const tokenRes = await fetch("https://id.twitch.tv/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: form.twitch_client_id,
          client_secret: form.twitch_client_secret,
          grant_type: "client_credentials",
        }),
      });
      const tokenData = await tokenRes.json();
      if (!tokenData.access_token) throw new Error("Invalid Twitch credentials");

      // Get user ID
      const userRes = await fetch(`https://api.twitch.tv/helix/users?login=${form.twitch_username}`, {
        headers: {
          "Client-ID": form.twitch_client_id,
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });
      const userData = await userRes.json();
      const twitchUserId = userData.data?.[0]?.id;
      if (!twitchUserId) throw new Error("Twitch username not found");

      // Save settings
      const { error } = await (supabase as any).from("stream_settings").upsert({
        id: crypto.randomUUID(),
        twitch_client_id: form.twitch_client_id,
        twitch_client_secret: form.twitch_client_secret,
        twitch_username: form.twitch_username,
        twitch_user_id: twitchUserId,
        site_url: form.site_url,
        business_name: form.business_name,
        content_niche: form.content_niche,
        setup_complete: true,
        is_running: true,
      });

      if (error) throw error;

      toast.success("Lazy Stream is active. Your next stream will be processed and published automatically when it ends.");
      navigate("/lazy-stream-dashboard");
    } catch (err: any) {
      toast.error(err.message || "Setup failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "twitch_client_id", label: "Twitch Client ID", type: "text", placeholder: "Your Twitch application Client ID", hint: "Get this by creating an application at dev.twitch.tv/console" },
    { key: "twitch_client_secret", label: "Twitch Client Secret", type: "password", placeholder: "Your Twitch application Client Secret", hint: "From the same Twitch developer application" },
    { key: "twitch_username", label: "Twitch Username", type: "text", placeholder: "Your exact Twitch channel username", hint: "" },
    { key: "business_name", label: "Business Name", type: "text", placeholder: "Your brand or channel name", hint: "" },
    { key: "content_niche", label: "Content Niche", type: "text", placeholder: "gaming, just chatting, music, creative, educational", hint: "What kind of content do you stream?" },
    { key: "site_url", label: "Site URL", type: "text", placeholder: "https://yoursite.com", hint: "Your full site URL" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Setup — Lazy Stream" description="Configure your autonomous Twitch content engine." url="/lazy-stream-setup" />
      <Navbar />

      <main className="pt-32 pb-20 px-6 md:px-12 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.5 }}>Setup</p>
          <h1 className="mt-2 mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#f0ead6", lineHeight: 1.2 }}>
            Activate Lazy Stream
          </h1>
          <p className="font-body text-sm text-foreground/40 mb-10">Connect your Twitch channel. Everything else runs automatically.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map(({ key, label, type, placeholder, hint }) => (
              <div key={key}>
                <label className="font-body text-xs font-medium text-foreground/40 uppercase tracking-wider block mb-1.5">{label}</label>
                <input
                  type={type}
                  value={(form as any)[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={placeholder}
                  className="w-full font-body text-sm bg-card border border-border px-3 py-2.5 text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-foreground/30 transition-all"
                />
                {hint && <p className="font-body text-xs text-foreground/35 mt-1">{hint}</p>}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-foreground text-background font-body font-semibold text-sm py-3 hover:opacity-90 transition-opacity disabled:opacity-50 mt-4"
            >
              {loading ? "Activating…" : "Activate Lazy Stream"}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default LazyStreamSetup;
