import { useState, useEffect, useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, FunnelChart, Funnel, LabelList } from "recharts";
import { supabase } from "@/integrations/supabase/client";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface AnalyticsEvent {
  event_name: string;
  event_data: Record<string, unknown> | null;
  page: string | null;
  created_at: string;
}

interface Visitor {
  country: string | null;
  country_code: string | null;
  city: string | null;
  region: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  user_agent: string | null;
  page: string | null;
  referrer: string | null;
}

interface AdminAnalyticsProps {
  password: string;
}

function parseUA(ua: string | null): { browser: string; os: string } {
  if (!ua) return { browser: "Unknown", os: "Unknown" };
  let browser = "Other";
  if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Edg")) browser = "Edge";

  let os = "Other";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac")) os = "macOS";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("Linux")) os = "Linux";

  return { browser, os };
}

const AdminAnalytics = ({ password }: AdminAnalyticsProps) => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [visitorsRes, eventsRes] = await Promise.all([
        supabase.functions.invoke("admin-submissions", {
          body: { action: "visitor_stats", password },
        }),
        supabase.functions.invoke("admin-submissions", {
          body: { action: "analytics_events", password },
        }),
      ]);
      if (!visitorsRes.error && visitorsRes.data && !visitorsRes.data.error) {
        setVisitors(visitorsRes.data);
      }
      if (!eventsRes.error && eventsRes.data && !eventsRes.data.error) {
        setEvents(eventsRes.data);
      }
      setLoading(false);
    };
    fetchData();
  }, [password]);

  const stats = useMemo(() => {
    const total = visitors.length;
    const today = visitors.filter(
      (v) => new Date(v.created_at).toDateString() === new Date().toDateString()
    ).length;

    // Country breakdown
    const countryMap: Record<string, number> = {};
    visitors.forEach((v) => {
      const key = v.country || "Unknown";
      countryMap[key] = (countryMap[key] || 0) + 1;
    });
    const countries = Object.entries(countryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);

    // City breakdown
    const cityMap: Record<string, number> = {};
    visitors.forEach((v) => {
      if (v.city) {
        const key = `${v.city}, ${v.country_code || ""}`;
        cityMap[key] = (cityMap[key] || 0) + 1;
      }
    });
    const cities = Object.entries(cityMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);

    // Browser/OS breakdown
    const browserMap: Record<string, number> = {};
    const osMap: Record<string, number> = {};
    visitors.forEach((v) => {
      const { browser, os } = parseUA(v.user_agent);
      browserMap[browser] = (browserMap[browser] || 0) + 1;
      osMap[os] = (osMap[os] || 0) + 1;
    });
    const browsers = Object.entries(browserMap).sort((a, b) => b[1] - a[1]);
    const operatingSystems = Object.entries(osMap).sort((a, b) => b[1] - a[1]);

    // Page breakdown
    const pageMap: Record<string, number> = {};
    visitors.forEach((v) => {
      const key = v.page || "/";
      pageMap[key] = (pageMap[key] || 0) + 1;
    });
    const pages = Object.entries(pageMap).sort((a, b) => b[1] - a[1]).slice(0, 10);

    // Referrer breakdown
    const refMap: Record<string, number> = {};
    visitors.forEach((v) => {
      if (v.referrer) {
        try {
          const host = new URL(v.referrer).hostname;
          refMap[host] = (refMap[host] || 0) + 1;
        } catch {
          refMap[v.referrer] = (refMap[v.referrer] || 0) + 1;
        }
      }
    });
    const referrers = Object.entries(refMap).sort((a, b) => b[1] - a[1]).slice(0, 10);

    // Map markers (deduplicate by lat/lng)
    const markerMap: Record<string, { lat: number; lng: number; city: string; count: number }> = {};
    visitors.forEach((v) => {
      if (v.latitude && v.longitude) {
        const key = `${v.latitude.toFixed(1)},${v.longitude.toFixed(1)}`;
        if (!markerMap[key]) {
          markerMap[key] = { lat: v.latitude, lng: v.longitude, city: v.city || "Unknown", count: 0 };
        }
        markerMap[key].count++;
      }
    });
    const markers = Object.values(markerMap);

    // Daily visits (last 30 days)
    const dailyMap: Record<string, number> = {};
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      dailyMap[d.toISOString().split("T")[0]] = 0;
    }
    visitors.forEach((v) => {
      const day = new Date(v.created_at).toISOString().split("T")[0];
      if (dailyMap[day] !== undefined) {
        dailyMap[day]++;
      }
    });
    const dailyVisits = Object.entries(dailyMap).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      visits: count,
    }));

    return { total, today, countries, cities, browsers, operatingSystems, pages, referrers, markers, dailyVisits };
  }, [visitors]);

  const lazyBloggerStats = useMemo(() => {
    const pageViews = events.filter(e => e.event_name === "lazy_blogger_page_view").length;
    const promptCopies = events.filter(e => e.event_name === "lazy_blogger_prompt_copy").length;
    const earlyAccess = events.filter(e => e.event_name === "lazy_blogger_early_access").length;

    // Breakdown by frequency tier
    const tierBreakdown: Record<string, number> = {};
    events.filter(e => e.event_name === "lazy_blogger_prompt_copy").forEach(e => {
      const label = (e.event_data as any)?.label || "Unknown";
      tierBreakdown[label] = (tierBreakdown[label] || 0) + 1;
    });
    const tiers = Object.entries(tierBreakdown).sort((a, b) => b[1] - a[1]);

    // Daily trend (last 14 days)
    const dailyMap: Record<string, { views: number; copies: number }> = {};
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      dailyMap[d.toISOString().split("T")[0]] = { views: 0, copies: 0 };
    }
    events.forEach(e => {
      const day = new Date(e.created_at).toISOString().split("T")[0];
      if (dailyMap[day]) {
        if (e.event_name === "lazy_blogger_page_view") dailyMap[day].views++;
        if (e.event_name === "lazy_blogger_prompt_copy") dailyMap[day].copies++;
      }
    });
    const dailyTrend = Object.entries(dailyMap).map(([date, data]) => ({
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      views: data.views,
      copies: data.copies,
    }));

    const conversionRate = pageViews > 0 ? ((promptCopies / pageViews) * 100).toFixed(1) : "0";

    return { pageViews, promptCopies, earlyAccess, conversionRate, tiers, dailyTrend };
  }, [events]);

  if (loading) {
    return <p className="font-body text-sm text-muted-foreground py-8 text-center">Loading analytics…</p>;
  }

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-border rounded-xl bg-card p-4 text-center">
          <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Total Visitors</p>
          <p className="font-display text-3xl font-bold text-foreground mt-1">{stats.total}</p>
        </div>
        <div className="border border-border rounded-xl bg-card p-4 text-center">
          <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Today</p>
          <p className="font-display text-3xl font-bold text-primary mt-1">{stats.today}</p>
        </div>
      </div>

      {/* Lazy Blogger Funnel */}
      <div className="border border-border rounded-xl bg-card p-4">
        <h3 className="font-display font-bold text-foreground mb-3">Lazy Blogger — Funnel</h3>
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="text-center p-3 rounded-lg bg-background/50 border border-border/50">
            <p className="font-display text-2xl font-bold text-foreground">{lazyBloggerStats.pageViews}</p>
            <p className="font-body text-xs text-muted-foreground">Page Views</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-background/50 border border-border/50">
            <p className="font-display text-2xl font-bold text-primary">{lazyBloggerStats.promptCopies}</p>
            <p className="font-body text-xs text-muted-foreground">Prompt Copies</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-background/50 border border-border/50">
            <p className="font-display text-2xl font-bold text-foreground">{lazyBloggerStats.earlyAccess}</p>
            <p className="font-body text-xs text-muted-foreground">Early Access</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-background/50 border border-border/50">
            <p className="font-display text-2xl font-bold text-primary">{lazyBloggerStats.conversionRate}%</p>
            <p className="font-body text-xs text-muted-foreground">Conv. Rate</p>
          </div>
        </div>

        {/* Daily trend */}
        <div className="w-full h-48 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={lazyBloggerStats.dailyTrend} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                interval={Math.floor(lazyBloggerStats.dailyTrend.length / 5)}
                tickLine={false}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="views" name="Page Views" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="copies" name="Prompt Copies" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tier breakdown */}
        {lazyBloggerStats.tiers.length > 0 && (
          <div>
            <h4 className="font-display text-sm font-bold text-muted-foreground mb-2">Copies by Frequency</h4>
            <div className="space-y-1.5">
              {lazyBloggerStats.tiers.map(([label, count]) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="font-body text-sm text-foreground/80">{label}</span>
                  <span className="font-body text-xs text-muted-foreground">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Daily visits chart */}
      <div className="border border-border rounded-xl bg-card p-4">
        <h3 className="font-display font-bold text-foreground mb-3">Daily Visits (Last 30 Days)</h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.dailyVisits} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                interval={Math.floor(stats.dailyVisits.length / 7)}
                tickLine={false}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold" }}
                itemStyle={{ color: "hsl(var(--primary))" }}
              />
              <Bar dataKey="visits" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* World map */}
      <div className="border border-border rounded-xl bg-card p-4 overflow-hidden">
        <h3 className="font-display font-bold text-foreground mb-3">Visitor Map</h3>
        <div className="w-full" style={{ aspectRatio: "2/1" }}>
          <ComposableMap
            projectionConfig={{ scale: 147 }}
            style={{ width: "100%", height: "100%" }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="hsl(var(--muted))"
                    stroke="hsl(var(--border))"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "hsl(var(--accent))", outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>
            {stats.markers.map((m, i) => (
              <Marker key={i} coordinates={[m.lng, m.lat]}>
                <circle
                  r={Math.min(Math.max(m.count * 1.5, 3), 12)}
                  fill="hsl(var(--primary))"
                  fillOpacity={0.7}
                  stroke="hsl(var(--primary))"
                  strokeWidth={1}
                  strokeOpacity={0.3}
                />
              </Marker>
            ))}
          </ComposableMap>
        </div>
      </div>

      {/* Breakdowns grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Countries */}
        <div className="border border-border rounded-xl bg-card p-4">
          <h3 className="font-display font-bold text-foreground mb-3">Top Countries</h3>
          <div className="space-y-2">
            {stats.countries.map(([name, count]) => (
              <div key={name} className="flex items-center justify-between">
                <span className="font-body text-sm text-foreground/80">{name}</span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 rounded-full bg-primary/30 w-20 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    />
                  </div>
                  <span className="font-body text-xs text-muted-foreground w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
            {stats.countries.length === 0 && (
              <p className="font-body text-xs text-muted-foreground">No data yet</p>
            )}
          </div>
        </div>

        {/* Cities */}
        <div className="border border-border rounded-xl bg-card p-4">
          <h3 className="font-display font-bold text-foreground mb-3">Top Cities</h3>
          <div className="space-y-2">
            {stats.cities.map(([name, count]) => (
              <div key={name} className="flex items-center justify-between">
                <span className="font-body text-sm text-foreground/80">{name}</span>
                <span className="font-body text-xs text-muted-foreground">{count}</span>
              </div>
            ))}
            {stats.cities.length === 0 && (
              <p className="font-body text-xs text-muted-foreground">No data yet</p>
            )}
          </div>
        </div>

        {/* Browsers */}
        <div className="border border-border rounded-xl bg-card p-4">
          <h3 className="font-display font-bold text-foreground mb-3">Browsers</h3>
          <div className="space-y-2">
            {stats.browsers.map(([name, count]) => (
              <div key={name} className="flex items-center justify-between">
                <span className="font-body text-sm text-foreground/80">{name}</span>
                <span className="font-body text-xs text-muted-foreground">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* OS */}
        <div className="border border-border rounded-xl bg-card p-4">
          <h3 className="font-display font-bold text-foreground mb-3">Operating Systems</h3>
          <div className="space-y-2">
            {stats.operatingSystems.map(([name, count]) => (
              <div key={name} className="flex items-center justify-between">
                <span className="font-body text-sm text-foreground/80">{name}</span>
                <span className="font-body text-xs text-muted-foreground">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pages */}
        <div className="border border-border rounded-xl bg-card p-4">
          <h3 className="font-display font-bold text-foreground mb-3">Top Pages</h3>
          <div className="space-y-2">
            {stats.pages.map(([name, count]) => (
              <div key={name} className="flex items-center justify-between">
                <span className="font-body text-sm text-foreground/80 truncate max-w-[200px]">{name}</span>
                <span className="font-body text-xs text-muted-foreground">{count}</span>
              </div>
            ))}
            {stats.pages.length === 0 && (
              <p className="font-body text-xs text-muted-foreground">No data yet</p>
            )}
          </div>
        </div>

        {/* Referrers */}
        <div className="border border-border rounded-xl bg-card p-4">
          <h3 className="font-display font-bold text-foreground mb-3">Top Referrers</h3>
          <div className="space-y-2">
            {stats.referrers.map(([name, count]) => (
              <div key={name} className="flex items-center justify-between">
                <span className="font-body text-sm text-foreground/80 truncate max-w-[200px]">{name}</span>
                <span className="font-body text-xs text-muted-foreground">{count}</span>
              </div>
            ))}
            {stats.referrers.length === 0 && (
              <p className="font-body text-xs text-muted-foreground">No referrers yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
