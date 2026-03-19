import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Submission {
  id: string;
  name: string;
  url: string;
  tagline: string;
  status: string;
  created_at: string;
}

const Admin = () => {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
  };

  const handleAction = async (id: string, action: "approve" | "reject") => {
    await supabase.functions.invoke("admin-submissions", {
      body: { action, password, id },
    });
    fetchSubmissions(password);
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
    <div className="min-h-screen bg-background text-foreground px-4 py-8 max-w-3xl mx-auto">
      <h1 className="font-display text-2xl font-bold mb-6">Submissions</h1>
      {loading && <p className="font-body text-sm text-muted-foreground">Loading…</p>}
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
    </div>
  );
};

export default Admin;
