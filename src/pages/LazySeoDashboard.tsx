import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { adminWrite } from "@/lib/adminWrite";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ArrowUp, ArrowDown, Minus, Settings, Zap, FileText, Target } from "lucide-react";

const LazySeoD = () => {
  const [settings, setSettings] = useState<any>(null);
  const [keywords, setKeywords] = useState<any[]>([]);
  const [postCount, setPostCount] = useState(0);
  const [postSlugs, setPostSlugs] = useState<Set<string>>(new Set());
  const [publishing, setPublishing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [settingsRes, keywordsRes, postsRes] = await Promise.all([
      supabase.from("seo_settings").select("*").order("created_at", { ascending: false }).limit(1).single(),
      supabase.from("seo_keywords").select("*").order("last_checked", { ascending: false }),
      supabase.from("seo_posts").select("slug, target_keyword").eq("status", "published"),
    ]);
    if (settingsRes.data) setSettings(settingsRes.data);
    if (keywordsRes.data) setKeywords(keywordsRes.data);
    if (postsRes.data) {
      setPostCount(postsRes.data.length);
      setPostSlugs(new Set(postsRes.data.map((p: any) => p.target_keyword?.toLowerCase())));
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const toggleRunning = async () => {
    if (!settings) return;
    const newVal = !settings.is_running;
    const { error } = await adminWrite({ table: "seo_settings", operation: "update", data: { is_running: newVal }, match: { id: settings.id } }).catch((e: any) => ({ error: e }));
    if (error) { toast.error("Failed to update"); return; }
    setSettings({ ...settings, is_running: newVal });
    toast.success(newVal ? "Lazy SEO resumed" : "Lazy SEO paused");
  };

  const publishNow = async () => {
    setPublishing(true);
    try {
      const res = await supabase.functions.invoke("lazy-seo-publish");
      if (res.error) throw res.error;
      toast.success("Post published!");
      fetchData();
    } catch (e: any) {
      toast.error("Publish failed: " + (e.message || "Unknown error"));
    }
    setPublishing(false);
  };

  const positionIndicator = (current: number | null, previous: number | null) => {
    if (current == null) return <Minus className="w-4 h-4 text-muted-foreground" />;
    if (previous == null) return <span className="text-muted-foreground text-xs">new</span>;
    if (current < previous) return <ArrowUp className="w-4 h-4 text-green-500" />;
    if (current > previous) return <ArrowDown className="w-4 h-4 text-destructive" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  if (loading) return <main className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading…</div>;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Lazy SEO Dashboard</h1>
            <p className="text-muted-foreground text-sm">Autonomous SEO agent status</p>
          </div>
          <Link to="/lazy-seo-setup">
            <Button variant="outline" size="sm"><Settings className="w-4 h-4 mr-1" /> Edit Settings</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-5 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm"><FileText className="w-4 h-4" /> Posts Published</div>
            <p className="text-3xl font-bold">{postCount}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm"><Target className="w-4 h-4" /> Keywords Tracked</div>
            <p className="text-3xl font-bold">{keywords.length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 space-y-1 flex items-center justify-between">
            <div>
              <div className="text-muted-foreground text-sm mb-1">Agent Status</div>
              <Badge variant={settings?.is_running ? "default" : "secondary"}>
                {settings?.is_running ? "Running" : "Paused"}
              </Badge>
            </div>
            <Switch checked={settings?.is_running ?? false} onCheckedChange={toggleRunning} />
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={publishNow} disabled={publishing}>
            <Zap className="w-4 h-4 mr-1" /> {publishing ? "Publishing…" : "Publish One Now"}
          </Button>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold">Keyword Tracker</h2>
          </div>
          {keywords.length === 0 ? (
            <p className="p-6 text-center text-muted-foreground text-sm">No keywords yet. Run the analysis to generate keyword opportunities.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Keyword</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Post Exists</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keywords.map((kw) => (
                  <TableRow key={kw.id}>
                    <TableCell className="font-medium">{kw.keyword}</TableCell>
                    <TableCell>{kw.current_position ?? "—"}</TableCell>
                    <TableCell>{positionIndicator(kw.current_position, kw.previous_position)}</TableCell>
                    <TableCell>
                      {postSlugs.has(kw.keyword?.toLowerCase()) ? (
                        <Badge variant="default" className="text-xs">Yes</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">No</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default LazySeoD;
