import { useState, useEffect, useCallback } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, PenTool, Search, Brain, ShoppingCart,
  Mic, CreditCard, MessageSquare, Tv, Code, Settings, Menu, X,
  BarChart3,
} from "lucide-react";

const db = supabase as any;

const navItems = [
  { label: "Overview", path: "/admin", icon: LayoutDashboard, engine: null },
  { label: "Analytics", path: "/admin/analytics", icon: BarChart3, engine: null },
  { label: "Lazy Blogger", path: "/admin/blogger", icon: PenTool, engine: "blogger" },
  { label: "Lazy SEO", path: "/admin/seo", icon: Search, engine: "seo" },
  { label: "Lazy GEO", path: "/admin/geo", icon: Brain, engine: "geo" },
  { label: "Lazy Store", path: "/admin/store", icon: ShoppingCart, engine: "store" },
  { label: "Lazy Voice", path: "/admin/voice", icon: Mic, engine: "voice" },
  { label: "Lazy Pay", path: "/admin/pay", icon: CreditCard, engine: "pay" },
  { label: "Lazy SMS", path: "/admin/sms", icon: MessageSquare, engine: "sms" },
  { label: "Lazy Stream", path: "/admin/stream", icon: Tv, engine: "stream" },
  { label: "Lazy Code", path: "/admin/code", icon: Code, engine: "code" },
  { label: "Settings", path: "/admin/settings", icon: Settings, engine: null },
];

export default function AdminLayout() {
  const [password, setPassword] = useState(() => sessionStorage.getItem("admin_pw") || "");
  const [authenticated, setAuthenticated] = useState(() => !!sessionStorage.getItem("admin_pw"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect /admin to /admin (overview is the index)
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("admin_pw", password);
    setAuthenticated(true);
  };

  // Check engine running status
  const { data: engineStatus = {} } = useQuery({
    queryKey: ["admin-engine-status"],
    queryFn: async () => {
      const status: Record<string, { running: boolean; hasErrors: boolean }> = {};

      const [blogSettings, seoSettings, geoSettings, voiceSettings, streamSettings] = await Promise.all([
        db.from("blog_settings").select("is_publishing").limit(1).single(),
        db.from("seo_settings").select("is_running").limit(1).single(),
        db.from("geo_settings").select("is_running").limit(1).single(),
        db.from("voice_settings").select("is_running").limit(1).single(),
        db.from("stream_settings").select("is_running").limit(1).single(),
      ]);

      const yesterday = new Date(Date.now() - 86400000).toISOString();
      const [blogErrors, seoErrors, geoErrors, voiceErrors, streamErrors] = await Promise.all([
        db.from("blog_errors").select("id", { count: "exact", head: true }).gte("created_at", yesterday),
        db.from("seo_errors").select("id", { count: "exact", head: true }).gte("created_at", yesterday),
        db.from("geo_errors").select("id", { count: "exact", head: true }).gte("created_at", yesterday),
        db.from("voice_errors").select("id", { count: "exact", head: true }).gte("created_at", yesterday),
        db.from("stream_errors").select("id", { count: "exact", head: true }).gte("created_at", yesterday),
      ]);

      status.blogger = { running: blogSettings.data?.is_publishing ?? false, hasErrors: (blogErrors.count ?? 0) > 0 };
      status.seo = { running: seoSettings.data?.is_running ?? false, hasErrors: (seoErrors.count ?? 0) > 0 };
      status.geo = { running: geoSettings.data?.is_running ?? false, hasErrors: (geoErrors.count ?? 0) > 0 };
      status.voice = { running: voiceSettings.data?.is_running ?? false, hasErrors: (voiceErrors.count ?? 0) > 0 };
      status.stream = { running: streamSettings.data?.is_running ?? false, hasErrors: (streamErrors.count ?? 0) > 0 };
      // Store, Pay, SMS don't have settings tables yet
      status.store = { running: false, hasErrors: false };
      status.pay = { running: false, hasErrors: false };
      status.sms = { running: false, hasErrors: false };
      status.code = { running: false, hasErrors: false };

      return status;
    },
    enabled: authenticated,
    refetchInterval: 30000,
  });

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a08] flex items-center justify-center">
        <form onSubmit={handleLogin} className="w-full max-w-xs">
          <p className="font-display text-sm tracking-[0.2em] uppercase text-[#f0ead6]/40 mb-6 text-center">Admin Access</p>
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
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#0a0a08] text-[#f0ead6] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-56 bg-[#0a0a08] border-r border-[#f0ead6]/8 flex flex-col transition-transform duration-200 md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="px-5 pt-6 pb-4 border-b border-[#f0ead6]/8">
          <Link to="/" className="font-display text-[10px] font-semibold tracking-[0.15em] uppercase text-[#f0ead6] hover:text-[#f0ead6]/70 transition-colors leading-tight flex flex-col">
            <span>Lazy</span>
            <span>Unicorn</span>
          </Link>
          <p className="font-body text-[9px] tracking-[0.15em] uppercase text-[#f0ead6]/20 mt-2">Mission Control</p>
        </div>

        <nav className="flex-1 py-3 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const status = item.engine ? engineStatus[item.engine] : null;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-5 py-2.5 font-body text-xs tracking-[0.08em] transition-colors relative ${
                  active
                    ? "text-[#c8a961] bg-[#c8a961]/8"
                    : "text-[#f0ead6]/40 hover:text-[#f0ead6]/70 hover:bg-[#f0ead6]/3"
                }`}
              >
                <item.icon size={14} />
                <span>{item.label}</span>
                {status && (
                  <div className="ml-auto flex items-center gap-1.5">
                    {status.hasErrors && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                    {status.running && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                    {!status.running && !status.hasErrors && <span className="w-1.5 h-1.5 rounded-full bg-[#f0ead6]/15" />}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-5 py-4 border-t border-[#f0ead6]/8">
          <button
            onClick={() => { sessionStorage.removeItem("admin_pw"); setAuthenticated(false); }}
            className="font-body text-[10px] tracking-[0.1em] uppercase text-[#f0ead6]/20 hover:text-[#f0ead6]/50 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-40 md:hidden bg-[#0a0a08] border-b border-[#f0ead6]/8 px-4 py-3 flex items-center justify-between">
        <p className="font-display text-[10px] font-semibold tracking-[0.15em] uppercase text-[#f0ead6]">Admin</p>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-[#f0ead6]/50">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile overlay */}
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
