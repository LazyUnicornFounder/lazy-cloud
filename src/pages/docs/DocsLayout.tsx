import { useLocation, useNavigate, Outlet } from "react-router-dom";

const NAV = [
  {
    header: "GETTING STARTED",
    items: [
      { label: "Introduction", path: "/docs" },
      { label: "Quickstart", path: "/docs/quickstart" },
      { label: "How it works", path: "/docs/how-it-works" },
    ],
  },
  {
    header: "AGENTS",
    items: [
      { label: "Content", path: "/docs/agents/content" },
      { label: "Commerce", path: "/docs/agents/commerce" },
      { label: "Media", path: "/docs/agents/media" },
      { label: "Dev", path: "/docs/agents/dev" },
      { label: "Monitor", path: "/docs/agents/monitor" },
      { label: "Intelligence", path: "/docs/agents/intelligence" },
    ],
  },
  {
    header: "ADMIN",
    items: [
      { label: "Overview", path: "/docs/admin/overview" },
      { label: "Settings", path: "/docs/admin/settings" },
    ],
  },
];

export default function DocsLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  return (
    <div className="min-h-screen font-display flex" style={{ background: "var(--background)", color: "#f0ead6", paddingTop: 80 }}>
      {/* Left sidebar */}
      <aside className="fixed top-[80px] left-0 bottom-0 overflow-y-auto" style={{ width: 240, borderRight: "1px solid rgba(240,234,214,0.08)", padding: "24px 0" }}>
        {NAV.map((section) => (
          <div key={section.header} className="mb-2">
            <div className="px-5 pt-4 pb-1.5" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,234,214,0.35)" }}>
              {section.header}
            </div>
            {section.items.map((item) => {
              const active = currentPath === item.path;
              return (
                <button key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex items-center w-full rounded transition-colors"
                  style={{
                    height: 34, padding: "0 20px", fontSize: 14, cursor: "pointer",
                    color: active ? "#f0ead6" : "rgba(240,234,214,0.6)",
                    fontWeight: active ? 600 : 400,
                    background: active ? "rgba(240,234,214,0.06)" : "transparent",
                    margin: "0 8px", width: "calc(100% - 16px)", borderRadius: 4,
                  }}
                  onMouseEnter={(e) => { if (!active) (e.currentTarget.style.background = "rgba(240,234,214,0.03)"); }}
                  onMouseLeave={(e) => { if (!active) (e.currentTarget.style.background = "transparent"); }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: 240, marginRight: 200, flex: 1, padding: "32px 48px", minHeight: "calc(100vh - 80px)" }}>
        <Outlet />
      </main>

      {/* Right sidebar — on this page */}
      <aside className="fixed top-[80px] right-0 bottom-0 overflow-y-auto" style={{ width: 200, borderLeft: "1px solid rgba(240,234,214,0.08)", padding: "24px 16px" }}>
        <DocsRightSidebar />
      </aside>
    </div>
  );
}

function DocsRightSidebar() {
  const location = useLocation();

  // Map routes to their headings for "On this page"
  const headings: Record<string, string[]> = {
    "/docs": ["What is LazyUnicorn?"],
    "/docs/quickstart": ["Step 1 — Open Lovable", "Step 2 — Pick an agent", "Step 3 — Get the prompt", "Step 4 — Paste into Lovable", "Step 5 — Complete setup", "Step 6 — It's running"],
    "/docs/how-it-works": ["Every agent is a mega-prompt", "Agents detect each other", "Updates"],
    "/docs/agents/content": ["Lazy Blogger", "Lazy SEO", "Lazy GEO", "Lazy Crawl", "Lazy Perplexity", "Lazy Repurpose", "Lazy Trend"],
    "/docs/agents/commerce": ["Lazy Store", "Lazy Drop", "Lazy Print", "Lazy Pay", "Lazy Mail", "Lazy SMS", "Lazy Churn"],
    "/docs/agents/media": ["Lazy Voice", "Lazy Stream", "Lazy YouTube"],
    "/docs/agents/dev": ["Lazy Code", "Lazy GitLab", "Lazy Linear", "Lazy Contentful", "Lazy Design", "Lazy Auth", "Lazy Granola"],
    "/docs/agents/monitor": ["Lazy Alert", "Lazy Telegram", "Lazy Supabase", "Lazy Security", "Lazy Watch"],
    "/docs/agents/intelligence": ["Lazy Fix", "Lazy Build", "Lazy Intel", "Lazy Agents"],
    "/docs/admin/overview": ["Three-column layout", "Agent detail page"],
    "/docs/admin/settings": ["Site settings", "API keys", "Weekly schedule", "Version status"],
  };

  const items = headings[location.pathname] || [];
  if (items.length === 0) return null;

  const toId = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return (
    <div>
      <div className="mb-3" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,234,214,0.3)" }}>
        On this page
      </div>
      {items.map((h) => (
        <a key={h} href={`#${toId(h)}`}
          className="block py-1 transition-colors hover:text-[#f0ead6]"
          style={{ fontSize: 12, color: "rgba(240,234,214,0.45)" }}>
          {h}
        </a>
      ))}
    </div>
  );
}
