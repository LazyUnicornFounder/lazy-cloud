import { useState, createContext, useContext } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Loader2, Play, Pause } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAgentDetection, type AgentState } from "./hooks/useAgentDetection";
import { AGENTS } from "./agentRegistry";
import { adminWrite } from "@/lib/adminWrite";

interface AdminCtx {
  states: Record<string, AgentState>;
  loading: boolean;
  refetch: () => void;
}

const AdminContext = createContext<AdminCtx>({ states: {}, loading: true, refetch: () => {} });
export const useAdminContext = () => useContext(AdminContext);

const NAV_ITEMS = [
  { label: "Overview", path: "/admin" },
  { label: "Content", path: "/admin/content" },
  { label: "Queue", path: "/admin/queue" },
  { label: "Agents", path: "/admin/agents" },
  { label: "Installs", path: "/admin/installs" },
  { label: "Errors", path: "/admin/errors" },
  { label: "Performance", path: "/admin/performance" },
  { label: "Versions", path: "/admin/versions" },
  { label: "Settings", path: "/admin/settings" },
];

export default function AdminLayout() {
  const [password, setPassword] = useState(() => sessionStorage.getItem("admin_pw") || "");
  const [authenticated, setAuthenticated] = useState(() => !!sessionStorage.getItem("admin_pw"));
  const navigate = useNavigate();
  const location = useLocation();
  const { states, loading, refetch } = useAgentDetection();

  const installedEngines = AGENTS.filter((a) => states[a.key]?.installed);
  const runningCount = Object.values(states).filter((s) => s.isRunning).length;
  const pausedCount = installedEngines.length - runningCount;

  // Get brand name from any available settings table
  const brandName = Object.values(states).find((s) => s.settings?.brand_name)?.settings?.brand_name || "LazyUnicorn";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("admin_pw", password);
    setAuthenticated(true);
  };

  const handleBulkToggle = async () => {
    const shouldPause = runningCount > 0;
    for (const a of installedEngines) {
      try {
        await adminWrite({
          table: a.settingsTable,
          operation: "update",
          data: { [a.runField]: !shouldPause },
          match: { id: states[a.key]?.settings?.id },
        });
      } catch {}
    }
    toast.success(shouldPause ? "All engines paused" : "All engines resumed");
    refetch();
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a08" }}>
        <form onSubmit={handleLogin} className="w-full max-w-xs">
          <p className="text-[11px] tracking-[0.2em] uppercase mb-6 text-center font-display" style={{ color: "rgba(240,234,214,0.8)" }}>
            Admin Access
          </p>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 text-sm focus:outline-none font-display rounded-md"
            style={{ background: "rgba(240,234,214,0.05)", border: "1px solid rgba(240,234,214,0.1)", color: "#f0ead6" }}
          />
          <button type="submit"
            className="w-full mt-3 text-[11px] tracking-[0.15em] uppercase font-bold py-3 rounded-md transition-opacity hover:opacity-90 font-display"
            style={{ background: "#c9a84c", color: "#0a0a08" }}>
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <AdminContext.Provider value={{ states, loading, refetch }}>
      <div className="min-h-screen font-display flex" style={{ background: "#0a0a08", color: "#f0ead6" }}>
        {/* Left sidebar */}
        <aside className="fixed top-0 left-0 bottom-0 overflow-y-auto flex flex-col" style={{ width: 220, borderRight: "1px solid rgba(240,234,214,0.08)", background: "#0a0a08", zIndex: 50 }}>
          {/* Header */}
          <div className="px-5 py-5" style={{ borderBottom: "1px solid rgba(240,234,214,0.06)" }}>
            <div className="text-[15px] font-bold tracking-[0.04em]" style={{ color: "#f0ead6" }}>🦄 {brandName}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className={`w-[7px] h-[7px] rounded-full ${pausedCount > 0 ? "bg-[#f87171]" : "bg-[#4ade80]"}`} />
              <span style={{ fontSize: 11, color: "rgba(240,234,214,0.5)" }}>
                {pausedCount > 0 ? `${pausedCount} engine${pausedCount > 1 ? "s" : ""} paused` : "All systems running"}
              </span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-3">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path || (item.path === "/admin" && location.pathname === "/admin/");
              return (
                <button key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex items-center w-full px-5 transition-colors"
                  style={{
                    height: 36, fontSize: 14, gap: 10,
                    color: isActive ? "#f0ead6" : "rgba(240,234,214,0.6)",
                    fontWeight: isActive ? 600 : 400,
                    background: isActive ? "rgba(201,168,76,0.1)" : "transparent",
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(240,234,214,0.04)"; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = isActive ? "rgba(201,168,76,0.1)" : "transparent"; }}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Global pause toggle */}
          <div className="px-5 py-4" style={{ borderTop: "1px solid rgba(240,234,214,0.06)" }}>
            <button onClick={handleBulkToggle}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md text-[11px] font-bold uppercase tracking-[0.08em] transition-opacity hover:opacity-90"
              style={{
                background: runningCount > 0 ? "rgba(248,113,113,0.1)" : "rgba(74,222,128,0.1)",
                color: runningCount > 0 ? "#f87171" : "#4ade80",
                border: `1px solid ${runningCount > 0 ? "rgba(248,113,113,0.2)" : "rgba(74,222,128,0.2)"}`,
              }}>
              {runningCount > 0 ? <><Pause size={12} /> Pause All Engines</> : <><Play size={12} /> Resume All Engines</>}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1" style={{ marginLeft: 220, padding: "32px 40px", minHeight: "100vh" }}>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="animate-spin" size={24} style={{ color: "rgba(240,234,214,0.4)" }} />
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </AdminContext.Provider>
  );
}
