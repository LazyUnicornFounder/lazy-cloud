import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";

const db = supabase as any;

const LivePage = () => {
  const { data: settings } = useQuery({
    queryKey: ["stream-settings-public"],
    queryFn: async () => {
      const { data } = await db.from("stream_settings").select("twitch_username, business_name").limit(1).maybeSingle();
      return data;
    },
  });

  const { data: latestSession } = useQuery({
    queryKey: ["latest-stream-session"],
    queryFn: async () => {
      const { data } = await db.from("stream_sessions").select("*").order("created_at", { ascending: false }).limit(1).maybeSingle();
      return data;
    },
    refetchInterval: 30000, // Poll every 30s
  });

  const isLive = latestSession?.status === "live";
  const twitchUrl = settings?.twitch_username ? `https://twitch.tv/${settings.twitch_username}` : "#";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Live — Lazy Stream" description="Check if the stream is live right now." url="/live" />
      <Navbar />

      <main className="pt-32 pb-20 px-6 md:px-12 max-w-3xl mx-auto text-center">
        {isLive ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <div className="inline-block px-4 py-1 border border-red-500/40 mb-6">
              <span className="font-body text-xs text-red-400 uppercase tracking-wider">● Live Now</span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 4vw, 3rem)", color: "#f0ead6", lineHeight: 1.1 }}>
              {latestSession.title}
            </h1>
            <p className="font-body text-sm text-foreground/40 mt-3">{latestSession.game_name || "Streaming now"}</p>
            <a
              href={twitchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 font-body text-[11px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Watch Live <ExternalLink size={14} />
            </a>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.4 }}>Offline</p>
            <h1 className="mt-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#f0ead6", lineHeight: 1.2 }}>
              Not streaming right now.
            </h1>
            {latestSession && (
              <p className="font-body text-sm text-foreground/30 mt-4">
                Last stream: {new Date(latestSession.started_at || latestSession.created_at).toLocaleDateString()}
              </p>
            )}
            <a
              href={twitchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 font-body text-[11px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/50 hover:text-foreground hover:border-foreground/30 transition-all"
            >
              Follow on Twitch <ExternalLink size={14} />
            </a>
          </motion.div>
        )}

        <p className="mt-20 font-body text-xs text-foreground/15">
          🦄 Content by Lazy Stream — autonomous Twitch content publishing for Lovable sites. Built by <a href="https://lazyunicorn.ai" className="underline hover:text-foreground/30">LazyUnicorn.ai</a>
        </p>
      </main>
    </div>
  );
};

export default LivePage;
