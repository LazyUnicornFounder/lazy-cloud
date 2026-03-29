import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Users, TrendingUp, Crown, UserCheck, Settings, Download, Search, RefreshCw, Rocket } from "lucide-react";
import ErrorLog from "@/pages/admin/components/ErrorLog";

export default function AdminWaitlistPage() {
  const [settings, setSettings] = useState<any>(null);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [totalCount, setTotalCount] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [priorityCount, setPriorityCount] = useState(0);
  const [convertedCount, setConvertedCount] = useState(0);
  const [page, setPage] = useState(0);
  const pageSize = 50;

  const load = async () => {
    const { data: s } = await supabase.from("waitlist_settings").select("*").single();
    if (s) setSettings(s);

    const { count: total } = await supabase.from("waitlist_subscribers").select("*", { count: "exact", head: true });
    setTotalCount(total || 0);

    const today = new Date().toISOString().split("T")[0];
    const { count: todayC } = await supabase.from("waitlist_subscribers").select("*", { count: "exact", head: true }).gte("created_at", today);
    setTodayCount(todayC || 0);

    const { count: prioC } = await supabase.from("waitlist_subscribers").select("*", { count: "exact", head: true }).eq("status", "priority");
    setPriorityCount(prioC || 0);

    const { count: convC } = await supabase.from("waitlist_subscribers").select("*", { count: "exact", head: true }).eq("status", "converted");
    setConvertedCount(convC || 0);

    let query = supabase.from("waitlist_subscribers").select("*").order("position", { ascending: true }).range(page * pageSize, (page + 1) * pageSize - 1);
    if (statusFilter !== "all") query = query.eq("status", statusFilter);
    if (search) query = query.ilike("email", `%${search}%`);
    const { data: subs } = await query;
    setSubscribers(subs || []);

    const { data: st } = await supabase.from("waitlist_stats").select("*").order("date", { ascending: false }).limit(30);
    setStats(st || []);

    const { data: errs } = await supabase.from("waitlist_errors").select("*").order("created_at", { ascending: false }).limit(50);
    setErrors(errs || []);
  };

  useEffect(() => { load(); }, [page, statusFilter, search]);

  const toggleEngine = async () => {
    if (!settings) return;
    const { error } = await supabase.from("waitlist_settings").update({ is_running: !settings.is_running }).eq("id", settings.id);
    if (!error) {
      setSettings({ ...settings, is_running: !settings.is_running });
      toast.success(settings.is_running ? "Engine paused" : "Engine started");
    }
  };

  const exportCsv = () => {
    const csv = ["Email,Name,Position,Referrals,Status,Created"]
      .concat(subscribers.map(s => `${s.email},${s.name || ""},${s.position},${s.referral_count},${s.status},${s.created_at}`))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "waitlist-subscribers.csv";
    a.click();
  };

  const statCards = [
    { label: "Total Signups", value: totalCount, icon: Users, color: "text-blue-500" },
    { label: "Today", value: todayCount, icon: TrendingUp, color: "text-green-500" },
    { label: "Priority Access", value: priorityCount, icon: Crown, color: "text-amber-500" },
    { label: "Converted", value: convertedCount, icon: UserCheck, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Lazy Waitlist</h1>
          <p className="text-sm text-muted-foreground">Pre-launch email capture with viral referrals</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm">{settings?.is_running ? "🟢 Running" : "🔴 Paused"}</span>
            <Switch checked={settings?.is_running || false} onCheckedChange={toggleEngine} />
          </div>
          <Badge variant={settings?.is_launched ? "default" : "secondary"}>
            {settings?.is_launched ? "🚀 Launched" : "📋 Collecting"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <div>
                  <p className="text-2xl font-bold">{s.value.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="subscribers">
        <TabsList>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="emails">Emails</TabsTrigger>
          <TabsTrigger value="launch">Launch</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
        </TabsList>

        <TabsContent value="subscribers" className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-md border bg-background px-3 text-sm"
            >
              <option value="all">All</option>
              <option value="waiting">Waiting</option>
              <option value="priority">Priority</option>
              <option value="converted">Converted</option>
              <option value="unsubscribed">Unsubscribed</option>
            </select>
            <Button variant="outline" size="sm" onClick={exportCsv}>
              <Download className="h-4 w-4 mr-1" /> Export CSV
            </Button>
            <Button variant="outline" size="icon" onClick={load}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Referrals</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No subscribers yet
                  </TableCell>
                </TableRow>
              ) : (
                subscribers.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.email}</TableCell>
                    <TableCell>#{s.position}</TableCell>
                    <TableCell>{s.referral_count}</TableCell>
                    <TableCell>
                      <Badge variant={s.status === "priority" ? "default" : s.status === "converted" ? "default" : "secondary"}>
                        {s.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(s.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, totalCount)} of {totalCount}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Prev</Button>
              <Button variant="outline" size="sm" disabled={(page + 1) * pageSize >= totalCount} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Signups (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No data yet</p>
              ) : (
                <div className="space-y-2">
                  {stats.slice(0, 14).map((s) => (
                    <div key={s.id} className="flex items-center justify-between text-sm">
                      <span>{new Date(s.date).toLocaleDateString()}</span>
                      <div className="flex items-center gap-4">
                        <span>{s.signups_count} signups</span>
                        <span className="text-muted-foreground">{s.referrals_count} referrals</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Referral Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              {subscribers.filter(s => s.referral_count > 0).sort((a, b) => b.referral_count - a.referral_count).slice(0, 10).map((s, i) => (
                <div key={s.id} className="flex items-center justify-between py-2 text-sm">
                  <span>{i + 1}. {s.email}</span>
                  <Badge variant="secondary">{s.referral_count} referrals</Badge>
                </div>
              ))}
              {subscribers.filter(s => s.referral_count > 0).length === 0 && (
                <p className="text-muted-foreground text-center py-4">No referrals yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emails" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Welcome Emails", field: "welcome_email_sent" },
                { label: "Follow-up Emails", field: "followup_email_sent" },
                { label: "Launch Emails", field: "launch_email_sent" },
              ].map((e) => {
                const sent = subscribers.filter(s => s[e.field]).length;
                return (
                  <div key={e.label} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="font-medium">{e.label}</span>
                    <span className="text-muted-foreground">{sent} sent</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="launch" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5" /> Launch Day Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <span>Current Status</span>
                <Badge variant={settings?.is_launched ? "default" : "secondary"}>
                  {settings?.is_launched ? "🚀 Launched" : "📋 Collecting Signups"}
                </Badge>
              </div>

              {settings?.launch_date && (
                <div className="flex items-center justify-between">
                  <span>Target Launch Date</span>
                  <span className="font-medium">{new Date(settings.launch_date).toLocaleDateString()}</span>
                </div>
              )}

              <div className="space-y-2 border rounded-lg p-4">
                <p className="font-semibold">Launch Checklist</p>
                <div className="space-y-1 text-sm">
                  <p>{settings?.is_running ? "✅" : "⬜"} Waitlist page active</p>
                  <p>{settings?.welcome_email_enabled ? "✅" : "⬜"} Welcome emails configured</p>
                  <p>{settings?.launch_email_subject ? "✅" : "⬜"} Launch email template ready</p>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                disabled={settings?.is_launched}
                onClick={async () => {
                  if (!confirm("Are you sure you want to launch? This will send launch emails to all subscribers.")) return;
                  await supabase.from("waitlist_settings").update({ is_launched: true }).eq("id", settings.id);
                  setSettings({ ...settings, is_launched: true });
                  toast.success("🚀 Waitlist launched!");
                }}
              >
                <Rocket className="h-5 w-5 mr-2" />
                {settings?.is_launched ? "Already Launched" : "🚀 LAUNCH WAITLIST"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors">
          <ErrorLog tableName="waitlist_errors" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
