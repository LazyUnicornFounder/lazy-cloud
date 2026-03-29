import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Activity, FileText, Film, BarChart3, Play, Pause, Zap, AlertTriangle, Settings, RefreshCw } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { adminWrite } from "@/lib/adminWrite";

const db = supabase as any;

const LazyStreamDashboard = () => {
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const { data: settings, refetch: refetchSettings } = useQuery({
    queryKey: ["stream-settings"],
    queryFn: async () => {
      const { data } = await db.from("stream_settings").select("*").limit(1).maybeSingle();
      return data;
    },
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ["stream-sessions"],
    queryFn: async () => {
      const { data } = await db.from("stream_sessions").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: content = [] } = useQuery({
    queryKey: ["stream-content"],
    queryFn: async () => {
      const { data } = await db.from("stream_content").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: clips = [] } = useQuery({
    queryKey: ["stream-clips"],
    queryFn: async () => {
      const { data } = await db.from("stream_clips").select("*").order("view_count", { ascending: false });
      return data || [];
    },
  });

  const { data: errors = [] } = useQuery({
    queryKey: ["stream-errors"],
    queryFn: async () => {
      const { data } = await db.from("stream_errors").select("*").order("created_at", { ascending: false }).limit(10);
      return data || [];
    },
  });

  const isLive = sessions.some((s: any) => s.status === "live");
  const processedCount = sessions.filter((s: any) => s.status === "processed").length;
  const avgViews = content.length > 0 ? Math.round(content.reduce((a: number, c: any) => a + (c.views || 0), 0) / content.length) : 0;

  const toggleRunning = async () => {
    if (!settings) return;
    setActionLoading("toggle");
    await adminWrite({ table: "stream_settings", operation: "update", data: { is_running: !settings.is_running }, match: { id: settings.id } });
    await refetchSettings();
    toast.success(settings.is_running ? "Lazy Stream paused." : "Lazy Stream resumed.");
    setActionLoading(null);
  };

  const processLastStream = async () => {
    const lastEnded = sessions.find((s: any) => s.status === "ended" || s.status === "processed");
    if (!lastEnded) { toast.error("No stream to process."); return; }
    setActionLoading("process");
    const { error } = await supabase.functions.invoke("stream-process", { body: { session_id: lastEnded.id } });
    if (error) toast.error("Processing failed.");
    else toast.success("Processing started.");
    setActionLoading(null);
  };

  const optimiseNow = async () => {
    setActionLoading("optimise");
    const { error } = await supabase.functions.invoke("stream-optimise", { body: {} });
    if (error) toast.error("Optimisation failed.");
    else toast.success("Optimisation complete.");
    setActionLoading(null);
  };

  const StatCard = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) => (
    <div className="border border-border bg-card p-6">
      <Icon size={18} className="text-foreground/45 mb-2" />
      <p className="font-display text-2xl font-bold text-foreground">{value}</p>
      <p className="font-body text-xs text-foreground/40 uppercase tracking-wider mt-1">{label}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Dashboard — Lazy Stream" description="Manage your autonomous Twitch content agent." url="/lazy-stream-dashboard" />
      <Navbar />

      <main className="pt-32 pb-20 px-6 md:px-12 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.5 }}>Dashboard</p>
            <h1 className="mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "#f0ead6" }}>Lazy Stream</h1>
          </div>
          <div className="flex items-center gap-2">
            {isLive && <span className="font-body text-xs px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/30">● LIVE</span>}
            <span className={`font-body text-xs px-2 py-1 border ${settings?.is_running ? "border-green-500/30 text-green-400" : "border-foreground/20 text-foreground/45"}`}>
              {settings?.is_running ? "Running" : "Paused"}
            </span>
          </div>
        </div>

        {/* Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-border mb-8">
          <StatCard icon={Activity} label="Streams" value={processedCount} />
          <StatCard icon={FileText} label="Content" value={content.length} />
          <StatCard icon={Film} label="Clips" value={clips.length} />
          <StatCard icon={BarChart3} label="Avg Views" value={avgViews} />
          <StatCard icon={Activity} label="Status" value={isLive ? "Live" : "Offline"} />
        </div>

        {/* Controls */}
        <div className="border border-border bg-card p-6 mb-8">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">Controls</h2>
          <div className="flex flex-wrap gap-3">
            <button onClick={toggleRunning} disabled={actionLoading === "toggle"} className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-wider px-4 py-2 border border-border text-foreground/50 hover:text-foreground hover:border-foreground/30 transition-all disabled:opacity-50">
              {settings?.is_running ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Resume</>}
            </button>
            <button onClick={processLastStream} disabled={actionLoading === "process"} className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-wider px-4 py-2 border border-border text-foreground/50 hover:text-foreground hover:border-foreground/30 transition-all disabled:opacity-50">
              <RefreshCw size={14} /> Process Last Stream
            </button>
            <button onClick={optimiseNow} disabled={actionLoading === "optimise"} className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-wider px-4 py-2 border border-border text-foreground/50 hover:text-foreground hover:border-foreground/30 transition-all disabled:opacity-50">
              <Zap size={14} /> Optimise Content Now
            </button>
            <Link to="/lazy-stream-setup" className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-wider px-4 py-2 border border-border text-foreground/50 hover:text-foreground hover:border-foreground/30 transition-all">
              <Settings size={14} /> Edit Settings
            </Link>
          </div>
        </div>

        {/* Streams Table */}
        <div className="border border-border bg-card p-6 mb-8">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">Streams</h2>
          {sessions.length === 0 ? (
            <p className="font-body text-sm text-foreground/45">No streams recorded yet. Go live on Twitch to get started.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-border">
                  {["Title", "Game", "Date", "Duration", "Status"].map(h => <th key={h} className="font-body text-[12px] uppercase tracking-wider text-foreground/45 pb-2 pr-4">{h}</th>)}
                </tr></thead>
                <tbody>
                  {sessions.map((s: any) => (
                    <tr key={s.id} className="border-b border-border/50">
                      <td className="font-body text-sm text-foreground/70 py-2 pr-4">{s.title}</td>
                      <td className="font-body text-sm text-foreground/40 py-2 pr-4">{s.game_name || "—"}</td>
                      <td className="font-body text-sm text-foreground/40 py-2 pr-4">{new Date(s.started_at || s.created_at).toLocaleDateString()}</td>
                      <td className="font-body text-sm text-foreground/40 py-2 pr-4">{s.duration_minutes ? `${s.duration_minutes}m` : "—"}</td>
                      <td className="py-2">
                        <span className={`font-body text-xs px-2 py-0.5 border ${s.status === "live" ? "border-red-500/30 text-red-400" : s.status === "processed" ? "border-green-500/30 text-green-400" : "border-foreground/20 text-foreground/45"}`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Content Table */}
        <div className="border border-border bg-card p-6 mb-8">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">Content</h2>
          {content.length === 0 ? (
            <p className="font-body text-sm text-foreground/45">No content published yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-border">
                  {["Title", "Type", "Published", "Views"].map(h => <th key={h} className="font-body text-[12px] uppercase tracking-wider text-foreground/45 pb-2 pr-4">{h}</th>)}
                </tr></thead>
                <tbody>
                  {content.map((c: any) => (
                    <tr key={c.id} className="border-b border-border/50">
                      <td className="font-body text-sm py-2 pr-4"><Link to={`/streams/${c.slug}`} className="text-foreground/70 hover:text-foreground transition-colors">{c.title}</Link></td>
                      <td className="font-body text-xs text-foreground/40 py-2 pr-4 uppercase">{c.content_type}</td>
                      <td className="font-body text-sm text-foreground/40 py-2 pr-4">{new Date(c.published_at).toLocaleDateString()}</td>
                      <td className="font-body text-sm text-foreground/40 py-2 pr-4">{c.views}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Clips Table */}
        <div className="border border-border bg-card p-6 mb-8">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">Clips</h2>
          {clips.length === 0 ? (
            <p className="font-body text-sm text-foreground/45">No clips saved yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-border">
                  {["Title", "Views", "Duration", ""].map(h => <th key={h} className="font-body text-[12px] uppercase tracking-wider text-foreground/45 pb-2 pr-4">{h}</th>)}
                </tr></thead>
                <tbody>
                  {clips.map((c: any) => (
                    <tr key={c.id} className="border-b border-border/50">
                      <td className="font-body text-sm text-foreground/70 py-2 pr-4">{c.title}</td>
                      <td className="font-body text-sm text-foreground/40 py-2 pr-4">{c.view_count}</td>
                      <td className="font-body text-sm text-foreground/40 py-2 pr-4">{c.duration_seconds ? `${Math.round(c.duration_seconds)}s` : "—"}</td>
                      <td className="py-2"><a href={c.clip_url} target="_blank" rel="noopener noreferrer" className="font-body text-xs text-foreground/40 hover:text-foreground transition-colors uppercase tracking-wider">Watch →</a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="border border-destructive/30 bg-card p-6">
            <h2 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2"><AlertTriangle size={18} className="text-destructive" /> Recent Errors</h2>
            <div className="space-y-2">
              {errors.map((e: any) => (
                <div key={e.id} className="border-b border-border/50 pb-2">
                  <p className="font-body text-xs text-foreground/45">{e.function_name} — {new Date(e.created_at).toLocaleString()}</p>
                  <p className="font-body text-sm text-destructive/70">{e.error_message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LazyStreamDashboard;
