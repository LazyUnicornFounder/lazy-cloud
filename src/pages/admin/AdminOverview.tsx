import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Eye, CreditCard, UserPlus, Loader2, TrendingUp } from "lucide-react";
import { format } from "date-fns";

interface VisitorRow {
  created_at: string;
  country: string | null;
  page: string | null;
  referrer: string | null;
}

interface ProfileRow {
  user_id: string;
  full_name: string | null;
  company_name: string | null;
  paid_tier: string | null;
  polar_checkout_id: string | null;
  created_at: string;
}

interface EarlyAccessRow {
  id: string;
  email: string;
  source: string | null;
  created_at: string;
}

export default function AdminOverview() {
  const [loading, setLoading] = useState(true);
  const [visitors, setVisitors] = useState<VisitorRow[]>([]);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [earlyAccess, setEarlyAccess] = useState<EarlyAccessRow[]>([]);
  const [visitorCount30d, setVisitorCount30d] = useState(0);
  const [visitorCount7d, setVisitorCount7d] = useState(0);
  const [visitorCountToday, setVisitorCountToday] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const now = new Date();
    const d30 = new Date(now.getTime() - 30 * 86400000).toISOString();
    const d7 = new Date(now.getTime() - 7 * 86400000).toISOString();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    const [visitorsRes, visitors7Res, visitorsTodayRes, profilesRes, earlyRes] = await Promise.all([
      supabase.from("visitors").select("created_at, country, page, referrer").gte("created_at", d30).order("created_at", { ascending: false }).limit(200),
      supabase.from("visitors").select("id", { count: "exact" }).gte("created_at", d7),
      supabase.from("visitors").select("id", { count: "exact" }).gte("created_at", today),
      supabase.from("profiles").select("user_id, full_name, company_name, paid_tier, polar_checkout_id, created_at").order("created_at", { ascending: false }),
      supabase.from("early_access").select("id, email, source, created_at").order("created_at", { ascending: false }).limit(50),
    ]);

    setVisitors((visitorsRes.data as VisitorRow[]) || []);
    setVisitorCount30d(visitorsRes.data?.length || 0);
    setVisitorCount7d(visitors7Res.count || 0);
    setVisitorCountToday(visitorsTodayRes.count || 0);
    setProfiles((profilesRes.data as ProfileRow[]) || []);
    setEarlyAccess((earlyRes.data as EarlyAccessRow[]) || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const paidCustomers = profiles.filter((p) => p.paid_tier);
  const topCountries = Object.entries(
    visitors.reduce<Record<string, number>>((acc, v) => {
      const c = v.country || "Unknown";
      acc[c] = (acc[c] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topPages = Object.entries(
    visitors.reduce<Record<string, number>>((acc, v) => {
      const p = v.page || "/";
      acc[p] = (acc[p] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const statCards = [
    { label: "Visitors today", value: visitorCountToday, icon: Eye },
    { label: "Visitors (7d)", value: visitorCount7d, icon: TrendingUp },
    { label: "Total signups", value: earlyAccess.length, icon: UserPlus },
    { label: "Paid customers", value: paidCustomers.length, icon: CreditCard },
  ];

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold font-display mb-1">Admin overview</h1>
      <p className="text-sm text-muted-foreground mb-8">Site, payments & customer activity</p>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((card) => (
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

      <div className="grid lg:grid-cols-2 gap-6 mb-10">
        {/* Top countries */}
        <Card className="bg-card border-border">
          <CardContent className="p-5">
            <h3 className="text-sm font-medium mb-4">Top countries (30d)</h3>
            {topCountries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No visitor data yet.</p>
            ) : (
              <div className="space-y-2">
                {topCountries.map(([country, count]) => (
                  <div key={country} className="flex justify-between text-sm">
                    <span>{country}</span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top pages */}
        <Card className="bg-card border-border">
          <CardContent className="p-5">
            <h3 className="text-sm font-medium mb-4">Top pages (30d)</h3>
            {topPages.length === 0 ? (
              <p className="text-sm text-muted-foreground">No visitor data yet.</p>
            ) : (
              <div className="space-y-2">
                {topPages.map(([page, count]) => (
                  <div key={page} className="flex justify-between text-sm">
                    <span className="truncate mr-4 font-mono text-xs">{page}</span>
                    <span className="text-muted-foreground shrink-0">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Paid customers */}
      <h2 className="text-lg font-bold font-display mb-4">Paid customers</h2>
      <Card className="bg-card border-border mb-10">
        <CardContent className="p-0">
          {paidCustomers.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">No paid customers yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-5 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Name</th>
                    <th className="px-5 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Company</th>
                    <th className="px-5 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Plan</th>
                    <th className="px-5 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paidCustomers.map((p) => (
                    <tr key={p.user_id} className="border-b border-border/50">
                      <td className="px-5 py-3">{p.full_name || "—"}</td>
                      <td className="px-5 py-3 text-muted-foreground">{p.company_name || "—"}</td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {p.paid_tier}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{format(new Date(p.created_at), "d MMM yyyy")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent signups */}
      <h2 className="text-lg font-bold font-display mb-4">Recent signups</h2>
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          {earlyAccess.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">No signups yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-5 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Email</th>
                    <th className="px-5 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Source</th>
                    <th className="px-5 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {earlyAccess.map((s) => (
                    <tr key={s.id} className="border-b border-border/50">
                      <td className="px-5 py-3">{s.email}</td>
                      <td className="px-5 py-3 text-muted-foreground">{s.source || "—"}</td>
                      <td className="px-5 py-3 text-muted-foreground">{format(new Date(s.created_at), "d MMM yyyy")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
