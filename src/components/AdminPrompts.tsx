import { useState, useEffect, useCallback } from "react";
import { Copy, Check, ChevronDown, ChevronRight, Pencil, History, Save, X, Github } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { savePromptVersion, type PromptVersion } from "@/hooks/usePrompt";
import { frequencyTiers } from "@/components/lazy-blogger/frequencyData";

async function syncToGitHub(product: string, version: string, promptText: string, allPrompts?: { product: string; version: string; prompt_text: string }[]) {
  try {
    const { data, error } = await supabase.functions.invoke("sync-prompts-github", {
      body: { product, version, prompt_text: promptText, all_prompts: allPrompts || [] },
    });
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error("GitHub sync failed:", err);
    return { success: false, error: err };
  }
}

const PRODUCTS = [
  // Unicorn
  { key: "lazy-run", label: "🚀 Lazy Run" },
  { key: "lazy-admin", label: "📊 Lazy Admin" },
  // Content
  { key: "lazy-blogger", label: "🤖 Lazy Blogger" },
  { key: "lazy-seo", label: "🔍 Lazy SEO" },
  { key: "lazy-geo", label: "🧠 Lazy GEO" },
  { key: "lazy-crawl", label: "🕷️ Lazy Crawl" },
  { key: "lazy-perplexity", label: "🔬 Lazy Perplexity" },
  // Commerce
  { key: "lazy-store", label: "🏪 Lazy Store" },
  { key: "lazy-pay", label: "💳 Lazy Pay" },
  { key: "lazy-sms", label: "💬 Lazy SMS" },
  // Media
  { key: "lazy-voice", label: "🎙️ Lazy Voice" },
  { key: "lazy-stream", label: "🎮 Lazy Stream" },
  // Dev
  { key: "lazy-code", label: "🐙 Lazy GitHub" },
  { key: "lazy-gitlab", label: "🦊 Lazy GitLab" },
  { key: "lazy-linear", label: "📋 Lazy Linear" },
  // Channels
  { key: "lazy-mail", label: "📧 Lazy Mail" },
  { key: "lazy-alert", label: "🔔 Lazy Alert" },
  { key: "lazy-telegram", label: "✈️ Lazy Telegram" },
  { key: "lazy-contentful", label: "📦 Lazy Contentful" },
  { key: "lazy-supabase", label: "⚡ Lazy Supabase" },
  // Shield
  { key: "lazy-security", label: "🛡️ Lazy Security" },
  { key: "lazy-auth", label: "🔐 Lazy Auth" },
  { key: "lazy-design", label: "🎨 Lazy Design" },
] as const;

/* ── Helpers ── */

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Prompt copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };
  return (
    <button
      onClick={(e) => { e.stopPropagation(); handleCopy(); }}
      className="inline-flex items-center gap-1.5 font-body text-xs px-3 py-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors shrink-0"
    >
      {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> {label}</>}
    </button>
  );
}

function bumpVersion(version: string): string {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) return "0.0.2";
  return `${match[1]}.${match[2]}.${parseInt(match[3]) + 1}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/* ── Prompt Editor Block ── */

function PromptEditor({
  product,
  current,
  history,
  onSaved,
}: {
  product: typeof PRODUCTS[number];
  current: PromptVersion | null;
  history: PromptVersion[];
  onSaved: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(current?.prompt_text || "");
  const [saving, setSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => { if (current && !editing) setDraft(current.prompt_text); }, [current, editing]);

  const handleSave = async () => {
    if (!current || draft === current.prompt_text) { setEditing(false); return; }
    setSaving(true);
    const newVersion = bumpVersion(current.version);
    const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    // Update the version header in the prompt text
    let updatedText = draft.replace(
      /\[.*?Prompt — v?[\d.]+ — .*?\]/,
      `[${product.label.replace(/^[^\w]*/, "").trim()} Prompt — v${newVersion} — ${today}]`
    );
    const { error } = await savePromptVersion(product.key, updatedText, newVersion);
    setSaving(false);
    if (error) { toast.error("Failed to save"); return; }
    toast.success(`${product.label} prompt updated to ${newVersion}`);
    setEditing(false);
    onSaved();
  };

  // For blogger, show frequency variants
  const isBlogger = product.key === "lazy-blogger";

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          {expanded ? <ChevronDown size={14} className="text-muted-foreground" /> : <ChevronRight size={14} className="text-muted-foreground" />}
          <span className="font-display text-sm font-bold text-foreground">{product.label}</span>
          {current && (
            <span className="font-body text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {current.version} — {formatDate(current.created_at)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {current && <CopyButton text={current.prompt_text} />}
          {!editing && (
            <button
              onClick={() => { setEditing(true); setExpanded(true); }}
              className="inline-flex items-center gap-1 font-body text-xs px-3 py-1.5 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors"
            >
              <Pencil size={12} /> Edit
            </button>
          )}
          {history.length > 1 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="inline-flex items-center gap-1 font-body text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              <History size={12} /> {history.length - 1} prev
            </button>
          )}
        </div>
      </div>

      {/* Edit mode */}
      {editing && expanded && (
        <div className="px-4 pb-4 border-t border-border space-y-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={20}
            className="w-full font-body text-xs bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary resize-y mt-3 leading-relaxed"
          />
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-1 font-body text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50">
              <Save size={12} /> {saving ? "Saving…" : "Save New Version"}
            </button>
            <button onClick={() => { setEditing(false); setDraft(current?.prompt_text || ""); }} className="inline-flex items-center gap-1 font-body text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80">
              <X size={12} /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Read mode */}
      {!editing && expanded && current && (
        <div className="px-4 pb-4 border-t border-border">
          {isBlogger && (
            <p className="font-body text-xs text-muted-foreground mt-3 mb-2">
              This is the base template. The <code className="text-primary">{"{{FREQUENCY_SCHEDULE}}"}</code> placeholder is replaced per tier ({frequencyTiers.map(t => `${t.postsPerDay}/day`).join(", ")}).
            </p>
          )}
          <pre className="font-body text-xs text-foreground/80 whitespace-pre-wrap leading-relaxed mt-3 max-h-[400px] overflow-y-auto">
            {current.prompt_text}
          </pre>
        </div>
      )}

      {/* Version History */}
      {showHistory && (
        <div className="px-4 pb-4 border-t border-border">
          <h4 className="font-display text-xs font-bold text-muted-foreground mt-3 mb-2 uppercase tracking-wider">Version History</h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {history.map((v) => (
              <div key={v.id} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className={`font-body text-xs font-medium ${v.is_current ? "text-primary" : "text-muted-foreground"}`}>
                    {v.version}
                  </span>
                  <span className="font-body text-[13px] text-muted-foreground">{formatDate(v.created_at)}</span>
                  {v.is_current && <span className="font-body text-[13px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">current</span>}
                </div>
                <CopyButton text={v.prompt_text} label="Copy" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main component ── */

const AdminPrompts = () => {
  const [allVersions, setAllVersions] = useState<PromptVersion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("prompt_versions")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setAllVersions(data as PromptVersion[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  if (loading) return <p className="font-body text-sm text-muted-foreground py-8 text-center">Loading prompts…</p>;

  return (
    <div className="space-y-6">
      <p className="font-body text-sm text-muted-foreground">
        Current prompts shipped on each product page. Edit here → changes go live instantly. Full version history tracked.
      </p>

      {PRODUCTS.map((product) => {
        const productVersions = allVersions.filter(v => v.product === product.key);
        const current = productVersions.find(v => v.is_current) || null;
        return (
          <PromptEditor
            key={product.key}
            product={product}
            current={current}
            history={productVersions}
            onSaved={fetchAll}
          />
        );
      })}
    </div>
  );
};

export default AdminPrompts;
