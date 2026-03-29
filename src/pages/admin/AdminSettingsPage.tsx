import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Save, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";
import { useAdminContext } from "./AdminLayout";
import { AGENTS, CATEGORY_META, type AgentCategory } from "./agentRegistry";

/* ── Weekly schedule (read-only visual) ── */
const SCHEDULE: { agent: string; category: AgentCategory; day: number; hour: number }[] = [
  // Content — gold
  { agent: "Blogger", category: "content", day: 0, hour: 6 },
  { agent: "Blogger", category: "content", day: 1, hour: 6 },
  { agent: "Blogger", category: "content", day: 2, hour: 6 },
  { agent: "Blogger", category: "content", day: 3, hour: 6 },
  { agent: "Blogger", category: "content", day: 4, hour: 6 },
  { agent: "Blogger", category: "content", day: 5, hour: 6 },
  { agent: "Blogger", category: "content", day: 6, hour: 6 },
  { agent: "SEO", category: "content", day: 1, hour: 8 },
  { agent: "SEO", category: "content", day: 3, hour: 8 },
  { agent: "SEO", category: "content", day: 5, hour: 8 },
  { agent: "GEO", category: "content", day: 0, hour: 10 },
  { agent: "GEO", category: "content", day: 2, hour: 10 },
  { agent: "GEO", category: "content", day: 4, hour: 10 },
  // Media — blue
  { agent: "Voice", category: "media", day: 1, hour: 14 },
  { agent: "Voice", category: "media", day: 4, hour: 14 },
  { agent: "Stream", category: "media", day: 6, hour: 20 },
  // Dev — purple
  { agent: "Fix", category: "dev", day: 6, hour: 23 },
  { agent: "Intel", category: "ops", day: 0, hour: 9 },
  // Ops — red
  { agent: "Watch", category: "ops", day: 0, hour: 7 },
  { agent: "Watch", category: "ops", day: 3, hour: 7 },
  { agent: "Watch", category: "ops", day: 6, hour: 7 },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ── API key definitions ── */
const API_KEYS: { label: string; secret: string; agents: string[] }[] = [
  { label: "ElevenLabs", secret: "ELEVENLABS_API_KEY", agents: ["Voice"] },
  { label: "Stripe", secret: "STRIPE_SECRET_KEY", agents: ["Pay"] },
  { label: "Twilio", secret: "TWILIO_AUTH_TOKEN", agents: ["SMS"] },
  { label: "Twitch", secret: "TWITCH_CLIENT_ID", agents: ["Stream"] },
  { label: "GitHub", secret: "GITHUB_PROMPTS_TOKEN", agents: ["GitHub", "Prompts"] },
  { label: "GitLab", secret: "GITLAB_TOKEN", agents: ["GitLab"] },
  { label: "Linear", secret: "LINEAR_API_KEY", agents: ["Linear"] },
  { label: "Firecrawl", secret: "FIRECRAWL_API_KEY", agents: ["Crawl"] },
  { label: "Perplexity", secret: "PERPLEXITY_API_KEY", agents: ["Perplexity"] },
  { label: "Aikido", secret: "AIKIDO_API_KEY", agents: ["Security"] },
  { label: "Contentful", secret: "CONTENTFUL_ACCESS_TOKEN", agents: ["Contentful"] },
  { label: "Resend", secret: "RESEND_API_KEY", agents: ["Mail"] },
  { label: "Supadata", secret: "SUPADATA_API_KEY", agents: ["YouTube"] },
  { label: "Granola", secret: "GRANOLA_API_KEY", agents: ["Granola"] },
  { label: "Slack", secret: "SLACK_WEBHOOK_URL", agents: ["Alert"] },
  { label: "Telegram", secret: "TELEGRAM_BOT_TOKEN", agents: ["Telegram"] },
];

export default function AdminSettingsPage() {
  const { installed } = useAdminContext();
  const [saving, setSaving] = useState(false);
  const [siteForm, setSiteForm] = useState({ site_url: "", brand_name: "", business_description: "", support_email: "" });
  const [showSecrets, setShowSecrets] = useState<Set<string>>(new Set());

  /* ── Version checker ── */
  const { data: versions } = useQuery({
    queryKey: ["admin-versions"],
    queryFn: async () => {
      try {
        const c = new AbortController(); setTimeout(() => c.abort(), 5000);
        const res = await fetch("https://lazyunicorn.ai/api/versions", { signal: c.signal });
        return res.ok ? await res.json() : null;
      } catch { return null; }
    },
    staleTime: 300_000,
  });

  const { data: promptVersions = [] } = useQuery({
    queryKey: ["admin-prompt-versions"],
    queryFn: async () => {
      const { data } = await supabase.from("prompt_versions").select("product, version").eq("is_current", true);
      return data || [];
    },
  });

  const [dismissed, setDismissed] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem("lazy-version-dismissed") || "[]"); } catch { return []; } });
  const outdated = versions ? promptVersions.filter(p => { const l = versions[p.product]; return l && l !== p.version && !dismissed.includes(`${p.product}:${l}`); }) : [];
  const dismissAll = () => { const k = outdated.map(p => `${p.product}:${versions[p.product]}`); const n = [...dismissed, ...k]; setDismissed(n); localStorage.setItem("lazy-version-dismissed", JSON.stringify(n)); };

  const toggleSecret = (key: string) => {
    const next = new Set(showSecrets);
    if (next.has(key)) next.delete(key); else next.add(key);
    setShowSecrets(next);
  };

  return (
    <div>
      <h1 className="font-display text-xl font-bold tracking-tight mb-6">Settings</h1>

      {/* Version update banner */}
      {outdated.length > 0 && (
        <div className="border border-[#c8a961]/30 bg-[#c8a961]/5 p-4 flex items-center justify-between mb-6">
          <span className="font-body text-[13px] text-[#c8a961]">Updates available for {outdated.length} agent{outdated.length > 1 ? "s" : ""}</span>
          <div className="flex gap-3">
            <button onClick={dismissAll} className="font-body text-[11px] uppercase tracking-wider text-[#f0ead6]/50 hover:text-[#f0ead6]">Dismiss</button>
          </div>
        </div>
      )}

      {/* Site settings */}
      <div className="border border-[#f0ead6]/8 p-5 mb-6">
        <h2 className="font-display text-sm font-bold tracking-[0.1em] uppercase text-[#f0ead6]/50 mb-4">Site Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: "site_url", label: "Site URL", ph: "https://yoursite.com" },
            { key: "brand_name", label: "Brand Name", ph: "Your Brand" },
            { key: "business_description", label: "Description", ph: "What your business does" },
            { key: "support_email", label: "Support Email", ph: "support@yoursite.com" },
          ].map(f => (
            <div key={f.key}>
              <label className="block font-body text-[10px] tracking-[0.2em] uppercase text-[#f0ead6]/40 mb-1">{f.label}</label>
              <input
                type="text"
                value={(siteForm as any)[f.key] || ""}
                onChange={e => setSiteForm({ ...siteForm, [f.key]: e.target.value })}
                placeholder={f.ph}
                className="w-full bg-transparent border border-[#f0ead6]/8 text-[#f0ead6] px-3 py-2 font-body text-[12px] focus:outline-none focus:border-[#f0ead6]/20"
              />
            </div>
          ))}
        </div>
        <button
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            const agents = AGENTS.filter(a => installed.has(a.key));
            for (const a of agents) {
              try {
                const u: Record<string, string> = {};
                if (siteForm.site_url) u.site_url = siteForm.site_url;
                if (siteForm.brand_name) u.brand_name = siteForm.brand_name;
                if (Object.keys(u).length > 0) await (supabase as any).from(a.settingsTable).update(u);
              } catch {}
            }
            toast.success("Settings propagated to all agents");
            setSaving(false);
          }}
          className="mt-4 inline-flex items-center gap-2 bg-[#f0ead6] text-[#0a0a08] px-4 py-2 font-display text-[11px] tracking-[0.1em] uppercase font-bold hover:opacity-90 disabled:opacity-50"
        >
          {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Propagate to All Agents
        </button>
      </div>

      {/* API Keys */}
      <div className="border border-[#f0ead6]/8 p-5 mb-6">
        <h2 className="font-display text-sm font-bold tracking-[0.1em] uppercase text-[#f0ead6]/50 mb-4">API Keys</h2>
        <div className="divide-y divide-[#f0ead6]/5">
          {API_KEYS.map(({ label, secret, agents }) => (
            <div key={secret} className="py-3 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-body text-[12px] text-[#f0ead6]/80 font-semibold">{label}</span>
                  <span className="font-body text-[10px] text-[#f0ead6]/30">{secret}</span>
                </div>
                <div className="flex gap-1 mt-0.5">
                  {agents.map(a => (
                    <span key={a} className="font-body text-[9px] tracking-wider uppercase text-[#f0ead6]/40">{a}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-transparent border border-[#f0ead6]/8 text-[#f0ead6]/30 px-2 py-1 font-body text-[11px] text-center">
                  {showSecrets.has(secret) ? "•••••••" : "•••"}
                </div>
                <button onClick={() => toggleSecret(secret)} className="text-[#f0ead6]/30 hover:text-[#f0ead6]/60">
                  {showSecrets.has(secret) ? <EyeOff size={12} /> : <Eye size={12} />}
                </button>
              </div>
            </div>
          ))}
        </div>
        <p className="font-body text-[10px] text-[#f0ead6]/30 mt-3">
          API keys are managed via Project Settings → Edge Functions → Secrets
        </p>
      </div>

      {/* Weekly Schedule */}
      <div className="border border-[#f0ead6]/8 p-5 mb-6">
        <h2 className="font-display text-sm font-bold tracking-[0.1em] uppercase text-[#f0ead6]/50 mb-4">Weekly Schedule</h2>
        <div className="grid grid-cols-7 gap-1">
          {DAYS.map((day, dayIdx) => (
            <div key={day}>
              <p className="font-body text-[10px] text-[#f0ead6]/40 text-center mb-1">{day}</p>
              <div className="space-y-0.5">
                {SCHEDULE.filter(s => s.day === dayIdx).map((s, i) => (
                  <div
                    key={i}
                    className="px-1 py-0.5 text-center"
                    style={{ backgroundColor: `${CATEGORY_META[s.category].color}15`, borderLeft: `2px solid ${CATEGORY_META[s.category].color}` }}
                  >
                    <span className="font-body text-[8px] uppercase tracking-wider" style={{ color: CATEGORY_META[s.category].color }}>
                      {s.agent}
                    </span>
                  </div>
                ))}
                {SCHEDULE.filter(s => s.day === dayIdx).length === 0 && (
                  <div className="h-6 border border-[#f0ead6]/5 border-dashed" />
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-3">
          {(["content", "commerce", "media", "dev", "ops"] as AgentCategory[]).map(cat => (
            <span key={cat} className="flex items-center gap-1">
              <span className="w-2 h-2" style={{ backgroundColor: CATEGORY_META[cat].color }} />
              <span className="font-body text-[9px] text-[#f0ead6]/40 uppercase tracking-wider">{CATEGORY_META[cat].label}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Installed versions */}
      {promptVersions.length > 0 && (
        <div className="border border-[#f0ead6]/8 p-5">
          <h2 className="font-display text-sm font-bold tracking-[0.1em] uppercase text-[#f0ead6]/50 mb-4">Installed Versions</h2>
          <div className="border border-[#f0ead6]/8 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#f0ead6]/8">
                  {["Agent", "Installed", "Latest", "Status"].map(h => (
                    <th key={h} className="px-3 py-2 font-body text-[10px] tracking-[0.2em] uppercase text-[#f0ead6]/40 font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ead6]/5">
                {promptVersions.map(p => {
                  const l = versions?.[p.product];
                  const ok = !l || l === p.version;
                  return (
                    <tr key={p.product} className="hover:bg-[#f0ead6]/3">
                      <td className="px-3 py-2 font-body text-[12px] text-[#f0ead6]/80">{p.product}</td>
                      <td className="px-3 py-2 font-body text-[12px] text-[#f0ead6]/60">{p.version}</td>
                      <td className="px-3 py-2 font-body text-[12px] text-[#f0ead6]/60">{l || "—"}</td>
                      <td className="px-3 py-2">
                        {ok ? (
                          <span className="inline-flex items-center gap-1 text-emerald-500 text-[10px] uppercase tracking-wider"><CheckCircle size={10} />Current</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[#c8a961] text-[10px] uppercase tracking-wider"><XCircle size={10} />Update</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
