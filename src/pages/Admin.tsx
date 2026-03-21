import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminAnalytics from "@/components/AdminAnalytics";
import { toast } from "sonner";

interface Submission {
  id: string;
  name: string;
  url: string;
  tagline: string;
  status: string;
  created_at: string;
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
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"submissions" | "blog" | "analytics">("analytics");
  const [generating, setGenerating] = useState(false);

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
    setBlogPosts(data);
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
    setSubmissions(data);
    fetchBlogPosts(password);
  };

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
    try {
      await supabase.functions.invoke("generate-blog-post");
      await fetchBlogPosts(password);
    } catch {
      // ignore
    }
    setGenerating(false);
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
      </div>

      {loading && <p className="font-body text-sm text-muted-foreground">Loading…</p>}

      {activeTab === "submissions" && (
        <div className="space-y-3">
          {submissions.map((s) => (
            <div key={s.id} className="border border-border rounded-xl bg-card p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
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
                {s.status === "pending" && (
                  <div className="flex gap-2 shrink-0">
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
                  </div>
                )}
              </div>
            </div>
          ))}
          {!loading && submissions.length === 0 && (
            <p className="font-body text-sm text-muted-foreground text-center py-8">No submissions yet.</p>
          )}
        </div>
      )}

      {activeTab === "blog" && (
        <div className="space-y-3">
          <button
            onClick={handleGeneratePost}
            disabled={generating}
            className="font-body text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 mb-4"
          >
            {generating ? "Generating…" : "Generate New Post"}
          </button>

          {blogPosts.map((post) => (
            <div key={post.id} className="border border-border rounded-xl bg-card p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="font-display font-bold text-foreground">{post.title}</h2>
                  <p className="font-body text-sm text-muted-foreground mt-1 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-block font-body text-xs px-2 py-0.5 rounded-full ${
                      post.status === "published" ? "bg-primary/20 text-primary" :
                      post.status === "rejected" ? "bg-destructive/20 text-destructive" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {post.status}
                    </span>
                    <span className="font-body text-xs text-muted-foreground">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
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
    </div>
  );
};

export default Admin;
