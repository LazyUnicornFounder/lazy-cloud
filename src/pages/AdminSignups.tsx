import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { Users, Mail, Calendar, ShieldAlert, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EarlyAccessEntry {
  id: string;
  email: string;
  source: string | null;
  created_at: string;
}

export default function AdminSignups() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [signups, setSignups] = useState<EarlyAccessEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }
    fetchSignups();
  }, [user, authLoading]);

  const fetchSignups = async () => {
    setLoading(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("admin-early-access");
      if (fnError) throw fnError;
      if (data?.error) {
        setError(data.error);
        return;
      }
      setSignups(data || []);
    } catch (e: any) {
      setError(e.message || "Failed to load signups");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <ShieldAlert className="h-8 w-8 text-destructive mx-auto" />
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold font-display">Early Access Signups</h1>
          <p className="text-sm text-muted-foreground mt-1">
            <Users className="inline h-4 w-4 mr-1" />
            {signups.length} total
          </p>
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
