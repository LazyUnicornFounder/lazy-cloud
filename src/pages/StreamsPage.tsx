import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FileText, Film, Zap } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";

const db = supabase as any;

const StreamsPage = () => {
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["public-stream-sessions"],
    queryFn: async () => {
      const { data } = await db.from("stream_sessions").select("*").eq("status", "processed").order("started_at", { ascending: false });
      return data || [];
    },
  });

  const { data: content = [] } = useQuery({
    queryKey: ["public-stream-content"],
    queryFn: async () => {
      const { data } = await db.from("stream_content").select("session_id, content_type, slug, title").eq("status", "published");
      return data || [];
    },
  });

  const getContentLinks = (sessionId: string) => {
    const sessionContent = content.filter((c: any) => c.session_id === sessionId);
    return {
      recap: sessionContent.find((c: any) => c.content_type === "recap"),
      seo: sessionContent.find((c: any) => c.content_type === "seo-article"),
      highlights: sessionContent.find((c: any) => c.content_type === "highlights"),
    };
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Stream Recaps — Lazy Stream" description="Browse all stream recaps, SEO articles, and highlights." url="/streams" />
      <Navbar />

      <main className="pt-32 pb-20 px-6 md:px-12 max-w-4xl mx-auto">
        <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.4 }}>Streams</p>
        <h1 className="mt-2 mb-10" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#f0ead6", lineHeight: 1.2 }}>
          Stream Archive
        </h1>

        {isLoading ? (
          <p className="font-body text-sm text-foreground/30">Loading…</p>
        ) : sessions.length === 0 ? (
          <p className="font-body text-sm text-foreground/30">No streams published yet.</p>
        ) : (
          <div className="space-y-0">
            {sessions.map((s: any, i: number) => {
              const links = getContentLinks(s.id);
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-border py-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h2 className="font-display text-lg font-bold text-foreground">{s.title}</h2>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="font-body text-xs text-foreground/30">{s.game_name || "—"}</span>
                        <span className="font-body text-xs text-foreground/20">•</span>
                        <span className="font-body text-xs text-foreground/30">{new Date(s.started_at || s.created_at).toLocaleDateString()}</span>
                        {s.duration_minutes && (
                          <>
                            <span className="font-body text-xs text-foreground/20">•</span>
                            <span className="font-body text-xs text-foreground/30">{s.duration_minutes}m</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {links.recap && (
                        <Link to={`/streams/${links.recap.slug}`} className="inline-flex items-center gap-1 font-body text-[10px] uppercase tracking-wider text-foreground/40 hover:text-foreground transition-colors">
                          <FileText size={12} /> Recap
                        </Link>
                      )}
                      {links.seo && (
                        <Link to={`/streams/${links.seo.slug}`} className="inline-flex items-center gap-1 font-body text-[10px] uppercase tracking-wider text-foreground/40 hover:text-foreground transition-colors">
                          <Zap size={12} /> SEO
                        </Link>
                      )}
                      {links.highlights && (
                        <Link to={`/streams/${links.highlights.slug}`} className="inline-flex items-center gap-1 font-body text-[10px] uppercase tracking-wider text-foreground/40 hover:text-foreground transition-colors">
                          <Film size={12} /> Highlights
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <p className="mt-16 font-body text-xs text-foreground/15 text-center">
          🦄 Content by Lazy Stream — autonomous Twitch content publishing for Lovable sites. Built by <a href="https://lazyunicorn.ai" className="underline hover:text-foreground/30">LazyUnicorn.ai</a>
        </p>
      </main>
    </div>
  );
};

export default StreamsPage;
