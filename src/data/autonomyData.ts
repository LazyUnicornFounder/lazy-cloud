export const LEVEL_LABELS = [
  "Manual",
  "Assisted",
  "Scheduled",
  "Triggered",
  "Generative",
  "Self-improving",
] as const;

export const LEVEL_COLORS: Record<number, string> = {
  0: "hsl(0 0% 30%)",
  1: "hsl(215 15% 45%)",
  2: "hsl(210 60% 50%)",
  3: "hsl(175 50% 45%)",
  4: "hsl(45 80% 55%)",
  5: "hsl(30 90% 55%)",
};

export const LEVEL_BG_TINTS: Record<number, string> = {
  0: "rgba(80,80,80,0.06)",
  1: "rgba(100,116,139,0.06)",
  2: "rgba(59,130,246,0.06)",
  3: "rgba(20,184,166,0.07)",
  4: "rgba(234,179,8,0.07)",
  5: "rgba(245,158,11,0.09)",
};

export interface EngineData {
  name: string;
  description: string;
  currentLevel: number;
  link?: string;
  levels: string[];
}

export interface EngineCategory {
  label: string;
  engines: EngineData[];
}

export const ENGINE_CATEGORIES: EngineCategory[] = [
  {
    label: "Lazy Unicorn",
    engines: [
      {
        name: "Lazy Run",
        description: "Installs all twenty-five engines in one prompt",

        currentLevel: 4,
        link: "/lazy-run",
        levels: [
          "You install each tool manually. Days per integration.",
          "Copy-paste guides speed things up. Still hours per engine.",
          "You batch-install a few engines at a time.",
          "One prompt. Twenty-three engines. Everything wired in minutes.",
          "It detects what you're missing and suggests engines automatically. Coming soon.",
          "It benchmarks your stack against similar businesses and optimises. Coming soon.",
        ],
      },
      {
        name: "Lazy Admin",
        description: "Unified dashboard for every engine in your stack",
        currentLevel: 3,
        link: "/lazy-admin",
        levels: [
          "You check each engine in its own dashboard. Tab hell.",
          "Bookmarks help. You still context-switch constantly.",
          "Weekly check-in across dashboards. Things fall through cracks.",
          "One dashboard. Every engine. Status, errors, and actions in sixty seconds.",
          "It surfaces only what needs attention. Coming soon.",
          "It learns your review patterns and pre-prioritises. Coming soon.",
        ],
      },
    ],
  },
  {
    label: "Lazy Content",
    engines: [
      {
        name: "Lazy Blogger",
        description: "Writes and publishes blog posts autonomously",
        currentLevel: 4,
        link: "/lazy-blogger",
        levels: [
          "You write every post yourself.",
          "AI drafts it. You still edit and publish.",
          "You batch-write posts and schedule them.",
          "A trigger fires. A post publishes. You weren't involved.",
          "Four posts a day. Zero input. Your blog writes itself.",
          "It rewrites what doesn't perform. Coming soon.",
        ],
      },
      {
        name: "Lazy SEO",
        description: "Discovers keywords and publishes ranking articles",
        currentLevel: 4,
        link: "/lazy-seo",
        levels: [
          "You research keywords and write articles manually.",
          "AI helps write faster. You still find keywords and publish.",
          "You batch-write SEO articles on a schedule.",
          "New keywords trigger new posts automatically.",
          "Keywords discovered Monday. Articles published by Friday. You did nothing.",
          "It rewrites articles that don't rank. Coming soon.",
        ],
      },
      {
        name: "Lazy GEO",
        description: "Gets your brand cited by AI engines",
        currentLevel: 4,
        link: "/lazy-geo",
        levels: [
          "You guess what AI engines say about you.",
          "AI helps write citation-ready content. You still publish.",
          "You batch-create GEO content on a schedule.",
          "New AI queries discovered. Content commissioned automatically.",
          "Your brand appears in ChatGPT and Perplexity answers. You wrote nothing.",
          "It adjusts content format per AI engine. Coming soon.",
        ],
      },
      {
        name: "Lazy Crawl",
        description: "Monitors competitors and feeds intelligence to your engines",
        currentLevel: 3,
        link: "/lazy-crawl",
        levels: [
          "You visit competitor sites manually. Monthly if lucky.",
          "You use research tools when you remember to.",
          "Google Alerts and RSS feeds. Passive but shallow.",
          "Competitor changes detected. Intelligence fed to your engines automatically.",
          "It publishes content from what it discovers. Coming soon.",
          "It learns which intelligence drives traffic. Coming soon.",
        ],
      },
      {
        name: "Lazy Perplexity",
        description: "Queries Perplexity for trends and feeds your content engines",
        currentLevel: 3,
        link: "/lazy-perplexity",
        levels: [
          "You query Perplexity manually for research.",
          "You use it regularly but still act on everything yourself.",
          "Recurring queries on a schedule. Still manual follow-through.",
          "Daily trend queries. Results flow into your blog and SEO queues automatically.",
          "It publishes citation-rich content from live trends. Coming soon.",
          "It tracks your citation rate and optimises for it. Coming soon.",
        ],
      },
      {
        name: "Lazy Contentful",
        description: "Two-way content sync with Contentful",
        currentLevel: 3,
        link: "/lazy-contentful",
        levels: [
          "You copy content between systems by hand.",
          "CSV export/import. Always behind.",
          "Nightly sync job. One-directional and fragile.",
          "Two-way sync. Every post appears in both systems automatically.",
          "It adapts content format per Contentful content type. Coming soon.",
          "It prioritises what syncs based on performance. Coming soon.",
        ],
      },
    ],
  },
  {
    label: "Lazy Commerce",
    engines: [
      {
        name: "Lazy Store",
        description: "Discovers products, writes listings, and optimises conversions",
        currentLevel: 5,
        link: "/lazy-store",
        levels: [
          "You find products, write listings, set prices. Full-time job.",
          "AI writes descriptions faster. You still manage everything.",
          "Batch-written listings on a schedule.",
          "New products trigger listings. Price changes trigger repricing.",
          "Trending products discovered. Listings written. Promotions launched. All automatic.",
          "It rewrites what doesn't convert. Adjusts prices. Runs promos on slow stock. Gets better every week.",
        ],
      },
      {
        name: "Lazy Pay",
        description: "Full Stripe integration that optimises its own conversion rate",
        currentLevel: 5,
        link: "/lazy-pay",
        levels: [
          "You debug Stripe webhooks for hours.",
          "Stripe plugin speeds things up. You still manage everything.",
          "Payments work. Conversion never improves.",
          "Payment events trigger actions. Failed payment retries. Cancellation triggers win-back.",
          "One prompt installs checkout, webhooks, subscriptions, portal, and dashboard.",
          "It recovers abandoned carts, rewrites low-converting pages, and improves itself weekly.",
        ],
      },
      {
        name: "Lazy SMS",
        description: "Self-improving SMS sequences via Twilio",
        currentLevel: 5,
        link: "/lazy-sms",
        levels: [
          "You send texts manually and track responses in a spreadsheet.",
          "Bulk SMS tool. You still write everything.",
          "Drip sequence runs on schedule. Never changes.",
          "Customer actions trigger texts. Signup → welcome. Payment → confirmation.",
          "One prompt installs welcome sequences, recovery texts, opt-out, and delivery tracking.",
          "Low-engagement messages get rewritten automatically. Your SMS gets better every week.",
        ],
      },
      {
        name: "Lazy Mail",
        description: "Subscriber capture, welcome sequences, and AI newsletters via Resend",
        currentLevel: 3,
        link: "/lazy-mail",
        levels: [
          "You write and send every email manually. Subscribers? What subscribers.",
          "Mailchimp helps. You still write every newsletter.",
          "Drip sequences exist. You wrote them once and forgot.",
          "New post publishes → newsletter written and sent automatically. Subject lines rewrite themselves.",
          "It segments audiences and personalises content per reader. Coming soon.",
          "It predicts churn and re-engages subscribers before they leave. Coming soon.",
        ],
      },
    ],
  },
  {
    label: "Lazy Media",
    engines: [
      {
        name: "Lazy Voice",
        description: "Narrates every post into a podcast episode automatically",
        currentLevel: 3,
        link: "/lazy-voice",
        levels: [
          "You record every episode yourself.",
          "Text-to-speech helps. You still review and upload.",
          "Batch-generate audio on a schedule.",
          "Every new post gets narrated and added to your RSS feed automatically.",
          "It tells your blog to write more of what people listen to. Coming soon.",
          "It rewrites narration scripts to reduce listener drop-off. Coming soon.",
        ],
      },
      {
        name: "Lazy Stream",
        description: "Turns every Twitch stream into indexed content",
        currentLevel: 4,
        link: "/lazy-stream",
        levels: [
          "You write recaps and clip highlights manually. Nobody does this.",
          "Transcription tools help. Still hours per stream.",
          "You batch-process last week's streams on Sunday.",
          "Stream ends. Content pipeline fires.",
          "Stream ends. Recap, SEO article, and highlights post publish while you eat dinner.",
          "It learns which stream topics drive traffic and adjusts templates. Coming soon.",
        ],
      },
    ],
  },
  {
    label: "Lazy Dev",
    engines: [
      {
        name: "Lazy GitHub",
        description: "Turns GitHub commits into changelogs and developer content",
        currentLevel: 3,
        link: "/lazy-github",
        levels: [
          "You write changelogs from memory. Most never get written.",
          "AI drafts release notes. You still review and publish.",
          "End-of-sprint documentation. Always behind the code.",
          "Every commit becomes a changelog entry or dev blog post automatically.",
          "It writes more about what developers engage with. Coming soon.",
          "It tracks which releases grow your stars. Coming soon.",
        ],
      },
      {
        name: "Lazy GitLab",
        description: "Turns GitLab activity into public content",
        currentLevel: 3,
        link: "/lazy-gitlab",
        levels: [
          "All documentation happens manually, if at all.",
          "AI drafts MR summaries. You still publish.",
          "Documentation sprints at end of milestone. Always behind.",
          "Every push and merge becomes a changelog entry automatically.",
          "It writes SEO blog posts for significant releases. Coming soon.",
          "It learns which dev content grows your community. Coming soon.",
        ],
      },
      {
        name: "Lazy Linear",
        description: "Turns Linear cycles into product update content",
        currentLevel: 3,
        link: "/lazy-linear",
        levels: [
          "You write sprint summaries manually. Most teams don't.",
          "AI drafts cycle summaries. You still publish.",
          "Batch-process at end of cycle. Behind by definition.",
          "Cycle completes. Summary, changelog, and update post publish automatically.",
          "It writes feature announcements for significant ships. Coming soon.",
          "It learns which updates your users care about. Coming soon.",
        ],
      },
      {
        name: "Lazy Design",
        description: "Upgrades your site with 21st.dev components matched to your brand",
        currentLevel: 3,
        link: "/lazy-design",
        levels: [
          "You browse component libraries manually. Hours per section.",
          "You find components but still adapt and integrate them yourself.",
          "You batch-upgrade pages on a schedule. Still manual.",
          "New pages detected. Component suggestions generated automatically.",
          "It applies upgrades matched to your brand without asking. Coming soon.",
          "It learns which component styles convert best and optimises. Coming soon.",
        ],
      },
      {
        name: "Lazy Auth",
        description: "Google Sign-In, email login, protected routes, and user management in one prompt",
        currentLevel: 3,
        link: "/lazy-auth",
        levels: [
          "You wire up auth manually. Hours debugging OAuth flows.",
          "Auth libraries help. You still build every page and guard.",
          "Templates speed things up. Still days per project.",
          "One prompt installs login, signup, protected routes, and user management automatically.",
          "It detects new routes and protects them without asking. Coming soon.",
          "It analyses login drop-off and rewrites auth flows to convert better. Coming soon.",
        ],
      },
      {
        name: "Lazy Granola",
        description: "Turns Granola meeting notes into blog posts, Slack summaries, and customer intelligence",
        currentLevel: 4,
        link: "/lazy-granola",
        levels: [
          "You take meeting notes but never turn them into content.",
          "AI summarises meetings. You still copy-paste and publish.",
          "You batch-process last week's meetings on Friday. Always behind.",
          "Meeting ends. Blog post, Slack summary, and Linear issues publish automatically.",
          "It extracts customer intelligence and feeds it into your content engines. Coming soon.",
          "It learns which meeting insights drive the most engagement. Coming soon.",
        ],
      },
    ],
  },
  {
    label: "Lazy Ops",
    engines: [
      {
        name: "Lazy Alert",
        description: "Every engine event reported to Slack in real time",
        currentLevel: 3,
        link: "/lazy-alert",
        levels: [
          "You are the monitoring system.",
          "Email notifications you start ignoring.",
          "A few Zapier automations. Incomplete and brittle.",
          "Every event hits Slack. Payment. Citation. Error. You know everything without opening a dashboard.",
          "It learns what you ignore and only shows what matters. Coming soon.",
          "It detects anomalies before you would. Coming soon.",
        ],
      },
      {
        name: "Lazy Telegram",
        description: "Real-time engine reporting via Telegram bot",
        currentLevel: 3,
        link: "/lazy-telegram",
        levels: [
          "You check everything manually.",
          "Email notifications you mostly ignore.",
          "A few automations. Inconsistent.",
          "Every event hits your Telegram. Bot commands let you control engines without leaving the chat.",
          "It surfaces only what needs your attention. Coming soon.",
          "It alerts you before problems compound. Coming soon.",
        ],
      },
      {
        name: "Lazy Supabase",
        description: "Narrates your database growth story automatically",
        currentLevel: 3,
        link: "/lazy-supabase",
        levels: [
          "You notice milestones days later. Maybe tweet about it.",
          "Basic error alerts. You get paged when it's down.",
          "Weekly metrics email. You read it sometimes.",
          "Hit 1,000 users? Celebration post publishes itself. Error spike? You're alerted.",
          "It feeds growth patterns into your content strategy. Coming soon.",
          "It detects anomalies before they become problems. Coming soon.",
        ],
      },
      {
        name: "Lazy Security",
        description: "Autonomous pentesting and vulnerability monitoring via Aikido",
        currentLevel: 3,
        link: "/lazy-security",
        levels: [
          "You run security audits manually. Quarterly if lucky.",
          "Scanning tools help. You still triage everything.",
          "Scheduled scans. Reports pile up unread.",
          "Every deploy triggers a scan. Critical findings alert you instantly.",
          "It writes fix PRs for vulnerabilities automatically. Coming soon.",
          "It learns your attack surface and prioritises what matters. Coming soon.",
        ],
      },
    ],
  },
];
