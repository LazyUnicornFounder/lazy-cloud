import { useLocation } from "react-router-dom";
import { OverviewRightSidebar } from "../AdminOverview";
import { AgentRightSidebar } from "../AgentPage";

export function AdminRightSidebar() {
  const location = useLocation();
  const path = location.pathname;

  if (path === "/admin" || path === "/admin/") {
    return <OverviewRightSidebar />;
  }

  if (path === "/admin/settings") {
    return (
      <div>
        <h3 className="mb-4" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,234,214,0.3)" }}>
          SETTINGS
        </h3>
        <p style={{ fontSize: 13, color: "rgba(240,234,214,0.4)" }}>Global configuration</p>
      </div>
    );
  }

  // Agent detail page
  const slug = path.replace("/admin/", "");
  return <AgentRightSidebar slug={slug} />;
}
