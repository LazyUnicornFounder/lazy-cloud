import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";

const db = supabase as any;

const StreamHighlightsPage = () => {
  const { data: clips = [], isLoading } = useQuery({
    queryKey: ["public-stream-clips"],
    queryFn: async () => {
      const { data } = await db.from("stream_clips").select("*").order("view_count", { ascending: false });
      return data || [];
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Stream Highlights — Lazy Stream" description="The best clips and highlights from every stream." url="/streams/highlights" />
      <Navbar />

      <main className="pt-32 pb-20 px-6 md:px-12 max-w-4xl mx-auto">
        <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.4 }}>Highlights</p>
        <h1 className="mt-2 mb-10" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#f0ead6", lineHeight: 1.2 }}>
          Best Clips
        </h1>

        {isLoading ? (
          <p className="font-body text-sm text-foreground/55">Loading…</p>
        ) : clips.length === 0 ? (
          <p className="font-body text-sm text-foreground/55">No clips saved yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {clips.map((clip: any, i: number) => (
              <motion.a
                key={clip.id}
                href={clip.clip_url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card block group"
              >
                {clip.thumbnail_url && (
                  <img src={clip.thumbnail_url} alt={clip.title} className="w-full aspect-video object-cover" />
                )}
                <div className="p-5">
                  <h3 className="font-display text-sm font-bold text-foreground group-hover:text-foreground/80 transition-colors">{clip.title}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="font-body text-sm text-foreground/55">{clip.view_count} views</span>
                    {clip.duration_seconds && (
                      <>
                        <span className="font-body text-sm text-foreground/15">•</span>
                        <span className="font-body text-sm text-foreground/55">{Math.round(clip.duration_seconds)}s</span>
                      </>
                    )}
                  </div>
                  <p className="font-body text-[13px] uppercase tracking-wider text-foreground/70 mt-3">Watch on Twitch →</p>
                </div>
              </motion.a>
            ))}
          </div>
        )}

        <p className="mt-16 font-body text-sm text-foreground/15 text-center">
          🦄 Content by Lazy Stream — autonomous Twitch content publishing for Lovable sites. Built by <a href="https://lazyunicorn.ai" className="underline hover:text-foreground/55">LazyUnicorn.ai</a>
        </p>
      </main>
    </div>
  );
};

export default StreamHighlightsPage;
