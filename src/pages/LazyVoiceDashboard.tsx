import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Volume2, Pause, Play, RefreshCw, Rss, AlertTriangle } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { adminWrite } from "@/lib/adminWrite";
import { toast } from "sonner";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

export default function LazyVoiceDashboard() {
  const [settings, setSettings] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [settingsRes, episodesRes, errorsRes] = await Promise.all([
      supabase.from("voice_settings").select("*").limit(1),
      supabase.from("voice_episodes").select("*").order("published_at", { ascending: false }),
      supabase.from("voice_errors").select("*").order("created_at", { ascending: false }).limit(10),
    ]);
    setSettings(settingsRes.data?.[0] || null);
    setEpisodes(episodesRes.data || []);
    setErrors(errorsRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const totalEpisodes = episodes.filter((e) => e.status === "published").length;
  const totalSeconds = episodes.reduce((sum, e) => sum + (e.duration_seconds || 0), 0);
  const totalHours = (totalSeconds / 3600).toFixed(1);

  const toggleRunning = async () => {
    if (!settings) return;
    const newVal = !settings.is_running;
    await adminWrite({ table: "voice_settings", operation: "update", data: { is_running: newVal }, match: { id: settings.id } });
    setSettings({ ...settings, is_running: newVal });
    toast.success(newVal ? "Lazy Voice resumed." : "Lazy Voice paused.");
  };

  const generateNow = async () => {
    setGenerating(true);
    try {
      await supabase.functions.invoke("voice-generate");
      toast.success("Audio generation triggered. Check back in a minute.");
      setTimeout(fetchData, 5000);
    } catch {
      toast.error("Failed to trigger generation.");
    } finally {
      setGenerating(false);
    }
  };

  const rssUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/voice-rss`;

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background text-foreground pt-32 px-6 flex items-center justify-center">
          <p className="font-body text-muted-foreground">Loading…</p>
        </main>
      </>
    );
  }

  if (!settings?.setup_complete) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background text-foreground pt-32 px-6 text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Lazy Voice Not Configured</h1>
          <p className="font-body text-muted-foreground mb-6">Complete the setup to start generating audio.</p>
          <Link to="/lazy-voice-setup" className="bg-primary text-primary-foreground font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:opacity-90 transition-opacity">
            Go to Setup
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <SEO title="Lazy Voice Dashboard" description="Manage your autonomous audio narration agent." />
      <Navbar />
      <main className="min-h-screen bg-background text-foreground pt-32 md:pt-44 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-muted/40 text-muted-foreground text-xs font-body tracking-wide mb-3">
                <Volume2 size={14} /> Lazy Voice Dashboard
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Audio Narration Agent</h1>
            </div>
            <Link to="/lazy-voice-setup" className="font-body text-xs text-muted-foreground underline hover:text-primary transition-colors">
              Edit Settings
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.05 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="border border-border rounded-2xl p-5 bg-card/40 text-center">
              <p className="font-display text-2xl font-bold">{totalEpisodes}</p>
              <p className="font-body text-xs text-muted-foreground">Episodes</p>
            </div>
            <div className="border border-border rounded-2xl p-5 bg-card/40 text-center">
              <p className="font-display text-2xl font-bold">{totalHours}h</p>
              <p className="font-body text-xs text-muted-foreground">Audio Hours</p>
            </div>
            <div className="border border-border rounded-2xl p-5 bg-card/40 text-center">
              <p className={`font-display text-2xl font-bold ${settings.is_running ? "text-green-400" : "text-destructive"}`}>
                {settings.is_running ? "Active" : "Paused"}
              </p>
              <p className="font-body text-xs text-muted-foreground">Status</p>
            </div>
            <div className="border border-border rounded-2xl p-5 bg-card/40 text-center">
              <p className="font-display text-2xl font-bold">{errors.length}</p>
              <p className="font-body text-xs text-muted-foreground">Recent Errors</p>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="flex flex-wrap gap-3 mb-10">
            <button
              onClick={toggleRunning}
              className="inline-flex items-center gap-2 border border-border rounded-full px-6 py-3 font-display text-xs font-bold uppercase tracking-wider hover:bg-muted transition-colors"
            >
              {settings.is_running ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Resume</>}
            </button>
            <button
              onClick={generateNow}
              disabled={generating}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-6 py-3 font-display text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <RefreshCw size={14} className={generating ? "animate-spin" : ""} /> {generating ? "Generating…" : "Generate Audio Now"}
            </button>
            <a
              href={rssUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-border rounded-full px-6 py-3 font-display text-xs font-bold uppercase tracking-wider hover:bg-muted transition-colors"
            >
              <Rss size={14} /> View RSS Feed
            </a>
          </motion.div>

          {/* Episodes table */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.15 }} className="border border-border rounded-2xl bg-card/40 overflow-hidden mb-10">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-display text-sm font-bold uppercase tracking-wider">Episodes</h2>
            </div>
            {episodes.length === 0 ? (
              <p className="px-6 py-8 font-body text-sm text-muted-foreground text-center">No episodes yet. Publish a blog post and audio will be generated automatically.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-6 py-3 font-display text-[12px] uppercase tracking-wider text-muted-foreground">Title</th>
                      <th className="px-6 py-3 font-display text-[12px] uppercase tracking-wider text-muted-foreground">Date</th>
                      <th className="px-6 py-3 font-display text-[12px] uppercase tracking-wider text-muted-foreground">Duration</th>
                      <th className="px-6 py-3 font-display text-[12px] uppercase tracking-wider text-muted-foreground">Status</th>
                      <th className="px-6 py-3 font-display text-[12px] uppercase tracking-wider text-muted-foreground">Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {episodes.map((ep) => (
                      <tr key={ep.id} className="border-b border-border/50 last:border-0">
                        <td className="px-6 py-3 font-body text-sm">{ep.post_title}</td>
                        <td className="px-6 py-3 font-body text-xs text-muted-foreground">
                          {ep.published_at ? new Date(ep.published_at).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-6 py-3 font-body text-xs text-muted-foreground">
                          {ep.duration_seconds ? `${Math.floor(ep.duration_seconds / 60)}:${String(ep.duration_seconds % 60).padStart(2, "0")}` : "—"}
                        </td>
                        <td className="px-6 py-3">
                          <span className={`font-body text-[12px] uppercase tracking-wider font-bold ${ep.status === "published" ? "text-green-400" : "text-muted-foreground"}`}>
                            {ep.status}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <Link to={`/blog/${ep.post_slug}`} className="font-body text-xs text-primary underline hover:opacity-80">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

          {/* Error log */}
          {errors.length > 0 && (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="border border-border rounded-2xl bg-card/40 overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center gap-2">
                <AlertTriangle size={14} className="text-destructive" />
                <h2 className="font-display text-sm font-bold uppercase tracking-wider">Recent Errors</h2>
              </div>
              <div className="divide-y divide-border/50">
                {errors.map((err) => (
                  <div key={err.id} className="px-6 py-3">
                    <p className="font-body text-xs text-destructive">{err.error_message}</p>
                    <p className="font-body text-[12px] text-muted-foreground mt-1">
                      {err.post_slug && `Post: ${err.post_slug} · `}
                      {new Date(err.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
}
