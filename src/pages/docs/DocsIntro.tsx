import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DocsIntro() {
  const navigate = useNavigate();
  return (
    <div>
      <h1 className="text-[28px] font-bold mb-2" style={{ color: "#f0ead6" }}>Introduction</h1>
      <p className="mb-8" style={{ fontSize: 14, color: "rgba(240,234,214,0.45)" }}>Welcome to the LazyUnicorn docs</p>

      <h2 id="what-is-lazyunicorn" className="text-[22px] font-bold mb-4" style={{ color: "#f0ead6" }}>What is LazyUnicorn?</h2>
      <p className="mb-4 leading-relaxed" style={{ fontSize: 15, color: "rgba(240,234,214,0.7)" }}>
        LazyUnicorn is a library of AI agents you install into your Lovable project. Each agent is a single prompt — paste it in and it auto-builds everything: database tables, edge functions, a dashboard, and a cron schedule.
      </p>
      <p className="mb-10 leading-relaxed" style={{ fontSize: 15, color: "rgba(240,234,214,0.7)" }}>
        Once set up, your agents run on their own. They publish content, monitor your app, process orders, and report back — without you doing anything.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => navigate("/docs/quickstart")}
          className="group p-5 rounded-lg text-left transition-colors"
          style={{ border: "1px solid rgba(234,88,12,0.2)", background: "rgba(234,88,12,0.04)" }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(234,88,12,0.4)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(234,88,12,0.2)")}>
          <div className="text-[15px] font-bold mb-1 flex items-center gap-2" style={{ color: "#ea580c" }}>
            Install your first agent <ArrowRight size={14} />
          </div>
          <div style={{ fontSize: 13, color: "rgba(240,234,214,0.45)" }}>Get up and running in 2 minutes</div>
        </button>
        <button onClick={() => navigate("/docs/agents/content")}
          className="group p-5 rounded-lg text-left transition-colors"
          style={{ border: "1px solid rgba(234,88,12,0.2)", background: "rgba(234,88,12,0.04)" }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(234,88,12,0.4)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(234,88,12,0.2)")}>
          <div className="text-[15px] font-bold mb-1 flex items-center gap-2" style={{ color: "#ea580c" }}>
            Browse all agents <ArrowRight size={14} />
          </div>
          <div style={{ fontSize: 13, color: "rgba(240,234,214,0.45)" }}>See the full agent catalogue</div>
        </button>
      </div>
    </div>
  );
}
