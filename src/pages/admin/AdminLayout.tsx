import { useState, createContext, useContext } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Loader2, Pause, Play, Settings, GitBranch, Upload, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAgentDetection } from "./hooks/useAgentDetection";
import { useAgentStatuses } from "./hooks/useAgentStatus";
import { AGENTS, type AdminTab, ADMIN_TABS } from "./agentRegistry";

interface AdminCtx {
  installed: Set<string>;
  statuses: Record<string, { running: boolean; errorsToday: number }>;
  refetchStatuses: () => void;
  activeTab: AdminTab;
  setActiveTab: (t: AdminTab) => void;
}
const AdminContext = createContext<AdminCtx>({
  installed: new Set(),
  statuses: {},
  refetchStatuses: () => {},
  activeTab: "all",
  setActiveTab: () => {},
});
export const useAdminContext = () => useContext(AdminContext);

export default function AdminLayout() {
  const [password, setPassword] = useState(() => sessionStorage.getItem("admin_pw") || "");
  const [authenticated, setAuthenticated] = useState(() => !!sessionStorage.getItem("admin_pw"));
  const [activeTab, setActiveTab] = useState<AdminTab>("all");
  const location = useLocation();
  const navigate = useNavigate();

  const { installed, loading: detecting } = useAgentDetection();
  const { data: statuses = {}, refetch: refetchStatuses } = useAgentStatuses(installed);

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

  // Master status
  const runningCount = Object.values(statuses).filter((s) => s.running).length;
  const errorCount = Object.values(statuses).reduce((a, s) => a + s.errorsToday, 0);
  const totalInstalled = Object.keys(statuses).length;
  const masterColor = errorCount > 0 ? "#ef4444" : runningCount === 0 ? "#6b7280" : runningCount < totalInstalled ? "#c8a961" : "#22c55e";

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

  const isOnOverview = location.pathname === "/admin" || location.pathname === "/admin/";
  const isOnAgentPage = !isOnOverview && !location.pathname.includes("/admin/settings") && !location.pathname.includes("/admin/installs") && !location.pathname.includes("/admin/changelog") && !location.pathname.includes("/admin/cloud-signups");

  return (
    <AdminContext.Provider value={{ installed, statuses, refetchStatuses, activeTab, setActiveTab }}>
      <div className="min-h-screen bg-[#0a0a08] text-[#f0ead6]">
        {/* Top bar */}
        <header className="sticky top-0 z-50 bg-[#0a0a08]/95 backdrop-blur-sm border-b border-[#f0ead6]/8">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            {/* Row 1: Brand + actions */}
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-4">
                <button onClick={() => navigate("/admin")} className="font-display text-[13px] font-semibold tracking-[0.15em] uppercase text-[#f0ead6] hover:text-[#f0ead6]/90 transition-colors">
                  LazyUnicorn
                </button>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: masterColor }} />
                <span className="font-body text-[10px] tracking-[0.1em] uppercase text-[#f0ead6]/50 hidden sm:inline">
                  {errorCount > 0 ? `${errorCount} error${errorCount > 1 ? "s" : ""}` : runningCount === totalInstalled ? "All running" : `${runningCount}/${totalInstalled} running`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <PromptActions />
                <button
                  onClick={handleBulkToggle}
                  className="inline-flex items-center gap-1.5 border border-[#f0ead6]/10 px-3 py-1.5 font-body text-[10px] tracking-[0.1em] uppercase text-[#f0ead6]/60 hover:text-[#f0ead6] hover:border-[#f0ead6]/30 transition-colors"
                >
                  {runningCount > 0 ? <><Pause size={10} /> Pause All</> : <><Play size={10} /> Resume All</>}
                </button>
                <button
                  onClick={() => navigate("/admin/settings")}
                  className={`p-2 transition-colors ${location.pathname === "/admin/settings" ? "text-[#c8a961]" : "text-[#f0ead6]/40 hover:text-[#f0ead6]/70"}`}
                >
                  <Settings size={14} />
                </button>
                <button
                  onClick={() => { sessionStorage.removeItem("admin_pw"); setAuthenticated(false); }}
                  className="p-2 text-[#f0ead6]/30 hover:text-[#f0ead6]/60 transition-colors"
                >
                  <LogOut size={14} />
                </button>
              </div>
            </div>

            {/* Row 2: Category tabs — only on overview */}
            {isOnOverview && (
              <div className="flex gap-1 pb-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
                {ADMIN_TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-3 py-1.5 font-body text-[11px] tracking-[0.12em] uppercase whitespace-nowrap transition-colors ${
                      activeTab === tab.key
                        ? "text-[#f0ead6] bg-[#f0ead6]/8 border-b-2 border-[#c8a961]"
                        : "text-[#f0ead6]/40 hover:text-[#f0ead6]/70"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 pb-20">
          {detecting ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="animate-spin text-[#f0ead6]/40" size={24} />
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </AdminContext.Provider>
  );
}

function PromptActions() {
  const [syncing, setSyncing] = useState(false);
  const [pushing, setPushing] = useState(false);

  const sync = async () => {
    setSyncing(true);
    try {
      const { error } = await supabase.functions.invoke("pull-prompts-github");
      if (error) throw error;
      toast.success("Prompts synced from GitHub.");
    } catch { toast.error("Sync from GitHub failed."); }
    setSyncing(false);
  };

  const push = async () => {
    setPushing(true);
    try {
      const { error } = await supabase.functions.invoke("sync-prompts-github");
      if (error) throw error;
      toast.success("Prompts pushed to GitHub.");
    } catch { toast.error("Push to GitHub failed."); }
    setPushing(false);
  };

  return (
    <div className="flex items-center gap-1">
      <button onClick={sync} disabled={syncing || pushing}
        className="inline-flex items-center gap-1 border border-[#f0ead6]/10 px-2 py-1.5 font-body text-[10px] tracking-[0.1em] uppercase text-[#f0ead6]/50 hover:text-[#f0ead6] hover:border-[#f0ead6]/30 transition-colors disabled:opacity-40">
        {syncing ? <Loader2 size={10} className="animate-spin" /> : <GitBranch size={10} />}
        <span className="hidden md:inline">Pull</span>
      </button>
      <button onClick={push} disabled={syncing || pushing}
        className="inline-flex items-center gap-1 border border-[#f0ead6]/10 px-2 py-1.5 font-body text-[10px] tracking-[0.1em] uppercase text-[#f0ead6]/50 hover:text-[#f0ead6] hover:border-[#f0ead6]/30 transition-colors disabled:opacity-40">
        {pushing ? <Loader2 size={10} className="animate-spin" /> : <Upload size={10} />}
        <span className="hidden md:inline">Push</span>
      </button>
    </div>
  );
}
