import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";

const db = supabase as any;

const StreamContentPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: content, isLoading } = useQuery({
    queryKey: ["stream-content", slug],
    queryFn: async () => {
      const { data } = await db.from("stream_content").select("*").eq("slug", slug).maybeSingle();
      return data;
    },
    enabled: !!slug,
  });

  // Track view
  useQuery({
    queryKey: ["stream-content-view", slug],
    queryFn: async () => {
      if (content?.id) {
        await db.from("stream_content").update({ views: (content.views || 0) + 1 }).eq("id", content.id);
      }
      return true;
    },
    enabled: !!content?.id,
    staleTime: Infinity,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-body text-sm text-foreground/30">Loading…</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="font-display text-2xl font-bold text-foreground">Content not found</p>
        <a href="/streams" className="font-body text-sm text-foreground/40 hover:text-foreground transition-colors">← Back to streams</a>
      </div>
    );
  }

  const typeLabel = content.content_type === "seo-article" ? "SEO Article" : content.content_type === "recap" ? "Stream Recap" : "Highlights";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title={`${content.title} — Lazy Stream`}
        description={content.body?.substring(0, 155) || ""}
        url={`/streams/${slug}`}
        keywords={content.target_keyword || ""}
      />
      <Navbar />

      <main className="pt-32 pb-20 px-6 md:px-12 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-8">
            <span className="font-body text-[10px] uppercase tracking-[0.2em] px-2 py-1 border border-border text-foreground/30">{typeLabel}</span>
            <h1 className="mt-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#f0ead6", lineHeight: 1.2 }}>
              {content.title}
            </h1>
            <p className="font-body text-xs text-foreground/30 mt-2">{new Date(content.published_at).toLocaleDateString()}</p>
          </div>

          <div className="prose prose-invert prose-sm max-w-none font-body text-foreground/60 leading-relaxed">
            <ReactMarkdown>{content.body}</ReactMarkdown>
          </div>

          <p className="mt-16 font-body text-xs text-foreground/15 text-center">
            🦄 Content by Lazy Stream — autonomous Twitch content publishing for Lovable sites. Built by <a href="https://lazyunicorn.ai" className="underline hover:text-foreground/30">LazyUnicorn.ai</a>
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default StreamContentPage;
