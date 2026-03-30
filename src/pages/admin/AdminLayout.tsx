import { useState, createContext, useContext } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Loader2, Pause, Play, LayoutDashboard, FileText, ListTodo, Bot, Download, AlertTriangle, Activity, GitBranch, Settings, Cloud } from "lucide-react";
import { toast } from "sonner";
import { useAgentDetection, type AgentState } from "./hooks/useAgentDetection";
import { AGENTS } from "./agentRegistry";
import { adminWrite } from "@/lib/adminWrite";
import "./admin.css";

interface AdminCtx {
  states: Record<string, AgentState>;
  loading: boolean;
  refetch: () => void;
}

const AdminContext = createContext<AdminCtx>({ states: {}, loading: true, refetch: () => {} });
export const useAdminContext = () => useContext(AdminContext);

const NAV_ITEMS = [
  { label: "Overview", path: "/admin", icon: LayoutDashboard },
  { label: "Content", path: "/admin/content", icon: FileText },
  { label: "Queue", path: "/admin/queue", icon: ListTodo },
  { label: "Agents", path: "/admin/agents", icon: Bot },
  { label: "Installs", path: "/admin/installs", icon: Download },
  { label: "Errors", path: "/admin/errors", icon: AlertTriangle },
  { label: "Performance", path: "/admin/performance", icon: Activity },
  { label: "Versions", path: "/admin/versions", icon: GitBranch },
  { label: "Cloud", path: "/admin/cloud-signups", icon: Cloud },
  { label: "Settings", path: "/admin/settings", icon: Settings },
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--admin-bg)" }}>
        <form onSubmit={handleLogin} className="w-full max-w-xs">
          <div className="text-center mb-8">
            <h1 className="text-lg font-semibold tracking-tight" style={{ color: "var(--admin-text)" }}>Admin</h1>
            <p className="text-sm mt-1" style={{ color: "var(--admin-text-tertiary)" }}>Enter your password to continue</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-shadow"
            style={{ background: "var(--admin-bg-elevated)", border: "1px solid var(--admin-border-strong)", color: "var(--admin-text)" }}
          />
          <button
            type="submit"
            className="w-full mt-3 text-sm font-medium py-2.5 rounded-lg transition-all hover:brightness-110"
            style={{ background: "var(--admin-accent)", color: "#fff" }}
          >
            Continue
          </button>
        </form>
      </div>
    );
  }

  return (
    <AdminContext.Provider value={{ states, loading, refetch }}>
      <div className="min-h-screen flex" style={{ background: "var(--admin-bg)", color: "var(--admin-text)" }}>
        {/* Sidebar */}
        <aside
          className="fixed top-0 left-0 bottom-0 overflow-y-auto flex flex-col"
          style={{ width: 240, borderRight: "1px solid var(--admin-border)", background: "var(--admin-bg)", zIndex: 50 }}
        >
          {/* Brand */}
          <div className="px-5 py-5" style={{ borderBottom: "1px solid var(--admin-border)" }}>
            <div className="text-sm font-semibold tracking-tight" style={{ color: "var(--admin-text)" }}>
              🦄 {brandName}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: pausedCount > 0 ? "var(--admin-warning)" : "var(--admin-success)" }}
              />
              <span className="text-xs" style={{ color: "var(--admin-text-tertiary)" }}>
                {pausedCount > 0 ? `${pausedCount} paused` : "All running"}
              </span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-2 px-2">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path || (item.path === "/admin" && location.pathname === "/admin/");
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex items-center w-full px-3 py-2 rounded-md text-[13px] gap-2.5 transition-colors mb-0.5"
                  style={{
                    color: isActive ? "var(--admin-text)" : "var(--admin-text-secondary)",
                    fontWeight: isActive ? 500 : 400,
                    background: isActive ? "var(--admin-bg-hover)" : "transparent",
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "var(--admin-bg-hover)"; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                >
                  <Icon size={15} style={{ opacity: isActive ? 1 : 0.5 }} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Bulk toggle */}
          <div className="px-3 py-4" style={{ borderTop: "1px solid var(--admin-border)" }}>
            <button
              onClick={handleBulkToggle}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-md text-xs font-medium transition-all hover:brightness-110"
              style={{
                background: runningCount > 0 ? "var(--admin-error-muted)" : "var(--admin-success-muted)",
                color: runningCount > 0 ? "var(--admin-error)" : "var(--admin-success)",
                border: `1px solid ${runningCount > 0 ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}`,
              }}
            >
              {runningCount > 0 ? <><Pause size={12} /> Pause All</> : <><Play size={12} /> Resume All</>}
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1" style={{ marginLeft: 240, padding: "32px 40px", minHeight: "100vh" }}>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="animate-spin" size={20} style={{ color: "var(--admin-text-tertiary)" }} />
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </AdminContext.Provider>
  );
}
