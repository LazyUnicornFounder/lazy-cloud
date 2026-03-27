import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard, BarChart3, PenTool, Settings, Menu, X,
  FileText, Bot,
} from "lucide-react";

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

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a08] flex items-center justify-center">
        <form onSubmit={handleLogin} className="w-full max-w-xs">
          <p className="font-display text-sm tracking-[0.2em] uppercase text-[#f0ead6]/82 mb-6 text-center">Admin Access</p>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
            className="w-full bg-transparent border border-[#f0ead6]/10 text-[#f0ead6] px-4 py-3 font-body text-sm focus:outline-none focus:border-[#f0ead6]/30" />
          <button type="submit" className="w-full mt-3 bg-[#f0ead6] text-[#0a0a08] font-display text-xs tracking-[0.15em] uppercase font-bold py-3 hover:opacity-90 transition-opacity">Enter</button>
        </form>
      </div>
    );
  }

  const navItems = [
    { label: "Mission Control", path: "/admin/overview", icon: LayoutDashboard },
    { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
    { label: "Prompts", path: "/admin/prompts", icon: FileText },
    { label: "Changelog", path: "/admin/changelog", icon: PenTool },
    { label: "Settings", path: "/admin/settings", icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === "/admin/overview") return location.pathname === "/admin" || location.pathname === "/admin/overview";
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-[#0a0a08] text-[#f0ead6] flex">
      {/* Sidebar — compact */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-48 bg-[#0a0a08] border-r border-[#f0ead6]/8 flex flex-col transition-transform duration-200 md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="px-5 pt-6 pb-4 border-b border-[#f0ead6]/8">
          <Link to="/" className="font-display text-[13px] font-semibold tracking-[0.15em] uppercase text-[#f0ead6] hover:text-[#f0ead6]/95 transition-colors leading-tight flex flex-col">
            <span>Lazy</span><span>Unicorn</span>
          </Link>
        </div>

        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-3 px-5 py-2.5 font-body text-[13px] tracking-[0.08em] transition-colors ${
                  active
                    ? "text-[#c8a961] bg-[#c8a961]/8 border-l-2 border-[#c8a961]"
                    : "text-[#f0ead6]/70 hover:text-[#f0ead6]/95 hover:bg-[#f0ead6]/5 border-l-2 border-transparent"
                }`}>
                <item.icon size={13} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-5 py-4 border-t border-[#f0ead6]/8">
          <button onClick={() => { sessionStorage.removeItem("admin_pw"); setAuthenticated(false); }}
            className="font-body text-[11px] tracking-[0.1em] uppercase text-[#f0ead6]/50 hover:text-[#f0ead6]/80 transition-colors">
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-40 md:hidden bg-[#0a0a08] border-b border-[#f0ead6]/8 px-4 py-3 flex items-center justify-between">
        <p className="font-display text-[13px] font-semibold tracking-[0.15em] uppercase text-[#f0ead6]">Admin</p>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-[#f0ead6]/80">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Main */}
      <main className="flex-1 md:ml-48 pt-14 md:pt-0 min-h-screen">
        <div className="p-6 md:p-8 max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
