import { useState } from "react";
import { Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { adminWrite } from "@/lib/adminWrite";
import { type AgentConfig } from "../agentRegistry";

export interface SetupField {
  key: string;
  label: string;
  type: "text" | "password" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  instructions?: { steps: string[]; link?: { url: string; label: string } };
}

const DEFAULT_FIELDS: SetupField[] = [
  { key: "site_url", label: "Site URL", type: "text", placeholder: "https://yoursite.com", required: true },
];

export const AGENT_SETUP_FIELDS: Record<string, SetupField[]> = {
  blogger: [
    { key: "site_url", label: "Site URL", type: "text", placeholder: "https://yoursite.com" },
  ],
  seo: [
    { key: "site_url", label: "Site URL", type: "text", placeholder: "https://yoursite.com", required: true },
    { key: "business_description", label: "Business Description", type: "textarea", placeholder: "Describe your business in 1-2 sentences", required: true,
      instructions: { steps: ["Write 1-2 sentences about what your business does", "Include your main product or service and target market"] } },
    { key: "target_keywords", label: "Target Keywords", type: "textarea", placeholder: "keyword1, keyword2, keyword3", required: true,
      instructions: { steps: ["List 5-10 keywords you want to rank for", "Separate with commas", "Mix broad and long-tail keywords"] } },
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
    { key: "elevenlabs_api_key", label: "ElevenLabs API Key", type: "password", placeholder: "sk-...", required: true,
      instructions: {
        steps: ["Sign in to your ElevenLabs account", "Go to Profile → API Keys", "Click Create API Key and copy it"],
        link: { url: "https://elevenlabs.io/app/settings/api-keys", label: "Open ElevenLabs API Keys" },
      } },
    { key: "voice_id", label: "Voice ID", type: "text", placeholder: "ElevenLabs Voice ID", required: true,
      instructions: {
        steps: ["Go to the ElevenLabs Voice Library", "Select or create a voice", "Copy the Voice ID from the voice settings"],
        link: { url: "https://elevenlabs.io/app/voice-library", label: "Open Voice Library" },
      } },
    { key: "podcast_title", label: "Podcast Title", type: "text", placeholder: "My Podcast", required: true },
    { key: "podcast_description", label: "Podcast Description", type: "textarea", placeholder: "A brief description of your podcast" },
    { key: "podcast_author", label: "Author Name", type: "text", placeholder: "Your name" },
    { key: "site_url", label: "Site URL", type: "text", placeholder: "https://yoursite.com", required: true },
  ],
  stream: [
    { key: "twitch_client_id", label: "Twitch Client ID", type: "text", placeholder: "Your Twitch Client ID", required: true,
      instructions: {
        steps: ["Go to the Twitch Developer Console", "Click Register Your Application", "Set OAuth Redirect to http://localhost", "Copy the Client ID"],
        link: { url: "https://dev.twitch.tv/console/apps", label: "Open Twitch Dev Console" },
      } },
    { key: "twitch_client_secret", label: "Twitch Client Secret", type: "password", placeholder: "Your Twitch Client Secret", required: true,
      instructions: { steps: ["On the same Twitch app page", "Click New Secret", "Copy the generated secret immediately — it won't be shown again"] } },
    { key: "twitch_username", label: "Twitch Username", type: "text", placeholder: "Your Twitch channel username", required: true,
      instructions: { steps: ["Your exact Twitch channel name (case-sensitive)", "This is the name in your channel URL: twitch.tv/username"] } },
    { key: "business_name", label: "Business Name", type: "text", placeholder: "Your brand or channel name" },
    { key: "content_niche", label: "Content Niche", type: "text", placeholder: "gaming, music, creative…" },
    { key: "site_url", label: "Site URL", type: "text", placeholder: "https://yoursite.com" },
  ],
  granola: [
    { key: "brand_name", label: "Brand Name", type: "text", placeholder: "Your brand name", required: true },
    { key: "site_url", label: "Site URL", type: "text", placeholder: "https://yoursite.com", required: true },
    { key: "slack_webhook_url", label: "Slack Webhook URL", type: "text", placeholder: "https://hooks.slack.com/…",
      instructions: {
        steps: ["Go to api.slack.com/apps", "Select or create an app", "Go to Incoming Webhooks → Activate", "Click Add New Webhook to Workspace", "Copy the webhook URL"],
        link: { url: "https://api.slack.com/apps", label: "Open Slack Apps" },
      } },
  ],
  security: [
    { key: "aikido_project_id", label: "Aikido Project ID", type: "text", placeholder: "Your Aikido project ID", required: true,
      instructions: {
        steps: ["Sign in to your Aikido Security dashboard", "Go to Settings → General", "Copy the Project ID from the project info section"],
        link: { url: "https://app.aikido.dev/settings/general", label: "Open Aikido Settings" },
      } },
    { key: "site_url", label: "Site URL", type: "text", placeholder: "https://yoursite.com", required: true },
  ],
  youtube: [
    { key: "youtube_channel_id", label: "YouTube Channel ID", type: "text", placeholder: "UC…", required: true,
      instructions: {
        steps: ["Go to your YouTube channel page", "Click your profile icon → Your channel", "The Channel ID is in the URL: youtube.com/channel/UC…", "Or find it in YouTube Studio → Settings → Channel → Advanced"],
        link: { url: "https://studio.youtube.com/channel", label: "Open YouTube Studio" },
      } },
    { key: "site_url", label: "Site URL", type: "text", placeholder: "https://yoursite.com" },
  ],
  pay: [
    { key: "stripe_secret_key", label: "Stripe Secret Key", type: "password", placeholder: "sk_live_…", required: true,
      instructions: {
        steps: ["Sign in to the Stripe Dashboard", "Go to Developers → API Keys", "Copy the Secret key (starts with sk_live_ or sk_test_)"],
        link: { url: "https://dashboard.stripe.com/apikeys", label: "Open Stripe API Keys" },
      } },
    { key: "site_url", label: "Site URL", type: "text", placeholder: "https://yoursite.com" },
  ],
  mail: [
    { key: "resend_api_key", label: "Resend API Key", type: "password", placeholder: "re_…", required: true,
      instructions: {
        steps: ["Sign in to your Resend dashboard", "Go to API Keys in the sidebar", "Click Create API Key", "Copy the key (starts with re_)"],
        link: { url: "https://resend.com/api-keys", label: "Open Resend API Keys" },
      } },
    { key: "site_url", label: "Site URL", type: "text", placeholder: "https://yoursite.com" },
  ],
  sms: [
    { key: "twilio_account_sid", label: "Twilio Account SID", type: "text", placeholder: "AC…", required: true,
      instructions: {
        steps: ["Sign in to the Twilio Console", "Your Account SID is shown on the dashboard home page", "It starts with AC"],
        link: { url: "https://console.twilio.com", label: "Open Twilio Console" },
      } },
    { key: "site_url", label: "Site URL", type: "text", placeholder: "https://yoursite.com" },
  ],
  gitlab: [
    { key: "gitlab_url", label: "GitLab URL", type: "text", placeholder: "https://gitlab.com/your-org", required: true,
      instructions: { steps: ["Your GitLab instance URL", "For GitLab.com use https://gitlab.com/your-group"] } },
    { key: "gitlab_token", label: "GitLab Token", type: "password", placeholder: "glpat-…", required: true,
      instructions: {
        steps: ["Go to GitLab → Preferences → Access Tokens", "Create a token with api and read_repository scopes", "Copy the token (starts with glpat-)"],
        link: { url: "https://gitlab.com/-/user_settings/personal_access_tokens", label: "Create GitLab Token" },
      } },
  ],
  linear: [
    { key: "linear_api_key", label: "Linear API Key", type: "password", placeholder: "lin_api_…", required: true,
      instructions: {
        steps: ["Go to Linear → Settings → API", "Click Create Key under Personal API Keys", "Copy the key (starts with lin_api_)"],
        link: { url: "https://linear.app/settings/api", label: "Open Linear API Settings" },
      } },
  ],
  contentful: [
    { key: "contentful_space_id", label: "Contentful Space ID", type: "text", placeholder: "Your space ID", required: true,
      instructions: {
        steps: ["Go to Contentful → Settings → General Settings", "Copy the Space ID shown at the top"],
        link: { url: "https://app.contentful.com", label: "Open Contentful" },
      } },
  ],
  watch: [
    { key: "github_token", label: "GitHub Token", type: "password", placeholder: "ghp_…", required: true,
      instructions: {
        steps: ["Go to GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens", "Click Generate new token", "Select repo scope", "Copy the token"],
        link: { url: "https://github.com/settings/tokens?type=beta", label: "Create GitHub Token" },
      } },
    { key: "github_repo", label: "GitHub Repo", type: "text", placeholder: "owner/repo", required: true,
      instructions: { steps: ["Enter as owner/repo format", "Example: lazyunicorn/lazy-engine"] } },
  ],
  fix: [
    { key: "github_token", label: "GitHub Token", type: "password", placeholder: "ghp_…", required: true,
      instructions: {
        steps: ["Go to GitHub → Settings → Developer settings → Personal access tokens", "Generate a token with repo scope"],
        link: { url: "https://github.com/settings/tokens?type=beta", label: "Create GitHub Token" },
      } },
    { key: "github_repo", label: "GitHub Repo", type: "text", placeholder: "owner/repo", required: true,
      instructions: { steps: ["Enter as owner/repo format", "Example: lazyunicorn/lazy-engine"] } },
  ],
  build: [
    { key: "github_token", label: "GitHub Token", type: "password", placeholder: "ghp_…", required: true,
      instructions: {
        steps: ["Go to GitHub → Settings → Developer settings → Personal access tokens", "Generate a token with repo scope"],
        link: { url: "https://github.com/settings/tokens?type=beta", label: "Create GitHub Token" },
      } },
    { key: "github_repo", label: "GitHub Repo", type: "text", placeholder: "owner/repo", required: true,
      instructions: { steps: ["Enter as owner/repo format", "Example: lazyunicorn/lazy-engine"] } },
  ],
  agents: [
    { key: "github_token", label: "GitHub Token", type: "password", placeholder: "ghp_…", required: true,
      instructions: {
        steps: ["Go to GitHub → Settings → Developer settings → Personal access tokens", "Generate a token with repo scope"],
        link: { url: "https://github.com/settings/tokens?type=beta", label: "Create GitHub Token" },
      } },
    { key: "github_repo", label: "GitHub Repo", type: "text", placeholder: "owner/repo", required: true,
      instructions: { steps: ["Enter as owner/repo format", "Example: lazyunicorn/lazy-engine"] } },
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
  const [activeField, setActiveField] = useState<string | null>(fields[0]?.key ?? null);

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const activeInstructions = fields.find((f) => f.key === activeField)?.instructions;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missing = fields.filter((f) => f.required && !form[f.key]?.trim());
    if (missing.length > 0) {
      toast.error(`Please fill in: ${missing.map((f) => f.label).join(", ")}`);
      return;
    }

    setLoading(true);
    try {
      const data: Record<string, any> = { ...form, setup_complete: true, is_running: true };
      const { data: existing } = await adminWrite({ table: agent.settingsTable, operation: "select" }) as { data: any[] | null };

      if (existing && existing.length > 0) {
        await adminWrite({ table: agent.settingsTable, operation: "update", data, match: { id: existing[0].id } });
      } else {
        await adminWrite({ table: agent.settingsTable, operation: "insert", data });
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

  const hasAnyInstructions = fields.some((f) => f.instructions);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className={`border-border bg-background text-foreground ${hasAnyInstructions ? "max-w-3xl" : "max-w-lg"}`}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-[0.05em] uppercase text-foreground">
            Set up {agent.label}
          </DialogTitle>
          <p className="text-[13px] text-foreground/50 mt-1">{agent.subtitle}</p>
        </DialogHeader>

        <div className={`mt-2 ${hasAnyInstructions ? "grid grid-cols-[1fr_260px] gap-6" : ""}`}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground block mb-1.5">
                  {field.label}{field.required && " *"}
                </label>

                {field.type === "select" && field.options ? (
                  <select
                    value={form[field.key] || ""}
                    onChange={(e) => set(field.key, e.target.value)}
                    onFocus={() => setActiveField(field.key)}
                    className="w-full bg-transparent border border-border text-foreground text-[13px] px-3 py-2.5 focus:outline-none focus:border-primary/50 transition-colors"
                  >
                    {field.options.map((o) => (
                      <option key={o.value} value={o.value} className="bg-background">{o.label}</option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    value={form[field.key] || ""}
                    onChange={(e) => set(field.key, e.target.value)}
                    onFocus={() => setActiveField(field.key)}
                    placeholder={field.placeholder}
                    rows={3}
                    className="w-full bg-transparent border border-border text-foreground text-[13px] px-3 py-2.5 placeholder:text-foreground/25 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  />
                ) : (
                  <input
                    type={field.type}
                    value={form[field.key] || ""}
                    onChange={(e) => set(field.key, e.target.value)}
                    onFocus={() => setActiveField(field.key)}
                    placeholder={field.placeholder}
                    className="w-full bg-transparent border border-border text-foreground text-[13px] px-3 py-2.5 placeholder:text-foreground/25 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                )}
              </div>
            ))}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-primary text-primary-foreground text-[12px] font-bold tracking-[0.1em] uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
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
                className="px-4 py-3 border border-border text-foreground/50 text-[12px] font-bold tracking-[0.1em] uppercase hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>

          {hasAnyInstructions && (
            <div className="border-l border-border pl-5 pt-1">
              {activeInstructions ? (
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary mb-3">
                    How to get this
                  </p>
                  <ol className="space-y-2">
                    {activeInstructions.steps.map((step, i) => (
                      <li key={i} className="flex gap-2 text-[12px] text-foreground/60 leading-relaxed">
                        <span className="text-primary/60 font-bold shrink-0">{i + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                  {activeInstructions.link && (
                    <a
                      href={activeInstructions.link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-4 px-3 py-2 text-[11px] font-bold tracking-[0.05em] text-primary border border-primary/30 hover:bg-primary/10 transition-colors"
                    >
                      <ExternalLink size={11} />
                      {activeInstructions.link.label}
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-[12px] text-muted-foreground italic">
                  Click a field for setup instructions
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
