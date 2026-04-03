import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Lock, Users, Mail, Calendar } from "lucide-react";

interface EarlyAccessEntry {
  id: string;
  email: string;
  source: string | null;
  created_at: string;
}

export default function AdminSignups() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [signups, setSignups] = useState<EarlyAccessEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: fnError } = await supabase.functions.invoke("admin-submissions", {
        body: { action: "list_early_access", password },
      });
      if (fnError) throw fnError;
      if (data?.error) {
        setError(data.error);
        return;
      }
      setSignups(data || []);
      setAuthenticated(true);
    } catch (e: any) {
      setError(e.message || "Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-4">
          <div className="flex items-center gap-2 text-foreground">
            <Lock className="h-5 w-5" />
            <h1 className="text-lg font-semibold font-display">Admin — Signups</h1>
          </div>
          <Input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={handleLogin} disabled={loading || !password} className="w-full">
            {loading ? "Checking…" : "View signups"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold font-display">Early Access Signups</h1>
            <p className="text-sm text-muted-foreground mt-1">
              <Users className="inline h-4 w-4 mr-1" />
              {signups.length} total
            </p>
          </div>
        </div>

        <div className="border border-border rounded-lg overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-2 bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <span>Email</span>
            <span>Source</span>
            <span>Date</span>
          </div>
          {signups.length === 0 ? (
            <p className="px-4 py-8 text-center text-muted-foreground text-sm">No signups yet.</p>
          ) : (
            signups.map((s) => (
              <div
                key={s.id}
                className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-4 py-3 border-t border-border text-sm"
              >
                <span className="flex items-center gap-2 truncate">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  {s.email}
                </span>
                <span className="text-muted-foreground text-xs">{s.source || "—"}</span>
                <span className="text-muted-foreground text-xs flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(s.created_at), "d MMM yyyy")}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
