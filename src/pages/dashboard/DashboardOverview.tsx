import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useOrg } from "@/hooks/useOrg";
import { Files, HardDrive, Search, Users, Upload, Cloud, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardOverview() {
  const { user } = useAuth();
  const { org, loading: orgLoading } = useOrg();
  const [stats, setStats] = useState({ files: 0, storage: 0, searches: 0, users: 0 });
  const [hasFiles, setHasFiles] = useState<boolean | null>(null);

  useEffect(() => {
    if (!org) return;

    const fetchStats = async () => {
      const [filesRes, searchRes, membersRes] = await Promise.all([
        supabase.from("files").select("size_bytes", { count: "exact" }).eq("org_id", org.id),
        supabase
          .from("search_history")
          .select("id", { count: "exact" })
          .eq("org_id", org.id)
          .gte("created_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
        supabase.from("org_members").select("user_id", { count: "exact" }).eq("org_id", org.id),
      ]);

      const totalBytes = (filesRes.data || []).reduce((sum, f) => sum + (Number(f.size_bytes) || 0), 0);
      setStats({
        files: filesRes.count || 0,
        storage: totalBytes,
        searches: searchRes.count || 0,
        users: membersRes.count || 0,
      });
      setHasFiles((filesRes.count || 0) > 0);
    };

    fetchStats();
  }, [org]);

  if (orgLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const overviewCards = [
    { label: "Files indexed", value: stats.files.toLocaleString(), icon: Files },
    { label: "Total storage", value: formatBytes(stats.storage), icon: HardDrive },
    { label: "Searches this month", value: stats.searches.toLocaleString(), icon: Search },
    { label: "Active users", value: stats.users.toLocaleString(), icon: Users },
  ];

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold font-display mb-1">Dashboard</h1>
      <p className="text-sm text-muted-foreground mb-8">{org?.name || "Your organisation"}</p>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {overviewCards.map((card) => (
          <Card key={card.label} className="bg-card border-border">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <card.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{card.label}</span>
              </div>
              <div className="text-2xl font-bold font-display">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Setup wizard if no files */}
      {hasFiles === false && <SetupWizard />}
    </div>
  );
}

function SetupWizard() {
  const [step, setStep] = useState(1);

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-8">
        <h2 className="text-xl font-bold font-display mb-6">Get started</h2>

        {/* Steps indicator */}
        <div className="flex items-center gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  s <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}
              >
                {s}
              </div>
              <span className={`text-sm hidden sm:inline ${s <= step ? "text-foreground" : "text-muted-foreground"}`}>
                {s === 1 && "Connect storage"}
                {s === 2 && "Indexing"}
                {s === 3 && "Ready"}
              </span>
              {s < 3 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">Choose how you'd like to add your documents.</p>
            <div className="grid sm:grid-cols-3 gap-4">
              <button
                onClick={() => setStep(2)}
                className="p-6 border border-border rounded-lg hover:border-primary/50 transition-colors text-left"
              >
                <Upload className="h-6 w-6 text-primary mb-3" />
                <div className="font-medium text-sm mb-1">Upload files</div>
                <div className="text-xs text-muted-foreground">Drag & drop, max 5 GB per upload</div>
              </button>
              <button
                onClick={() => setStep(2)}
                className="p-6 border border-border rounded-lg hover:border-primary/50 transition-colors text-left"
              >
                <Cloud className="h-6 w-6 text-primary mb-3" />
                <div className="font-medium text-sm mb-1">Connect AWS S3</div>
                <div className="text-xs text-muted-foreground">Bucket name, region, access key</div>
              </button>
              <button
                onClick={() => setStep(2)}
                className="p-6 border border-border rounded-lg hover:border-primary/50 transition-colors text-left"
              >
                <HardDrive className="h-6 w-6 text-primary mb-3" />
                <div className="font-medium text-sm mb-1">Google Drive</div>
                <div className="text-xs text-muted-foreground">Connect via OAuth</div>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">Indexing your documents…</p>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>0 / 0 files processed</span>
                <span className="text-muted-foreground">Waiting for upload</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
            <Button onClick={() => setStep(3)}>
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Your documents are ready to search.</p>
            <div className="flex gap-4">
              <Button>Open Search App</Button>
              <Link to="/dashboard/team">
                <Button variant="outline">Invite Team Members</Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
