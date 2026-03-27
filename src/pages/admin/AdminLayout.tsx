import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, BarChart3, PenTool, Search, Brain, Radar, Compass,
  ShoppingCart, CreditCard, MessageSquare, Mic, Tv, Mail,
  Code, GitBranch, CheckCircle, Bell, Send, Database as DbIcon,
  Shield, Settings, Menu, X, ChevronDown,
} from "lucide-react";

const db = supabase as any;

interface NavGroup {
  label: string;
  items: { label: string; path: string; icon: any; engine: string | null }[];
}

const navGroups: NavGroup[] = [
  { label: "", items: [
    { label: "Overview", path: "/admin/overview", icon: LayoutDashboard, engine: null },
    { label: "Analytics", path: "/admin/analytics", icon: BarChart3, engine: null },
  ]},
  { label: "Lazy Content", items: [
    { label: "Blogger", path: "/admin/blogger", icon: PenTool, engine: "blogger" },
    { label: "SEO", path: "/admin/seo", icon: Search, engine: "seo" },
    { label: "GEO", path: "/admin/geo", icon: Brain, engine: "geo" },
    { label: "Crawl", path: "/admin/crawl", icon: Radar, engine: "crawl" },
    { label: "Perplexity", path: "/admin/perplexity", icon: Compass, engine: "perplexity" },
    { label: "Contentful", path: "/admin/contentful", icon: DbIcon, engine: "contentful" },
  ]},
  { label: "Lazy Commerce", items: [
    { label: "Store", path: "/admin/store", icon: ShoppingCart, engine: "store" },
    { label: "Pay", path: "/admin/pay", icon: CreditCard, engine: "pay" },
    { label: "SMS", path: "/admin/sms", icon: MessageSquare, engine: "sms" },
    { label: "Mail", path: "/admin/mail", icon: Mail, engine: "mail" },
  ]},
  { label: "Lazy Media", items: [
    { label: "Voice", path: "/admin/voice", icon: Mic, engine: "voice" },
    { label: "Stream", path: "/admin/stream", icon: Tv, engine: "stream" },
  ]},
  { label: "Lazy Dev", items: [
    { label: "GitHub", path: "/admin/code", icon: Code, engine: "code" },
    { label: "GitLab", path: "/admin/gitlab", icon: GitBranch, engine: "gitlab" },
    { label: "Linear", path: "/admin/linear", icon: CheckCircle, engine: "linear" },
    { label: "Design", path: "/admin/design", icon: LayoutDashboard, engine: "design" },
    { label: "Auth", path: "/admin/auth", icon: Shield, engine: "auth" },
  ]},
  { label: "Lazy Ops", items: [
    { label: "Alert", path: "/admin/alert", icon: Bell, engine: "alert" },
    { label: "Telegram", path: "/admin/telegram", icon: Send, engine: "telegram" },
    { label: "Supabase", path: "/admin/supabase-monitor", icon: DbIcon, engine: "supabase_monitor" },
    { label: "Security", path: "/admin/security", icon: Shield, engine: "security" },
  ]},
  { label: "", items: [
    { label: "Changelog", path: "/admin/changelog", icon: PenTool, engine: null },
    { label: "Settings", path: "/admin/settings", icon: Settings, engine: null },
  ]},
];

const allEngineItems = navGroups.flatMap(g => g.items).filter(i => i.engine);

export default function AdminLayout() {
  const [password, setPassword] = useState(() => sessionStorage.getItem("admin_pw") || "");
  const [authenticated, setAuthenticated] = useState(() => !!sessionStorage.getItem("admin_pw"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("admin_pw", password);
    setAuthenticated(true);
  };

  // Engine status polling
  const { data: engineStatus = {} } = useQuery({
    queryKey: ["admin-engine-status-v2"],
    queryFn: async () => {
      const status: Record<string, { running: boolean; hasErrors: boolean }> = {};
      const settingsTables: Record<string, { table: string; runField: string }> = {
        blogger: { table: "blog_settings", runField: "is_publishing" },
        seo: { table: "seo_settings", runField: "is_running" },
        geo: { table: "geo_settings", runField: "is_running" },
        voice: { table: "voice_settings", runField: "is_running" },
        stream: { table: "stream_settings", runField: "is_running" },
      };
      const errorTables: Record<string, string> = {
        blogger: "blog_errors",
        seo: "seo_errors",
        geo: "geo_errors",
        voice: "voice_errors",
        stream: "stream_errors",
      };

      const yesterday = new Date(Date.now() - 86400000).toISOString();

      await Promise.all(
        Object.entries(settingsTables).map(async ([key, { table, runField }]) => {
          const { data } = await db.from(table).select(runField).limit(1).single();
          const errTable = errorTables[key];
          let hasErrors = false;
          if (errTable) {
            const { count } = await db.from(errTable).select("id", { count: "exact", head: true }).gte("created_at", yesterday);
            hasErrors = (count ?? 0) > 0;
          }
          status[key] = { running: data?.[runField] ?? false, hasErrors };
        })
      );

      // Engines without settings tables yet
      ["store", "pay", "sms", "code", "crawl", "perplexity", "gitlab", "linear", "alert", "telegram", "contentful", "supabase_monitor", "security"].forEach(key => {
        if (!status[key]) status[key] = { running: false, hasErrors: false };
      });

      return status;
    },
    enabled: authenticated,
    refetchInterval: 60000,
  });

  // Master status
  const runningCount = Object.values(engineStatus).filter(s => s.running).length;
  const errorCount = Object.values(engineStatus).filter(s => s.hasErrors).length;
  const masterColor = errorCount > 0 ? "bg-red-500" : runningCount > 0 ? "bg-emerald-500" : "bg-[#c8a961]";
  const masterLabel = errorCount > 0 ? `${errorCount} engine${errorCount > 1 ? "s" : ""} need attention` : runningCount > 0 ? "All engines running" : "Everything paused";

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a08] flex items-center justify-center">
        <form onSubmit={handleLogin} className="w-full max-w-xs">
          <p className="font-display text-sm tracking-[0.2em] uppercase text-[#f0ead6]/82 mb-6 text-center">Admin Access</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-transparent border border-[#f0ead6]/10 text-[#f0ead6] px-4 py-3 font-body text-sm focus:outline-none focus:border-[#f0ead6]/30"
          />
          <button type="submit" className="w-full mt-3 bg-[#f0ead6] text-[#0a0a08] font-display text-xs tracking-[0.15em] uppercase font-bold py-3 hover:opacity-90 transition-opacity">
            Enter
          </button>
        </form>
      </div>
    );
  }

  const isActive = (path: string) => {
    if (path === "/admin/overview") return location.pathname === "/admin" || location.pathname === "/admin/overview";
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-[#0a0a08] text-[#f0ead6] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-56 bg-[#0a0a08] border-r border-[#f0ead6]/8 flex flex-col transition-transform duration-200 md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="px-5 pt-6 pb-4 border-b border-[#f0ead6]/8">
          <Link to="/" className="font-display text-[13px] font-semibold tracking-[0.15em] uppercase text-[#f0ead6] hover:text-[#f0ead6]/95 transition-colors leading-tight flex flex-col">
            <span>Lazy</span>
            <span>Unicorn</span>
          </Link>
          <p className="font-body text-[13px] tracking-[0.15em] uppercase text-[#f0ead6]/68 mt-2">Mission Control</p>
        </div>

        {/* Master status */}
        <div className="px-5 py-3 border-b border-[#f0ead6]/8 flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${masterColor}`} />
          <span className="font-body text-[13px] tracking-[0.08em] text-[#f0ead6]/82">{masterLabel}</span>
        </div>

        <nav className="flex-1 py-2 overflow-y-auto">
          {navGroups.map((group, gi) => (
            <div key={gi}>
              {group.label && (
                <p className="px-5 pt-4 pb-1 font-body text-[13px] tracking-[0.15em] uppercase text-[#f0ead6]/68">{group.label}</p>
              )}
              {group.items.map((item) => {
                const active = isActive(item.path);
                const status = item.engine ? engineStatus[item.engine] : null;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-5 py-2 font-body text-[14px] tracking-[0.08em] transition-colors relative ${
                      active
                        ? "text-[#c8a961] bg-[#c8a961]/8 border-l-2 border-[#c8a961]"
                        : "text-[#f0ead6]/82 hover:text-[#f0ead6]/95 hover:bg-[#f0ead6]/8 border-l-2 border-transparent"
                    }`}
                  >
                    <item.icon size={13} />
                    <span>{item.label}</span>
                    {status && (
                      <span className={`ml-auto w-1.5 h-1.5 rounded-full ${
                        status.hasErrors ? "bg-red-500" : status.running ? "bg-emerald-500" : "bg-[#f0ead6]/15"
                      }`} />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-[#f0ead6]/8">
          <button
            onClick={() => { sessionStorage.removeItem("admin_pw"); setAuthenticated(false); }}
            className="font-body text-[13px] tracking-[0.1em] uppercase text-[#f0ead6]/68 hover:text-[#f0ead6]/88 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-40 md:hidden bg-[#0a0a08] border-b border-[#f0ead6]/8 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${masterColor}`} />
          <p className="font-display text-[13px] font-semibold tracking-[0.15em] uppercase text-[#f0ead6]">Admin</p>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-[#f0ead6]/88">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Main content */}
      <main className="flex-1 md:ml-56 pt-14 md:pt-0 min-h-screen">
        <div className="p-6 md:p-8 max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
