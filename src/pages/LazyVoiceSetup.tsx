import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { adminWrite } from "@/lib/adminWrite";
import { toast } from "sonner";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

export default function LazyVoiceSetup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    elevenlabs_api_key: "",
    voice_id: "",
    podcast_title: "",
    podcast_description: "",
    podcast_author: "",
    site_url: "",
  });

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.elevenlabs_api_key || !form.voice_id || !form.podcast_title || !form.site_url) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      // Check if settings already exist
      const { data: existing } = await adminWrite({ table: "voice_settings", operation: "select" }) as { data: any[] | null };
      if (existing && existing.length > 0) {
        await adminWrite({ table: "voice_settings", operation: "update", data: {
          ...form,
          setup_complete: true,
          is_running: true,
        }, match: { id: existing[0].id } });
      } else {
        await adminWrite({ table: "voice_settings", operation: "insert", data: {
          ...form,
          setup_complete: true,
          is_running: true,
        } });
      }
      toast.success("Lazy Voice is running. Every new blog post will be narrated automatically.");
      navigate("/lazy-voice-dashboard");
    } catch (err) {
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Lazy Voice Setup" description="Configure Lazy Voice — autonomous audio narration for your Lovable blog." />
      <Navbar />
      <main className="min-h-screen bg-background text-foreground pt-32 md:pt-44 pb-20 px-6">
        <div className="max-w-lg mx-auto">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.6 }} className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-muted/40 text-muted-foreground text-xs font-body tracking-wide mb-4">
              <Volume2 size={14} /> Lazy Voice Setup
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Configure Lazy Voice</h1>
            <p className="font-body text-sm mt-2">Fill in the details below to start narrating every blog post automatically.</p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-5 border border-border rounded-2xl p-8 bg-card/40"
          >
            <label className="flex flex-col gap-1.5">
              <span className="font-display text-xs font-bold uppercase tracking-wider">ElevenLabs API Key *</span>
              <input
                type="password"
                value={form.elevenlabs_api_key}
                onChange={(e) => set("elevenlabs_api_key", e.target.value)}
                placeholder="xi-xxxxxxxxxxxxxxxx"
                className="bg-background border border-border rounded-xl px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
              <span className="font-body text-[11px] text-muted-foreground/60">
                Get one at{" "}
                <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">
                  elevenlabs.io
                </a>
              </span>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="font-display text-xs font-bold uppercase tracking-wider">Voice ID *</span>
              <input
                type="text"
                value={form.voice_id}
                onChange={(e) => set("voice_id", e.target.value)}
                placeholder="e.g. EXAVITQu4vr4xnSDxMaL"
                className="bg-background border border-border rounded-xl px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
              <span className="font-body text-[11px] text-muted-foreground/60">
                Find your voice ID in the ElevenLabs dashboard under Voices → Voice ID.
              </span>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="font-display text-xs font-bold uppercase tracking-wider">Podcast Title *</span>
              <input
                type="text"
                value={form.podcast_title}
                onChange={(e) => set("podcast_title", e.target.value)}
                placeholder="My Blog Podcast"
                className="bg-background border border-border rounded-xl px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="font-display text-xs font-bold uppercase tracking-wider">Podcast Description</span>
              <input
                type="text"
                value={form.podcast_description}
                onChange={(e) => set("podcast_description", e.target.value)}
                placeholder="One sentence describing your podcast"
                className="bg-background border border-border rounded-xl px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="font-display text-xs font-bold uppercase tracking-wider">Author Name</span>
              <input
                type="text"
                value={form.podcast_author}
                onChange={(e) => set("podcast_author", e.target.value)}
                placeholder="Your name"
                className="bg-background border border-border rounded-xl px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="font-display text-xs font-bold uppercase tracking-wider">Site URL *</span>
              <input
                type="url"
                value={form.site_url}
                onChange={(e) => set("site_url", e.target.value)}
                placeholder="https://yoursite.com"
                className="bg-background border border-border rounded-xl px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
              <span className="font-body text-[11px] text-muted-foreground/60">Used to build the RSS feed URLs.</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-primary text-primary-foreground font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Saving…" : "Start Lazy Voice"}
            </button>
          </motion.form>
        </div>
      </main>
    </>
  );
}
