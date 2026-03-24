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
    label: "Content Engines",
    engines: [
      {
        name: "Lazy Blogger",
        description: "Writes and publishes blog posts autonomously",
        currentLevel: 4,
        link: "/lazy-blogger",
        levels: [
          "You open a text editor, write the post yourself, copy it into your CMS, add the metadata, and hit publish. Every post takes an hour. Most never get written.",
          "You prompt an AI to draft a post, edit it yourself, paste it in, and publish manually. Faster than writing from scratch. Still requires you every single time.",
          "You write a month of posts in advance on a Sunday and schedule them to publish throughout the month. Work still happens — you just front-loaded it.",
          "A new post publishes automatically when a trigger fires — a product launch, a Slack command, a webhook. You designed the trigger once. Posts happen without you opening a laptop.",
          "Your blog writes and publishes itself. Lazy Blogger generates a new SEO or GEO-optimised post every 15 minutes, targets real keywords from your queue, and publishes it to your site without you involved at any stage. Four posts a day. Zero input after setup.",
          "Your blog notices which posts drive traffic and which do not. It rewrites underperforming articles, adjusts its own topics toward what converts, and changes its writing style based on what your audience reads to the end. Coming soon.",
        ],
      },
      {
        name: "Lazy SEO",
        description: "Discovers keywords and publishes ranking articles",
        currentLevel: 4,
        link: "/lazy-seo",
        levels: [
          "You manually research keywords in Ahrefs, write articles targeting each one, optimise the metadata yourself, and wait months to see if anything ranks.",
          "You use an AI to help write SEO articles faster but you still find the keywords, brief the content, and publish each post manually.",
          "You batch-write SEO articles on a schedule and publish them at set intervals. Consistent but entirely dependent on your input.",
          "Keyword discovery triggers automatically on a schedule. When a new keyword is added to your queue a post gets commissioned without you asking.",
          "Lazy SEO discovers the keywords your site should rank for every Monday, fills a publishing queue, and your site publishes ranking articles automatically. Real keywords from real competitors. Zero manual effort after setup.",
          "Lazy SEO monitors which articles rank and which do not, rewrites underperformers, shifts budget toward the topics with the highest ranking velocity, and adjusts keyword strategy based on what is actually working in your niche right now. Coming soon.",
        ],
      },
      {
        name: "Lazy GEO",
        description: "Gets your brand cited by AI engines",
        currentLevel: 4,
        link: "/lazy-geo",
        levels: [
          "You manually research what questions people ask AI engines about your niche, write authoritative answers, publish them, and hope AI engines find them.",
          "You use AI to help write GEO-optimised content faster but you still identify the queries, write the briefs, and publish manually.",
          "You batch-create GEO content on a schedule. Consistent but you are still the source of every topic.",
          "GEO query discovery triggers automatically. When a new AI query is discovered a piece of citation-optimised content gets commissioned without you asking.",
          "Lazy GEO discovers the questions people ask ChatGPT and Perplexity about your niche, writes citation-optimised answers, publishes them, and tests whether your brand gets cited — all automatically. Your brand starts appearing in AI answers without you writing a word.",
          "Lazy GEO detects which content formats get cited most often by which AI engine, adjusts its writing structure per engine, rewrites content that is not being cited, and doubles down on the query types driving the most AI traffic. Coming soon.",
        ],
      },
      {
        name: "Lazy Crawl",
        description: "Monitors competitors and feeds intelligence to your engines",
        currentLevel: 3,
        levels: [
          "You manually visit competitor sites, check their pricing, read industry news, and make notes. Once a month if you are diligent. Never if you are busy.",
          "You use tools like Ahrefs or SimilarWeb to research competitors when you remember to. Still requires you to initiate every research session.",
          "You set up Google Alerts and RSS feeds that bring information to you. Passive but shallow — you still have to read and act on everything manually.",
          "Lazy Crawl monitors competitors, news sites, and pricing pages on a schedule. The moment something significant changes — a price update, a new feature, a trending topic — it extracts the intelligence and feeds it into your blog and SEO engines automatically.",
          "Lazy Crawl writes and publishes content based on what it discovers — trend posts from industry news, competitive analysis from competitor pages — without you reviewing or approving each piece. Coming soon.",
          "Lazy Crawl identifies which types of intelligence produce the most traffic when published, adjusts what it monitors to find more of it, and deprioritises sources that consistently produce low-value data. Coming soon.",
        ],
      },
      {
        name: "Lazy Perplexity",
        description: "Queries Perplexity for trends and feeds your content engines",
        currentLevel: 3,
        link: "/lazy-perplexity",
        levels: [
          "You manually query Perplexity to research your industry, copy useful information into docs, and use it to inform your content strategy. Valuable but entirely manual.",
          "You use Perplexity regularly for research but you still initiate every query, review every result, and decide what to do with each finding.",
          "You build a set of recurring Perplexity queries you run on a schedule to stay current. Still manual execution. Still requires you to act on the results.",
          "Lazy Perplexity queries Perplexity daily for trends, competitor intelligence, and the questions people are actually asking. Results feed automatically into your blog queue and SEO keyword list. Real web intelligence flowing into your content engines without you lifting a finger.",
          "Lazy Perplexity writes and publishes citation-rich content based on what Perplexity tells it is trending right now — without you briefing or reviewing each piece. Coming soon.",
          "Lazy Perplexity tracks your brand citation rate in real Perplexity results over time, identifies what content formats get you cited most, and adjusts its research and publishing strategy to maximise your AI visibility score. Coming soon.",
        ],
      },
      {
        name: "Lazy Contentful",
        description: "Two-way content sync with Contentful",
        currentLevel: 3,
        link: "/lazy-contentful",
        levels: [
          "You manually copy content from your Lovable site into Contentful, update it when posts change, and keep both systems in sync by hand. Nobody does this consistently.",
          "You use a CSV export/import workflow to batch-sync content periodically. Behind by days or weeks. Still entirely manual.",
          "You schedule a sync job that runs nightly. Better but one-directional and fragile.",
          "Every post published by Lazy Blogger, Lazy SEO, or Lazy GEO syncs to Contentful automatically within 30 minutes. Every entry published in Contentful appears on your Lovable site automatically. Two-way. Real-time. Zero manual work after setup.",
          "Lazy Contentful adapts content format automatically for different Contentful content types — adjusting structure, metadata, and field mapping based on where the content is going and who will read it. Coming soon.",
          "Lazy Contentful monitors which content performs best across each distribution channel and adjusts what gets prioritised in each direction of the sync. Coming soon.",
        ],
      },
    ],
  },
  {
    label: "Commerce Engines",
    engines: [
      {
        name: "Lazy Store",
        description: "Discovers products, writes listings, and optimises conversions",
        currentLevel: 5,
        link: "/lazy-store",
        levels: [
          "You manually find products, write every listing, set every price, create every promotion, and update everything by hand. A full-time job disguised as a store.",
          "You use AI to write product descriptions faster but you still source products, set prices, and manage promotions manually.",
          "You batch-write product listings and schedule price reviews on a calendar. Consistent but still entirely driven by your input.",
          "New products trigger listing creation automatically. Price changes trigger repricing. Low stock triggers promotion logic. You set the rules once.",
          "Lazy Store discovers trending products in your niche, writes their listings, sets competitive prices, and launches promotions — all without you touching anything. New products appear in your store automatically every day.",
          "Lazy Store monitors which product pages convert and which do not. It rewrites underperforming descriptions automatically, adjusts prices based on competitor data, runs promotions on slow-moving stock, and gets measurably better at selling every week. No optimisation sprints. No CRO consultant. The store improves itself.",
        ],
      },
      {
        name: "Lazy Pay",
        description: "Full Stripe integration that optimises its own conversion rate",
        currentLevel: 5,
        link: "/lazy-pay",
        levels: [
          "You copy-paste Stripe documentation, debug webhooks for hours, write checkout session logic from scratch, and manually optimise your pricing page based on gut feel.",
          "You use a Stripe plugin or template to speed up integration but you still manage products, monitor conversion, and run optimisation manually.",
          "You set up Stripe properly once and it handles transactions. Payments work. Conversion stays whatever it was on launch day forever.",
          "Payment events trigger actions automatically. Successful payment sends a confirmation. Failed payment fires a retry. Subscription cancelled triggers a win-back email.",
          "Lazy Pay installs the full Stripe integration in one prompt — checkout, webhooks, subscriptions, customer portal, confirmation emails, revenue dashboard. Everything works without you writing a line of Stripe code.",
          "Lazy Pay monitors which products convert poorly, rewrites their descriptions automatically, recovers abandoned checkouts with a personalised email 24 hours later, and improves its own conversion rate week over week. Your payments page gets better without you running a single optimisation sprint.",
        ],
      },
    ],
  },
  {
    label: "Media Engines",
    engines: [
      {
        name: "Lazy Voice",
        description: "Narrates every post into a podcast episode automatically",
        currentLevel: 3,
        link: "/lazy-voice",
        levels: [
          "You record every blog post as a podcast episode yourself — writing a script, recording audio, editing it, uploading it to a host, and submitting it to Apple Podcasts and Spotify manually.",
          "You use text-to-speech tools to generate audio from your posts but you still review each one, export files manually, and upload them yourself.",
          "You batch-generate audio for a set of posts on a schedule. Faster than recording but still requires your input to start.",
          "Every new post published by Lazy Blogger, Lazy SEO, or Lazy GEO triggers an audio version automatically. Lazy Voice narrates it in your chosen ElevenLabs voice, publishes it to your /listen page, and adds it to your podcast RSS feed — before you have even seen the post yourself.",
          "Lazy Voice identifies which post formats produce the most podcast listens and tells Lazy Blogger to produce more of them. Content and audio strategy start informing each other. Coming soon.",
          "Lazy Voice monitors listener drop-off points and rewrites narration scripts for episodes with high abandonment, adjusting pacing and structure to keep listeners engaged longer. Coming soon.",
        ],
      },
      {
        name: "Lazy Stream",
        description: "Turns every Twitch stream into indexed content",
        currentLevel: 4,
        link: "/lazy-stream",
        levels: [
          "You watch your own VOD, write a stream recap manually, clip highlights yourself, upload clips to YouTube, write SEO articles about the stream, and publish everything by hand. Almost nobody does this.",
          "You use transcription tools to get a rough transcript, then manually edit it into a recap. Faster but still hours of work per stream.",
          "You batch-process your last five streams on a Sunday. Better than nothing but always behind.",
          "The end of a stream triggers content creation. When your Twitch status goes offline the content pipeline fires automatically.",
          "Lazy Stream detects when your stream ends, fetches the top clips, generates a transcript summary, and publishes a stream recap, an SEO article, and a highlights post to your site — automatically, while you are still eating dinner. Every stream becomes three pieces of permanent indexed content without you writing a word.",
          "Lazy Stream monitors which stream recaps drive the most site traffic, identifies what stream topics and formats your audience searches for most, and adjusts its content templates to produce more of what performs. Coming soon.",
        ],
      },
      {
        name: "Lazy SMS",
        description: "Self-improving SMS sequences via Twilio",
        currentLevel: 5,
        link: "/lazy-sms",
        levels: [
          "You write every SMS manually, send it from your phone, track responses in a spreadsheet, and rewrite messages based on your own guesswork about what works.",
          "You use a bulk SMS tool to send pre-written messages faster. Still requires you to write everything and decide when to send.",
          "You build a drip sequence once and it runs on schedule. Messages go out automatically. But they never change or improve.",
          "Customer actions trigger SMS automatically. New signup triggers a welcome text. Payment success triggers a confirmation. Abandoned checkout triggers a recovery text.",
          "Lazy SMS installs the full Twilio integration in one prompt — welcome sequences, payment confirmations, subscription alerts, abandoned checkout recovery, two-way messaging, opt-out management, and delivery tracking. All running automatically from day one.",
          "Lazy SMS monitors response rates for every message sequence. When a message gets low engagement it rewrites it automatically using AI and updates the sequence. The welcome message that converts poorly gets replaced. The recovery text that gets ignored gets rewritten. Your SMS sequences get better every week without you touching them.",
        ],
      },
    ],
  },
  {
    label: "Developer Engines",
    engines: [
      {
        name: "Lazy Code",
        description: "Turns GitHub commits into changelogs and developer content",
        currentLevel: 3,
        link: "/lazy-github",
        levels: [
          "You write changelogs manually, draft release notes from memory, update your public roadmap by hand, and write developer blog posts when you find time. Most never get written.",
          "You use AI to help write release notes faster but you still initiate every document, review every output, and publish manually.",
          "You batch-write documentation at the end of each sprint. Consistent but always slightly behind the actual code.",
          "Every push to your GitHub repository fires a webhook. Lazy Code processes every commit, classifies it by significance, writes a plain-English summary, and publishes a changelog entry or developer blog post automatically. Your commits become content before you have closed your terminal.",
          "Lazy Code identifies which developer posts drive the most traffic and adjusts its writing approach to produce more of what your audience engages with. Coming soon.",
          "Lazy Code monitors your repository's star growth and contributor activity, identifies what types of releases drive the most developer interest, and adjusts what it documents in more depth to maximise your project's public visibility. Coming soon.",
        ],
      },
      {
        name: "Lazy GitLab",
        description: "Turns GitLab activity into public content",
        currentLevel: 3,
        link: "/lazy-gitlab",
        levels: [
          "Same as Lazy Code but for GitLab. All documentation happens manually, after the fact, if it happens at all.",
          "You use AI to draft merge request summaries and release notes faster but still review and publish everything yourself.",
          "You schedule documentation sprints at the end of each milestone. Behind the work. Dependent on your initiative.",
          "Every push, merge request, and release in your GitLab project fires a webhook. Lazy GitLab processes every event, writes plain-English summaries, and publishes changelogs, MR summaries, and release notes automatically. Your GitLab activity becomes public content without any manual work.",
          "Lazy GitLab writes SEO-optimised developer blog posts for significant releases and feeds them into your content engine. Coming soon.",
          "Lazy GitLab monitors which developer content drives the most contributor interest and adjusts its documentation depth and style toward what grows your project's community. Coming soon.",
        ],
      },
      {
        name: "Lazy Linear",
        description: "Turns Linear cycles into product update content",
        currentLevel: 3,
        link: "/lazy-linear",
        levels: [
          "You manually write sprint summaries, update your public roadmap in Notion, draft product update posts, and publish changelogs when you remember. Most teams never do this consistently.",
          "You use AI to draft cycle summaries from your Linear data faster but still review and publish every document yourself.",
          "You batch-process Linear activity at the end of each cycle and publish documentation as a block. Behind the work by definition.",
          "When a Linear cycle completes Lazy Linear processes all completed issues, writes a plain-English cycle summary, generates a changelog, and publishes a product update post automatically. Your Linear workflow produces public content without any extra work from your team.",
          "Lazy Linear writes feature announcement blog posts for significant shipped work and feeds them into your content engine. Coming soon.",
          "Lazy Linear monitors which product updates drive the most user engagement, identifies what types of shipped features your audience cares about most, and adjusts its announcement templates to produce content that resonates. Coming soon.",
        ],
      },
      {
        name: "Lazy Supabase",
        description: "Narrates your database growth story automatically",
        currentLevel: 3,
        link: "/lazy-supabase",
        levels: [
          "You check your Supabase dashboard occasionally and notice you have hit 1000 users. You write a tweet about it later that week. Maybe.",
          "You set up basic Supabase alerts for critical errors. You get paged when the database goes down. Nothing proactive.",
          "You have a scheduled report that emails you database metrics weekly. You read it sometimes.",
          "Every significant database milestone — 100 users, 1000 blog posts, first $1000 in revenue — triggers an automatic celebration post published to your site. Every error spike triggers an alert. Your Supabase database narrates its own growth story without you writing a word.",
          "Lazy Supabase identifies growth patterns — which acquisition channels are producing your highest-value users, which features drive the most engagement — and feeds those insights into your content strategy. Coming soon.",
          "Lazy Supabase detects anomalies in your data patterns before they become problems — unusual churn signals, suspicious signup spikes, performance degradation — and alerts you proactively with context. Coming soon.",
        ],
      },
    ],
  },
  {
    label: "Channels",
    engines: [
      {
        name: "Lazy Alert",
        description: "Every engine event reported to Slack in real time",
        currentLevel: 3,
        link: "/lazy-alert",
        levels: [
          "You open your dashboard every morning to check if anything happened. You check Stripe for payments. You check your blog for errors. You check your store for new products. You are the monitoring system.",
          "You set up email notifications for some events. You get buried in emails and start ignoring them.",
          "You configure a few Zapier automations to ping you when specific things happen. Better but incomplete and brittle.",
          "Every significant event across every Lazy engine sends a Slack message automatically. Payment received. Brand cited. Customer replied. Engine error. Stream went live. You know what your autonomous business is doing without opening a single dashboard. Slash commands let you control everything from Slack.",
          "Lazy Alert learns which events you respond to and which you ignore, surfaces only what actually requires your attention, and batches low-priority updates into a single daily digest. Coming soon.",
          "Lazy Alert detects anomalies automatically — a sudden drop in conversion rate, an unusual spike in errors, a competitor price change — and proactively alerts you before you would have noticed. Coming soon.",
        ],
      },
      {
        name: "Lazy Telegram",
        description: "Real-time engine reporting via Telegram bot",
        currentLevel: 3,
        link: "/lazy-telegram",
        levels: [
          "Same as Lazy Alert. You are the monitoring system. You check everything manually.",
          "You get some email notifications that you mostly ignore.",
          "You have a few basic automations that ping you inconsistently.",
          "Every significant event sends a Telegram message to your bot. Your autonomous business reports to you in real time on the messaging app you actually use. Bot commands let you publish posts, pause engines, and check errors without leaving Telegram.",
          "Lazy Telegram learns your response patterns and surfaces only what needs your attention, batching routine updates intelligently. Coming soon.",
          "Lazy Telegram detects anomalies and alerts you proactively before problems compound. Coming soon.",
        ],
      },
    ],
  },
];
