import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Zap, Settings, Trash2, ExternalLink, AlertTriangle } from "lucide-react";

const AdminSeo = () => {
  const [tab, setTab] = useState<"setup" | "dashboard">("dashboard");
  const [settings, setSettings] = useState<any>(null);
  const [keywords, setKeywords] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [showErrors, setShowErrors] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [discovering, setDiscovering] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const [form, setForm] = useState({
    site_url: "",
    business_description: "",
    target_keywords: "",
    competitors: "",
    publishing_frequency: "1",
  });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [settingsRes, keywordsRes, postsRes, errorsRes] = await Promise.all([
      supabase.from("seo_settings").select("*").order("created_at", { ascending: false }).limit(1).single(),
      supabase.from("seo_keywords").select("*").order("last_checked", { ascending: false }),
      supabase.from("seo_posts").select("*").eq("status", "published").order("published_at", { ascending: false }).limit(10),
      supabase.from("seo_errors").select("*").order("created_at", { ascending: false }).limit(20),
    ]);
    if (settingsRes.data) {
      setSettings(settingsRes.data);
      setForm({
        site_url: settingsRes.data.site_url || "",
        business_description: settingsRes.data.business_description || "",
        target_keywords: settingsRes.data.target_keywords || "",
        competitors: settingsRes.data.competitors || "",
        publishing_frequency: settingsRes.data.publishing_frequency || "1",
      });
    }
    if (keywordsRes.data) setKeywords(keywordsRes.data);
    if (postsRes.data) setPosts(postsRes.data);
    if (errorsRes.data) setErrors(errorsRes.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (settings) {
      await supabase.from("seo_settings").update(form).eq("id", settings.id);
    } else {
      await supabase.from("seo_settings").insert(form);
    }
    toast.success("SEO settings saved. Lazy SEO is running.");
    await fetchAll();
    setSaving(false);
    setTab("dashboard");
  };

  const toggleRunning = async () => {
    if (!settings) return;
    const { error } = await supabase.from("seo_settings").update({ is_running: !settings.is_running }).eq("id", settings.id);
    if (error) { toast.error("Failed to update"); return; }
    setSettings({ ...settings, is_running: !settings.is_running });
    toast.success(settings.is_running ? "Lazy SEO paused" : "Lazy SEO resumed");
  };

  const discover = async () => {
    setDiscovering(true);
    try {
      const res = await supabase.functions.invoke("lazy-seo-analyse");
      if (res.error) throw res.error;
      toast.success("Keywords discovered!");
      fetchAll();
    } catch (e: any) { toast.error("Discovery failed: " + (e.message || "Unknown")); }
    setDiscovering(false);
  };

  const publishOne = async () => {
    setPublishing(true);
    try {
      const res = await supabase.functions.invoke("lazy-seo-publish");
      if (res.error) throw res.error;
      toast.success("Post published!");
      fetchAll();
    } catch (e: any) { toast.error("Publish failed: " + (e.message || "Unknown")); }
    setPublishing(false);
  };

  const postKeywords = new Set(posts.map(p => p.target_keyword?.toLowerCase()));

  if (loading) return <p className="font-body text-sm text-muted-foreground py-8 text-center">Loading SEO data…</p>;

  return (
    <div className="space-y-4">
      {/* Sub-tabs */}
      <div className="flex gap-3 mb-4">
        <button onClick={() => setTab("dashboard")} className={`font-body text-sm font-medium pb-1 border-b-2 transition-colors ${tab === "dashboard" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
          Dashboard
        </button>
        <button onClick={() => setTab("setup")} className={`font-body text-sm font-medium pb-1 border-b-2 transition-colors ${tab === "setup" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
          <Settings size={12} className="inline mr-1" />Setup
        </button>
      </div>

      {tab === "setup" && (
        <form onSubmit={handleSave} className="space-y-4 max-w-xl">
          <div>
            <label className="font-body text-xs text-muted-foreground block mb-1">Site URL</label>
            <input value={form.site_url} onChange={e => setForm({ ...form, site_url: e.target.value })} required className="w-full font-body text-sm bg-card border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary/50" placeholder="https://lazyunicorn.ai" />
          </div>
          <div>
            <label className="font-body text-xs text-muted-foreground block mb-1">Business Description</label>
            <textarea value={form.business_description} onChange={e => setForm({ ...form, business_description: e.target.value })} required rows={3} className="w-full font-body text-sm bg-card border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary/50 resize-none" />
          </div>
          <div>
            <label className="font-body text-xs text-muted-foreground block mb-1">Target Keywords (comma separated)</label>
            <textarea value={form.target_keywords} onChange={e => setForm({ ...form, target_keywords: e.target.value })} required rows={2} className="w-full font-body text-sm bg-card border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary/50 resize-none" />
          </div>
          <div>
            <label className="font-body text-xs text-muted-foreground block mb-1">Competitors (comma separated)</label>
            <textarea value={form.competitors} onChange={e => setForm({ ...form, competitors: e.target.value })} rows={2} className="w-full font-body text-sm bg-card border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary/50 resize-none" />
          </div>
          <div>
            <label className="font-body text-xs text-muted-foreground block mb-1">Posts Per Day</label>
            <select value={form.publishing_frequency} onChange={e => setForm({ ...form, publishing_frequency: e.target.value })} className="w-full font-body text-sm bg-card border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary/50">
              <option value="1">1 post per day</option>
              <option value="2">2 posts per day</option>
              <option value="4">4 posts per day</option>
            </select>
          </div>
          <button type="submit" disabled={saving} className="font-body text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
            {saving ? "Saving…" : "Save and Start"}
          </button>
        </form>
      )}

      {tab === "dashboard" && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="border border-border rounded-xl bg-card p-3 text-center">
              <p className="font-display text-2xl font-bold text-foreground">{posts.length}</p>
              <p className="font-body text-xs text-muted-foreground">Posts Published</p>
            </div>
            <div className="border border-border rounded-xl bg-card p-3 text-center">
              <p className="font-display text-2xl font-bold text-foreground">{keywords.length}</p>
              <p className="font-body text-xs text-muted-foreground">Keywords Tracked</p>
            </div>
            <div className="border border-border rounded-xl bg-card p-3 text-center">
              <p className="font-display text-2xl font-bold text-foreground">{settings?.is_running ? "🟢 Running" : "⏸️ Paused"}</p>
              <p className="font-body text-xs text-muted-foreground">Engine Status</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-2">
            <button onClick={toggleRunning} className={`font-body text-xs px-3 py-1.5 rounded-lg transition-colors ${settings?.is_running ? "bg-destructive/20 text-destructive hover:bg-destructive/30" : "bg-primary/20 text-primary hover:bg-primary/30"}`}>
              {settings?.is_running ? "Pause SEO" : "Resume SEO"}
            </button>
            <button onClick={discover} disabled={discovering} className="font-body text-xs px-3 py-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors disabled:opacity-50 flex items-center gap-1">
              <Search size={12} /> {discovering ? "Discovering…" : "Discover Keywords Now"}
            </button>
            <button onClick={publishOne} disabled={publishing} className="font-body text-xs px-3 py-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors disabled:opacity-50 flex items-center gap-1">
              <Zap size={12} /> {publishing ? "Publishing…" : "Publish One Now"}
            </button>
            {errors.length > 0 && (
              <button onClick={() => setShowErrors(!showErrors)} className="font-body text-xs px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors flex items-center gap-1">
                <AlertTriangle size={12} /> {errors.length} Errors
              </button>
            )}
          </div>

          {/* Errors */}
          {showErrors && errors.length > 0 && (
            <div className="border border-destructive/30 rounded-xl bg-destructive/5 p-4 space-y-2">
              <h3 className="font-display text-sm font-bold text-destructive">Recent Errors</h3>
              {errors.map(err => (
                <div key={err.id} className="font-body text-xs text-destructive/80">
                  <span className="text-muted-foreground">{new Date(err.created_at).toLocaleString()}</span> — {err.error_message}
                </div>
              ))}
            </div>
          )}

          {/* Keywords Table */}
          {keywords.length > 0 && (
            <div className="border border-border rounded-xl overflow-hidden">
              <div className="p-3 border-b border-border bg-card">
                <h3 className="font-display text-sm font-bold text-foreground">Keywords ({keywords.length})</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="text-left px-3 py-2 font-body text-xs text-muted-foreground">Keyword</th>
                      <th className="text-center px-3 py-2 font-body text-xs text-muted-foreground">Position</th>
                      <th className="text-center px-3 py-2 font-body text-xs text-muted-foreground">Has Post</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keywords.map(kw => (
                      <tr key={kw.id} className="border-t border-border/50">
                        <td className="px-3 py-2 font-body text-foreground">{kw.keyword}</td>
                        <td className="px-3 py-2 text-center font-body text-muted-foreground">{kw.current_position ?? "—"}</td>
                        <td className="px-3 py-2 text-center">
                          <span className={`font-body text-xs px-2 py-0.5 rounded-full ${postKeywords.has(kw.keyword?.toLowerCase()) ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                            {postKeywords.has(kw.keyword?.toLowerCase()) ? "Yes" : "No"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recent Posts */}
          {posts.length > 0 && (
            <div className="border border-border rounded-xl overflow-hidden">
              <div className="p-3 border-b border-border bg-card">
                <h3 className="font-display text-sm font-bold text-foreground">Recent SEO Posts</h3>
              </div>
              <div className="space-y-0">
                {posts.map(post => (
                  <div key={post.id} className="flex items-center justify-between px-3 py-2 border-t border-border/50">
                    <div className="min-w-0 flex-1">
                      <p className="font-body text-sm text-foreground truncate">{post.title}</p>
                      <p className="font-body text-xs text-muted-foreground">{post.target_keyword} · {new Date(post.published_at).toLocaleDateString()}</p>
                    </div>
                    <a href={`/seo-blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="font-body text-xs text-primary hover:underline flex items-center gap-1 shrink-0">
                      <ExternalLink size={12} /> View
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminSeo;
