import { useState, useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminAnalytics from "@/components/AdminAnalytics";
import AdminSeo from "@/components/AdminSeo";
import AdminGeo from "@/components/AdminGeo";
import AdminPrompts from "@/components/AdminPrompts";
import { toast } from "sonner";
import { Twitter, Pencil, X, Check, Trash2, Upload, Loader2, ArrowUp, ArrowDown, Save } from "lucide-react";
import { staticBlogPosts } from "@/components/BlogSection";
import logoNaive from "@/assets/logo-naive.jpg";
import logoPolsia from "@/assets/logo-polsia.jpg";

const FALLBACK_LOGOS: Record<string, string> = {
  "Naive": logoNaive,
  "Polsia": logoPolsia,
};

interface Submission {
  id: string;
  name: string;
  url: string;
  tagline: string;
  description: string | null;
  logo_url: string | null;
  status: string;
  created_at: string;
  display_order: number;
}

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  status: string;
  created_at: string;
  published_at: string | null;
}



const Admin = () => {
  const [password, setPassword] = useState(() => sessionStorage.getItem("admin_pw") || "");
  const [authenticated, setAuthenticated] = useState(() => !!sessionStorage.getItem("admin_pw"));
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"submissions" | "blog" | "analytics" | "seo" | "geo" | "prompts">(() => {
    const saved = sessionStorage.getItem("admin_tab");
    return (saved === "submissions" || saved === "blog" || saved === "analytics" || saved === "seo" || saved === "geo" || saved === "prompts") ? saved : "analytics";
  });
  useEffect(() => { sessionStorage.setItem("admin_tab", activeTab); }, [activeTab]);
  const [generating, setGenerating] = useState(false);
  const [customTopic, setCustomTopic] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", url: "", tagline: "", description: "", logo_url: "" });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchSubmissions = useCallback(async (pw: string) => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("admin-submissions", {
      body: { action: "list", password: pw },
    });
    setLoading(false);
    if (error || data?.error) {
      setError(data?.error || "Failed to load");
      return;
    }
    setSubmissions(data);
  }, []);


  const fetchBlogPosts = useCallback(async (pw: string) => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("admin-submissions", {
      body: { action: "list_posts", password: pw },
    });
    setLoading(false);
    if (error || data?.error) {
      setError(data?.error || "Failed to load");
      return;
    }
    setBlogPosts(data || []);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { data, error: err } = await supabase.functions.invoke("admin-submissions", {
      body: { action: "list", password },
    });
    setLoading(false);
    if (err || data?.error) {
      setError("Invalid password");
      return;
    }
    setAuthenticated(true);
    sessionStorage.setItem("admin_pw", password);
    localStorage.setItem("is_admin", "true");
    setSubmissions(data);
    fetchBlogPosts(password);
  };

  // Auto-fetch data on mount if already authenticated from sessionStorage
  useEffect(() => {
    if (authenticated && password) {
      fetchSubmissions(password);
      fetchBlogPosts(password);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAction = async (id: string, action: "approve" | "reject") => {
    await supabase.functions.invoke("admin-submissions", {
      body: { action, password, id },
    });
    fetchSubmissions(password);
  };

  const handleBlogAction = async (id: string, action: "publish_post" | "reject_post" | "delete_post") => {
    await supabase.functions.invoke("admin-submissions", {
      body: { action, password, id },
    });
    fetchBlogPosts(password);
  };

  const handleGeneratePost = async () => {
    setGenerating(true);
    const topics = customTopic.trim()
      ? customTopic.split("\n").map(t => t.trim()).filter(Boolean)
      : [""];
    let successCount = 0;
    for (const topic of topics) {
      try {
        const { data, error } = await supabase.functions.invoke("generate-blog-post", {
          body: topic ? { topic } : {},
        });
        if (error) {
          toast.error(`Failed to generate: ${topic || "random topic"}`);
        } else {
          successCount++;
          const title = data?.post?.title || "New post";
          toast.success(`"${title}" added to queue`);
        }
      } catch {
        toast.error(`Failed to generate: ${topic || "random topic"}`);
      }
    }
    if (successCount > 0) setCustomTopic("");
    await fetchBlogPosts(password);
    setGenerating(false);
  };

  const startEdit = (s: Submission) => {
    setEditingId(s.id);
    setEditForm({
      name: s.name,
      url: s.url,
      tagline: s.tagline,
      description: s.description || "",
      logo_url: s.logo_url || "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    try {
      const { data, error } = await supabase.functions.invoke("admin-submissions", {
        body: { action: "update_submission", password, id: editingId, updates: editForm },
      });
      if (error || data?.error) {
        toast.error(data?.error || "Failed to update");
        return;
      }
      toast.success("Submission updated");
      setEditingId(null);
      fetchSubmissions(password);
    } catch {
      toast.error("Failed to update");
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <h1 className="font-display text-2xl font-bold text-foreground text-center">Admin</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full font-body text-sm bg-card border border-border rounded-lg px-3 py-2.5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
          />
          {error && <p className="font-body text-xs text-destructive text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-primary text-primary-foreground font-body font-medium text-sm py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Checking…" : "Login"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-8 max-w-5xl mx-auto">
      {/* Tabs */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setActiveTab("submissions")}
          className={`font-display text-lg font-bold pb-1 border-b-2 transition-colors ${
            activeTab === "submissions" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Submissions
        </button>
        <button
          onClick={() => { setActiveTab("blog"); fetchBlogPosts(password); }}
          className={`font-display text-lg font-bold pb-1 border-b-2 transition-colors ${
            activeTab === "blog" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Blog Posts
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`font-display text-lg font-bold pb-1 border-b-2 transition-colors ${
            activeTab === "analytics" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveTab("seo")}
          className={`font-display text-lg font-bold pb-1 border-b-2 transition-colors ${
            activeTab === "seo" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Lazy SEO
        </button>
        <button
          onClick={() => setActiveTab("geo")}
          className={`font-display text-lg font-bold pb-1 border-b-2 transition-colors ${
            activeTab === "geo" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Lazy GEO
        </button>
        <button
          onClick={() => setActiveTab("prompts")}
          className={`font-display text-lg font-bold pb-1 border-b-2 transition-colors ${
            activeTab === "prompts" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Prompts
        </button>
      </div>

      {loading && <p className="font-body text-sm text-muted-foreground">Loading…</p>}

      {activeTab === "submissions" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <p className="font-body text-xs text-muted-foreground">
              Use arrows to reorder, then save. Order applies to the public directory.
            </p>
            <button
              onClick={async () => {
                const orders = submissions.map((s, i) => ({ id: s.id, display_order: i }));
                const { error } = await supabase.functions.invoke("admin-submissions", {
                  body: { action: "reorder_submissions", password, orders },
                });
                if (error) { toast.error("Failed to save order"); return; }
                toast.success("Directory order saved!");
                fetchSubmissions(password);
              }}
              className="font-body text-xs px-3 py-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors flex items-center gap-1"
            >
              <Save size={12} /> Save Order
            </button>
          </div>
          {submissions.map((s, idx) => (
            <div key={s.id} className="border border-border rounded-xl bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => {
                      if (idx === 0) return;
                      const newList = [...submissions];
                      [newList[idx - 1], newList[idx]] = [newList[idx], newList[idx - 1]];
                      setSubmissions(newList);
                    }}
                    disabled={idx === 0}
                    className="p-0.5 rounded hover:bg-muted transition-colors disabled:opacity-20"
                    title="Move up"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    onClick={() => {
                      if (idx === submissions.length - 1) return;
                      const newList = [...submissions];
                      [newList[idx], newList[idx + 1]] = [newList[idx + 1], newList[idx]];
                      setSubmissions(newList);
                    }}
                    disabled={idx === submissions.length - 1}
                    className="p-0.5 rounded hover:bg-muted transition-colors disabled:opacity-20"
                    title="Move down"
                  >
                    <ArrowDown size={12} />
                  </button>
                </div>
                <span className="font-display text-xs font-bold text-muted-foreground w-5 text-center">{idx + 1}</span>
              </div>
              {editingId === s.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-body text-xs text-muted-foreground block mb-1">Name</label>
                      <input
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full font-body text-sm bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary/50"
                      />
                    </div>
                    <div>
                      <label className="font-body text-xs text-muted-foreground block mb-1">Website</label>
                      <input
                        value={editForm.url}
                        onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                        className="w-full font-body text-sm bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-body text-xs text-muted-foreground block mb-1">Tagline</label>
                    <input
                      value={editForm.tagline}
                      onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })}
                      className="w-full font-body text-sm bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs text-muted-foreground block mb-1">Description</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={3}
                      className="w-full font-body text-sm bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary/50 resize-none"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs text-muted-foreground block mb-1">Thumbnail</label>
                    <div className="flex items-center gap-3">
                      {editForm.logo_url && (
                        <img src={editForm.logo_url} alt="Preview" className="h-12 w-12 rounded-lg object-cover border border-border shrink-0" />
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setUploading(true);
                          const ext = file.name.split(".").pop();
                          const filePath = `${editingId}-${Date.now()}.${ext}`;
                          const { error: uploadError } = await supabase.storage
                            .from("logos")
                            .upload(filePath, file, { upsert: true });
                          if (uploadError) {
                            toast.error("Upload failed: " + uploadError.message);
                            setUploading(false);
                            return;
                          }
                          const { data: urlData } = supabase.storage
                            .from("logos")
                            .getPublicUrl(filePath);
                          setEditForm({ ...editForm, logo_url: urlData.publicUrl });
                          setUploading(false);
                          toast.success("Thumbnail uploaded!");
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="font-body text-xs px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {uploading ? (
                          <><Loader2 size={12} className="animate-spin" /> Uploading…</>
                        ) : (
                          <><Upload size={12} /> {editForm.logo_url ? "Replace" : "Upload"} thumbnail</>
                        )}
                      </button>
                      {editForm.logo_url && (
                        <button
                          type="button"
                          onClick={() => setEditForm({ ...editForm, logo_url: "" })}
                          className="font-body text-xs px-2 py-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="font-body text-xs px-3 py-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors flex items-center gap-1"
                    >
                      <Check size={12} /> Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="font-body text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors flex items-center gap-1"
                    >
                      <X size={12} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex items-start gap-3">
                    {(s.logo_url || FALLBACK_LOGOS[s.name]) && (
                      <img src={s.logo_url || FALLBACK_LOGOS[s.name]} alt={s.name} className="h-10 w-10 rounded-lg object-cover border border-border shrink-0" />
                    )}
                    <div>
                      <h2 className="font-display font-bold text-foreground truncate">{s.name}</h2>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-body text-xs text-primary hover:underline">
                        {s.url}
                      </a>
                      <p className="font-body text-sm text-muted-foreground mt-1">{s.tagline}</p>
                      <span className={`inline-block mt-2 font-body text-xs px-2 py-0.5 rounded-full ${
                        s.status === "approved" ? "bg-primary/20 text-primary" :
                        s.status === "rejected" ? "bg-destructive/20 text-destructive" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {s.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => startEdit(s)}
                      className="font-body text-xs px-3 py-1.5 rounded-lg bg-foreground/10 text-foreground hover:bg-foreground/20 transition-colors flex items-center gap-1"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    {s.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleAction(s.id, "approve")}
                          className="font-body text-xs px-3 py-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(s.id, "reject")}
                          className="font-body text-xs px-3 py-1.5 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={async () => {
                        if (!confirm(`Delete "${s.name}"?`)) return;
                        await supabase.functions.invoke("admin-submissions", {
                          body: { action: "delete_submission", password, id: s.id },
                        });
                        fetchSubmissions(password);
                        toast.success("Submission deleted");
                      }}
                      className="font-body text-xs px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {!loading && submissions.length === 0 && (
            <p className="font-body text-sm text-muted-foreground text-center py-8">No submissions yet.</p>
          )}
        </div>
      )}

      {activeTab === "blog" && (
        <div className="space-y-3">
          {/* Stats */}
          {(() => {
            const published = blogPosts.filter(p => p.status === "published");
            const staticSlugs = new Set(staticBlogPosts.map(p => p.slug));
            const uniqueDbPublished = published.filter(p => !staticSlugs.has(p.slug));
            const totalOnSite = uniqueDbPublished.length + staticBlogPosts.length;
            const drafts = blogPosts.filter(p => p.status === "draft").length;
            const today = new Date().toDateString();
            const publishedToday = blogPosts.filter(p => p.status === "published" && p.published_at && new Date(p.published_at).toDateString() === today).length;
            const createdToday = blogPosts.filter(p => new Date(p.created_at).toDateString() === today).length;
            return (
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="border border-border rounded-xl bg-card p-3 text-center">
                  <p className="font-display text-2xl font-bold text-foreground">{totalOnSite}</p>
                  <p className="font-body text-xs text-muted-foreground">Total on Site</p>
                </div>
                <div className="border border-border rounded-xl bg-card p-3 text-center">
                  <p className="font-display text-2xl font-bold text-foreground">{drafts}</p>
                  <p className="font-body text-xs text-muted-foreground">Queued</p>
                </div>
                <div className="border border-border rounded-xl bg-card p-3 text-center">
                  <p className="font-display text-2xl font-bold text-primary">{publishedToday}</p>
                  <p className="font-body text-xs text-muted-foreground">Published Today</p>
                </div>
                <div className="border border-border rounded-xl bg-card p-3 text-center">
                  <p className="font-display text-2xl font-bold text-foreground">{createdToday}</p>
                  <p className="font-body text-xs text-muted-foreground">Generated Today</p>
                </div>
              </div>
            );
          })()}

          <div className="flex gap-3 items-end mb-4">
            <div className="flex-1">
              <textarea
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="One topic per line — generate multiple posts at once (leave empty for random)…"
                rows={3}
                className="w-full font-body text-sm bg-card border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 resize-none"
              />
            </div>
            <button
              onClick={handleGeneratePost}
              disabled={generating}
              className="font-body text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0 h-fit"
            >
              {generating ? "Generating…" : customTopic.split("\n").filter(t => t.trim()).length > 1 ? `Generate ${customTopic.split("\n").filter(t => t.trim()).length} Posts` : "Generate"}
            </button>
          </div>

          {/* Next 10 queued posts */}
          {(() => {
            const queued = blogPosts
              .filter(p => p.status === "draft")
              .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
              .slice(0, 10);
            
            // Calculate next publish times (every 30 min from now)
            const now = new Date();
            const mins = now.getMinutes();
            const firstSlot = new Date(now);
            if (mins < 30) {
              firstSlot.setMinutes(30, 0, 0);
            } else {
              firstSlot.setHours(firstSlot.getHours() + 1);
              firstSlot.setMinutes(0, 0, 0);
            }

            return (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display text-sm font-bold text-muted-foreground uppercase tracking-wider">
                    Next Up — Queued for Auto-Publish ({queued.length} drafts)
                  </h3>
                  <button
                    onClick={async () => {
                      setGenerating(true);
                      for (let i = 0; i < 3; i++) {
                        try {
                          await supabase.functions.invoke("generate-blog-post", {
                            body: {},
                          });
                        } catch { /* continue */ }
                      }
                      await fetchBlogPosts(password);
                      setGenerating(false);
                      toast.success("Generated 3 posts!");
                    }}
                    disabled={generating}
                    className="font-body text-xs px-3 py-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors disabled:opacity-50"
                  >
                    {generating ? "Generating…" : "Generate 3 Posts"}
                  </button>
                </div>
                {queued.length === 0 ? (
                  <p className="font-body text-sm text-muted-foreground text-center py-4 border border-border/50 rounded-lg bg-card/50">
                    No queued posts. Generate some to fill the pipeline.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {queued.map((post, i) => {
                      const publishTime = new Date(firstSlot.getTime() + i * 30 * 60 * 1000);
                      return (
                        <div key={post.id} className="flex items-center gap-3 border border-border/50 rounded-lg bg-card/50 px-3 py-2">
                          <span className="font-display text-xs font-bold text-primary w-5 shrink-0">{i + 1}</span>
                          <div className="min-w-0 flex-1">
                            <p className="font-body text-sm text-foreground truncate">{post.title}</p>
                            <p className="font-body text-xs text-muted-foreground">
                              Created {new Date(post.created_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={async () => {
                                await handleBlogAction(post.id, "publish_post");
                                toast.success(`"${post.title}" published!`);
                              }}
                              className="font-body text-xs px-2.5 py-1 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                            >
                              Publish Now
                            </button>
                            <button
                              onClick={async () => {
                                await handleBlogAction(post.id, "delete_post");
                                toast.success(`"${post.title}" deleted`);
                              }}
                              className="font-body text-xs px-2 py-1 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                              title="Delete draft"
                            >
                              <Trash2 size={12} />
                            </button>
                            <span className="font-body text-xs text-muted-foreground">
                              ~{publishTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

          {blogPosts.filter(p => p.status !== "draft").map((post) => (
            <div key={post.id} className="border border-border rounded-xl bg-card p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="font-display font-bold text-foreground">{post.title}</h2>
                  <p className="font-body text-sm text-muted-foreground mt-1 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className={`inline-block font-body text-xs px-2 py-0.5 rounded-full ${
                      post.status === "published" ? "bg-primary/20 text-primary" :
                      post.status === "rejected" ? "bg-destructive/20 text-destructive" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {post.status}
                    </span>
                    <span className="font-body text-xs text-muted-foreground">
                      Created {new Date(post.created_at).toLocaleString()}
                    </span>
                    {post.published_at && (
                      <span className="font-body text-xs text-primary">
                        Published {new Date(post.published_at).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => {
                      const url = `https://lazyunicorn.ai/blog/${post.slug}`;
                      const hashtags = "#AutonomousCapitalism #AI #RecursiveStartups #SoloFounder #LazyUnicorn #Lovable";
                      const text = `${post.title}. 🦄 🤖\n\n${hashtags}\n\n${url}`;
                      navigator.clipboard.writeText(text);
                      toast.success("X post copied to clipboard!");
                    }}
                    className="font-body text-xs px-3 py-1.5 rounded-lg bg-foreground/10 text-foreground hover:bg-foreground/20 transition-colors flex items-center gap-1"
                    title="Copy X post"
                  >
                    <Twitter size={12} /> X
                  </button>
                  {post.status === "draft" && (
                    <>
                      <button
                        onClick={() => handleBlogAction(post.id, "publish_post")}
                        className="font-body text-xs px-3 py-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                      >
                        Publish
                      </button>
                      <button
                        onClick={() => handleBlogAction(post.id, "reject_post")}
                        className="font-body text-xs px-3 py-1.5 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleBlogAction(post.id, "delete_post")}
                    className="font-body text-xs px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!loading && blogPosts.length === 0 && (
            <p className="font-body text-sm text-muted-foreground text-center py-8">No blog posts yet. Click "Generate New Post" to create one.</p>
          )}
        </div>
      )}

      {activeTab === "analytics" && (
        <AdminAnalytics password={password} />
      )}

      {activeTab === "seo" && <AdminSeo />}

      {activeTab === "geo" && <AdminGeo />}

      {activeTab === "prompts" && <AdminPrompts />}

    </div>
  );
};

export default Admin;
