import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { adminWrite } from "@/lib/adminWrite";
import { type AgentConfig } from "../agentRegistry";

export interface SetupField {
  key: string;
  label: string;
  type: "text" | "password" | "textarea" | "select";
  placeholder?: string;
  hint?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
}

/** Default setup fields for agents that don't have specific ones */
const DEFAULT_FIELDS: SetupField[] = [
  { key: "site_url", label: "Site URL", type: "text", placeholder: "https://yoursite.com", required: true },
];

/** Per-agent setup field overrides keyed by agent slug */
export const AGENT_SETUP_FIELDS: Record<string, SetupField[]> = {
  blogger: [
    { key: "site_url", label: "Site URL", type: "text", placeholder: "https://yoursite.com" },
  ],
  seo: [
    { key: "site_url", label: "Site URL", type: "text", placeholder: "https://yoursite.com", required: true },
    { key: "business_description", label: "Business Description", type: "textarea", placeholder: "Describe your business in 1-2 sentences", required: true },
    { key: "target_keywords", label: "Target Keywords", type: "textarea", placeholder: "keyword1, keyword2, keyword3", required: true, hint: "Comma-separated list of keywords to target" },
    { key: "competitors", label: "Competitors", type: "text", placeholder: "competitor1.com, competitor2.com" },
    { key: "publishing_frequency", label: "Posts per Day", type: "select", options: [
      { value: "1", label: "1 per day" }, { value: "2", label: "2 per day" }, { value: "3", label: "3 per day" },
    ]},
  ],
  geo: [
    { key: "site_url", label: "Site URL", type: "text", placeholder: "https://yoursite.com", required: true },
    { key: "brand_name", label: "Brand Name", type: "text", placeholder: "Your brand name", required: true },
    { key: "business_description", label: "Business Description", type: "textarea", placeholder: "What does your business do?", required: true },
    { key: "target_audience", label: "Target Audience", type: "text", placeholder: "Founders, marketers, developers…", required: true },
    { key: "competitors", label: "Competitors", type: "text", placeholder: "competitor1.com, competitor2.com", required: true },
    { key: "niche_topics", label: "Niche Topics", type: "textarea", placeholder: "Topics relevant to your niche" },
  ],
  voice: [
    { key: "elevenlabs_api_key", label: "ElevenLabs API Key", type: "password", placeholder: "sk-...", required: true, hint: "Get this from elevenlabs.io/app/settings" },
    { key: "voice_id", label: "Voice ID", type: "text", placeholder: "ElevenLabs Voice ID", required: true, hint: "Find in the ElevenLabs voice library" },
    { key: "podcast_title", label: "Podcast Title", type: "text", placeholder: "My Podcast", required: true },
    { key: "podcast_description", label: "Podcast Description", type: "textarea", placeholder: "A brief description of your podcast" },
    { key: "podcast_author", label: "Author Name", type: "text", placeholder: "Your name" },
    { key: "site_url", label: "Site URL", type: "text", placeholder: "https://yoursite.com", required: true },
  ],
  stream: [
    { key: "twitch_client_id", label: "Twitch Client ID", type: "text", placeholder: "Your Twitch Client ID", required: true, hint: "Get this at dev.twitch.tv/console" },
    { key: "twitch_client_secret", label: "Twitch Client Secret", type: "password", placeholder: "Your Twitch Client Secret", required: true },
    { key: "twitch_username", label: "Twitch Username", type: "text", placeholder: "Your Twitch channel username", required: true },
    { key: "business_name", label: "Business Name", type: "text", placeholder: "Your brand or channel name" },
    { key: "content_niche", label: "Content Niche", type: "text", placeholder: "gaming, music, creative…", hint: "What kind of content do you stream?" },
    { key: "site_url", label: "Site URL", type: "text", placeholder: "https://yoursite.com" },
  ],
  granola: [
    { key: "brand_name", label: "Brand Name", type: "text", placeholder: "Your brand name", required: true },
    { key: "site_url", label: "Site URL", type: "text", placeholder: "https://yoursite.com", required: true },
    { key: "slack_webhook_url", label: "Slack Webhook URL", type: "text", placeholder: "https://hooks.slack.com/…", hint: "For meeting summary notifications" },
  ],
  security: [
    { key: "aikido_project_id", label: "Aikido Project ID", type: "text", placeholder: "Your Aikido project ID", required: true },
    { key: "site_url", label: "Site URL", type: "text", placeholder: "https://yoursite.com", required: true },
  ],
  youtube: [
    { key: "youtube_channel_id", label: "YouTube Channel ID", type: "text", placeholder: "UC…", required: true, hint: "Find in your YouTube channel URL" },
    { key: "site_url", label: "Site URL", type: "text", placeholder: "https://yoursite.com" },
  ],
  pay: [
    { key: "stripe_secret_key", label: "Stripe Secret Key", type: "password", placeholder: "sk_live_…", required: true },
    { key: "site_url", label: "Site URL", type: "text", placeholder: "https://yoursite.com" },
  ],
  mail: [
    { key: "resend_api_key", label: "Resend API Key", type: "password", placeholder: "re_…", required: true },
    { key: "site_url", label: "Site URL", type: "text", placeholder: "https://yoursite.com" },
  ],
  sms: [
    { key: "twilio_account_sid", label: "Twilio Account SID", type: "text", placeholder: "AC…", required: true },
    { key: "site_url", label: "Site URL", type: "text", placeholder: "https://yoursite.com" },
  ],
  gitlab: [
    { key: "gitlab_url", label: "GitLab URL", type: "text", placeholder: "https://gitlab.com/your-org", required: true },
    { key: "gitlab_token", label: "GitLab Token", type: "password", placeholder: "glpat-…", required: true },
  ],
  linear: [
    { key: "linear_api_key", label: "Linear API Key", type: "password", placeholder: "lin_api_…", required: true },
  ],
  contentful: [
    { key: "contentful_space_id", label: "Contentful Space ID", type: "text", placeholder: "Your space ID", required: true },
  ],
  watch: [
    { key: "github_token", label: "GitHub Token", type: "password", placeholder: "ghp_…", required: true },
    { key: "github_repo", label: "GitHub Repo", type: "text", placeholder: "owner/repo", required: true },
  ],
  fix: [
    { key: "github_token", label: "GitHub Token", type: "password", placeholder: "ghp_…", required: true },
    { key: "github_repo", label: "GitHub Repo", type: "text", placeholder: "owner/repo", required: true },
  ],
  build: [
    { key: "github_token", label: "GitHub Token", type: "password", placeholder: "ghp_…", required: true },
    { key: "github_repo", label: "GitHub Repo", type: "text", placeholder: "owner/repo", required: true },
  ],
  agents: [
    { key: "github_token", label: "GitHub Token", type: "password", placeholder: "ghp_…", required: true },
    { key: "github_repo", label: "GitHub Repo", type: "text", placeholder: "owner/repo", required: true },
  ],
};

function getSetupFields(agent: AgentConfig): SetupField[] {
  return AGENT_SETUP_FIELDS[agent.slug] || DEFAULT_FIELDS;
}

interface Props {
  agent: AgentConfig;
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function AgentSetupWizard({ agent, open, onClose, onComplete }: Props) {
  const fields = getSetupFields(agent);
  const [form, setForm] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    fields.forEach((f) => {
      initial[f.key] = f.options?.[0]?.value ?? "";
    });
    return initial;
  });
  const [loading, setLoading] = useState(false);

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const missing = fields.filter((f) => f.required && !form[f.key]?.trim());
    if (missing.length > 0) {
      toast.error(`Please fill in: ${missing.map((f) => f.label).join(", ")}`);
      return;
    }

    setLoading(true);
    try {
      // Build data payload — include setup_complete and is_running
      const data: Record<string, any> = { ...form, setup_complete: true, is_running: true };

      // Check if row already exists (upsert)
      const { data: existing } = await adminWrite({ table: agent.settingsTable, operation: "select" }) as { data: any[] | null };

      if (existing && existing.length > 0) {
        await adminWrite({
          table: agent.settingsTable,
          operation: "update",
          data,
          match: { id: existing[0].id },
        });
      } else {
        await adminWrite({
          table: agent.settingsTable,
          operation: "insert",
          data,
        });
      }

      toast.success(`${agent.label} is now active`);
      onComplete();
      onClose();
    } catch (err: any) {
      toast.error(`Setup failed — ${err?.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-lg border-[#f0ead6]/10 bg-[#0a0a08] text-[#f0ead6]"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-[0.05em] uppercase text-[#f0ead6]">
            Set up {agent.label}
          </DialogTitle>
          <p className="text-[13px] text-[#f0ead6]/50 mt-1">{agent.subtitle}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#f0ead6]/50 block mb-1.5">
                {field.label}{field.required && " *"}
              </label>

              {field.type === "select" && field.options ? (
                <select
                  value={form[field.key] || ""}
                  onChange={(e) => set(field.key, e.target.value)}
                  className="w-full bg-transparent border border-[#f0ead6]/15 text-[#f0ead6] text-[13px] px-3 py-2.5 focus:outline-none focus:border-[#c9a84c]/50 transition-colors"
                >
                  {field.options.map((o) => (
                    <option key={o.value} value={o.value} className="bg-[#0a0a08]">{o.label}</option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  value={form[field.key] || ""}
                  onChange={(e) => set(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={3}
                  className="w-full bg-transparent border border-[#f0ead6]/15 text-[#f0ead6] text-[13px] px-3 py-2.5 placeholder:text-[#f0ead6]/25 focus:outline-none focus:border-[#c9a84c]/50 transition-colors resize-none"
                />
              ) : (
                <input
                  type={field.type}
                  value={form[field.key] || ""}
                  onChange={(e) => set(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full bg-transparent border border-[#f0ead6]/15 text-[#f0ead6] text-[13px] px-3 py-2.5 placeholder:text-[#f0ead6]/25 focus:outline-none focus:border-[#c9a84c]/50 transition-colors"
                />
              )}

              {field.hint && (
                <p className="text-[10px] text-[#f0ead6]/30 mt-1">{field.hint}</p>
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-[#c9a84c] text-[#0a0a08] text-[12px] font-bold tracking-[0.1em] uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={14} className="animate-spin" /> Activating…
                </span>
              ) : (
                `Activate ${agent.label} →`
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 border border-[#f0ead6]/15 text-[#f0ead6]/50 text-[12px] font-bold tracking-[0.1em] uppercase hover:text-[#f0ead6] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
