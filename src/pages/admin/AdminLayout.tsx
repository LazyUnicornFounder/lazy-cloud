import { useState, createContext, useContext, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Loader2, Settings, Search, Pause, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAgentDetection, type AgentState } from "./hooks/useAgentDetection";
import { AGENTS, CATEGORIES, CATEGORY_AGENTS, type AgentCategory } from "./agentRegistry";
import { AdminRightSidebar } from "./components/AdminRightSidebar";

interface AdminCtx {
  states: Record<string, AgentState>;
  loading: boolean;
  refetch: () => void;
  selectedCategory: AgentCategory | "All";
  setSelectedCategory: (c: AgentCategory | "All") => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const AdminContext = createContext<AdminCtx>({
  states: {}, loading: true, refetch: () => {},
  selectedCategory: "All", setSelectedCategory: () => {},
  searchQuery: "", setSearchQuery: () => {},
});
export const useAdminContext = () => useContext(AdminContext);

export default function AdminLayout() {
  const [password, setPassword] = useState(() => sessionStorage.getItem("admin_pw") || "");
  const [authenticated, setAuthenticated] = useState(() => !!sessionStorage.getItem("admin_pw"));
  const [selectedCategory, setSelectedCategory] = useState<AgentCategory | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { states, loading, refetch } = useAgentDetection();

  const runningCount = Object.values(states).filter((s) => s.isRunning).length;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("admin_pw", password);
    setAuthenticated(true);
  };

  const handleBulkToggle = async () => {
    const shouldPause = runningCount > 0;
    const agents = AGENTS.filter((a) => states[a.key]?.installed);
    for (const a of agents) {
      try {
        await (supabase as any).from(a.settingsTable).update({ [a.runField]: !shouldPause });
      } catch {}
    }
    toast.success(shouldPause ? "All agents paused" : "All agents resumed");
    refetch();
  };

  const getStatusDot = (state?: AgentState) => {
    if (!state || !state.installed) return "bg-[rgba(240,234,214,0.2)]";
    if (state.hasRecentError) return "bg-[#f87171]";
    if (!state.setupComplete) return "bg-[#c9a84c]";
    if (state.isRunning) return "bg-[#4ade80]";
    return "bg-[rgba(240,234,214,0.2)]";
  };

  const currentSlug = location.pathname.replace("/admin/", "").replace("/admin", "");

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
            style={{ background: "#c9a84c", color: "#0a0a08" }}
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <AdminContext.Provider value={{ states, loading, refetch, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery }}>
      <div className="min-h-screen font-display" style={{ background: "#0a0a08", color: "#f0ead6" }}>
        {/* Top bar */}
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5"
          style={{ height: 52, background: "#0a0a08", borderBottom: "1px solid rgba(240,234,214,0.08)" }}>
          <button onClick={() => navigate("/admin")}
            className="text-[15px] font-bold tracking-[0.04em] hover:opacity-90 transition-opacity"
            style={{ color: "#f0ead6" }}>
            🦄 LAZY UNICORN
          </button>

          <div className="relative" style={{ width: 400 }}>
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(240,234,214,0.3)" }} />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agents..."
              className="w-full pl-9 pr-12 py-2 text-[14px] rounded-md focus:outline-none font-display"
              style={{ background: "rgba(240,234,214,0.05)", border: "1px solid rgba(240,234,214,0.1)", color: "#f0ead6" }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px]" style={{ color: "rgba(240,234,214,0.25)" }}>⌘K</span>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleBulkToggle}
              className="flex items-center gap-1.5 text-[12px] tracking-[0.05em] uppercase transition-colors hover:opacity-80"
              style={{ color: "rgba(240,234,214,0.5)" }}>
              {runningCount > 0 ? <><Pause size={11} /> PAUSE ALL</> : <><Play size={11} /> RESUME ALL</>}
            </button>
            <button onClick={() => navigate("/admin/settings")}
              className="p-2 transition-colors hover:opacity-70" style={{ color: "rgba(240,234,214,0.4)" }}>
              <Settings size={14} />
            </button>
            <a href="/lazy-cloud"
              className="px-3 py-1 text-[11px] font-bold tracking-[0.08em] uppercase rounded-full transition-opacity hover:opacity-90"
              style={{ background: "#c9a84c", color: "#0a0a08" }}>
              LAZY CLOUD ↗
            </a>
          </div>
        </header>

        {/* Three-column layout */}
        <div className="flex" style={{ paddingTop: 52, minHeight: "100vh" }}>
          {/* Left sidebar */}
          <aside className="fixed top-[52px] left-0 bottom-0 overflow-y-auto" style={{ width: 240, borderRight: "1px solid rgba(240,234,214,0.08)" }}>
            <div className="px-4 py-5" style={{ borderBottom: "1px solid rgba(240,234,214,0.06)" }}>
              <div className="text-[15px] font-bold" style={{ color: "#f0ead6" }}>🦄 Lazy</div>
              <div className="text-[11px] mt-1" style={{ color: "rgba(240,234,214,0.4)" }}>
                {runningCount} of 36 running
              </div>
            </div>

            <nav className="py-2">
              {/* All Agents */}
              <button
                onClick={() => { setSelectedCategory("All"); navigate("/admin"); }}
                className="flex items-center w-full px-4 mx-1 rounded transition-colors"
                style={{
                  height: 36, fontSize: 14, gap: 10,
                  color: selectedCategory === "All" && !currentSlug ? "#f0ead6" : "rgba(240,234,214,0.7)",
                  fontWeight: selectedCategory === "All" && !currentSlug ? 600 : 400,
                  background: selectedCategory === "All" && !currentSlug ? "rgba(201,168,76,0.1)" : "transparent",
                }}
              >
                All Agents
              </button>

              {/* Cloud Signups */}
              <button
                onClick={() => navigate("/admin/cloud-signups")}
                className="flex items-center w-full px-4 mx-1 rounded transition-colors"
                style={{
                  height: 36, fontSize: 14, gap: 10,
                  color: currentSlug === "cloud-signups" ? "#f0ead6" : "rgba(240,234,214,0.7)",
                  fontWeight: currentSlug === "cloud-signups" ? 600 : 400,
                  background: currentSlug === "cloud-signups" ? "rgba(201,168,76,0.1)" : "transparent",
                }}
                onMouseEnter={(e) => { if (currentSlug !== "cloud-signups") e.currentTarget.style.background = "rgba(240,234,214,0.04)"; }}
                onMouseLeave={(e) => { if (currentSlug !== "cloud-signups") e.currentTarget.style.background = "transparent"; }}
              >
                ☁️ Cloud Signups
              </button>

              {CATEGORIES.map((cat) => (
                <div key={cat}>
                  <button
                    onClick={() => { setSelectedCategory(cat); navigate("/admin"); }}
                    className="block w-full text-left px-4 pt-4 pb-1.5"
                    style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,234,214,0.35)" }}
                  >
                    {cat}
                  </button>
                  {CATEGORY_AGENTS[cat].map((agentSlug) => {
                    const agent = AGENTS.find((a) => a.slug === agentSlug);
                    if (!agent) return null;
                    const state = states[agent.key];
                    const isActive = currentSlug === agentSlug;
                    return (
                      <button key={agentSlug}
                        onClick={() => navigate(`/admin/${agentSlug}`)}
                        className="flex items-center w-full rounded transition-colors mx-1"
                        style={{
                          height: 36, padding: "0 16px", fontSize: 14, gap: 10, cursor: "pointer",
                          color: isActive ? "#f0ead6" : "rgba(240,234,214,0.7)",
                          fontWeight: isActive ? 600 : 400,
                          background: isActive ? "rgba(201,168,76,0.1)" : "transparent",
                        }}
                        onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(240,234,214,0.04)"; }}
                        onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                      >
                        <span className={`w-[7px] h-[7px] rounded-full ${getStatusDot(state)}`} />
                        {agent.label}
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1" style={{ marginLeft: 240, marginRight: 220, padding: "32px 40px" }}>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin" size={24} style={{ color: "rgba(240,234,214,0.4)" }} />
              </div>
            ) : (
              <Outlet />
            )}
          </main>

          {/* Right sidebar */}
          <aside className="fixed top-[52px] right-0 bottom-0 overflow-y-auto" style={{ width: 220, borderLeft: "1px solid rgba(240,234,214,0.08)", padding: "24px 20px" }}>
            <AdminRightSidebar />
          </aside>
        </div>
      </div>
    </AdminContext.Provider>
  );
}
