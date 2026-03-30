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
  { key: "site_url", label: "Site URL", type: "text", placeholder: "https://yoursite.com", required: true,
    instructions: { steps: ["Enter the full URL of the website this agent will work with", "Include the protocol (https://)"] } },
];

/* ── Shared field helpers ── */
const siteUrlField = (hint?: string): SetupField => ({
  key: "site_url", label: "Site URL", type: "text", placeholder: "https://yoursite.com", required: true,
  instructions: { steps: [hint || "Enter the full URL of the website this agent will work with", "Include the protocol (https://)"] },
});

const brandNameField: SetupField = {
  key: "brand_name", label: "Brand Name", type: "text", placeholder: "Your brand name", required: true,
  instructions: { steps: ["Your company or product name", "Used in generated content and AI prompts"] },
};

const businessDescField: SetupField = {
  key: "business_description", label: "Business Description", type: "textarea", placeholder: "Describe your business in 1-2 sentences", required: true,
  instructions: { steps: ["Write 1-2 sentences about what your business does", "Include your main product or service and target market", "This is used as context for AI-generated content"] },
};

const githubTokenField: SetupField = {
  key: "github_token", label: "GitHub Token", type: "password", placeholder: "ghp_…", required: true,
  instructions: {
    steps: ["Go to GitHub → Settings → Developer settings", "Click Personal access tokens → Fine-grained tokens", "Click Generate new token", "Select the repo scope and copy the token"],
    link: { url: "https://github.com/settings/tokens?type=beta", label: "Create GitHub Token" },
  },
};

const githubRepoField: SetupField = {
  key: "github_repo", label: "GitHub Repo", type: "text", placeholder: "owner/repo", required: true,
  instructions: { steps: ["Enter as owner/repo format", "Example: lazyunicorn/lazy-engine", "This is the repository the agent will monitor or push to"] },
};

const competitorsField: SetupField = {
  key: "competitors", label: "Competitors", type: "text", placeholder: "competitor1.com, competitor2.com",
  instructions: { steps: ["List competitor domains, separated by commas", "The agent will analyse their content strategy", "3-5 competitors is ideal"] },
};

const contentNicheField: SetupField = {
  key: "content_niche", label: "Content Niche", type: "text", placeholder: "e.g. SaaS, fintech, AI tools…",
  instructions: { steps: ["Describe your content vertical in a few words", "Helps the agent stay on-topic when generating content"] },
};

const slackWebhookField: SetupField = {
  key: "slack_webhook_url", label: "Slack Webhook URL", type: "text", placeholder: "https://hooks.slack.com/…",
  instructions: {
    steps: ["Go to api.slack.com/apps and select your app", "Go to Incoming Webhooks → Activate", "Click Add New Webhook to Workspace", "Copy the webhook URL"],
    link: { url: "https://api.slack.com/apps", label: "Open Slack Apps" },
  },
};

export const AGENT_SETUP_FIELDS: Record<string, SetupField[]> = {
  // ── Content ──
  blogger: [
    siteUrlField("The site where blog posts will be published"),
    { key: "posts_per_day", label: "Posts per Day", type: "select", options: [
      { value: "1", label: "1 per day" }, { value: "2", label: "2 per day" }, { value: "3", label: "3 per day" }, { value: "5", label: "5 per day" },
    ], instructions: { steps: ["How many blog posts should the agent publish daily", "Start with 1 and increase once you're happy with quality"] } },
  ],
  seo: [
    siteUrlField("The site you want to rank higher in search results"),
    businessDescField,
    { key: "target_keywords", label: "Target Keywords", type: "textarea", placeholder: "keyword1, keyword2, keyword3", required: true,
      instructions: { steps: ["List 5-10 keywords you want to rank for", "Separate with commas", "Mix broad terms with long-tail phrases", "Example: 'AI automation, autonomous agents, lazy unicorn SaaS'"] } },
    competitorsField,
    { key: "publishing_frequency", label: "Posts per Day", type: "select", options: [
      { value: "1", label: "1 per day" }, { value: "2", label: "2 per day" }, { value: "3", label: "3 per day" },
    ], instructions: { steps: ["How many SEO-optimised posts to publish daily", "Each post targets a different keyword"] } },
  ],
  geo: [
    siteUrlField("The site you want AI search engines to cite"),
    brandNameField,
    businessDescField,
    { key: "target_audience", label: "Target Audience", type: "text", placeholder: "Founders, marketers, developers…", required: true,
      instructions: { steps: ["Who are you trying to reach?", "Be specific: 'B2B SaaS founders' is better than 'businesses'"] } },
    competitorsField,
    { key: "niche_topics", label: "Niche Topics", type: "textarea", placeholder: "Topics relevant to your niche",
      instructions: { steps: ["List topics the agent should write about", "These seed the AI query discovery engine", "Example: 'autonomous agents, prompt engineering, AI SEO'"] } },
  ],
  crawl: [
    siteUrlField("Your site URL for context"),
    { key: "target_urls", label: "Target URLs", type: "textarea", placeholder: "https://competitor1.com\nhttps://competitor2.com", required: true,
      instructions: { steps: ["Enter one URL per line", "These are the sites the crawler will monitor", "The agent extracts intel, leads, and content ideas from these pages"] } },
    { key: "crawl_depth", label: "Crawl Depth", type: "select", options: [
      { value: "1", label: "1 level (homepage only)" }, { value: "2", label: "2 levels" }, { value: "3", label: "3 levels (deep)" },
    ], instructions: { steps: ["How many link levels deep to crawl", "Level 1 = just the page, Level 3 = follows links two layers deep", "Deeper crawls take longer but find more intel"] } },
    contentNicheField,
  ],
  perplexity: [
    siteUrlField("Your site — used to check if AI search engines cite you"),
    brandNameField,
    { key: "research_topics", label: "Research Topics", type: "textarea", placeholder: "AI automation tools, best SaaS platforms…", required: true,
      instructions: { steps: ["Enter topics Perplexity should research for you", "One topic per line or comma-separated", "The agent will check if your brand appears in AI search results"] } },
    competitorsField,
  ],
  repurpose: [
    siteUrlField("The site where original content lives"),
    brandNameField,
    { key: "output_formats", label: "Output Formats", type: "text", placeholder: "twitter thread, linkedin post, newsletter",
      instructions: { steps: ["List the formats you want content repurposed into", "Separate with commas", "Supported: twitter thread, linkedin post, newsletter, summary, email"] } },
  ],
  trend: [
    siteUrlField("Your site for context"),
    brandNameField,
    contentNicheField,
    { key: "trend_sources", label: "Trend Sources", type: "text", placeholder: "hackernews, reddit, twitter",
      instructions: { steps: ["Which platforms should the agent monitor for trends", "Comma-separated list", "Discovered trends are seeded to SEO and GEO agents"] } },
  ],

  // ── Commerce ──
  store: [
    siteUrlField("Your e-commerce store URL"),
    brandNameField,
    { key: "platform", label: "Platform", type: "select", options: [
      { value: "shopify", label: "Shopify" }, { value: "woocommerce", label: "WooCommerce" }, { value: "other", label: "Other" },
    ], instructions: { steps: ["Select your e-commerce platform", "This determines how the agent syncs products"] } },
  ],
  drop: [
    siteUrlField("Your storefront URL"),
    { key: "autods_api_key", label: "AutoDS API Key", type: "password", placeholder: "Your AutoDS API key", required: true,
      instructions: {
        steps: ["Sign in to your AutoDS account", "Go to Settings → API", "Generate and copy your API key"],
        link: { url: "https://app.autods.com", label: "Open AutoDS" },
      } },
    brandNameField,
  ],
  print: [
    siteUrlField("Your storefront URL"),
    { key: "printful_api_key", label: "Printful API Key", type: "password", placeholder: "Your Printful API key", required: true,
      instructions: {
        steps: ["Sign in to your Printful dashboard", "Go to Settings → API", "Create a new API key and copy it"],
        link: { url: "https://www.printful.com/dashboard/developer/api-keys", label: "Open Printful API Keys" },
      } },
    brandNameField,
  ],
  pay: [
    { key: "stripe_secret_key", label: "Stripe Secret Key", type: "password", placeholder: "sk_live_…", required: true,
      instructions: {
        steps: ["Sign in to the Stripe Dashboard", "Go to Developers → API Keys", "Copy the Secret key (starts with sk_live_ or sk_test_)", "Use test keys for development, live keys for production"],
        link: { url: "https://dashboard.stripe.com/apikeys", label: "Open Stripe API Keys" },
      } },
    siteUrlField("Your site — used for checkout redirects"),
  ],
  mail: [
    { key: "resend_api_key", label: "Resend API Key", type: "password", placeholder: "re_…", required: true,
      instructions: {
        steps: ["Sign in to your Resend dashboard", "Go to API Keys in the sidebar", "Click Create API Key", "Copy the key (starts with re_)"],
        link: { url: "https://resend.com/api-keys", label: "Open Resend API Keys" },
      } },
    { key: "from_email", label: "From Email", type: "text", placeholder: "hello@yoursite.com",
      instructions: { steps: ["The email address campaigns will be sent from", "Must be verified in Resend → Domains"] } },
    siteUrlField("Your site URL for email links"),
  ],
  sms: [
    { key: "twilio_account_sid", label: "Twilio Account SID", type: "text", placeholder: "AC…", required: true,
      instructions: {
        steps: ["Sign in to the Twilio Console", "Your Account SID is on the dashboard home page", "It starts with AC"],
        link: { url: "https://console.twilio.com", label: "Open Twilio Console" },
      } },
    { key: "twilio_auth_token", label: "Twilio Auth Token", type: "password", placeholder: "Your auth token", required: true,
      instructions: { steps: ["On the same Twilio Console dashboard", "Click Show next to the Auth Token", "Copy the token"] } },
    { key: "twilio_phone_number", label: "Twilio Phone Number", type: "text", placeholder: "+1234567890",
      instructions: {
        steps: ["Go to Phone Numbers → Manage → Active Numbers", "Copy your Twilio phone number in E.164 format (+1…)"],
        link: { url: "https://console.twilio.com/us1/develop/phone-numbers/manage/incoming", label: "View Phone Numbers" },
      } },
  ],
  churn: [
    siteUrlField("Your app or SaaS URL"),
    brandNameField,
    { key: "churn_signals", label: "Churn Signals", type: "textarea", placeholder: "no login 7 days, subscription cancel page visit…",
      instructions: { steps: ["Describe behaviours that indicate a user might churn", "One signal per line", "The agent will monitor these and trigger retention actions"] } },
  ],

  // ── Media ──
  voice: [
    { key: "elevenlabs_api_key", label: "ElevenLabs API Key", type: "password", placeholder: "sk-...", required: true,
      instructions: {
        steps: ["Sign in to your ElevenLabs account", "Go to Profile → API Keys", "Click Create API Key and copy it"],
        link: { url: "https://elevenlabs.io/app/settings/api-keys", label: "Open ElevenLabs API Keys" },
      } },
    { key: "voice_id", label: "Voice ID", type: "text", placeholder: "ElevenLabs Voice ID", required: true,
      instructions: {
        steps: ["Go to the ElevenLabs Voice Library", "Select or create a voice", "Copy the Voice ID from the voice settings panel"],
        link: { url: "https://elevenlabs.io/app/voice-library", label: "Open Voice Library" },
      } },
    { key: "podcast_title", label: "Podcast Title", type: "text", placeholder: "My Podcast", required: true,
      instructions: { steps: ["The name of your audio podcast", "Appears in the RSS feed and podcast players"] } },
    { key: "podcast_description", label: "Podcast Description", type: "textarea", placeholder: "A brief description of your podcast",
      instructions: { steps: ["A short description of what your podcast covers", "Shown in podcast directories like Apple Podcasts and Spotify"] } },
    { key: "podcast_author", label: "Author Name", type: "text", placeholder: "Your name",
      instructions: { steps: ["The author name shown in podcast metadata", "Usually your name or brand name"] } },
    siteUrlField("Your site — used for podcast feed links"),
  ],
  stream: [
    { key: "twitch_client_id", label: "Twitch Client ID", type: "text", placeholder: "Your Twitch Client ID", required: true,
      instructions: {
        steps: ["Go to the Twitch Developer Console", "Click Register Your Application", "Set OAuth Redirect to http://localhost", "Copy the Client ID from the app details"],
        link: { url: "https://dev.twitch.tv/console/apps", label: "Open Twitch Dev Console" },
      } },
    { key: "twitch_client_secret", label: "Twitch Client Secret", type: "password", placeholder: "Your Twitch Client Secret", required: true,
      instructions: { steps: ["On the same Twitch app page", "Click New Secret", "Copy the generated secret immediately — it won't be shown again"] } },
    { key: "twitch_username", label: "Twitch Username", type: "text", placeholder: "Your Twitch channel username", required: true,
      instructions: { steps: ["Your exact Twitch channel name (case-sensitive)", "This is the name in your channel URL: twitch.tv/username"] } },
    { key: "business_name", label: "Business Name", type: "text", placeholder: "Your brand or channel name",
      instructions: { steps: ["Your channel brand name", "Used in generated recaps and content titles"] } },
    contentNicheField,
    siteUrlField("Where stream recaps will link back to"),
  ],
  youtube: [
    { key: "youtube_channel_id", label: "YouTube Channel ID", type: "text", placeholder: "UC…", required: true,
      instructions: {
        steps: ["Go to your YouTube channel page", "Click your profile icon → Your channel", "The Channel ID is in the URL: youtube.com/channel/UC…", "Or find it in YouTube Studio → Settings → Channel → Advanced"],
        link: { url: "https://studio.youtube.com/channel", label: "Open YouTube Studio" },
      } },
    siteUrlField("Your site — where repurposed video content will link to"),
  ],

  // ── Dev ──
  code: [
    githubTokenField,
    githubRepoField,
    { key: "branch", label: "Default Branch", type: "text", placeholder: "main",
      instructions: { steps: ["The branch to monitor for commits", "Usually 'main' or 'master'"] } },
  ],
  gitlab: [
    { key: "gitlab_url", label: "GitLab URL", type: "text", placeholder: "https://gitlab.com/your-org", required: true,
      instructions: { steps: ["Your GitLab instance URL", "For GitLab.com use https://gitlab.com", "For self-hosted, use your instance domain"] } },
    { key: "gitlab_token", label: "GitLab Token", type: "password", placeholder: "glpat-…", required: true,
      instructions: {
        steps: ["Go to GitLab → Preferences → Access Tokens", "Create a token with api and read_repository scopes", "Copy the token (starts with glpat-)"],
        link: { url: "https://gitlab.com/-/user_settings/personal_access_tokens", label: "Create GitLab Token" },
      } },
    { key: "gitlab_project_id", label: "Project ID", type: "text", placeholder: "12345678",
      instructions: { steps: ["Go to your GitLab project page", "The Project ID is shown under the project name on the main page"] } },
  ],
  linear: [
    { key: "linear_api_key", label: "Linear API Key", type: "password", placeholder: "lin_api_…", required: true,
      instructions: {
        steps: ["Go to Linear → Settings → API", "Click Create Key under Personal API Keys", "Copy the key (starts with lin_api_)"],
        link: { url: "https://linear.app/settings/api", label: "Open Linear API Settings" },
      } },
    { key: "team_id", label: "Team ID", type: "text", placeholder: "Your Linear team ID",
      instructions: {
        steps: ["Go to Linear → Settings → Teams", "Click on your team", "The Team ID is in the URL: linear.app/settings/teams/[team-id]"],
        link: { url: "https://linear.app/settings/teams", label: "View Teams" },
      } },
  ],
  contentful: [
    { key: "contentful_space_id", label: "Contentful Space ID", type: "text", placeholder: "Your space ID", required: true,
      instructions: {
        steps: ["Go to Contentful → Settings → General Settings", "Copy the Space ID shown at the top of the page"],
        link: { url: "https://app.contentful.com", label: "Open Contentful" },
      } },
    { key: "contentful_access_token", label: "Content Delivery Token", type: "password", placeholder: "Your CDA token", required: true,
      instructions: {
        steps: ["Go to Settings → API Keys in Contentful", "Select or create an API key", "Copy the Content Delivery API access token"],
        link: { url: "https://app.contentful.com", label: "Open Contentful" },
      } },
  ],
  design: [
    siteUrlField("The site whose design system the agent will maintain"),
    brandNameField,
    { key: "design_system_url", label: "Design System URL", type: "text", placeholder: "https://your-storybook.vercel.app",
      instructions: { steps: ["Optional: URL to your Storybook or design system docs", "The agent uses this as reference when upgrading components"] } },
  ],
  auth: [
    siteUrlField("Your application URL"),
    { key: "support_email", label: "Support Email", type: "text", placeholder: "support@yoursite.com",
      instructions: { steps: ["The email shown to users for account issues", "Used in auth emails and error pages"] } },
  ],
  granola: [
    brandNameField,
    siteUrlField("Your site — used for publishing meeting-derived content"),
    slackWebhookField,
    { key: "meeting_types_to_process", label: "Meeting Types", type: "text", placeholder: "all, or: customer-discovery, planning, standup",
      instructions: { steps: ["Which meetings should be processed?", "Enter 'all' to process everything", "Or list specific types: customer-discovery, planning, standup, pitch, 1on1"] } },
  ],

  // ── Monitor ──
  alert: [
    siteUrlField("Your site URL for alert context"),
    slackWebhookField,
    { key: "alert_email", label: "Alert Email", type: "text", placeholder: "alerts@yoursite.com",
      instructions: { steps: ["Email address for critical alerts", "High-priority alerts will also be sent here in addition to Slack"] } },
  ],
  telegram: [
    { key: "telegram_bot_token", label: "Telegram Bot Token", type: "password", placeholder: "123456:ABC-DEF…", required: true,
      instructions: {
        steps: ["Open Telegram and message @BotFather", "Send /newbot and follow the prompts", "Copy the bot token it gives you (format: 123456:ABC-DEF1234ghIkl-zyx57W2v)"],
        link: { url: "https://t.me/BotFather", label: "Open BotFather" },
      } },
    { key: "telegram_chat_id", label: "Chat ID", type: "text", placeholder: "-1001234567890", required: true,
      instructions: {
        steps: ["Add your bot to the target group or channel", "Send a message in the group", "Visit https://api.telegram.org/bot<TOKEN>/getUpdates", "Find the chat.id in the response"],
      } },
  ],
  "supabase-agent": [
    siteUrlField("Your application URL"),
    { key: "monitoring_interval", label: "Check Interval", type: "select", options: [
      { value: "hourly", label: "Every hour" }, { value: "daily", label: "Daily" }, { value: "weekly", label: "Weekly" },
    ], instructions: { steps: ["How often the agent checks your database metrics", "Hourly is best for production apps, weekly for side projects"] } },
  ],
  security: [
    { key: "aikido_project_id", label: "Aikido Project ID", type: "text", placeholder: "Your Aikido project ID", required: true,
      instructions: {
        steps: ["Sign in to your Aikido Security dashboard", "Go to Settings → General", "Copy the Project ID from the project info section", "Your API key must be stored as a backend secret (AIKIDO_API_KEY)"],
        link: { url: "https://app.aikido.dev/settings/general", label: "Open Aikido Settings" },
      } },
    siteUrlField("The site to scan for vulnerabilities"),
  ],
  watch: [
    githubTokenField,
    githubRepoField,
    slackWebhookField,
  ],

  // ── Intelligence ──
  fix: [
    githubTokenField,
    githubRepoField,
  ],
  build: [
    githubTokenField,
    githubRepoField,
    { key: "template_style", label: "Template Style", type: "select", options: [
      { value: "minimal", label: "Minimal" }, { value: "full", label: "Full (with tests)" },
    ], instructions: { steps: ["How much scaffolding should new agents include", "Minimal: just the edge function and settings table", "Full: includes tests, error handling, and admin integration"] } },
  ],
  intel: [
    siteUrlField("Your site for competitive context"),
    brandNameField,
    { key: "intel_topics", label: "Intelligence Topics", type: "textarea", placeholder: "competitor launches, market trends, funding news…",
      instructions: { steps: ["What should the intel agent track?", "One topic per line or comma-separated", "Reports are generated weekly and can seed other agents"] } },
    competitorsField,
  ],
  repurpose: [
    siteUrlField("The site where original content lives"),
    brandNameField,
    { key: "output_formats", label: "Output Formats", type: "text", placeholder: "twitter thread, linkedin post, newsletter",
      instructions: { steps: ["List the formats you want content repurposed into", "Separate with commas", "Supported: twitter thread, linkedin post, newsletter, summary, email"] } },
  ],
  trend: [
    siteUrlField("Your site for context"),
    brandNameField,
    contentNicheField,
    { key: "trend_sources", label: "Trend Sources", type: "text", placeholder: "hackernews, reddit, twitter",
      instructions: { steps: ["Which platforms should the agent monitor for trends", "Comma-separated list", "Discovered trends are seeded to SEO and GEO agents automatically"] } },
  ],
  churn: [
    siteUrlField("Your app or SaaS URL"),
    brandNameField,
    { key: "churn_signals", label: "Churn Signals", type: "textarea", placeholder: "no login 7 days, subscription cancel page visit…",
      instructions: { steps: ["Describe behaviours that indicate a user might churn", "One signal per line", "The agent monitors these and triggers retention actions"] } },
  ],
  agents: [
    githubTokenField,
    githubRepoField,
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
