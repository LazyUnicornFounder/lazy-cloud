import { useState, useEffect, createContext, useContext } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Loader2, Pause, Play, LayoutDashboard, Settings, Download, ExternalLink, GitBranch, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAgentDetection } from "./hooks/useAgentDetection";
import { useAgentStatuses } from "./hooks/useAgentStatus";
import { AGENTS, CATEGORY_META, getAgentsByCategory, type AgentCategory } from "./agentRegistry";

interface AdminCtx {
  installed: Set<string>;
  statuses: Record<string, { running: boolean; errorsToday: number }>;
  refetchStatuses: () => void;
}
const AdminContext = createContext<AdminCtx>({
  installed: new Set(),
  statuses: {},
  refetchStatuses: () => {},
});
export const useAdminContext = () => useContext(AdminContext);

export default function AdminLayout() {
  const [password, setPassword] = useState(() => sessionStorage.getItem("admin_pw") || "");
  const [authenticated, setAuthenticated] = useState(() => !!sessionStorage.getItem("admin_pw"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const { installed, loading: detecting } = useAgentDetection();
  const { data: statuses = {}, refetch: refetchStatuses } = useAgentStatuses(installed);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("admin_pw", password);
    setAuthenticated(true);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a08] flex items-center justify-center">
        <form onSubmit={handleLogin} className="w-full max-w-xs">
          <p className="font-display text-sm tracking-[0.2em] uppercase text-[#f0ead6]/82 mb-6 text-center">
            Admin Access
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-transparent border border-[#f0ead6]/10 text-[#f0ead6] px-4 py-3 font-body text-sm focus:outline-none focus:border-[#f0ead6]/30"
          />
          <button
            type="submit"
            className="w-full mt-3 bg-[#f0ead6] text-[#0a0a08] font-display text-xs tracking-[0.15em] uppercase font-bold py-3 hover:opacity-90 transition-opacity"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  const grouped = getAgentsByCategory(installed);

  // Master status
  const runningCount = Object.values(statuses).filter((s) => s.running).length;
  const errorCount = Object.values(statuses).reduce((a, s) => a + s.errorsToday, 0);
  const totalInstalled = Object.keys(statuses).length;
  const masterColor = errorCount > 0 ? "#ef4444" : runningCount === 0 ? "#6b7280" : runningCount < totalInstalled ? "#c8a961" : "#22c55e";
  const masterLabel = errorCount > 0 ? `${errorCount} error${errorCount > 1 ? "s" : ""}` : runningCount === totalInstalled ? "All running" : runningCount === 0 ? "All paused" : `${runningCount}/${totalInstalled} running`;

  const handleBulkToggle = async () => {
    const shouldPause = runningCount > 0;
    const agents = AGENTS.filter((a) => installed.has(a.key));
    for (const a of agents) {
      try {
        await (supabase as any).from(a.settingsTable).update({ [a.runField]: !shouldPause });
      } catch {}
    }
    toast.success(shouldPause ? "All agents paused" : "All agents resumed");
    refetchStatuses();
  };

  const isActive = (path: string) => location.pathname === path || (path === "/admin" && location.pathname === "/admin");

  const navSections: { category: AgentCategory; agents: typeof AGENTS }[] = (
    Object.entries(grouped) as [AgentCategory, typeof AGENTS][]
  ).filter(([, agents]) => agents.length > 0).map(([cat, agents]) => ({
    category: cat as AgentCategory,
    agents,
  }));

  return (
    <AdminContext.Provider value={{ installed, statuses, refetchStatuses }}>
      <div className="min-h-screen bg-[#0a0a08] text-[#f0ead6] flex">
        {/* Desktop Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-52 bg-[#0a0a08] border-r border-[#f0ead6]/8 flex-col overflow-y-auto hidden md:flex`}>
          <div className="px-5 pt-6 pb-4 border-b border-[#f0ead6]/8">
            <Link to="/" className="font-display text-[13px] font-semibold tracking-[0.15em] uppercase text-[#f0ead6] hover:text-[#f0ead6]/95 transition-colors leading-tight flex flex-col">
              <span>Lazy</span><span>Unicorn</span>
            </Link>
          </div>

          {/* Master status */}
          <div className="px-5 py-3 border-b border-[#f0ead6]/8 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: masterColor }} />
            <span className="font-body text-[11px] tracking-[0.1em] uppercase text-[#f0ead6]/70">{masterLabel}</span>
          </div>

          {/* Overview */}
          <nav className="flex-1 py-2">
            <Link
              to="/admin"
              className={`flex items-center justify-between px-5 py-2 font-body text-[13px] tracking-[0.06em] transition-colors ${isActive("/admin") ? "text-[#c8a961] bg-[#c8a961]/8 border-l-2 border-[#c8a961]" : "text-[#f0ead6]/70 hover:text-[#f0ead6]/95 border-l-2 border-transparent"}`}
            >
              <span className="flex items-center gap-2"><LayoutDashboard size={13} /> Overview</span>
            </Link>

            {navSections.map(({ category, agents }) => (
              <div key={category} className="mt-3">
                <p className="px-5 font-body text-[10px] tracking-[0.2em] uppercase text-[#f0ead6]/40 mb-1">
                  {CATEGORY_META[category].label}
                </p>
                {agents.map((a) => {
                  const s = statuses[a.key];
                  const dotColor = s ? (s.errorsToday > 0 ? "#ef4444" : s.running ? "#22c55e" : "#6b7280") : "#6b7280";
                  const active = isActive(a.route);
                  return (
                    <Link
                      key={a.key}
                      to={a.route}
                      className={`flex items-center justify-between px-5 py-1.5 font-body text-[13px] tracking-[0.06em] transition-colors ${active ? "text-[#c8a961] bg-[#c8a961]/8 border-l-2 border-[#c8a961]" : "text-[#f0ead6]/70 hover:text-[#f0ead6]/95 border-l-2 border-transparent"}`}
                    >
                      <span>{a.label}</span>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dotColor }} />
                    </Link>
                  );
                })}
              </div>
            ))}

            {/* System */}
            <div className="mt-3">
              <p className="px-5 font-body text-[10px] tracking-[0.2em] uppercase text-[#f0ead6]/40 mb-1">System</p>
              <Link
                to="/admin/installs"
                className={`flex items-center gap-2 px-5 py-1.5 font-body text-[13px] tracking-[0.06em] transition-colors ${isActive("/admin/installs") ? "text-[#c8a961] bg-[#c8a961]/8 border-l-2 border-[#c8a961]" : "text-[#f0ead6]/70 hover:text-[#f0ead6]/95 border-l-2 border-transparent"}`}
              >
                <Download size={12} /> Installs
              </Link>
              <Link
                to="/admin/settings"
                className={`flex items-center gap-2 px-5 py-1.5 font-body text-[13px] tracking-[0.06em] transition-colors ${isActive("/admin/settings") ? "text-[#c8a961] bg-[#c8a961]/8 border-l-2 border-[#c8a961]" : "text-[#f0ead6]/70 hover:text-[#f0ead6]/95 border-l-2 border-transparent"}`}
              >
                <Settings size={12} /> Settings
              </Link>
            </div>
          </nav>

          {/* Bottom actions */}
          <div className="px-5 py-3 border-t border-[#f0ead6]/8 space-y-2">
            <button
              onClick={handleBulkToggle}
              className="w-full flex items-center justify-center gap-2 border border-[#f0ead6]/10 py-2 font-body text-[11px] tracking-[0.1em] uppercase text-[#f0ead6]/70 hover:text-[#f0ead6] hover:border-[#f0ead6]/30 transition-colors"
            >
              {runningCount > 0 ? <><Pause size={10} /> Pause Everything</> : <><Play size={10} /> Resume Everything</>}
            </button>
            <button
              onClick={() => { sessionStorage.removeItem("admin_pw"); setAuthenticated(false); }}
              className="w-full font-body text-[11px] tracking-[0.1em] uppercase text-[#f0ead6]/40 hover:text-[#f0ead6]/70 transition-colors"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Mobile bottom nav */}
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0a0a08] border-t border-[#f0ead6]/8 flex items-center justify-around py-2 px-1">
          <Link to="/admin" className={`flex flex-col items-center gap-0.5 text-[10px] ${isActive("/admin") ? "text-[#c8a961]" : "text-[#f0ead6]/60"}`}>
            <LayoutDashboard size={16} />
            <span>Overview</span>
          </Link>
          <Link to="/admin/installs" className={`flex flex-col items-center gap-0.5 text-[10px] ${isActive("/admin/installs") ? "text-[#c8a961]" : "text-[#f0ead6]/60"}`}>
            <Download size={16} />
            <span>Installs</span>
          </Link>
          <Link to="/admin/settings" className={`flex flex-col items-center gap-0.5 text-[10px] ${isActive("/admin/settings") ? "text-[#c8a961]" : "text-[#f0ead6]/60"}`}>
            <Settings size={16} />
            <span>Settings</span>
          </Link>
          <button onClick={handleBulkToggle} className="flex flex-col items-center gap-0.5 text-[10px] text-[#f0ead6]/60">
            {runningCount > 0 ? <Pause size={16} /> : <Play size={16} />}
            <span>{runningCount > 0 ? "Pause" : "Resume"}</span>
          </button>
        </div>

        {/* Main content */}
        <main className="flex-1 md:ml-52 pb-20 md:pb-0 min-h-screen">
          <div className="p-4 md:p-8 max-w-6xl">
            {detecting ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-[#f0ead6]/40" size={24} />
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </main>
      </div>
    </AdminContext.Provider>
  );
}
