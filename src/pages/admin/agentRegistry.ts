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

export type AgentCategory =
  | "content"
  | "commerce"
  | "media"
  | "dev"
  | "ops"
  | "system";

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
    key: "blogger",
    label: "Blogger",
    subtitle: "Publishes blog posts every 15 minutes.",
    settingsTable: "blog_settings",
    runField: "is_publishing",
    category: "content",
    route: "/admin/blogger",
    actions: [{ label: "Publish Now", fn: "auto-publish-blog" }],
    statsQueries: [
      { label: "Posts today", table: "blog_posts", type: "count_today" },
      { label: "Posts this week", table: "blog_posts", type: "count_week" },
      { label: "SEO posts", table: "seo_posts", type: "count" },
      { label: "GEO posts", table: "geo_posts", type: "count" },
    ],
    contentTable: "blog_posts",
    contentColumns: [
      { key: "title", label: "Title" },
      { key: "status", label: "Status", type: "badge" },
      { key: "published_at", label: "Date", type: "date" },
    ],
    errorsTable: "blog_errors",
  },
  {
    key: "seo",
    label: "SEO",
    subtitle: "Discovers keywords and publishes ranking articles.",
    settingsTable: "seo_settings",
    runField: "is_running",
    category: "content",
    route: "/admin/seo",
    actions: [
      { label: "Publish Now", fn: "lazy-seo-publish" },
      { label: "Discover Now", fn: "lazy-seo-analyse" },
    ],
    statsQueries: [
      { label: "Posts published", table: "seo_posts", type: "count" },
      { label: "Keywords found", table: "seo_keywords", type: "count" },
    ],
    contentTable: "seo_posts",
    contentColumns: [
      { key: "title", label: "Title" },
      { key: "target_keyword", label: "Keyword", type: "badge" },
      { key: "published_at", label: "Date", type: "date" },
    ],
    queueTable: "seo_keywords",
    queueFilter: { has_content: false },
    queueColumns: [
      { key: "keyword", label: "Keyword" },
      { key: "product", label: "Product", type: "badge" },
    ],
    errorsTable: "seo_errors",
  },
  {
    key: "geo",
    label: "GEO",
    subtitle: "Publishes content cited by AI search engines.",
    settingsTable: "geo_settings",
    runField: "is_running",
    category: "content",
    route: "/admin/geo",
    actions: [
      { label: "Publish Now", fn: "lazy-geo-publish" },
      { label: "Discover Now", fn: "lazy-geo-discover" },
      { label: "Test Citations", fn: "lazy-geo-test" },
    ],
    statsQueries: [
      { label: "Posts published", table: "geo_posts", type: "count" },
      { label: "Queries found", table: "geo_queries", type: "count" },
    ],
    contentTable: "geo_posts",
    contentColumns: [
      { key: "title", label: "Title" },
      { key: "target_query", label: "Query", type: "badge" },
      { key: "published_at", label: "Date", type: "date" },
    ],
    queueTable: "geo_queries",
    queueFilter: { has_content: false },
    queueColumns: [
      { key: "query", label: "Query" },
      { key: "query_type", label: "Type", type: "badge" },
    ],
    errorsTable: "geo_errors",
  },
  {
    key: "crawl",
    label: "Crawl",
    subtitle: "Monitors competitors and feeds intelligence into your content agents.",
    settingsTable: "crawl_settings",
    runField: "is_running",
    category: "content",
    route: "/admin/crawl",
    actions: [
      { label: "Crawl Now", fn: "crawl-run" },
      { label: "Publish Intel", fn: "crawl-publish" },
    ],
    statsQueries: [],
    contentTable: "crawl_intel",
    errorsTable: "crawl_errors",
  },
  {
    key: "perplexity",
    label: "Perplexity",
    subtitle: "Researches your niche and tests brand citation rates.",
    settingsTable: "perplexity_settings",
    runField: "is_running",
    category: "content",
    route: "/admin/perplexity",
    actions: [
      { label: "Research Now", fn: "perplexity-research" },
      { label: "Test Citations", fn: "perplexity-test-citations" },
    ],
    statsQueries: [],
    contentTable: "perplexity_content",
    errorsTable: "perplexity_errors",
  },
  {
    key: "repurpose",
    label: "Repurpose",
    subtitle: "Repurposes existing content into new formats automatically.",
    settingsTable: "repurpose_settings",
    runField: "is_running",
    category: "ops",
    route: "/admin/repurpose",
    actions: [{ label: "Run Now", fn: "repurpose-run" }],
    statsQueries: [],
    contentTable: "repurpose_output",
    errorsTable: "repurpose_errors",
  },
  {
    key: "trend",
    label: "Trend",
    subtitle: "Discovers trending topics and seeds content engines.",
    settingsTable: "trend_settings",
    runField: "is_running",
    category: "ops",
    route: "/admin/trend",
    actions: [
      { label: "Scan Now", fn: "trend-scan" },
      { label: "Seed Engines", fn: "trend-seed" },
    ],
    statsQueries: [],
    contentTable: "trend_topics",
    errorsTable: "trend_errors",
  },

  // ── Commerce ──
  {
    key: "store",
    label: "Store",
    subtitle: "Discovers products, writes listings, optimises conversion.",
    settingsTable: "store_settings",
    runField: "is_running",
    category: "commerce",
    route: "/admin/store",
    actions: [
      { label: "Discover", fn: "store-discover" },
      { label: "Optimise", fn: "store-optimise" },
      { label: "Promote", fn: "store-promote" },
      { label: "Publish Content", fn: "store-content" },
    ],
    statsQueries: [],
    contentTable: "store_products",
    errorsTable: "store_errors",
  },
  {
    key: "pay",
    label: "Pay",
    subtitle: "Stripe payments with self-improving conversion optimisation.",
    settingsTable: "pay_settings",
    runField: "is_running",
    category: "commerce",
    route: "/admin/pay",
    actions: [
      { label: "Optimise Now", fn: "pay-optimise" },
      { label: "Run Recovery", fn: "pay-recover" },
    ],
    statsQueries: [],
    contentTable: "pay_transactions",
    errorsTable: "pay_errors",
  },
  {
    key: "sms",
    label: "SMS",
    subtitle: "Automated SMS sequences that improve themselves.",
    settingsTable: "sms_settings",
    runField: "is_running",
    category: "commerce",
    route: "/admin/sms",
    actions: [
      { label: "Run Sequences", fn: "sms-sequences-run" },
      { label: "Optimise", fn: "sms-optimise" },
    ],
    statsQueries: [],
    contentTable: "sms_messages",
    errorsTable: "sms_errors",
  },
  {
    key: "drop",
    label: "Drop",
    subtitle: "Syncs dropshipping products from AutoDS and publishes content.",
    settingsTable: "drop_settings",
    runField: "is_running",
    category: "commerce",
    route: "/admin/drop",
    actions: [
      { label: "Sync Now", fn: "drop-sync" },
      { label: "Publish Content", fn: "drop-content" },
      { label: "Optimise", fn: "drop-optimise" },
    ],
    statsQueries: [],
    contentTable: "drop_products",
    errorsTable: "drop_errors",
  },
  {
    key: "print",
    label: "Print",
    subtitle: "Syncs Printful products and publishes print-on-demand content.",
    settingsTable: "print_settings",
    runField: "is_running",
    category: "commerce",
    route: "/admin/print",
    actions: [
      { label: "Sync Now", fn: "print-sync" },
      { label: "Publish Content", fn: "print-content" },
      { label: "Optimise", fn: "print-optimise" },
    ],
    statsQueries: [],
    contentTable: "print_products",
    errorsTable: "print_errors",
  },
  {
    key: "mail",
    label: "Mail",
    subtitle: "Automated email campaigns that improve themselves.",
    settingsTable: "mail_settings",
    runField: "is_running",
    category: "commerce",
    route: "/admin/mail",
    actions: [
      { label: "Send Campaign", fn: "mail-campaign" },
      { label: "Optimise", fn: "mail-optimise" },
    ],
    statsQueries: [],
    contentTable: "mail_campaigns",
    errorsTable: "mail_errors",
  },
  {
    key: "churn",
    label: "Churn",
    subtitle: "Detects churn signals and triggers retention actions automatically.",
    settingsTable: "churn_settings",
    runField: "is_running",
    category: "ops",
    route: "/admin/churn",
    actions: [{ label: "Analyse Now", fn: "churn-analyse" }],
    statsQueries: [],
    contentTable: "churn_signals",
    errorsTable: "churn_errors",
  },

  // ── Media ──
  {
    key: "voice",
    label: "Voice",
    subtitle: "Narrates every post in your ElevenLabs voice.",
    settingsTable: "voice_settings",
    runField: "is_running",
    category: "media",
    route: "/admin/voice",
    actions: [{ label: "Narrate Now", fn: "voice-generate" }],
    statsQueries: [
      { label: "Episodes", table: "voice_episodes", type: "count" },
    ],
    contentTable: "voice_episodes",
    contentColumns: [
      { key: "post_title", label: "Title" },
      { key: "status", label: "Status", type: "badge" },
      { key: "created_at", label: "Date", type: "date" },
    ],
    errorsTable: "voice_errors",
  },
  {
    key: "stream",
    label: "Stream",
    subtitle: "Turns every Twitch stream into blog posts and SEO content.",
    settingsTable: "stream_settings",
    runField: "is_running",
    category: "media",
    route: "/admin/stream",
    actions: [
      { label: "Process Last Stream", fn: "stream-process" },
      { label: "Optimise", fn: "stream-optimise" },
    ],
    statsQueries: [
      { label: "Streams", table: "stream_sessions", type: "count" },
      { label: "Content", table: "stream_content", type: "count" },
      { label: "Clips", table: "stream_clips", type: "count" },
    ],
    contentTable: "stream_content",
    contentColumns: [
      { key: "title", label: "Title" },
      { key: "content_type", label: "Type", type: "badge" },
      { key: "published_at", label: "Date", type: "date" },
    ],
    errorsTable: "stream_errors",
  },
  {
    key: "youtube",
    label: "YouTube",
    subtitle: "Turns every YouTube video into transcripts, SEO, GEO, and chapter markers.",
    settingsTable: "youtube_settings",
    runField: "is_running",
    category: "media",
    route: "/admin/youtube",
    actions: [
      { label: "Sync Now", fn: "youtube-sync" },
      { label: "Fetch Comments", fn: "youtube-extract-comments" },
      { label: "Track Performance", fn: "youtube-track-performance" },
    ],
    statsQueries: [],
    contentTable: "youtube_videos",
    errorsTable: "youtube_errors",
  },

  // ── Developer ──
  {
    key: "code",
    label: "Code",
    subtitle: "Turns every GitHub commit into changelogs and developer posts.",
    settingsTable: "code_settings",
    runField: "is_running",
    category: "dev",
    route: "/admin/code",
    actions: [
      { label: "Sync Roadmap", fn: "code-sync-roadmap" },
      { label: "Optimise", fn: "code-optimise" },
    ],
    statsQueries: [],
    contentTable: "code_content",
    errorsTable: "code_errors",
  },
  {
    key: "gitlab",
    label: "GitLab",
    subtitle: "Turns every GitLab commit into changelogs and developer posts.",
    settingsTable: "gitlab_settings",
    runField: "is_running",
    category: "dev",
    route: "/admin/gitlab",
    actions: [
      { label: "Sync Roadmap", fn: "gitlab-sync-roadmap" },
      { label: "Optimise", fn: "gitlab-optimise" },
    ],
    statsQueries: [],
    contentTable: "gitlab_content",
    errorsTable: "gitlab_errors",
  },
  {
    key: "linear",
    label: "Linear",
    subtitle: "Turns Linear cycles and issues into product updates.",
    settingsTable: "linear_settings",
    runField: "is_running",
    category: "dev",
    route: "/admin/linear",
    actions: [
      { label: "Sync Now", fn: "linear-sync-all" },
      { label: "Velocity Report", fn: "linear-velocity-report" },
    ],
    statsQueries: [],
    contentTable: "linear_content",
    errorsTable: "linear_errors",
  },
  {
    key: "auth",
    label: "Auth",
    subtitle: "Authentication system — Google Sign-In, email login, role management.",
    settingsTable: "auth_settings",
    runField: "is_running",
    category: "dev",
    route: "/admin/auth",
    actions: [],
    statsQueries: [],
  },
  {
    key: "design",
    label: "Design",
    subtitle: "Visual design and component library management.",
    settingsTable: "design_settings",
    runField: "is_running",
    category: "dev",
    route: "/admin/design",
    actions: [{ label: "Run Design Upgrade", fn: "design-upgrade" }],
    statsQueries: [],
    errorsTable: "design_errors",
  },
  {
    key: "granola",
    label: "Granola",
    subtitle: "Turns meeting notes from Granola into blog posts and product updates.",
    settingsTable: "granola_settings",
    runField: "is_running",
    category: "dev",
    route: "/admin/granola",
    actions: [
      { label: "Sync Now", fn: "granola-sync" },
      { label: "Publish Content", fn: "granola-write-post" },
    ],
    statsQueries: [
      { label: "Meetings", table: "granola_meetings", type: "count" },
      { label: "Outputs", table: "granola_outputs", type: "count" },
    ],
    contentTable: "granola_outputs",
    contentColumns: [
      { key: "title", label: "Title" },
      { key: "output_type", label: "Type", type: "badge" },
      { key: "created_at", label: "Date", type: "date" },
    ],
    queueTable: "granola_meetings",
    queueFilter: { processed: false },
    queueColumns: [
      { key: "title", label: "Title" },
      { key: "meeting_type", label: "Type", type: "badge" },
      { key: "created_at", label: "Date", type: "date" },
    ],
    errorsTable: "granola_errors",
  },

  // ── Channels ──
  {
    key: "alert",
    label: "Alert",
    subtitle: "Real-time Slack alerts for every agent event.",
    settingsTable: "alert_settings",
    runField: "is_running",
    category: "ops",
    route: "/admin/alert",
    actions: [
      { label: "Send Test", fn: "alert-test" },
      { label: "Briefing Now", fn: "alert-briefing" },
    ],
    statsQueries: [],
    contentTable: "alert_log",
    errorsTable: "alert_errors",
  },
  {
    key: "telegram",
    label: "Telegram",
    subtitle: "Real-time Telegram alerts and bot commands.",
    settingsTable: "telegram_settings",
    runField: "is_running",
    category: "ops",
    route: "/admin/telegram",
    actions: [
      { label: "Send Test", fn: "telegram-test" },
      { label: "Briefing Now", fn: "telegram-briefing" },
      { label: "Register Webhook", fn: "telegram-register-webhook" },
    ],
    statsQueries: [],
    contentTable: "telegram_log",
    errorsTable: "telegram_errors",
  },
  {
    key: "contentful",
    label: "Contentful",
    subtitle: "Two-way content sync with Contentful.",
    settingsTable: "contentful_settings",
    runField: "is_running",
    category: "content",
    route: "/admin/contentful",
    actions: [
      { label: "Pull Now", fn: "contentful-pull" },
      { label: "Push Now", fn: "contentful-push" },
    ],
    statsQueries: [],
    contentTable: "contentful_sync_log",
    errorsTable: "contentful_errors",
  },
  {
    key: "supabase",
    label: "Supabase",
    subtitle: "Monitors database milestones and publishes product updates.",
    settingsTable: "supabase_settings",
    runField: "is_running",
    category: "ops",
    route: "/admin/supabase",
    actions: [
      { label: "Check Now", fn: "supabase-monitor" },
      { label: "Weekly Report", fn: "supabase-weekly-report" },
    ],
    statsQueries: [],
    contentTable: "supabase_milestones",
    errorsTable: "supabase_errors",
  },

  // ── Security ──
  {
    key: "security",
    label: "Security",
    subtitle: "Automated pentests and vulnerability monitoring.",
    settingsTable: "security_settings",
    runField: "is_running",
    category: "ops",
    route: "/admin/security",
    actions: [
      { label: "Run Pentest", fn: "security-scan" },
      { label: "Quick Scan", fn: "security-monitor" },
    ],
    statsQueries: [],
    contentTable: "security_scans",
    errorsTable: "security_errors",
  },

  // ── Ops ──
  {
    key: "watch",
    label: "Watch",
    subtitle: "Monitors all agent error tables and opens GitHub issues automatically.",
    settingsTable: "watch_settings",
    runField: "is_running",
    category: "ops",
    route: "/admin/watch",
    actions: [{ label: "Run Now", fn: "watch-monitor" }],
    statsQueries: [],
    contentTable: "watch_issues",
    errorsTable: "watch_errors",
  },
  {
    key: "fix",
    label: "Fix",
    subtitle: "Reads agent performance data and opens GitHub PRs with prompt improvements.",
    settingsTable: "fix_settings",
    runField: "is_running",
    category: "ops",
    route: "/admin/fix",
    actions: [{ label: "Run Now", fn: "fix-analyse" }],
    statsQueries: [],
    contentTable: "fix_improvements",
    errorsTable: "fix_errors",
  },
  {
    key: "build",
    label: "Build",
    subtitle: "Writes and deploys new Lazy engines from a spec.",
    settingsTable: "build_settings",
    runField: "is_running",
    category: "ops",
    route: "/admin/build",
    actions: [{ label: "Build New Engine", fn: "build-engine" }],
    statsQueries: [],
    contentTable: "build_engines",
    errorsTable: "build_errors",
  },
  {
    key: "intel",
    label: "Intel",
    subtitle: "Weekly competitive intelligence reports and content seeding.",
    settingsTable: "intel_settings",
    runField: "is_running",
    category: "ops",
    route: "/admin/intel",
    actions: [
      { label: "Run Now", fn: "intel-weekly" },
      { label: "Seed Engines", fn: "intel-seed" },
    ],
    statsQueries: [],
    contentTable: "intel_reports",
    errorsTable: "intel_errors",
  },
];

// Agents that always show (no settings table check needed)
export const ALWAYS_VISIBLE = ["installs", "settings", "overview"];

export function getAgentsByCategory(installed: Set<string>): Record<AgentCategory, AgentConfig[]> {
  const result: Record<AgentCategory, AgentConfig[]> = {
    content: [], commerce: [], media: [], dev: [],
    ops: [], system: [],
  };
  for (const a of AGENTS) {
    if (installed.has(a.key)) {
      result[a.category].push(a);
    }
  }
  return result;
}
