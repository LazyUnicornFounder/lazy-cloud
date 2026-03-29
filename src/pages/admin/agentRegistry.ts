// Agent registry — single source of truth for all LazyUnicorn agents

export interface AgentAction {
  label: string;
  fn: string;
  body?: Record<string, any>;
}

export interface AgentColumn {
  key: string;
  label: string;
  type?: "badge" | "link" | "date" | "number" | "button";
  badgeColor?: string;
  linkPrefix?: string;
  buttonFn?: string;
  buttonLabel?: string;
}

export interface AgentConfig {
  key: string;
  label: string;
  subtitle: string;
  settingsTable: string;
  runField: string;
  category: AgentCategory;
  tab: AdminTab;
  route: string;
  actions: AgentAction[];
  statsQueries: AgentStatQuery[];
  contentTable?: string;
  contentColumns?: AgentColumn[];
  errorsTable?: string;
  queueTable?: string;
  queueFilter?: Record<string, any>;
  queueColumns?: AgentColumn[];
  settingsFields?: SettingsField[];
  requiredSecrets?: string[];
  setupRoute?: string;
}

export interface AgentStatQuery {
  label: string;
  table: string;
  type: "count" | "count_today" | "count_week" | "sum" | "latest_field" | "computed";
  filter?: Record<string, any>;
  field?: string;
  colorThreshold?: { green: number; amber: number };
}

export interface SettingsField {
  key: string;
  label: string;
  type?: "text" | "password" | "number" | "textarea" | "toggle";
  placeholder?: string;
}

export type AgentCategory = "content" | "commerce" | "media" | "dev" | "ops" | "system";

export type AdminTab = "all" | "content" | "commerce" | "media" | "dev" | "monitor" | "intelligence";

export const ADMIN_TABS: { key: AdminTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "content", label: "Content" },
  { key: "commerce", label: "Commerce" },
  { key: "media", label: "Media" },
  { key: "dev", label: "Dev" },
  { key: "monitor", label: "Monitor" },
  { key: "intelligence", label: "Intelligence" },
];

export const TAB_COLORS: Record<AdminTab, string> = {
  all: "#f0ead6",
  content: "#c8a961",
  commerce: "#22c55e",
  media: "#3b82f6",
  dev: "#a855f7",
  monitor: "#ef4444",
  intelligence: "#f59e0b",
};

export const CATEGORY_META: Record<AgentCategory, { label: string; color: string }> = {
  content: { label: "Content", color: "#c8a961" },
  commerce: { label: "Commerce", color: "#22c55e" },
  media: { label: "Media", color: "#3b82f6" },
  dev: { label: "Dev", color: "#a855f7" },
  ops: { label: "Ops", color: "#ef4444" },
  system: { label: "System", color: "#6b7280" },
};

export const AGENTS: AgentConfig[] = [
  // ── Content ──
  {
    key: "blogger", label: "Blogger",
    subtitle: "Publishes blog posts every 15 minutes.",
    settingsTable: "blog_settings", runField: "is_publishing",
    category: "content", tab: "content", route: "/admin/blogger",
    actions: [{ label: "Publish Now", fn: "auto-publish-blog" }],
    statsQueries: [
      { label: "Posts today", table: "blog_posts", type: "count_today" },
      { label: "Posts this week", table: "blog_posts", type: "count_week" },
    ],
    contentTable: "blog_posts",
    contentColumns: [
      { key: "title", label: "Title" },
      { key: "status", label: "Status", type: "badge" },
      { key: "published_at", label: "Date", type: "date" },
    ],
    errorsTable: "blog_errors",
    settingsFields: [
      { key: "posts_per_day", label: "Posts per Day", type: "number" },
      { key: "frequency_minutes", label: "Frequency (min)", type: "number" },
    ],
  },
  {
    key: "seo", label: "SEO",
    subtitle: "Discovers keywords and publishes ranking articles.",
    settingsTable: "seo_settings", runField: "is_running",
    category: "content", tab: "content", route: "/admin/seo",
    setupRoute: "/lazy-seo-setup",
    actions: [
      { label: "Publish Now", fn: "lazy-seo-publish" },
      { label: "Discover Now", fn: "lazy-seo-analyse" },
    ],
    statsQueries: [
      { label: "Posts", table: "seo_posts", type: "count" },
      { label: "Keywords", table: "seo_keywords", type: "count" },
    ],
    contentTable: "seo_posts",
    contentColumns: [
      { key: "title", label: "Title" },
      { key: "target_keyword", label: "Keyword", type: "badge" },
      { key: "published_at", label: "Date", type: "date" },
    ],
    queueTable: "seo_keywords", queueFilter: { has_content: false },
    queueColumns: [{ key: "keyword", label: "Keyword" }, { key: "product", label: "Product", type: "badge" }],
    errorsTable: "seo_errors",
  },
  {
    key: "geo", label: "GEO",
    subtitle: "Publishes content cited by AI search engines.",
    settingsTable: "geo_settings", runField: "is_running",
    category: "content", tab: "content", route: "/admin/geo",
    setupRoute: "/lazy-geo-setup",
    actions: [
      { label: "Publish Now", fn: "lazy-geo-publish" },
      { label: "Discover Now", fn: "lazy-geo-discover" },
      { label: "Test Citations", fn: "lazy-geo-test" },
    ],
    statsQueries: [
      { label: "Posts", table: "geo_posts", type: "count" },
      { label: "Queries", table: "geo_queries", type: "count" },
    ],
    contentTable: "geo_posts",
    contentColumns: [
      { key: "title", label: "Title" },
      { key: "target_query", label: "Query", type: "badge" },
      { key: "published_at", label: "Date", type: "date" },
    ],
    queueTable: "geo_queries", queueFilter: { has_content: false },
    queueColumns: [{ key: "query", label: "Query" }, { key: "query_type", label: "Type", type: "badge" }],
    errorsTable: "geo_errors",
  },
  {
    key: "crawl", label: "Crawl",
    subtitle: "Monitors competitors and feeds intelligence.",
    settingsTable: "crawl_settings", runField: "is_running",
    category: "content", tab: "content", route: "/admin/crawl",
    requiredSecrets: ["FIRECRAWL_API_KEY"],
    actions: [{ label: "Crawl Now", fn: "crawl-run" }, { label: "Publish Intel", fn: "crawl-publish" }],
    statsQueries: [], contentTable: "crawl_intel", errorsTable: "crawl_errors",
  },
  {
    key: "perplexity", label: "Perplexity",
    subtitle: "Researches niche and tests brand citations.",
    settingsTable: "perplexity_settings", runField: "is_running",
    category: "content", tab: "content", route: "/admin/perplexity",
    requiredSecrets: ["PERPLEXITY_API_KEY"],
    actions: [{ label: "Research Now", fn: "perplexity-research" }, { label: "Test Citations", fn: "perplexity-test-citations" }],
    statsQueries: [], contentTable: "perplexity_content", errorsTable: "perplexity_errors",
  },
  {
    key: "contentful", label: "Contentful",
    subtitle: "Two-way content sync with Contentful.",
    settingsTable: "contentful_settings", runField: "is_running",
    category: "content", tab: "content", route: "/admin/contentful",
    requiredSecrets: ["CONTENTFUL_ACCESS_TOKEN"],
    actions: [{ label: "Pull Now", fn: "contentful-pull" }, { label: "Push Now", fn: "contentful-push" }],
    statsQueries: [], contentTable: "contentful_sync_log", errorsTable: "contentful_errors",
  },

  // ── Commerce ──
  {
    key: "store", label: "Store",
    subtitle: "Discovers products, writes listings, optimises conversion.",
    settingsTable: "store_settings", runField: "is_running",
    category: "commerce", tab: "commerce", route: "/admin/store",
    requiredSecrets: ["SHOPIFY_ACCESS_TOKEN"],
    actions: [{ label: "Discover", fn: "store-discover" }, { label: "Optimise", fn: "store-optimise" }, { label: "Promote", fn: "store-promote" }],
    statsQueries: [], contentTable: "store_products", errorsTable: "store_errors",
  },
  {
    key: "drop", label: "Drop",
    subtitle: "Syncs dropshipping products from AutoDS.",
    settingsTable: "drop_settings", runField: "is_running",
    category: "commerce", tab: "commerce", route: "/admin/drop",
    requiredSecrets: ["AUTODS_API_KEY"],
    actions: [{ label: "Sync Now", fn: "drop-sync" }, { label: "Publish Content", fn: "drop-content" }],
    statsQueries: [], contentTable: "drop_products", errorsTable: "drop_errors",
  },
  {
    key: "print", label: "Print",
    subtitle: "Syncs Printful products and publishes content.",
    settingsTable: "print_settings", runField: "is_running",
    category: "commerce", tab: "commerce", route: "/admin/print",
    requiredSecrets: ["PRINTFUL_API_KEY"],
    actions: [{ label: "Sync Now", fn: "print-sync" }, { label: "Publish Content", fn: "print-content" }],
    statsQueries: [], contentTable: "print_products", errorsTable: "print_errors",
  },
  {
    key: "pay", label: "Pay",
    subtitle: "Stripe payments with self-improving conversion.",
    settingsTable: "pay_settings", runField: "is_running",
    category: "commerce", tab: "commerce", route: "/admin/pay",
    requiredSecrets: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"],
    actions: [{ label: "Optimise Now", fn: "pay-optimise" }, { label: "Run Recovery", fn: "pay-recover" }],
    statsQueries: [], contentTable: "pay_transactions", errorsTable: "pay_errors",
  },
  {
    key: "sms", label: "SMS",
    subtitle: "Automated SMS sequences that improve themselves.",
    settingsTable: "sms_settings", runField: "is_running",
    category: "commerce", tab: "commerce", route: "/admin/sms",
    requiredSecrets: ["TWILIO_AUTH_TOKEN"],
    actions: [{ label: "Run Sequences", fn: "sms-sequences-run" }, { label: "Optimise", fn: "sms-optimise" }],
    statsQueries: [], contentTable: "sms_messages", errorsTable: "sms_errors",
  },
  {
    key: "mail", label: "Mail",
    subtitle: "Automated email campaigns that improve themselves.",
    settingsTable: "mail_settings", runField: "is_running",
    category: "commerce", tab: "commerce", route: "/admin/mail",
    requiredSecrets: ["RESEND_API_KEY"],
    actions: [{ label: "Send Campaign", fn: "mail-campaign" }, { label: "Optimise", fn: "mail-optimise" }],
    statsQueries: [], contentTable: "mail_campaigns", errorsTable: "mail_errors",
  },

  // ── Media ──
  {
    key: "voice", label: "Voice",
    subtitle: "Narrates every post in your ElevenLabs voice.",
    settingsTable: "voice_settings", runField: "is_running",
    category: "media", tab: "media", route: "/admin/voice",
    requiredSecrets: ["ELEVENLABS_API_KEY"], setupRoute: "/lazy-voice-setup",
    actions: [{ label: "Narrate Now", fn: "voice-generate" }],
    statsQueries: [{ label: "Episodes", table: "voice_episodes", type: "count" }],
    contentTable: "voice_episodes",
    contentColumns: [{ key: "post_title", label: "Title" }, { key: "status", label: "Status", type: "badge" }, { key: "created_at", label: "Date", type: "date" }],
    errorsTable: "voice_errors",
  },
  {
    key: "stream", label: "Stream",
    subtitle: "Turns every Twitch stream into blog posts and SEO content.",
    settingsTable: "stream_settings", runField: "is_running",
    category: "media", tab: "media", route: "/admin/stream",
    requiredSecrets: ["TWITCH_CLIENT_ID", "TWITCH_CLIENT_SECRET"], setupRoute: "/lazy-stream-setup",
    actions: [{ label: "Process Last Stream", fn: "stream-process" }, { label: "Optimise", fn: "stream-optimise" }],
    statsQueries: [
      { label: "Streams", table: "stream_sessions", type: "count" },
      { label: "Content", table: "stream_content", type: "count" },
    ],
    contentTable: "stream_content",
    contentColumns: [{ key: "title", label: "Title" }, { key: "content_type", label: "Type", type: "badge" }, { key: "published_at", label: "Date", type: "date" }],
    errorsTable: "stream_errors",
  },
  {
    key: "youtube", label: "YouTube",
    subtitle: "Turns videos into transcripts, SEO, GEO, and chapters.",
    settingsTable: "youtube_settings", runField: "is_running",
    category: "media", tab: "media", route: "/admin/youtube",
    requiredSecrets: ["SUPADATA_API_KEY"],
    actions: [{ label: "Sync Now", fn: "youtube-sync" }, { label: "Fetch Comments", fn: "youtube-extract-comments" }],
    statsQueries: [], contentTable: "youtube_videos", errorsTable: "youtube_errors",
  },

  // ── Dev ──
  {
    key: "code", label: "GitHub",
    subtitle: "Turns commits into changelogs and developer posts.",
    settingsTable: "code_settings", runField: "is_running",
    category: "dev", tab: "dev", route: "/admin/code",
    requiredSecrets: ["GITHUB_PROMPTS_TOKEN"],
    actions: [{ label: "Sync Roadmap", fn: "code-sync-roadmap" }],
    statsQueries: [], contentTable: "code_content", errorsTable: "code_errors",
  },
  {
    key: "gitlab", label: "GitLab",
    subtitle: "Turns GitLab commits into changelogs and posts.",
    settingsTable: "gitlab_settings", runField: "is_running",
    category: "dev", tab: "dev", route: "/admin/gitlab",
    requiredSecrets: ["GITLAB_TOKEN"],
    actions: [{ label: "Sync Roadmap", fn: "gitlab-sync-roadmap" }],
    statsQueries: [], contentTable: "gitlab_content", errorsTable: "gitlab_errors",
  },
  {
    key: "linear", label: "Linear",
    subtitle: "Turns Linear cycles and issues into product updates.",
    settingsTable: "linear_settings", runField: "is_running",
    category: "dev", tab: "dev", route: "/admin/linear",
    requiredSecrets: ["LINEAR_API_KEY"],
    actions: [{ label: "Sync Now", fn: "linear-sync-all" }],
    statsQueries: [], contentTable: "linear_content", errorsTable: "linear_errors",
  },
  {
    key: "design", label: "Design",
    subtitle: "Visual design and component library management.",
    settingsTable: "design_settings", runField: "is_running",
    category: "dev", tab: "dev", route: "/admin/design",
    actions: [{ label: "Run Design Upgrade", fn: "design-upgrade" }],
    statsQueries: [], errorsTable: "design_errors",
  },
  {
    key: "auth", label: "Auth",
    subtitle: "Authentication — Google Sign-In, email login, roles.",
    settingsTable: "auth_settings", runField: "is_running",
    category: "dev", tab: "dev", route: "/admin/auth",
    actions: [], statsQueries: [],
  },
  {
    key: "granola", label: "Granola",
    subtitle: "Turns meeting notes into blog posts and updates.",
    settingsTable: "granola_settings", runField: "is_running",
    category: "dev", tab: "dev", route: "/admin/granola",
    requiredSecrets: ["GRANOLA_API_KEY"], setupRoute: "/lazy-granola-setup",
    actions: [{ label: "Sync Now", fn: "granola-sync" }, { label: "Publish Content", fn: "granola-write-post" }],
    statsQueries: [
      { label: "Meetings", table: "granola_meetings", type: "count" },
      { label: "Outputs", table: "granola_outputs", type: "count" },
    ],
    contentTable: "granola_outputs",
    contentColumns: [{ key: "title", label: "Title" }, { key: "output_type", label: "Type", type: "badge" }, { key: "created_at", label: "Date", type: "date" }],
    queueTable: "granola_meetings", queueFilter: { processed: false },
    queueColumns: [{ key: "title", label: "Title" }, { key: "meeting_type", label: "Type", type: "badge" }],
    errorsTable: "granola_errors",
  },

  // ── Monitor ──
  {
    key: "alert", label: "Alert",
    subtitle: "Real-time Slack alerts for every agent event.",
    settingsTable: "alert_settings", runField: "is_running",
    category: "ops", tab: "monitor", route: "/admin/alert",
    requiredSecrets: ["SLACK_WEBHOOK_URL"],
    actions: [{ label: "Send Test", fn: "alert-test" }, { label: "Briefing Now", fn: "alert-briefing" }],
    statsQueries: [], contentTable: "alert_log", errorsTable: "alert_errors",
  },
  {
    key: "telegram", label: "Telegram",
    subtitle: "Real-time Telegram alerts and bot commands.",
    settingsTable: "telegram_settings", runField: "is_running",
    category: "ops", tab: "monitor", route: "/admin/telegram",
    requiredSecrets: ["TELEGRAM_BOT_TOKEN"],
    actions: [{ label: "Send Test", fn: "telegram-test" }, { label: "Register Webhook", fn: "telegram-register-webhook" }],
    statsQueries: [], contentTable: "telegram_log", errorsTable: "telegram_errors",
  },
  {
    key: "supabase", label: "Supabase",
    subtitle: "Monitors database milestones and publishes updates.",
    settingsTable: "supabase_settings", runField: "is_running",
    category: "ops", tab: "monitor", route: "/admin/supabase",
    actions: [{ label: "Check Now", fn: "supabase-monitor" }],
    statsQueries: [], contentTable: "supabase_milestones", errorsTable: "supabase_errors",
  },
  {
    key: "security", label: "Security",
    subtitle: "Automated pentests and vulnerability monitoring.",
    settingsTable: "security_settings", runField: "is_running",
    category: "ops", tab: "monitor", route: "/admin/security",
    requiredSecrets: ["AIKIDO_API_KEY"],
    actions: [{ label: "Run Pentest", fn: "security-scan" }, { label: "Quick Scan", fn: "security-monitor" }],
    statsQueries: [], contentTable: "security_scans", errorsTable: "security_errors",
  },
  {
    key: "watch", label: "Watch",
    subtitle: "Monitors error tables and opens GitHub issues.",
    settingsTable: "watch_settings", runField: "is_running",
    category: "ops", tab: "monitor", route: "/admin/watch",
    actions: [{ label: "Run Now", fn: "watch-monitor" }],
    statsQueries: [], contentTable: "watch_issues", errorsTable: "watch_errors",
  },
  {
    key: "fix", label: "Fix",
    subtitle: "Opens GitHub PRs with prompt improvements.",
    settingsTable: "fix_settings", runField: "is_running",
    category: "ops", tab: "monitor", route: "/admin/fix",
    actions: [{ label: "Run Now", fn: "fix-analyse" }],
    statsQueries: [], contentTable: "fix_improvements", errorsTable: "fix_errors",
  },

  // ── Intelligence ──
  {
    key: "intel", label: "Intel",
    subtitle: "Weekly competitive intelligence and content seeding.",
    settingsTable: "intel_settings", runField: "is_running",
    category: "ops", tab: "intelligence", route: "/admin/intel",
    actions: [{ label: "Run Now", fn: "intel-weekly" }, { label: "Seed Agents", fn: "intel-seed" }],
    statsQueries: [], contentTable: "intel_reports", errorsTable: "intel_errors",
  },
  {
    key: "repurpose", label: "Repurpose",
    subtitle: "Repurposes content into new formats automatically.",
    settingsTable: "repurpose_settings", runField: "is_running",
    category: "ops", tab: "intelligence", route: "/admin/repurpose",
    actions: [{ label: "Run Now", fn: "repurpose-run" }],
    statsQueries: [], contentTable: "repurpose_output", errorsTable: "repurpose_errors",
  },
  {
    key: "trend", label: "Trend",
    subtitle: "Discovers trending topics and seeds content agents.",
    settingsTable: "trend_settings", runField: "is_running",
    category: "ops", tab: "intelligence", route: "/admin/trend",
    actions: [{ label: "Scan Now", fn: "trend-scan" }, { label: "Seed Agents", fn: "trend-seed" }],
    statsQueries: [], contentTable: "trend_topics", errorsTable: "trend_errors",
  },
  {
    key: "churn", label: "Churn",
    subtitle: "Detects churn signals and triggers retention.",
    settingsTable: "churn_settings", runField: "is_running",
    category: "ops", tab: "intelligence", route: "/admin/churn",
    actions: [{ label: "Analyse Now", fn: "churn-analyse" }],
    statsQueries: [], contentTable: "churn_signals", errorsTable: "churn_errors",
  },
  {
    key: "build", label: "Build",
    subtitle: "Writes and deploys new Lazy agents from a spec.",
    settingsTable: "build_settings", runField: "is_running",
    category: "ops", tab: "intelligence", route: "/admin/build",
    actions: [{ label: "Build New Agent", fn: "build-engine" }],
    statsQueries: [], contentTable: "build_engines", errorsTable: "build_errors",
  },
  {
    key: "agents", label: "Agents",
    subtitle: "Autonomous agents that monitor and improve your stack.",
    settingsTable: "agent_settings", runField: "is_running",
    category: "ops", tab: "intelligence", route: "/admin/agents",
    actions: [], statsQueries: [], contentTable: "agent_runs", errorsTable: "agent_errors",
  },
];

export const ALWAYS_VISIBLE = ["installs", "settings", "overview"];

export function getAgentsByTab(installed: Set<string>, tab: AdminTab): AgentConfig[] {
  return AGENTS.filter((a) => installed.has(a.key) && (tab === "all" || a.tab === tab));
}

export function getAgentsByCategory(installed: Set<string>): Record<AgentCategory, AgentConfig[]> {
  const result: Record<AgentCategory, AgentConfig[]> = {
    content: [], commerce: [], media: [], dev: [], ops: [], system: [],
  };
  for (const a of AGENTS) {
    if (installed.has(a.key)) result[a.category].push(a);
  }
  return result;
}
