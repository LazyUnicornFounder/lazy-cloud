import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Headphones, Rss, Copy, Check } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

export default function ListenPage() {
  const [settings, setSettings] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [copiedRss, setCopiedRss] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [s, e] = await Promise.all([
        supabase.from("voice_settings").select("*").limit(1),
        supabase.from("voice_episodes").select("*").eq("status", "published").order("published_at", { ascending: false }),
      ]);
      setSettings(s.data?.[0] || null);
      setEpisodes(e.data || []);
    };
    load();
  }, []);

  const rssUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/voice-rss`;

  const copyRss = async () => {
    await navigator.clipboard.writeText(rssUrl);
    setCopiedRss(true);
    toast.success("RSS URL copied!");
    setTimeout(() => setCopiedRss(false), 2500);
  };

  return (
    <>
      <SEO title={settings?.podcast_title || "Listen"} description={settings?.podcast_description || "Listen to narrated blog posts."} />
      <Navbar />
      <main className="min-h-screen bg-background text-foreground pt-32 md:pt-44 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-muted/40 text-muted-foreground text-xs font-body tracking-wide mb-4">
              <Headphones size={14} /> Podcast
            </div>
            <h1 className="font-display text-2xl md:text-4xl font-bold tracking-tight mb-3">
              {settings?.podcast_title || "Listen"}
            </h1>
            {settings?.podcast_description && (
              <p className="font-body text-sm text-muted-foreground">{settings.podcast_description}</p>
            )}
          </motion.div>

          {/* RSS subscribe */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.05 }} className="border border-border rounded-2xl p-6 bg-card/40 mb-10">
            <div className="flex items-center gap-2 mb-3">
              <Rss size={16} className="text-primary" />
              <h2 className="font-display text-xs font-bold uppercase tracking-wider">Subscribe via RSS</h2>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 font-body text-xs text-muted-foreground overflow-x-auto whitespace-nowrap">
                {rssUrl}
              </code>
              <button
                onClick={copyRss}
                className="shrink-0 border border-border rounded-xl px-3 py-2.5 hover:bg-muted transition-colors"
              >
                {copiedRss ? <Check size={14} className="text-primary" /> : <Copy size={14} className="text-muted-foreground" />}
              </button>
            </div>
            <p className="font-body text-[11px] text-muted-foreground/60 mt-3">
              Copy this RSS URL and paste it into Apple Podcasts, Spotify for Podcasters, or Google Podcasts to subscribe.
            </p>
          </motion.div>

          {/* Episodes */}
          {episodes.length === 0 ? (
            <motion.p variants={fadeUp} initial="hidden" animate="visible" className="font-body text-sm text-muted-foreground text-center py-12">
              No episodes yet. Once blog posts are published, audio versions will appear here automatically.
            </motion.p>
          ) : (
            <div className="flex flex-col gap-4">
              {episodes.map((ep, i) => (
                <motion.div
                  key={ep.id}
                  variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="border border-border rounded-2xl p-6 bg-card/40"
                >
                  <h3 className="font-display text-sm font-bold mb-1">{ep.post_title}</h3>
                  <p className="font-body text-[11px] text-muted-foreground mb-4">
                    {ep.published_at ? new Date(ep.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}
                    {ep.duration_seconds ? ` · ${Math.floor(ep.duration_seconds / 60)}:${String(ep.duration_seconds % 60).padStart(2, "0")}` : ""}
                  </p>
                  <audio controls className="w-full h-10" preload="none">
                    <source src={ep.audio_url} type="audio/mpeg" />
                  </audio>
                </motion.div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="mt-16 text-center">
            <p className="font-body text-xs text-muted-foreground/50">
              🦄 Powered by Lazy Voice — autonomous audio narration for Lovable sites. Built by{" "}
              <a href="https://lazyunicorn.ai" className="underline hover:text-primary transition-colors">Lazy Unicorn</a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
