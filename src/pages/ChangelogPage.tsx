import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { ChevronDown, Rss, Check, AlertTriangle } from "lucide-react";
import ReactMarkdown from "react-markdown";

const db = supabase as any;

interface Release {
  id: string;
  agent_name: string;
  version: string;
  release_date: string;
  change_type: string;
  summary: string;
  changes: string | null;
  upgrade_complexity: string;
  upgrade_instructions: string | null;
  download_url: string | null;
  published: boolean;
  created_at: string;
}

const AGENT_CATEGORIES: Record<string, string[]> = {
  "Lazy Unicorn": ["Lazy Launch", "Lazy Run"],
  "Lazy Content": ["Lazy Blogger", "Lazy SEO", "Lazy GEO", "Lazy Crawl", "Lazy Perplexity", "Lazy Contentful"],
  "Lazy Commerce": ["Lazy Store", "Lazy Drop", "Lazy Print", "Lazy Pay", "Lazy SMS", "Lazy Mail"],
  "Lazy Media": ["Lazy Voice", "Lazy Stream", "Lazy YouTube"],
  "Lazy Dev": ["Lazy GitHub", "Lazy GitLab", "Lazy Linear", "Lazy Design", "Lazy Auth", "Lazy Granola"],
  "Lazy Ops": ["Lazy Admin", "Lazy Alert", "Lazy Telegram", "Lazy Supabase", "Lazy Security", "Lazy Watch", "Lazy Fix", "Lazy Build", "Lazy Intel", "Lazy Repurpose", "Lazy Trend", "Lazy Churn"],
};

const CATEGORY_FILTERS = ["All Agents", ...Object.keys(AGENT_CATEGORIES)];
const CHANGE_TYPES = ["All", "Major", "Minor", "Fix", "Security"];

function changeTypeBadge(type: string) {
  const colors: Record<string, string> = {
    major: "bg-[#c8a961]/20 text-[#c8a961]",
    minor: "bg-blue-500/20 text-blue-400",
    fix: "bg-emerald-500/20 text-emerald-400",
    security: "bg-red-500/20 text-red-400",
  };
  return colors[type] || colors.minor;
}

function complexityBadge(c: string) {
  const colors: Record<string, string> = {
    "drop-in": "bg-emerald-500/20 text-emerald-400",
    "setup-required": "bg-amber-500/20 text-amber-400",
    "breaking": "bg-red-500/20 text-red-400",
  };
  return colors[c] || colors["drop-in"];
}

function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function ChangelogPage() {
  const [categoryFilter, setCategoryFilter] = useState("All Agents");
  const [typeFilter, setTypeFilter] = useState("All");
  const [expandedChanges, setExpandedChanges] = useState<Set<string>>(new Set());
  const [expandedUpgrade, setExpandedUpgrade] = useState<Set<string>>(new Set());

  // Version checker
  const [checkerAgent, setCheckerEngine] = useState("");
  const [checkerVersion, setCheckerVersion] = useState("");
  const [checkerResult, setCheckerResult] = useState<null | { upToDate: boolean; updates: Release[] }>(null);

  const { data: releases = [] } = useQuery<Release[]>({
    queryKey: ["prompt-releases"],
    queryFn: async () => {
      const { data } = await db
        .from("prompt_releases")
        .select("*")
        .eq("published", true)
        .order("release_date", { ascending: false });
      return ((data || []) as any[]).map((r: any) => ({
        ...r,
        agent_name: r.engine_name ?? r.agent_name,
      })) as Release[];
    },
  });

  const agentNames = useMemo(() => {
    const ordered = Object.values(AGENT_CATEGORIES).flat();
    const fromReleases = [...new Set(releases.map(r => r.agent_name))];
    return [
      ...ordered.filter(n => fromReleases.includes(n)),
      ...fromReleases.filter(n => !ordered.includes(n)).sort(),
    ];
  }, [releases]);

  const filtered = useMemo(() => {
    return releases.filter(r => {
      if (categoryFilter !== "All Agents") {
        const agent = AGENT_CATEGORIES[categoryFilter] || [];
        if (!agent.includes(r.agent_name)) return false;
      }
      if (typeFilter !== "All" && r.change_type !== typeFilter.toLowerCase()) return false;
      return true;
    });
  }, [releases, categoryFilter, typeFilter]);

  const grouped = useMemo(() => {
    const groups: Record<string, Release[]> = {};
    filtered.forEach(r => {
      if (!groups[r.release_date]) groups[r.release_date] = [];
      groups[r.release_date].push(r);
    });
    Object.values(groups).forEach(g => g.sort((a, b) => a.agent_name.localeCompare(b.agent_name)));
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [filtered]);

  const toggleSet = (set: Set<string>, id: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    setter(next);
  };

  const handleCheck = () => {
    if (!checkerAgent || !checkerVersion) return;
    const agentReleases = releases.filter(r => r.agent_name === checkerAgent);
    const currentRelease = agentReleases.find(r => r.version === checkerVersion);
    if (!currentRelease) {
      setCheckerResult({ upToDate: false, updates: agentReleases });
      return;
    }
    const newer = agentReleases.filter(r => r.release_date > currentRelease.release_date || (r.release_date === currentRelease.release_date && r.version > currentRelease.version));
    setCheckerResult({ upToDate: newer.length === 0, updates: newer });
  };

  return (
    <>
      <SEO title="Prompt Changelog — LazyUnicorn" description="Every version of every Lazy prompt. What changed, when it changed, and how to upgrade." />
      <Navbar />
      <main className="min-h-screen bg-background text-foreground pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">Prompt Changelog</h1>
            <p className="font-body text-foreground/50 text-lg max-w-2xl mb-3">
              Every version of every Lazy prompt. What changed, when it changed, and how to upgrade.
            </p>
            <p className="font-body text-foreground/70 text-sm mb-4">
              Prompts are updated when Lovable's platform evolves, new integrations are added, or bugs are found. Check here before pasting a prompt you have not used recently.
            </p>
            <a
              href={`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/changelog-rss`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-body text-[13px] tracking-[0.12em] uppercase text-[#c8a961]/70 hover:text-[#c8a961] transition-colors"
            >
              <Rss size={12} /> Subscribe to updates
            </a>
          </div>

          {/* Version Checker */}
          <div className="border border-border p-6 mb-12">
            <h2 className="font-display text-sm tracking-[0.15em] uppercase font-bold text-foreground/60 mb-4">Are you on the latest version?</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="font-body text-[14px] tracking-[0.12em] uppercase text-foreground/70 mb-1 block">Agent</label>
                <select
                  value={checkerAgent}
                  onChange={e => { setCheckerEngine(e.target.value); setCheckerResult(null); }}
                  className="w-full bg-background border border-border text-foreground px-3 py-2 font-body text-sm focus:outline-none focus:border-foreground/30"
                >
                  <option value="">Select agent</option>
                  {agentNames.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="font-body text-[14px] tracking-[0.12em] uppercase text-foreground/70 mb-1 block">Your current version</label>
                <input
                  type="text"
                  value={checkerVersion}
                  onChange={e => { setCheckerVersion(e.target.value); setCheckerResult(null); }}
                  placeholder="e.g. v0.0.3"
                  className="w-full bg-background border border-border text-foreground px-3 py-2 font-body text-sm focus:outline-none focus:border-foreground/30"
                />
              </div>
              <div className="flex items-end">
                <button onClick={handleCheck} className="bg-foreground text-background font-display text-[13px] tracking-[0.12em] uppercase font-bold px-5 py-2 hover:opacity-90 transition-opacity">
                  Check
                </button>
              </div>
            </div>
            {checkerResult && (
              <div className="mt-4">
                {checkerResult.upToDate ? (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Check size={14} /> <span className="font-body text-sm">You are on the latest version.</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 text-amber-400 mb-3">
                      <AlertTriangle size={14} />
                      <span className="font-body text-sm">{checkerResult.updates.length} update{checkerResult.updates.length > 1 ? "s" : ""} available</span>
                    </div>
                    <div className="space-y-2">
                      {checkerResult.updates.map(u => (
                        <div key={u.id} className="flex items-center gap-3 font-body text-sm text-foreground/60">
                          <code className="text-[13px] bg-foreground/5 px-1.5 py-0.5">{u.version}</code>
                          <span>{formatDate(u.release_date)}</span>
                          <span className={`text-[14px] px-1.5 py-0.5 uppercase tracking-wider ${changeTypeBadge(u.change_type)}`}>{u.change_type}</span>
                          <span className="text-foreground/65">{u.summary}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {CATEGORY_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setCategoryFilter(f)}
                className={`font-body text-[14px] tracking-[0.12em] uppercase px-3 py-1.5 border transition-colors ${
                  categoryFilter === f ? "border-[#c8a961] text-[#c8a961] bg-[#c8a961]/10" : "border-border text-foreground/65 hover:text-foreground/60"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-10">
            {CHANGE_TYPES.map(f => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`font-body text-[14px] tracking-[0.12em] uppercase px-3 py-1.5 border transition-colors ${
                  typeFilter === f ? "border-foreground/40 text-foreground bg-foreground/5" : "border-border text-foreground/65 hover:text-foreground/60"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Release log */}
          {grouped.map(([date, items]) => (
            <div key={date} className="mb-12">
              <div className="flex items-baseline gap-3 mb-4">
                <h3 className="font-display text-xl font-bold">{formatDate(date)}</h3>
                <span className="font-body text-[13px] text-foreground/70">{items.length} release{items.length > 1 ? "s" : ""}</span>
              </div>
              <div className="space-y-3">
                {items.map(r => (
                  <div key={r.id} className="border border-border p-4">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-display text-sm font-bold">{r.agent_name}</span>
                      <code className="text-[13px] bg-foreground/5 px-1.5 py-0.5 text-foreground/60">{r.version}</code>
                      <span className={`text-[14px] px-1.5 py-0.5 uppercase tracking-wider ${changeTypeBadge(r.change_type)}`}>{r.change_type}</span>
                      <span className={`text-[14px] px-1.5 py-0.5 uppercase tracking-wider ${complexityBadge(r.upgrade_complexity)}`}>{r.upgrade_complexity}</span>
                      {r.download_url && (
                        <a href={r.download_url} target="_blank" rel="noopener noreferrer" className="ml-auto font-body text-[14px] tracking-[0.1em] uppercase text-[#c8a961] hover:text-[#c8a961]/70 transition-colors">
                          Get Latest Version →
                        </a>
                      )}
                    </div>
                    <p className="font-body text-sm text-foreground/60 mb-2">{r.summary}</p>
                    {r.changes && (
                      <button
                        onClick={() => toggleSet(expandedChanges, r.id, setExpandedChanges)}
                        className="font-body text-[13px] tracking-[0.1em] uppercase text-foreground/70 hover:text-foreground/50 transition-colors flex items-center gap-1"
                      >
                        <ChevronDown size={12} className={expandedChanges.has(r.id) ? "rotate-180" : ""} />
                        Show all changes
                      </button>
                    )}
                    {expandedChanges.has(r.id) && r.changes && (
                      <div className="mt-3 pl-4 border-l border-border prose prose-invert prose-sm max-w-none text-foreground/50">
                        <ReactMarkdown>{r.changes}</ReactMarkdown>
                      </div>
                    )}
                    {(r.upgrade_complexity === "setup-required" || r.upgrade_complexity === "breaking") && r.upgrade_instructions && (
                      <>
                        <button
                          onClick={() => toggleSet(expandedUpgrade, r.id, setExpandedUpgrade)}
                          className="mt-2 font-body text-[13px] tracking-[0.1em] uppercase text-amber-400/60 hover:text-amber-400 transition-colors flex items-center gap-1"
                        >
                          <ChevronDown size={12} className={expandedUpgrade.has(r.id) ? "rotate-180" : ""} />
                          Upgrade instructions
                        </button>
                        {expandedUpgrade.has(r.id) && (
                          <div className="mt-3 pl-4 border-l border-amber-500/30 prose prose-invert prose-sm max-w-none text-foreground/50">
                            <ReactMarkdown>{r.upgrade_instructions}</ReactMarkdown>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {grouped.length === 0 && (
            <p className="font-body text-foreground/70 text-center py-12">No releases match your filters.</p>
          )}
        </div>
      </main>
    </>
  );
}
