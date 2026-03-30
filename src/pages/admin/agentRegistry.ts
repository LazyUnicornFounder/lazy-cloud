export type AgentCategory = "Content" | "Commerce" | "Media" | "Dev" | "Monitor" | "Intelligence";

export interface AgentAction {
  label: string;
  fn: string;
  primary?: boolean;
}

export interface AgentStatDef {
  label: string;
  table: string;
  query: "count" | "sum";
  field?: string;
  filter?: Record<string, any>;
  dateFilter?: "today" | "this_week" | "this_month";
}

export interface AgentConfig {
  key: string;
  slug: string;
  label: string;
  category: AgentCategory;
  settingsTable: string;
  runField: string;
  errorsTable?: string;
  subtitle: string;
  actions: AgentAction[];
  stats: AgentStatDef[];
  requiredSecrets?: { name: string; settingsField?: string }[];
  settingsFields?: string[];
}

export const CATEGORIES: AgentCategory[] = ["Content", "Commerce", "Media", "Dev", "Monitor", "Intelligence"];

export const CATEGORY_AGENTS: Record<AgentCategory, string[]> = {
  Content: ["blogger", "seo", "geo", "crawl", "perplexity", "repurpose", "trend"],
  Commerce: ["store", "drop", "print", "pay", "mail", "sms", "churn"],
  Media: ["voice", "stream", "youtube"],
  Dev: ["code", "gitlab", "linear", "contentful", "design", "auth", "granola"],
  Monitor: ["alert", "telegram", "supabase", "security", "watch"],
  Intelligence: ["fix", "build", "intel", "agents"],
};

export const AGENTS: AgentConfig[] = [
  // CONTENT
  {
    key: "blogger", slug: "blogger", label: "Blogger", category: "Content",
    settingsTable: "blog_settings", runField: "is_publishing", errorsTable: "blog_errors",
    subtitle: "Autonomous blog content engine",
    actions: [
      { label: "PUBLISH NOW", fn: "auto-publish-blog", primary: true },
      { label: "VIEW ALL POSTS", fn: "" },
    ],
    stats: [
      { label: "Posts Today", table: "blog_posts", query: "count", dateFilter: "today" },
      { label: "Posts This Week", table: "blog_posts", query: "count", dateFilter: "this_week" },
      { label: "SEO Posts Total", table: "seo_posts", query: "count" },
      { label: "GEO Posts Total", table: "geo_posts", query: "count" },
    ],
    settingsFields: ["posts_per_day", "frequency_minutes", "is_publishing"],
  },
  {
    key: "seo", slug: "seo", label: "SEO", category: "Content",
    settingsTable: "seo_settings", runField: "is_running", errorsTable: "seo_errors",
    subtitle: "Search engine optimisation engine",
    actions: [
      { label: "PUBLISH NOW", fn: "lazy-seo-publish", primary: true },
      { label: "DISCOVER KEYWORDS", fn: "lazy-seo-analyse" },
    ],
    stats: [
      { label: "Posts Published", table: "seo_posts", query: "count" },
      { label: "Keywords Found", table: "seo_keywords", query: "count" },
      { label: "Keywords Remaining", table: "seo_keywords", query: "count", filter: { has_content: false } },
    ],
    settingsFields: ["site_url", "target_keywords", "publishing_frequency", "competitors"],
  },
  {
    key: "geo", slug: "geo", label: "GEO", category: "Content",
    settingsTable: "geo_settings", runField: "is_running", errorsTable: "geo_errors",
    subtitle: "Generative engine optimisation",
    actions: [
      { label: "PUBLISH NOW", fn: "lazy-geo-publish", primary: true },
      { label: "DISCOVER QUERIES", fn: "lazy-geo-discover" },
      { label: "TEST CITATIONS", fn: "lazy-geo-test" },
    ],
    stats: [
      { label: "Posts Published", table: "geo_posts", query: "count" },
      { label: "Queries Found", table: "geo_queries", query: "count" },
      { label: "Citation Rate", table: "geo_citations", query: "count" },
    ],
    settingsFields: ["brand_name", "site_url", "target_audience", "niche_topics"],
  },
  {
    key: "crawl", slug: "crawl", label: "Crawl", category: "Content",
    settingsTable: "crawl_settings", runField: "is_running", errorsTable: "crawl_errors",
    subtitle: "Autonomous web crawler for intel",
    actions: [
      { label: "CRAWL NOW", fn: "crawl-run", primary: true },
      { label: "PUBLISH INTEL", fn: "crawl-publish" },
    ],
    stats: [],
  },
  {
    key: "perplexity", slug: "perplexity", label: "Perplexity", category: "Content",
    settingsTable: "perplexity_settings", runField: "is_running", errorsTable: "perplexity_errors",
    subtitle: "AI research and brand citation tracker",
    actions: [
      { label: "RESEARCH NOW", fn: "perplexity-research", primary: true },
      { label: "TEST CITATIONS", fn: "perplexity-test-citations" },
    ],
    stats: [],
  },
  {
    key: "repurpose", slug: "repurpose", label: "Repurpose", category: "Content",
    settingsTable: "repurpose_settings", runField: "is_running", errorsTable: "repurpose_errors",
    subtitle: "Content repurposing engine",
    actions: [{ label: "RUN NOW", fn: "repurpose-run", primary: true }],
    stats: [],
  },
  {
    key: "trend", slug: "trend", label: "Trend", category: "Content",
    settingsTable: "trend_settings", runField: "is_running", errorsTable: "trend_errors",
    subtitle: "Trend discovery and topic seeding",
    actions: [
      { label: "SCAN NOW", fn: "trend-scan", primary: true },
      { label: "SEED AGENTS", fn: "trend-seed" },
    ],
    stats: [],
  },
  // COMMERCE
  {
    key: "store", slug: "store", label: "Store", category: "Commerce",
    settingsTable: "store_settings", runField: "is_running", errorsTable: "store_errors",
    subtitle: "Autonomous product store engine",
    actions: [
      { label: "DISCOVER", fn: "store-discover", primary: true },
      { label: "OPTIMISE", fn: "store-optimise" },
      { label: "PROMOTE", fn: "store-promote" },
    ],
    stats: [],
  },
  {
    key: "drop", slug: "drop", label: "Drop", category: "Commerce",
    settingsTable: "drop_settings", runField: "is_running", errorsTable: "drop_errors",
    subtitle: "Dropshipping automation",
    actions: [
      { label: "SYNC NOW", fn: "drop-sync", primary: true },
      { label: "PUBLISH CONTENT", fn: "drop-content" },
    ],
    stats: [],
  },
  {
    key: "print", slug: "print", label: "Print", category: "Commerce",
    settingsTable: "print_settings", runField: "is_running", errorsTable: "print_errors",
    subtitle: "Print on demand automation",
    actions: [
      { label: "SYNC NOW", fn: "print-sync", primary: true },
      { label: "PUBLISH CONTENT", fn: "print-content" },
    ],
    stats: [],
  },
  {
    key: "pay", slug: "pay", label: "Pay", category: "Commerce",
    settingsTable: "pay_settings", runField: "is_running", errorsTable: "pay_errors",
    subtitle: "Payment and revenue engine",
    actions: [
      { label: "OPTIMISE NOW", fn: "pay-optimise", primary: true },
      { label: "RUN RECOVERY", fn: "pay-recover" },
    ],
    stats: [],
    requiredSecrets: [{ name: "stripe_secret_key", settingsField: "stripe_secret_key" }],
  },
  {
    key: "mail", slug: "mail", label: "Mail", category: "Commerce",
    settingsTable: "mail_settings", runField: "is_running", errorsTable: "mail_errors",
    subtitle: "Email marketing automation",
    actions: [
      { label: "SEND CAMPAIGN", fn: "mail-campaign", primary: true },
      { label: "OPTIMISE", fn: "mail-optimise" },
    ],
    stats: [],
    requiredSecrets: [{ name: "resend_api_key", settingsField: "resend_api_key" }],
  },
  {
    key: "sms", slug: "sms", label: "SMS", category: "Commerce",
    settingsTable: "sms_settings", runField: "is_running", errorsTable: "sms_errors",
    subtitle: "SMS marketing and alerts",
    actions: [
      { label: "RUN SEQUENCES", fn: "sms-sequences-run", primary: true },
      { label: "OPTIMISE", fn: "sms-optimise" },
    ],
    stats: [],
    requiredSecrets: [{ name: "twilio_account_sid", settingsField: "twilio_account_sid" }],
  },
  {
    key: "churn", slug: "churn", label: "Churn", category: "Commerce",
    settingsTable: "churn_settings", runField: "is_running", errorsTable: "churn_errors",
    subtitle: "Churn prevention engine",
    actions: [{ label: "ANALYSE NOW", fn: "churn-analyse", primary: true }],
    stats: [],
  },
  // MEDIA
  {
    key: "voice", slug: "voice", label: "Voice", category: "Media",
    settingsTable: "voice_settings", runField: "is_running", errorsTable: "voice_errors",
    subtitle: "Podcast narration engine",
    actions: [{ label: "NARRATE NOW", fn: "voice-generate", primary: true }],
    stats: [
      { label: "Episodes Generated", table: "voice_episodes", query: "count" },
      { label: "Posts Without Audio", table: "blog_posts", query: "count" },
    ],
    requiredSecrets: [{ name: "elevenlabs_api_key", settingsField: "elevenlabs_api_key" }],
    settingsFields: ["podcast_title", "podcast_author", "voice_id", "site_url"],
  },
  {
    key: "stream", slug: "stream", label: "Stream", category: "Media",
    settingsTable: "stream_settings", runField: "is_running", errorsTable: "stream_errors",
    subtitle: "Live stream content engine",
    actions: [{ label: "PROCESS LAST STREAM", fn: "stream-process", primary: true }],
    stats: [
      { label: "Streams Processed", table: "stream_sessions", query: "count" },
      { label: "Content Published", table: "stream_content", query: "count" },
      { label: "Clips Saved", table: "stream_clips", query: "count" },
    ],
    requiredSecrets: [{ name: "twitch_channel", settingsField: "twitch_username" }],
    settingsFields: ["twitch_username", "site_url", "business_name", "content_niche"],
  },
  {
    key: "youtube", slug: "youtube", label: "YouTube", category: "Media",
    settingsTable: "youtube_settings", runField: "is_running", errorsTable: "youtube_errors",
    subtitle: "YouTube content processor",
    actions: [
      { label: "SYNC NOW", fn: "youtube-sync", primary: true },
      { label: "FETCH COMMENTS", fn: "youtube-extract-comments" },
    ],
    stats: [],
    requiredSecrets: [{ name: "youtube_channel_id", settingsField: "youtube_channel_id" }],
  },
  // DEV
  {
    key: "code", slug: "code", label: "Code", category: "Dev",
    settingsTable: "code_settings", runField: "is_running", errorsTable: "code_errors",
    subtitle: "Codebase intelligence engine",
    actions: [{ label: "SYNC ROADMAP", fn: "code-sync-roadmap", primary: true }],
    stats: [],
  },
  {
    key: "gitlab", slug: "gitlab", label: "GitLab", category: "Dev",
    settingsTable: "gitlab_settings", runField: "is_running", errorsTable: "gitlab_errors",
    subtitle: "GitLab integration and sync",
    actions: [{ label: "SYNC ROADMAP", fn: "gitlab-sync-roadmap", primary: true }],
    stats: [],
    requiredSecrets: [
      { name: "gitlab_url", settingsField: "gitlab_url" },
      { name: "gitlab_token", settingsField: "gitlab_token" },
    ],
  },
  {
    key: "linear", slug: "linear", label: "Linear", category: "Dev",
    settingsTable: "linear_settings", runField: "is_running", errorsTable: "linear_errors",
    subtitle: "Linear project sync engine",
    actions: [
      { label: "SYNC NOW", fn: "linear-sync-all", primary: true },
      { label: "VELOCITY REPORT", fn: "linear-velocity-report" },
    ],
    stats: [],
    requiredSecrets: [{ name: "linear_api_key", settingsField: "linear_api_key" }],
  },
  {
    key: "contentful", slug: "contentful", label: "Contentful", category: "Dev",
    settingsTable: "contentful_settings", runField: "is_running", errorsTable: "contentful_errors",
    subtitle: "Contentful CMS sync",
    actions: [
      { label: "PULL NOW", fn: "contentful-pull", primary: true },
      { label: "PUSH NOW", fn: "contentful-push" },
    ],
    stats: [],
    requiredSecrets: [{ name: "contentful_space_id", settingsField: "contentful_space_id" }],
  },
  {
    key: "design", slug: "design", label: "Design", category: "Dev",
    settingsTable: "design_settings", runField: "is_running", errorsTable: "design_errors",
    subtitle: "Design system upgrade engine",
    actions: [{ label: "RUN UPGRADE", fn: "design-upgrade", primary: true }],
    stats: [],
  },
  {
    key: "auth", slug: "auth", label: "Auth", category: "Dev",
    settingsTable: "auth_settings", runField: "is_running", errorsTable: "auth_errors",
    subtitle: "Authentication management",
    actions: [],
    stats: [],
  },
  {
    key: "granola", slug: "granola", label: "Granola", category: "Dev",
    settingsTable: "granola_settings", runField: "is_running", errorsTable: "granola_errors",
    subtitle: "Meeting intelligence engine",
    actions: [
      { label: "SYNC NOW", fn: "granola-sync", primary: true },
      { label: "PUBLISH CONTENT", fn: "granola-write-post" },
    ],
    stats: [
      { label: "Meetings Synced", table: "granola_meetings", query: "count" },
      { label: "Content Published", table: "granola_outputs", query: "count" },
    ],
    settingsFields: ["brand_name", "site_url", "slack_webhook_url"],
  },
  // MONITOR
  {
    key: "alert", slug: "alert", label: "Alert", category: "Monitor",
    settingsTable: "alert_settings", runField: "is_running", errorsTable: "alert_errors",
    subtitle: "Multi-channel alerting engine",
    actions: [
      { label: "SEND TEST", fn: "alert-test", primary: true },
      { label: "BRIEFING NOW", fn: "alert-briefing" },
    ],
    stats: [],
  },
  {
    key: "telegram", slug: "telegram", label: "Telegram", category: "Monitor",
    settingsTable: "telegram_settings", runField: "is_running", errorsTable: "telegram_errors",
    subtitle: "Telegram bot and alerts",
    actions: [
      { label: "SEND TEST", fn: "telegram-test", primary: true },
      { label: "BRIEFING NOW", fn: "telegram-briefing" },
      { label: "REGISTER WEBHOOK", fn: "telegram-register" },
    ],
    stats: [],
  },
  {
    key: "supabase-agent", slug: "supabase", label: "Supabase", category: "Monitor",
    settingsTable: "supabase_settings", runField: "is_running", errorsTable: "supabase_errors",
    subtitle: "Database monitoring engine",
    actions: [
      { label: "CHECK NOW", fn: "supabase-monitor", primary: true },
      { label: "WEEKLY REPORT", fn: "supabase-weekly-report" },
    ],
    stats: [],
  },
  {
    key: "security", slug: "security", label: "Security", category: "Monitor",
    settingsTable: "security_settings", runField: "is_running", errorsTable: "security_errors",
    subtitle: "Autonomous security scanner",
    actions: [
      { label: "RUN PENTEST", fn: "security-scan", primary: true },
      { label: "QUICK SCAN", fn: "security-monitor" },
    ],
    stats: [],
    requiredSecrets: [{ name: "AIKIDO_API_KEY" }],
  },
  {
    key: "watch", slug: "watch", label: "Watch", category: "Monitor",
    settingsTable: "watch_settings", runField: "is_running", errorsTable: "watch_errors",
    subtitle: "Agent health monitor",
    actions: [{ label: "RUN NOW", fn: "watch-monitor", primary: true }],
    stats: [],
    requiredSecrets: [
      { name: "GITHUB_TOKEN" },
      { name: "GITHUB_REPO" },
    ],
  },
  // INTELLIGENCE
  {
    key: "fix", slug: "fix", label: "Fix", category: "Intelligence",
    settingsTable: "fix_settings", runField: "is_running", errorsTable: "fix_errors",
    subtitle: "Autonomous improvement engine",
    actions: [{ label: "RUN NOW", fn: "fix-analyse", primary: true }],
    stats: [],
    requiredSecrets: [{ name: "GITHUB_TOKEN" }, { name: "GITHUB_REPO" }],
  },
  {
    key: "build", slug: "build", label: "Build", category: "Intelligence",
    settingsTable: "build_settings", runField: "is_running", errorsTable: "build_errors",
    subtitle: "Agent builder engine",
    actions: [{ label: "BUILD NEW AGENT", fn: "build-engine", primary: true }],
    stats: [],
    requiredSecrets: [{ name: "GITHUB_TOKEN" }, { name: "GITHUB_REPO" }],
  },
  {
    key: "intel", slug: "intel", label: "Intel", category: "Intelligence",
    settingsTable: "intel_settings", runField: "is_running", errorsTable: "intel_errors",
    subtitle: "Competitive intelligence reports",
    actions: [
      { label: "RUN NOW", fn: "intel-weekly", primary: true },
      { label: "SEED AGENTS", fn: "intel-seed" },
    ],
    stats: [],
  },
];

export function getAgentBySlug(slug: string): AgentConfig | undefined {
  return AGENTS.find((a) => a.slug === slug);
}

export function getAgentsByCategory(category: AgentCategory | "All"): AgentConfig[] {
  if (category === "All") return AGENTS;
  return AGENTS.filter((a) => a.category === category);
}
