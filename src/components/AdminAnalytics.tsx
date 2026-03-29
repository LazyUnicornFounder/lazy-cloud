import { useState, useEffect, useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { staticBlogPosts } from "@/components/BlogSection";

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

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: string;
  created_at: string;
  published_at: string | null;
}

/* ── All agents by category (unified taxonomy) ── */
const AGENT_CATEGORIES: { category: string; agents: { key: string; label: string; path: string; color: string }[] }[] = [
  {
    category: "Unicorn",
    agents: [
      { key: "lazy-launch", label: "Lazy Launch", path: "/lazy-launch", color: "hsl(280, 60%, 55%)" },
      { key: "lazy-run", label: "Lazy Run", path: "/lazy-run", color: "hsl(280, 60%, 55%)" },
    ],
  },
  {
    category: "Content",
    agents: [
      { key: "lazy-blogger", label: "Lazy Blogger", path: "/lazy-blogger", color: "hsl(142, 71%, 45%)" },
      { key: "lazy-seo", label: "Lazy SEO", path: "/lazy-seo", color: "hsl(217, 91%, 60%)" },
      { key: "lazy-geo", label: "Lazy GEO", path: "/lazy-geo", color: "hsl(270, 50%, 60%)" },
      { key: "lazy-crawl", label: "Lazy Crawl", path: "/lazy-crawl", color: "hsl(30, 80%, 55%)" },
      { key: "lazy-perplexity", label: "Lazy Perplexity", path: "/lazy-perplexity", color: "hsl(190, 70%, 50%)" },
      { key: "lazy-contentful", label: "Lazy Contentful", path: "/lazy-contentful", color: "hsl(120, 40%, 50%)" },
    ],
  },
  {
    category: "Commerce",
    agents: [
      { key: "lazy-store", label: "Lazy Store", path: "/lazy-store", color: "hsl(45, 90%, 50%)" },
      { key: "lazy-pay", label: "Lazy Pay", path: "/lazy-pay", color: "hsl(340, 65%, 55%)" },
      { key: "lazy-sms", label: "Lazy SMS", path: "/lazy-sms", color: "hsl(160, 60%, 45%)" },
      { key: "lazy-mail", label: "Lazy Mail", path: "/lazy-mail", color: "hsl(200, 50%, 50%)" },
      { key: "lazy-drop", label: "Lazy Drop", path: "/lazy-drop", color: "hsl(20, 70%, 50%)" },
      { key: "lazy-print", label: "Lazy Print", path: "/lazy-print", color: "hsl(50, 60%, 50%)" },
    ],
  },
  {
    category: "Media",
    agents: [
      { key: "lazy-voice", label: "Lazy Voice", path: "/lazy-voice", color: "hsl(40, 70%, 55%)" },
      { key: "lazy-stream", label: "Lazy Stream", path: "/lazy-stream", color: "hsl(0, 70%, 55%)" },
      { key: "lazy-youtube", label: "Lazy YouTube", path: "/lazy-youtube", color: "hsl(0, 80%, 50%)" },
      { key: "lazy-design", label: "Lazy Design", path: "/lazy-design", color: "hsl(310, 50%, 55%)" },
    ],
  },
  {
    category: "Dev",
    agents: [
      { key: "lazy-github", label: "Lazy GitHub", path: "/lazy-github", color: "hsl(0, 0%, 60%)" },
      { key: "lazy-gitlab", label: "Lazy GitLab", path: "/lazy-gitlab", color: "hsl(260, 50%, 55%)" },
      { key: "lazy-linear", label: "Lazy Linear", path: "/lazy-linear", color: "hsl(250, 60%, 60%)" },
      { key: "lazy-supabase", label: "Lazy Supabase", path: "/lazy-supabase", color: "hsl(150, 70%, 45%)" },
      { key: "lazy-security", label: "Lazy Security", path: "/lazy-security", color: "hsl(350, 60%, 50%)" },
    ],
  },
  {
    category: "Ops",
    agents: [
      { key: "lazy-admin", label: "Lazy Admin", path: "/lazy-admin", color: "hsl(220, 40%, 50%)" },
      { key: "lazy-alert", label: "Lazy Alert", path: "/lazy-alert", color: "hsl(50, 90%, 50%)" },
      { key: "lazy-telegram", label: "Lazy Telegram", path: "/lazy-telegram", color: "hsl(200, 70%, 50%)" },
      { key: "lazy-granola", label: "Lazy Granola", path: "/lazy-granola", color: "hsl(30, 50%, 50%)" },
      { key: "lazy-watch", label: "Lazy Watch", path: "/lazy-watch", color: "hsl(0, 65%, 50%)" },
      { key: "lazy-fix", label: "Lazy Fix", path: "/lazy-fix", color: "hsl(120, 50%, 45%)" },
      { key: "lazy-build", label: "Lazy Build", path: "/lazy-build", color: "hsl(35, 80%, 50%)" },
      { key: "lazy-intel", label: "Lazy Intel", path: "/lazy-intel", color: "hsl(210, 70%, 55%)" },
      { key: "lazy-repurpose", label: "Lazy Repurpose", path: "/lazy-repurpose", color: "hsl(170, 60%, 45%)" },
      { key: "lazy-trend", label: "Lazy Trend", path: "/lazy-trend", color: "hsl(15, 80%, 55%)" },
      { key: "lazy-churn", label: "Lazy Churn", path: "/lazy-churn", color: "hsl(300, 50%, 50%)" },
    ],
  },
];

const ALL_AGENTS = AGENT_CATEGORIES.flatMap((c) => c.agents.map((a) => ({ ...a, category: c.category })));

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: "12px",
};

const AdminAnalytics = ({ password }: AdminAnalyticsProps) => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "visitors">("overview");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [visitorsRes, eventsRes, postsRes] = await Promise.all([
        supabase.functions.invoke("admin-submissions", {
          body: { action: "visitor_stats", password },
        }),
        supabase.functions.invoke("admin-submissions", {
          body: { action: "analytics_events", password },
        }),
        supabase.functions.invoke("admin-submissions", {
          body: { action: "list_posts", password },
        }),
      ]);
      if (!visitorsRes.error && visitorsRes.data && !visitorsRes.data.error) {
        setVisitors(visitorsRes.data);
      }
      if (!eventsRes.error && eventsRes.data && !eventsRes.data.error) {
        setEvents(eventsRes.data);
      }
      if (!postsRes.error && postsRes.data && !postsRes.data.error) {
        setBlogPosts(postsRes.data);
      }
      setLoading(false);
    };
    fetchData();
  }, [password]);

  /* ── Overview stats ── */
  const stats = useMemo(() => {
    const total = visitors.length;
    const today = visitors.filter(
      (v) => new Date(v.created_at).toDateString() === new Date().toDateString()
    ).length;

    const countryMap: Record<string, number> = {};
    visitors.forEach((v) => {
      const key = v.country || "Unknown";
      countryMap[key] = (countryMap[key] || 0) + 1;
    });
    const countries = Object.entries(countryMap).sort((a, b) => b[1] - a[1]).slice(0, 15);

    const cityMap: Record<string, number> = {};
    visitors.forEach((v) => {
      if (v.city) {
        const key = `${v.city}, ${v.country_code || ""}`;
        cityMap[key] = (cityMap[key] || 0) + 1;
      }
    });
    const cities = Object.entries(cityMap).sort((a, b) => b[1] - a[1]).slice(0, 15);

    const browserMap: Record<string, number> = {};
    const osMap: Record<string, number> = {};
    visitors.forEach((v) => {
      const { browser, os } = parseUA(v.user_agent);
      browserMap[browser] = (browserMap[browser] || 0) + 1;
      osMap[os] = (osMap[os] || 0) + 1;
    });
    const browsers = Object.entries(browserMap).sort((a, b) => b[1] - a[1]);
    const operatingSystems = Object.entries(osMap).sort((a, b) => b[1] - a[1]);

    const pageMap: Record<string, number> = {};
    visitors.forEach((v) => {
      const key = v.page || "/";
      pageMap[key] = (pageMap[key] || 0) + 1;
    });
    const pages = Object.entries(pageMap).sort((a, b) => b[1] - a[1]).slice(0, 10);

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

    const dailyMap: Record<string, number> = {};
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      dailyMap[d.toISOString().split("T")[0]] = 0;
    }
    visitors.forEach((v) => {
      const day = new Date(v.created_at).toISOString().split("T")[0];
      if (dailyMap[day] !== undefined) dailyMap[day]++;
    });
    const dailyVisits = Object.entries(dailyMap).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      visits: count,
    }));

    return { total, today, countries, cities, browsers, operatingSystems, pages, referrers, markers, dailyVisits };
  }, [visitors]);

  /* ── Per-agent stats (unified) ── */
  const productStats = useMemo(() => {
    return ALL_AGENTS.map((agent) => {
      const pageVisits = visitors.filter((v) => v.page === agent.path).length;
      const prefixedKey = agent.key.replace("-", "_");

      const pageViewEvents = events.filter((e) => {
        if (e.event_name === `${prefixedKey}_page_view`) return true;
        if (e.event_name === "page_view" && (e.event_data as any)?.page === agent.path) return true;
        return false;
      }).length;

      const promptCopies = events.filter((e) => {
        if (e.event_name === `${prefixedKey}_prompt_copy`) return true;
        if (e.event_name === "copy_prompt" && (e.event_data as any)?.product === agent.key) return true;
        return false;
      }).length;

      const totalViews = Math.max(pageVisits, pageViewEvents);
      const rawRate = totalViews > 0 ? (promptCopies / totalViews) * 100 : 0;
      const conversionRate = Math.min(rawRate, 100).toFixed(1);

      // Daily trend (last 14 days)
      const dailyMap: Record<string, { views: number; copies: number }> = {};
      const now = new Date();
      for (let i = 13; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        dailyMap[d.toISOString().split("T")[0]] = { views: 0, copies: 0 };
      }
      visitors.forEach((v) => {
        if (v.page === agent.path) {
          const day = new Date(v.created_at).toISOString().split("T")[0];
          if (dailyMap[day]) dailyMap[day].views++;
        }
      });
      events.forEach((e) => {
        const day = new Date(e.created_at).toISOString().split("T")[0];
        if (dailyMap[day]) {
          if (e.event_name === `${prefixedKey}_prompt_copy` ||
              (e.event_name === "copy_prompt" && (e.event_data as any)?.product === agent.key)) {
            dailyMap[day].copies++;
          }
        }
      });
      const dailyTrend = Object.entries(dailyMap).map(([date, data]) => ({
        date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        views: data.views,
        copies: data.copies,
      }));

      return {
        ...agent,
        pageVisits: totalViews,
        promptCopies,
        conversionRate,
        dailyTrend,
      };
    }).sort((a, b) => b.promptCopies - a.promptCopies);
  }, [visitors, events]);

  /* ── Blog stats ── */
  const blogStats = useMemo(() => {
    const published = blogPosts.filter((p) => p.status === "published");
    const drafts = blogPosts.filter((p) => p.status === "draft");
    const staticSlugs = new Set(staticBlogPosts.map((p) => p.slug));
    const uniqueDbPublished = published.filter((p) => !staticSlugs.has(p.slug));
    const totalPublished = uniqueDbPublished.length + staticBlogPosts.length;
    const totalDrafts = drafts.length;
    const todayStr = new Date().toDateString();
    const publishedToday = published.filter((p) => p.published_at && new Date(p.published_at).toDateString() === todayStr).length;

    const dailyMap: Record<string, number> = {};
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      dailyMap[d.toISOString().split("T")[0]] = 0;
    }
    published.forEach((p) => {
      if (p.published_at) {
        const day = new Date(p.published_at).toISOString().split("T")[0];
        if (dailyMap[day] !== undefined) dailyMap[day]++;
      }
    });
    const dailyPublished = Object.entries(dailyMap).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      posts: count,
    }));

    return { totalPublished, totalDrafts, publishedToday, dailyPublished };
  }, [blogPosts]);

  /* ── Aggregate product metrics ── */
  const productSummary = useMemo(() => {
    const totalViews = productStats.reduce((sum, p) => sum + p.pageVisits, 0);
    const totalCopies = productStats.reduce((sum, p) => sum + p.promptCopies, 0);
    const topProduct = productStats[0];
    const topConverting = [...productStats].filter((p) => p.pageVisits >= 3).sort((a, b) => parseFloat(b.conversionRate) - parseFloat(a.conversionRate))[0];
    return { totalViews, totalCopies, topProduct, topConverting };
  }, [productStats]);

  if (loading) {
    return <p className="font-body text-sm text-muted-foreground py-8 text-center">Loading analytics…</p>;
  }

  const tabs = [
    { key: "overview" as const, label: "Overview" },
    { key: "products" as const, label: "Products" },
    { key: "visitors" as const, label: "Visitors" },
  ];

  return (
    <div className="space-y-6">
      {/* Tab navigation */}
      <div className="flex gap-1 border border-border rounded-lg p-1 bg-card">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 font-body text-xs tracking-[0.1em] uppercase font-semibold py-2 rounded-md transition-colors ${
              activeTab === tab.key
                ? "bg-foreground text-background"
                : "text-foreground/40 hover:text-foreground/60"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ════════════════════ OVERVIEW TAB ════════════════════ */}
      {activeTab === "overview" && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="border border-border rounded-xl bg-card p-4 text-center">
              <p className="font-body text-[13px] text-muted-foreground uppercase tracking-wider">Total Visitors</p>
              <p className="font-display text-2xl font-bold text-foreground mt-1">{stats.total}</p>
            </div>
            <div className="border border-border rounded-xl bg-card p-4 text-center">
              <p className="font-body text-[13px] text-muted-foreground uppercase tracking-wider">Today</p>
              <p className="font-display text-2xl font-bold text-primary mt-1">{stats.today}</p>
            </div>
            <div className="border border-border rounded-xl bg-card p-4 text-center">
              <p className="font-body text-[13px] text-muted-foreground uppercase tracking-wider">Product Views</p>
              <p className="font-display text-2xl font-bold text-foreground mt-1">{productSummary.totalViews}</p>
            </div>
            <div className="border border-border rounded-xl bg-card p-4 text-center">
              <p className="font-body text-[13px] text-muted-foreground uppercase tracking-wider">Prompt Copies</p>
              <p className="font-display text-2xl font-bold text-primary mt-1">{productSummary.totalCopies}</p>
            </div>
          </div>

          {/* Daily visits chart */}
          <div className="border border-border rounded-xl bg-card p-4">
            <h3 className="font-display font-bold text-foreground mb-3">Daily Visits (Last 30 Days)</h3>
            <div className="w-full h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.dailyVisits} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} interval={Math.floor(stats.dailyVisits.length / 7)} tickLine={false} axisLine={{ stroke: "hsl(var(--border))" }} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold" }} />
                  <Bar dataKey="visits" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Agent Leaderboard by Category */}
          <div className="border border-border rounded-xl bg-card p-4">
            <h3 className="font-display font-bold text-foreground mb-4">Agent Leaderboard</h3>
            <div className="space-y-5">
              {AGENT_CATEGORIES.map((cat) => {
                const catAgents = productStats.filter((p) => (p as any).category === cat.category);
                const catSorted = [...catAgents].sort((a, b) => b.promptCopies - a.promptCopies || b.pageVisits - a.pageVisits);
                return (
                  <div key={cat.category}>
                    <p className="font-display text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-2">{cat.category}</p>
                    <div className="space-y-1.5">
                      {catSorted.map((a) => (
                        <div key={a.key} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: a.color }} />
                          <span className="font-body text-sm text-foreground/70 flex-1 min-w-0 truncate">{a.label}</span>
                          <div className="flex items-center gap-4 flex-shrink-0">
                            <div className="text-right">
                              <span className="font-display text-sm font-bold text-foreground">{a.pageVisits}</span>
                              <span className="font-body text-[13px] text-muted-foreground ml-1">views</span>
                            </div>
                            <div className="text-right">
                              <span className="font-display text-sm font-bold text-primary">{a.promptCopies}</span>
                              <span className="font-body text-[13px] text-muted-foreground ml-1">copies</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {productStats.every((p) => p.pageVisits === 0 && p.promptCopies === 0) && (
                <p className="font-body text-xs text-muted-foreground">No data yet</p>
              )}
            </div>
          </div>

          {/* Blog stats */}
          <div className="border border-border rounded-xl bg-card p-4">
            <h3 className="font-display font-bold text-foreground mb-3">Blog Posts</h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-3 rounded-lg bg-background/50 border border-border/50">
                <p className="font-display text-2xl font-bold text-foreground">{blogStats.totalPublished}</p>
                <p className="font-body text-[13px] text-muted-foreground">Published</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-background/50 border border-border/50">
                <p className="font-display text-2xl font-bold text-primary">{blogStats.publishedToday}</p>
                <p className="font-body text-[13px] text-muted-foreground">Today</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-background/50 border border-border/50">
                <p className="font-display text-2xl font-bold text-muted-foreground">{blogStats.totalDrafts}</p>
                <p className="font-body text-[13px] text-muted-foreground">Drafts</p>
              </div>
            </div>
            <div className="w-full h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={blogStats.dailyPublished} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} interval={Math.floor(blogStats.dailyPublished.length / 7)} tickLine={false} axisLine={{ stroke: "hsl(var(--border))" }} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="posts" name="Posts Published" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* ════════════════════ PRODUCTS TAB ════════════════════ */}
      {activeTab === "products" && (
        <>
          {/* Product summary cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="border border-border rounded-xl bg-card p-4 text-center">
              <p className="font-body text-[13px] text-muted-foreground uppercase tracking-wider">Total Product Views</p>
              <p className="font-display text-2xl font-bold text-foreground mt-1">{productSummary.totalViews}</p>
            </div>
            <div className="border border-border rounded-xl bg-card p-4 text-center">
              <p className="font-body text-[13px] text-muted-foreground uppercase tracking-wider">Total Copies</p>
              <p className="font-display text-2xl font-bold text-primary mt-1">{productSummary.totalCopies}</p>
            </div>
            <div className="border border-border rounded-xl bg-card p-4 text-center">
              <p className="font-body text-[13px] text-muted-foreground uppercase tracking-wider">Avg Conversion</p>
              <p className="font-display text-2xl font-bold text-foreground mt-1">
                {productSummary.totalViews > 0 ? ((productSummary.totalCopies / productSummary.totalViews) * 100).toFixed(1) : "0.0"}%
              </p>
            </div>
          </div>

          {/* Per-product cards */}
          <div className="space-y-4">
            {productStats.map((product) => {
              const hasData = product.pageVisits > 0 || product.promptCopies > 0;
              const hasTrendData = product.dailyTrend.some((d) => d.views > 0 || d.copies > 0);

              return (
                <div key={product.key} className="border border-border rounded-xl bg-card overflow-hidden">
                  {/* Header row */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: product.color }} />
                      <h3 className="font-display text-sm font-bold text-foreground">{product.label}</h3>
                    </div>
                    {!hasData && (
                      <span className="font-body text-[13px] text-muted-foreground tracking-wider uppercase">No data yet</span>
                    )}
                  </div>

                  {hasData && (
                    <div className="p-4">
                      {/* Metrics row */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center p-2 rounded-lg bg-background/50 border border-border/50">
                          <p className="font-display text-xl font-bold text-foreground">{product.pageVisits}</p>
                          <p className="font-body text-[13px] text-muted-foreground">Page Views</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-background/50 border border-border/50">
                          <p className="font-display text-xl font-bold text-primary">{product.promptCopies}</p>
                          <p className="font-body text-[13px] text-muted-foreground">Prompt Copies</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-background/50 border border-border/50">
                          <p className="font-display text-xl font-bold text-foreground">{product.conversionRate}%</p>
                          <p className="font-body text-[13px] text-muted-foreground">Conversion</p>
                        </div>
                      </div>

                      {/* Daily trend chart */}
                      {hasTrendData && (
                        <div className="w-full h-32">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={product.dailyTrend} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                              <XAxis dataKey="date" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} interval={Math.floor(product.dailyTrend.length / 5)} tickLine={false} axisLine={{ stroke: "hsl(var(--border))" }} />
                              <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} allowDecimals={false} />
                              <Tooltip contentStyle={tooltipStyle} />
                              <Bar dataKey="views" name="Views" fill="hsl(var(--muted-foreground))" radius={[3, 3, 0, 0]} />
                              <Bar dataKey="copies" name="Copies" fill={product.color} radius={[3, 3, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ════════════════════ VISITORS TAB ════════════════════ */}
      {activeTab === "visitors" && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-border rounded-xl bg-card p-4 text-center">
              <p className="font-body text-[13px] text-muted-foreground uppercase tracking-wider">Total Visitors</p>
              <p className="font-display text-2xl font-bold text-foreground mt-1">{stats.total}</p>
            </div>
            <div className="border border-border rounded-xl bg-card p-4 text-center">
              <p className="font-body text-[13px] text-muted-foreground uppercase tracking-wider">Today</p>
              <p className="font-display text-2xl font-bold text-primary mt-1">{stats.today}</p>
            </div>
          </div>

          {/* World map */}
          <div className="border border-border rounded-xl bg-card p-4 overflow-hidden">
            <h3 className="font-display font-bold text-foreground mb-3">Visitor Map</h3>
            <div className="w-full" style={{ aspectRatio: "2/1" }}>
              <ComposableMap projectionConfig={{ scale: 147 }} style={{ width: "100%", height: "100%" }}>
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
            <div className="border border-border rounded-xl bg-card p-4">
              <h3 className="font-display font-bold text-foreground mb-3">Top Countries</h3>
              <div className="space-y-2">
                {stats.countries.map(([name, count]) => (
                  <div key={name} className="flex items-center justify-between">
                    <span className="font-body text-sm text-foreground/80">{name}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 rounded-full bg-primary/30 w-20 overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${(count / stats.total) * 100}%` }} />
                      </div>
                      <span className="font-body text-xs text-muted-foreground w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
                {stats.countries.length === 0 && <p className="font-body text-xs text-muted-foreground">No data yet</p>}
              </div>
            </div>

            <div className="border border-border rounded-xl bg-card p-4">
              <h3 className="font-display font-bold text-foreground mb-3">Top Cities</h3>
              <div className="space-y-2">
                {stats.cities.map(([name, count]) => (
                  <div key={name} className="flex items-center justify-between">
                    <span className="font-body text-sm text-foreground/80">{name}</span>
                    <span className="font-body text-xs text-muted-foreground">{count}</span>
                  </div>
                ))}
                {stats.cities.length === 0 && <p className="font-body text-xs text-muted-foreground">No data yet</p>}
              </div>
            </div>

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

            <div className="border border-border rounded-xl bg-card p-4">
              <h3 className="font-display font-bold text-foreground mb-3">Top Pages</h3>
              <div className="space-y-2">
                {stats.pages.map(([name, count]) => (
                  <div key={name} className="flex items-center justify-between">
                    <span className="font-body text-sm text-foreground/80 truncate max-w-[200px]">{name}</span>
                    <span className="font-body text-xs text-muted-foreground">{count}</span>
                  </div>
                ))}
                {stats.pages.length === 0 && <p className="font-body text-xs text-muted-foreground">No data yet</p>}
              </div>
            </div>

            <div className="border border-border rounded-xl bg-card p-4">
              <h3 className="font-display font-bold text-foreground mb-3">Top Referrers</h3>
              <div className="space-y-2">
                {stats.referrers.map(([name, count]) => (
                  <div key={name} className="flex items-center justify-between">
                    <span className="font-body text-sm text-foreground/80 truncate max-w-[200px]">{name}</span>
                    <span className="font-body text-xs text-muted-foreground">{count}</span>
                  </div>
                ))}
                {stats.referrers.length === 0 && <p className="font-body text-xs text-muted-foreground">No referrers yet</p>}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAnalytics;
